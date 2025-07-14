package com.rasp.app.service;

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

    /**
     * Uploads a file and associates it with the authenticated user.
     * @param file The file to upload.
     * @param additionalMetadata Optional metadata from the client.
     * @param username The username of the authenticated user.
     * @return A map containing the upload result.
     * @throws IOException
     */
    public Map<String, Object> uploadFile(MultipartFile file, Map<String, Object> additionalMetadata, String username) throws IOException {

        // Validate file
        if (file.isEmpty()) {
            throw new IllegalArgumentException("File is empty");
        }

        // Validate user
        if (username == null || username.trim().isEmpty()) {
            throw new IllegalArgumentException("Username is required for tracking");
        }

        // Create metadata for the file
        Map<String, Object> metadata = new HashMap<>();
        metadata.put("uploadedBy", username); // Store the username instead of session_id
        metadata.put("originalFilename", file.getOriginalFilename());
        metadata.put("contentType", file.getContentType());
        metadata.put("uploadDate", System.currentTimeMillis());
        metadata.put("fileSize", file.getSize());

        // Merge additional metadata from the client, if any
        if (additionalMetadata != null && !additionalMetadata.isEmpty()) {
            metadata.putAll(additionalMetadata);
        }

        // Store file in GridFS
        ObjectId fileId = gridFsTemplate.store(
                file.getInputStream(),
                file.getOriginalFilename(),
                file.getContentType(),
                metadata
        );

        // Return response with file ID
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("filename", fileId.toString()); // This is the GridFS file ID
        response.put("originalFilename", file.getOriginalFilename());
        response.put("contentType", file.getContentType());
        response.put("size", file.getSize());
        response.put("message", "File uploaded successfully");
        // Remove the old sessionId from the response

        return response;
    }

    // No changes are needed for the methods below, as they are not dependent on the session.

    public ResponseEntity<?> retrieveFile(String fileId) throws IOException {
        if (!ObjectId.isValid(fileId)) {
            throw new IllegalArgumentException("Invalid file ID format");
        }
        GridFSFile gridFSFile = gridFsTemplate.findOne(new Query(Criteria.where("_id").is(new ObjectId(fileId))));
        if (gridFSFile == null) {
            return ResponseEntity.notFound().build();
        }
        InputStream inputStream = gridFsOperations.getResource(gridFSFile).getInputStream();
        byte[] fileContent = inputStream.readAllBytes();
        inputStream.close();
        String filename = gridFSFile.getFilename();
        String contentType = getContentType(gridFSFile);
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.parseMediaType(contentType));
        if (contentType.startsWith("image/")) {
            headers.setContentDispositionFormData("inline", filename);
        } else {
            headers.setContentDispositionFormData("attachment", filename);
        }
        headers.setContentLength(fileContent.length);
        return ResponseEntity.ok().headers(headers).body(fileContent);
    }

    public Map<String, Object> getFileInfo(String fileId) {
        if (!ObjectId.isValid(fileId)) {
            throw new IllegalArgumentException("Invalid file ID format");
        }
        GridFSFile gridFSFile = gridFsTemplate.findOne(new Query(Criteria.where("_id").is(new ObjectId(fileId))));
        if (gridFSFile == null) {
            return new HashMap<>();
        }
        Map<String, Object> fileInfo = new HashMap<>();
        fileInfo.put("id", gridFSFile.getObjectId().toString());
        fileInfo.put("filename", gridFSFile.getFilename());
        fileInfo.put("length", gridFSFile.getLength());
        fileInfo.put("uploadDate", gridFSFile.getUploadDate());
        fileInfo.put("contentType", getContentType(gridFSFile));
        if (gridFSFile.getMetadata() != null) {
            fileInfo.put("metadata", gridFSFile.getMetadata());
        }
        return fileInfo;
    }

    private String getContentType(GridFSFile gridFSFile) {
        if (gridFSFile.getMetadata() != null && gridFSFile.getMetadata().containsKey("contentType")) {
            return gridFSFile.getMetadata().getString("contentType");
        }
        return "application/octet-stream";
    }

    public Map<String, Object> deleteFile(String fileId) {
        if (!ObjectId.isValid(fileId)) {
            throw new IllegalArgumentException("Invalid file ID format");
        }
        GridFSFile gridFSFile = gridFsTemplate.findOne(new Query(Criteria.where("_id").is(new ObjectId(fileId))));
        if (gridFSFile == null) {
            throw new IllegalArgumentException("File not found");
        }
        gridFsTemplate.delete(new Query(Criteria.where("_id").is(new ObjectId(fileId))));
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("filename", fileId);
        response.put("message", "File deleted successfully");
        response.put("deletedFile", gridFSFile.getFilename());
        return response;
    }
}