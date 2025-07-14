package com.rasp.app.controller;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.rasp.app.service.FileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.security.Principal;
import java.util.Collections;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*") // For production, restrict this to your frontend's domain
public class FileController {

    @Autowired
    private FileService fileService;

    // ObjectMapper to parse metadata JSON string
    private final ObjectMapper objectMapper = new ObjectMapper();

    /**
     * Handles file upload with JWT-based authentication.
     * The Principal object is injected by Spring Security after validating the Bearer token.
     */
    @PostMapping("/file_upload")
    public ResponseEntity<?> uploadFile(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "metadata", required = false) String metadataJson, // Receive metadata as JSON string
            Principal principal) { // Injected by Spring Security

        if (principal == null) {
            return ResponseEntity.status(401)
                    .body(Map.of("message", "Unauthorized: No valid token provided"));
        }

        try {
            // Parse metadata string into a Map
            Map<String, Object> metadata = metadataJson == null ? Collections.emptyMap() :
                    objectMapper.readValue(metadataJson, new TypeReference<Map<String, Object>>() {});

            // Use principal.getName() which typically returns the username
            Map<String, Object> response = fileService.uploadFile(file, metadata, principal.getName());
            return ResponseEntity.ok(response);

        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", e.getMessage()));
        } catch (Exception e) {
            e.printStackTrace(); // For debugging
            return ResponseEntity.status(500)
                    .body(Map.of("message", "File upload failed: " + e.getMessage()));
        }
    }

    // No changes needed for retrieve, info, or delete methods as they use fileId.
    // However, you should ensure your Spring Security configuration protects these endpoints.

    @GetMapping("/file_retrieve")
    public ResponseEntity<?> retrieveFile(@RequestParam("fileName") String fileId) {
        try {
            return fileService.retrieveFile(fileId);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("message", "File retrieval failed: " + e.getMessage()));
        }
    }

    @GetMapping("/file_info")
    public ResponseEntity<?> getFileInfo(@RequestParam("fileName") String fileId) {
        try {
            Map<String, Object> fileInfo = fileService.getFileInfo(fileId);
            if (fileInfo.isEmpty()) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.ok(fileInfo);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("message", "Error retrieving file info: " + e.getMessage()));
        }
    }

    @DeleteMapping("/file_delete")
    public ResponseEntity<?> deleteFile(@RequestParam("fileName") String fileId) {
        try {
            Map<String, Object> response = fileService.deleteFile(fileId);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("message", "File deletion failed: " + e.getMessage()));
        }
    }
}