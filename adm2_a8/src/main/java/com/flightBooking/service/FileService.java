package com.flightBooking.service;

import com.mongodb.client.gridfs.model.GridFSFile;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.gridfs.GridFsOperations;
import org.springframework.data.mongodb.gridfs.GridFsTemplate;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.util.HashMap;
import java.util.Map;

@Service
public class FileService {

    @Autowired
    private GridFsTemplate gridFsTemplate;

    @Autowired
    private GridFsOperations gridFsOperations;

    public Map<String, Object> uploadFile(MultipartFile file, String sessionId) throws IOException {

        // Validate file
        if (file.isEmpty()) {
            throw new IllegalArgumentException("File is empty");
        }

        if (sessionId == null || sessionId.trim().isEmpty()) {
            throw new IllegalArgumentException("Session ID is required");
        }

        System.out.println("=== FILE UPLOAD DEBUG ===");
        System.out.println("Original filename: " + file.getOriginalFilename());
        System.out.println("Content type: " + file.getContentType());
        System.out.println("File size: " + file.getSize() + " bytes");
        System.out.println("Session ID: " + sessionId);

        // Create metadata for the file
        Map<String, Object> metadata = new HashMap<>();
        metadata.put("session_id", sessionId);
        metadata.put("originalFilename", file.getOriginalFilename());
        metadata.put("contentType", file.getContentType());
        metadata.put("uploadDate", System.currentTimeMillis());
        metadata.put("fileSize", file.getSize());

        // Store file in GridFS
        ObjectId fileId = gridFsTemplate.store(
                file.getInputStream(),
                file.getOriginalFilename(),
                file.getContentType(),
                metadata
        );

        System.out.println("✅ File stored in GridFS with ID: " + fileId.toString());
        System.out.println("🔍 Check MongoDB collections: fs.files and fs.chunks");
        System.out.println("📝 File should be visible in GridFS collections");
        System.out.println("========================");


        // Return response with file ID
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("filename", fileId.toString());
        response.put("originalFilename", file.getOriginalFilename());
        response.put("contentType", file.getContentType());
        response.put("size", file.getSize());
        response.put("sessionId", sessionId);
        response.put("message", "File uploaded successfully");

        return response;
    }

    public ResponseEntity<?> retrieveFile(String fileId) throws IOException {

        // Validate ObjectId format
        if (!ObjectId.isValid(fileId)) {
            throw new IllegalArgumentException("Invalid file ID format");
        }

        // Find file by ObjectId
        GridFSFile gridFSFile = gridFsTemplate.findOne(
                new Query(Criteria.where("_id").is(new ObjectId(fileId)))
        );

        if (gridFSFile == null) {
            return ResponseEntity.notFound().build();
        }

        // Get file content
        InputStream inputStream = gridFsOperations.getResource(gridFSFile).getInputStream();

        // Convert InputStream to byte array
        byte[] fileContent = inputStream.readAllBytes();
        inputStream.close();

        // Get metadata
        String filename = gridFSFile.getFilename();
        String contentType = getContentType(gridFSFile);

        // Set response headers
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.parseMediaType(contentType));
        
        // For images, display inline instead of downloading
        if (contentType.startsWith("image/")) {
            headers.setContentDispositionFormData("inline", filename);
        } else {
            headers.setContentDispositionFormData("attachment", filename);
        }
        
        headers.setContentLength(fileContent.length);

        return ResponseEntity.ok()
                .headers(headers)
                .body(fileContent);
    }

    public Map<String, Object> getFileInfo(String fileId) {

        // Validate ObjectId format
        if (!ObjectId.isValid(fileId)) {
            throw new IllegalArgumentException("Invalid file ID format");
        }

        GridFSFile gridFSFile = gridFsTemplate.findOne(
                new Query(Criteria.where("_id").is(new ObjectId(fileId)))
        );

        if (gridFSFile == null) {
            return new HashMap<>(); // Return empty map if file not found
        }

        Map<String, Object> fileInfo = new HashMap<>();
        fileInfo.put("id", gridFSFile.getObjectId().toString());
        fileInfo.put("filename", gridFSFile.getFilename());
        fileInfo.put("length", gridFSFile.getLength());
        fileInfo.put("uploadDate", gridFSFile.getUploadDate());
        fileInfo.put("contentType", getContentType(gridFSFile));

        // Add custom metadata if available
        if (gridFSFile.getMetadata() != null) {
            fileInfo.put("metadata", gridFSFile.getMetadata());
        }

        return fileInfo;
    }

    private String getContentType(GridFSFile gridFSFile) {
        if (gridFSFile.getMetadata() != null &&
                gridFSFile.getMetadata().containsKey("contentType")) {
            return gridFSFile.getMetadata().getString("contentType");
        }
        return "application/octet-stream"; // Default content type
    }

    public Map<String, Object> deleteFile(String fileId) {
        
        // Validate ObjectId format
        if (!ObjectId.isValid(fileId)) {
            throw new IllegalArgumentException("Invalid file ID format");
        }

        // Check if file exists before deleting
        GridFSFile gridFSFile = gridFsTemplate.findOne(
                new Query(Criteria.where("_id").is(new ObjectId(fileId)))
        );

        if (gridFSFile == null) {
            throw new IllegalArgumentException("File not found");
        }

        // Delete the file from GridFS
        gridFsTemplate.delete(new Query(Criteria.where("_id").is(new ObjectId(fileId))));

        // Return success response
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("filename", fileId);
        response.put("message", "File deleted successfully");
        response.put("deletedFile", gridFSFile.getFilename());

        return response;
    }
}