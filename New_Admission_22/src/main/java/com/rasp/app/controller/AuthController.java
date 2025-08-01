// Updated AuthController.java
package com.rasp.app.controller;

import com.rasp.app.dto.AdminValidationRequest;
import com.rasp.app.dto.AdminValidationResponse;
import com.rasp.app.dto.LoginRequest;
import com.rasp.app.dto.LoginResponse;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpServletRequest;
import org.apache.http.HttpResponse;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.*;
//import org.springframework.web.client.DefaultRestClient;
import org.springframework.web.client.RestTemplate;
import platform.helper.BaseHelper;
import platform.resource.BaseResource;
import platform.util.ApplicationException;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.lang.reflect.InvocationTargetException;
import java.net.URI;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    String accessToken=null;

    @Value("${clientId}")
    private  String clientId;
    @Value("${clientSecret}")
    private  String clientSecret; // Replace with your actual secret
    private final String redirectUri = "http://localhost:8082/api/auth/callback";

    @Value("${keycloakTokenUrl}")
    private  String keycloakTokenUrl;

    @Value("${keycloakUrl}")
    private String keycloakUrl;

    @Value("${spring.security.oauth2.client.provider.keycloak.authorization-uri}")
    private String keycloakAuthUrl;

    @Value("${spring.security.oauth2.client.provider.keycloak.issuer-uri}")
    private String keycloakIssuerUri;

    private final String frontendURL = "http://localhost:3000/cookies";

    @Value("${authentication-type:auth-code}")
    private String authenticationType;


    /**
     * Validates admin secret password
     */
    @PostMapping("/validate-admin")
    public ResponseEntity<AdminValidationResponse> validateAdmin(@RequestBody AdminValidationRequest request) {
        try {
            System.out.println("Admin validation request received: " + request);
            // Simple hardcoded admin secret validation
            String providedPassword = request.getAdmin_registration_password();
            boolean isValid = "admin@123".equals(providedPassword);
            
            AdminValidationResponse response = new AdminValidationResponse(isValid);

            if (isValid) {
                return ResponseEntity.ok(response);
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
            }
        } catch (Exception e) {
            AdminValidationResponse errorResponse = new AdminValidationResponse(false, "Error validating admin credentials");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    /**
     * Enhanced login endpoint that determines user role from Keycloak JWT token
     */
    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest loginRequest, HttpServletResponse response) {
        try {
            String username = loginRequest.getUsername();
            String password = loginRequest.getPassword();

            // Call the existing login logic based on authentication type
            if ("implicit".equalsIgnoreCase(authenticationType)) {
                return handleImplicitFlowLogin(username, password, response);
            } else {
                // For authorization code flow, redirect to Keycloak
                String authUrl = keycloakAuthUrl
                        + "?client_id=" + clientId
                        + "&response_type=code"
                        + "&scope=openid profile email"
                        + "&redirect_uri=" + redirectUri;

                LoginResponse loginResponse = new LoginResponse();
                loginResponse.setSuccess(false);
                loginResponse.setMessage("Redirect to: " + authUrl);

                return ResponseEntity.status(HttpStatus.FOUND)
                        .header("Location", authUrl)
                        .body(loginResponse);
            }
        } catch (Exception e) {
            LoginResponse errorResponse = new LoginResponse(false, "Login failed: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    private ResponseEntity<LoginResponse> handleImplicitFlowLogin(String username, String password, HttpServletResponse response) {
        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        MultiValueMap<String, String> requestBody = new LinkedMultiValueMap<>();
        requestBody.add("grant_type", "password");
        requestBody.add("client_id", clientId);
        requestBody.add("client_secret", clientSecret);
        requestBody.add("username", username);
        requestBody.add("password", password);

        HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(requestBody, headers);
        ResponseEntity<Map> tokenResponse = restTemplate.exchange(keycloakTokenUrl, HttpMethod.POST, request, Map.class);

        if (!tokenResponse.getStatusCode().is2xxSuccessful()) {
            LoginResponse errorResponse = new LoginResponse(false, "Invalid credentials");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(errorResponse);
        }

        Map<String, String> body = tokenResponse.getBody();
        String accessToken = body.get("access_token");
        String refreshToken = body.get("refresh_token");

        // Set cookies
        setCookie(response, "access_token", accessToken, 900); // 15 minutes expiry
        setCookie(response, "refresh_token", refreshToken, 86400); // 24 hours expiry

        // Parse JWT token to get user role and custom_id
        String userRole = "USER"; // Default role
        String userId = username; // Default to username
        
        try {
            // Extract user role from token (this would need JWT parsing)
            // For now, check if user exists in Admin table to determine role
            String filter_params = "queryId=GET_ALL&filter=email:" + username;
            
            // Check if user is admin
            try {
                RestTemplate adminRestTemplate = new RestTemplate();
                HttpHeaders adminHeaders = new HttpHeaders();
                adminHeaders.setBearerAuth(accessToken);
                
                ResponseEntity<String> adminResponse = adminRestTemplate.exchange(
                    "http://localhost:8082/api/admin?" + filter_params,
                    HttpMethod.GET,
                    new HttpEntity<>(adminHeaders),
                    String.class
                );
                
                if (adminResponse.getStatusCode().is2xxSuccessful()) {
                    // User found in admin table
                    userRole = "ADMIN";
                    // Parse response to get admin ID
                    // For now, use a simple approach
                }
            } catch (Exception e) {
                // User not found in admin table, check user table
                try {
                    RestTemplate userRestTemplate = new RestTemplate();
                    HttpHeaders userHeaders = new HttpHeaders();
                    userHeaders.setBearerAuth(accessToken);
                    
                    ResponseEntity<String> userResponse = userRestTemplate.exchange(
                        "http://localhost:8082/api/user?" + filter_params,
                        HttpMethod.GET,
                        new HttpEntity<>(userHeaders),
                        String.class
                    );
                    
                    if (userResponse.getStatusCode().is2xxSuccessful()) {
                        userRole = "USER";
                        // Parse response to get user ID
                    }
                } catch (Exception ex) {
                    // Default to USER role if both checks fail
                    userRole = "USER";
                }
            }
        } catch (Exception e) {
            // Default to USER if role detection fails
            userRole = "USER";
        }

        // Create successful login response with role information
        LoginResponse loginResponse = new LoginResponse(accessToken, userRole, userId, "Login successful");
        loginResponse.setSuccess(true);

        return ResponseEntity.ok(loginResponse);
    }

    // Keep existing login method for backward compatibility
    @GetMapping("/login")
    public void login(@RequestParam(value = "username", required = false) String username,
                      @RequestParam(value = "password", required = false) String password,
                      HttpServletResponse response) throws IOException {
        if ("implicit".equalsIgnoreCase(authenticationType) && username != null && password != null) {
            handleImplicitFlow(username, password, response);
        } else {
            String authUrl = keycloakAuthUrl
                    + "?client_id=" + clientId
                    + "&response_type=code"
                    + "&scope=openid profile email"
                    + "&redirect_uri=" + redirectUri;
            response.sendRedirect(authUrl);
        }
    }

    private void handleImplicitFlow(String username, String password, HttpServletResponse response) {
        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        MultiValueMap<String, String> requestBody = new LinkedMultiValueMap<>();
        requestBody.add("grant_type", "password");
        requestBody.add("client_id", clientId);
        requestBody.add("client_secret", clientSecret);
        requestBody.add("username", username);
        requestBody.add("password", password);

        HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(requestBody, headers);
        ResponseEntity<Map> tokenResponse = restTemplate.exchange(keycloakTokenUrl, HttpMethod.POST, request, Map.class);

        if (!tokenResponse.getStatusCode().is2xxSuccessful()) {
            response.setStatus(HttpStatus.UNAUTHORIZED.value());
            return;
        }

        Map<String, String> body = tokenResponse.getBody();
        accessToken = body.get("access_token");
        String refreshToken = body.get("refresh_token");
        setCookie(response, "access_token", accessToken, 900); // 15 minutes expiry
        setCookie(response, "refresh_token", refreshToken, 86400); // 24 hours expiry
    }

    @GetMapping("/callback")
    public ResponseEntity<String> callback(@RequestParam("code") String authCode, HttpServletResponse response) {
        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        String requestBody = "grant_type=authorization_code"
                + "&client_id=" + clientId
                + "&client_secret=" + clientSecret
                + "&redirect_uri=" + redirectUri
                + "&code=" + authCode;

        HttpEntity<String> request = new HttpEntity<>(requestBody, headers);
        ResponseEntity<Map> tokenResponse = restTemplate.exchange(keycloakTokenUrl, HttpMethod.POST, request, Map.class);

        if (!tokenResponse.getStatusCode().is2xxSuccessful()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Failed to authenticate");
        }

        Map<String, String> body = tokenResponse.getBody();
        String accessToken = body.get("access_token");
        String refreshToken = body.get("refresh_token");

        setCookie(response, "access_token", accessToken, 60); // 1 minute
        setCookie(response, "refresh_token", refreshToken, 86400); // 24 hours expiry

        String redirectUrl = frontendURL;

        HttpHeaders redirectHeaders = new HttpHeaders();
        redirectHeaders.setLocation(URI.create(redirectUrl));

//        setCookie(response, "access_token", newAccessToken, 900);
//        setCookie(response, "refresh_token", newRefreshToken, 86400;
//
        return new ResponseEntity<>(redirectHeaders, HttpStatus.FOUND);
//        return ResponseEntity.ok("Login successful");
    }

    @PostMapping("/addUser")
    public ResponseEntity<String> addUser(@RequestParam String adminUsername,
                                          @RequestParam String adminPassword,
                                          @RequestParam String newUsername,
                                          @RequestParam String newPassword,
                                          @RequestParam String newFirstName,
                                          @RequestParam String newLastName,
                                          @RequestParam String newEmail) {

        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        // Step 1: Get Admin Access Token using Password Grant
        MultiValueMap<String, String> tokenRequestBody = new LinkedMultiValueMap<>();
        tokenRequestBody.add("grant_type", "password");
        tokenRequestBody.add("client_id", "admin-cli");
        tokenRequestBody.add("username", adminUsername);
        tokenRequestBody.add("password", adminPassword);

        HttpEntity<MultiValueMap<String, String>> tokenRequest = new HttpEntity<>(tokenRequestBody, headers);
        ResponseEntity<Map> tokenResponse = restTemplate.exchange(
                keycloakIssuerUri.replace("/realms/new", "/realms/master/protocol/openid-connect/token"),
                HttpMethod.POST,
                tokenRequest,
                Map.class
        );

        if (!tokenResponse.getStatusCode().is2xxSuccessful()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Failed to get admin token");
        }

        String accessToken = (String) tokenResponse.getBody().get("access_token");

        // Step 2: Create New User in Keycloak
        HttpHeaders userHeaders = new HttpHeaders();
        userHeaders.setContentType(MediaType.APPLICATION_JSON);
        userHeaders.setBearerAuth(accessToken);

        Map<String, Object> userPayload = new HashMap<>();
        userPayload.put("username", newUsername);
        userPayload.put("email", newEmail);
        userPayload.put("enabled", true);
        userPayload.put("emailVerified", true);
        userPayload.put("firstName", newFirstName);
        userPayload.put("lastName", newLastName);
        userPayload.put("requiredActions", List.of()); // No required actions


        Map<String, Object> credentials = new HashMap<>();
        credentials.put("type", "password");
        credentials.put("value", newPassword);
        credentials.put("temporary", false);

        userPayload.put("credentials", List.of(credentials));

        HttpEntity<Map<String, Object>> userRequest = new HttpEntity<>(userPayload, userHeaders);

        ResponseEntity<String> userResponse = restTemplate.exchange(
                keycloakUrl + "/users",
                HttpMethod.POST,
                userRequest,
                String.class
        );

        if (!userResponse.getStatusCode().is2xxSuccessful()) {
            return ResponseEntity.status(userResponse.getStatusCode()).body("Failed to create user");
        }

        return ResponseEntity.ok("User created successfully");
    }

//    @PostMapping("/add-client-role")
//    public ResponseEntity<String> addClientRole(@RequestParam String roleName) {
//        RestTemplate restTemplate = new RestTemplate();
//        HttpHeaders headers = new HttpHeaders();
//        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
//
//        // 🔹 Step 1: Get Admin Access Token using Client Credentials
//        MultiValueMap<String, String> tokenRequestBody = new LinkedMultiValueMap<>();
//        tokenRequestBody.add("grant_type", "client_credentials");
//        tokenRequestBody.add("client_id", clientId);
//        tokenRequestBody.add("client_secret", clientSecret);
//
//        HttpEntity<MultiValueMap<String, String>> tokenRequest = new HttpEntity<>(tokenRequestBody, headers);
//        ResponseEntity<Map> tokenResponse = restTemplate.exchange(
//                keycloakTokenUrl,
//                HttpMethod.POST,
//                tokenRequest,
//                Map.class
//        );
//
//        if (!tokenResponse.getStatusCode().is2xxSuccessful()) {
//            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Failed to get admin token");
//        }
//
//        String accessToken = (String) tokenResponse.getBody().get("access_token");
//
//        // 🔹 Step 2: Get the Client ID (UUID) from Keycloak
//        HttpHeaders clientHeaders = new HttpHeaders();
//        clientHeaders.setBearerAuth(accessToken);
//        HttpEntity<Void> clientRequest = new HttpEntity<>(clientHeaders);
//
//        ResponseEntity<List> clientResponse = restTemplate.exchange(
//                keycloakUrl + "/clients",
//                HttpMethod.GET,
//                clientRequest,
//                List.class
//        );
//
//        if (!clientResponse.getStatusCode().is2xxSuccessful()) {
//            return ResponseEntity.status(clientResponse.getStatusCode()).body("Failed to fetch clients");
//        }
//
//        List<Map<String, Object>> clients = clientResponse.getBody();
//        String clientUUID = clients.stream()
//                .filter(client -> clientId.equals(client.get("clientId")))
//                .map(client -> (String) client.get("id"))
//                .findFirst()
//                .orElse(null);
//
//        if (clientUUID == null) {
//            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Client not found");
//        }
//
//        // 🔹 Step 3: Create New Role for Client using Client UUID
//        HttpHeaders roleHeaders = new HttpHeaders();
//        roleHeaders.setContentType(MediaType.APPLICATION_JSON);
//        roleHeaders.setBearerAuth(accessToken);
//
//        Map<String, Object> rolePayload = new HashMap<>();
//        rolePayload.put("name", roleName);
//        rolePayload.put("description", "Auto-created client role");
//
//        HttpEntity<Map<String, Object>> roleRequest = new HttpEntity<>(rolePayload, roleHeaders);
//        ResponseEntity<String> roleResponse = restTemplate.exchange(
//                keycloakUrl + "/clients/" + clientUUID + "/roles",
//                HttpMethod.POST,
//                roleRequest,
//                String.class
//        );
//
//        if (!roleResponse.getStatusCode().is2xxSuccessful()) {
//            return ResponseEntity.status(roleResponse.getStatusCode()).body("Failed to create client role");
//        }
//
//        return ResponseEntity.ok("Client role '" + roleName + "' added successfully to client '" + clientId + "'");
//    }

//    ### Keycloak Role Mapping (Client Roles)

    //```java
    @PostMapping("/assign-client-role")
    public ResponseEntity<String> assignClientRole(
            @RequestParam String username,
            @RequestParam String roleName) {

        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        // 🔹 Step 1: Get Admin Access Token
        MultiValueMap<String, String> tokenRequestBody = new LinkedMultiValueMap<>();
        tokenRequestBody.add("grant_type", "client_credentials");
        tokenRequestBody.add("client_id", clientId);
        tokenRequestBody.add("client_secret", clientSecret);

        HttpEntity<MultiValueMap<String, String>> tokenRequest = new HttpEntity<>(tokenRequestBody, headers);
        ResponseEntity<Map> tokenResponse = restTemplate.exchange(
                keycloakTokenUrl,
                HttpMethod.POST,
                tokenRequest,
                Map.class
        );

        if (!tokenResponse.getStatusCode().is2xxSuccessful()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Failed to get admin token");
        }

        String accessToken = (String) tokenResponse.getBody().get("access_token");

        // 🔹 Step 2: Get User ID
        HttpHeaders authHeaders = new HttpHeaders();
        authHeaders.setBearerAuth(accessToken);
        HttpEntity<Void> userRequest = new HttpEntity<>(authHeaders);

        ResponseEntity<List> userResponse = restTemplate.exchange(
                keycloakUrl + "/users?username=" + username,
                HttpMethod.GET,
                userRequest,
                List.class
        );

        if (userResponse.getBody().isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        }

        String userId = ((Map<String, Object>) userResponse.getBody().get(0)).get("id").toString();

        // 🔹 Step 3: Get Client ID
        ResponseEntity<List> clientResponse = restTemplate.exchange(
                keycloakUrl + "/clients?clientId=" + clientId,
                HttpMethod.GET,
                userRequest,
                List.class
        );

        if (clientResponse.getBody().isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Client not found");
        }

        String clientUuid = ((Map<String, Object>) clientResponse.getBody().get(0)).get("id").toString();

        // 🔹 Step 4: Get Client Role
        ResponseEntity<List> roleResponse = restTemplate.exchange(
                keycloakUrl + "/clients/" + clientUuid + "/roles",
                HttpMethod.GET,
                userRequest,
                List.class
        );

        List<Map<String, Object>> roles = roleResponse.getBody();
        Map<String, Object> role = roles.stream()
                .filter(r -> roleName.equals(r.get("name")))
                .findFirst()
                .orElse(null);

        if (role == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Role not found");
        }
        // 🔹 Step 5: Assign Role (Content-Type must be JSON)
        HttpHeaders jsonHeaders = new HttpHeaders();
        jsonHeaders.setBearerAuth(accessToken);
        jsonHeaders.setContentType(MediaType.APPLICATION_JSON);

        // 🔹 Step 5: Assign Client Role to User
        HttpEntity<List<Map<String, Object>>> assignRoleRequest = new HttpEntity<>(List.of(role), jsonHeaders);
        ResponseEntity<String> assignRoleResponse = restTemplate.exchange(
                keycloakUrl + "/users/" + userId + "/role-mappings/clients/" + clientUuid,
                HttpMethod.POST,
                assignRoleRequest,
                String.class
        );

        if (!assignRoleResponse.getStatusCode().is2xxSuccessful()) {
            return ResponseEntity.status(assignRoleResponse.getStatusCode()).body("Failed to assign role");
        }

        return ResponseEntity.ok("Role '" + roleName + "' assigned successfully to user '" + username + "'");
    }



    @PostMapping("/logout")
    public ResponseEntity<String> logout(@CookieValue(value = "refresh_token", required = false) String refreshToken, HttpServletResponse response) {
        if (refreshToken == null || refreshToken.isEmpty()) {
            System.out.println("No refresh token");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Refresh token missing");
        }

        // Prepare request parameters as form data (x-www-form-urlencoded)
        MultiValueMap<String, String> body = new LinkedMultiValueMap<>();
        body.add("client_id", clientId);
        body.add("client_secret", clientSecret);
        body.add("refresh_token", refreshToken);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(body, headers);
        RestTemplate restTemplate = new RestTemplate();

        try {
            restTemplate.postForEntity(keycloakIssuerUri + "/protocol/openid-connect/logout", request, String.class);
            System.out.println("Logout successful in Keycloak");
        } catch (Exception e) {
            System.err.println("Logout failed: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Logout failed");
        }

        // Clear cookies
        setCookie(response, "access_token", "", 0);
        setCookie(response, "refresh_token", "", 0);

        return ResponseEntity.ok("Logged out");
    }

    private void setCookie(HttpServletResponse response, String name, String value, int maxAge) {
        Cookie cookie = new Cookie(name, value);
        cookie.setHttpOnly(false); // Set to false to allow JavaScript access
        cookie.setSecure(false); // Set to true in HTTPS environments
        cookie.setPath("/"); // Ensure it's accessible everywhere
        cookie.setMaxAge(maxAge);
        cookie.setDomain("localhost"); // Change this for production
        response.addCookie(cookie);
    }
}