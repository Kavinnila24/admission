package com.rasp.app.dto;

public class LoginRequest {
    private String username;
    private String password;
    private String requestedRole; // "ADMIN" or "USER"

    public LoginRequest() {}

    public LoginRequest(String username, String password) {
        this.username = username;
        this.password = password;
        this.requestedRole = "USER"; // Default to USER
    }

    public LoginRequest(String username, String password, String requestedRole) {
        this.username = username;
        this.password = password;
        this.requestedRole = requestedRole;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getRequestedRole() {
        return requestedRole;
    }

    public void setRequestedRole(String requestedRole) {
        this.requestedRole = requestedRole;
    }
}
