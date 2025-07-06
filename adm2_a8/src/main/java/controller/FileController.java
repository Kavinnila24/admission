package controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.gridfs.GridFsTemplate;
import com.mongodb.client.gridfs.model.GridFSFile;
import org.bson.types.ObjectId;
import com.flightBooking.service.FileService;

import java.util.Map;
import java.util.HashMap;
import java.util.List;
import java.util.ArrayList;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class FileController {

    @Autowired
    private FileService fileService;

    @Autowired
    private GridFsTemplate gridFsTemplate;

    @PostMapping("/file_upload")
    public ResponseEntity<?> uploadFile(
            @RequestParam("file") MultipartFile file,
            @RequestParam("session_id") String sessionId) {

        try {
            Map<String, Object> response = fileService.uploadFile(file, sessionId);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(500)
                    .body(Map.of("message", "File upload failed: " + e.getMessage()));
        }
    }

    @GetMapping("/file_retrieve")
    public ResponseEntity<?> retrieveFile(@RequestParam("fileName") String fileId) {

        try {
            return fileService.retrieveFile(fileId);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(500)
                    .body(Map.of("message", "File retrieval failed: " + e.getMessage()));
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
            return ResponseEntity.badRequest()
                    .body(Map.of("message", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(500)
                    .body(Map.of("message", "Error retrieving file info: " + e.getMessage()));
        }
    }

    @DeleteMapping("/file_delete")
    public ResponseEntity<?> deleteFile(@RequestParam("fileName") String fileId) {

        try {
            Map<String, Object> response = fileService.deleteFile(fileId);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(500)
                    .body(Map.of("message", "File deletion failed: " + e.getMessage()));
        }
    }

    @GetMapping("/debug/gridfs")
    public ResponseEntity<?> debugGridFS() {
        try {
            Map<String, Object> debug = new HashMap<>();
            
            // Count files in GridFS
            long fileCount = 0;
            for (com.mongodb.client.gridfs.model.GridFSFile gridFSFile : gridFsTemplate.find(new Query())) {
                fileCount++;
            }
            debug.put("totalFiles", fileCount);
            
            // Get recent files
            List<Map<String, Object>> recentFiles = new ArrayList<>();
            int count = 0;
            for (com.mongodb.client.gridfs.model.GridFSFile file : gridFsTemplate.find(new Query())) {
                if (count >= 10) break;
                
                Map<String, Object> fileInfo = new HashMap<>();
                fileInfo.put("id", file.getObjectId().toString());
                fileInfo.put("filename", file.getFilename());
                fileInfo.put("size", file.getLength());
                fileInfo.put("uploadDate", file.getUploadDate());
                fileInfo.put("contentType", file.getMetadata() != null ? 
                    file.getMetadata().getString("contentType") : "unknown");
                recentFiles.add(fileInfo);
                count++;
            }
            
            debug.put("recentFiles", recentFiles);
            debug.put("message", "GridFS debug information");
            
            return ResponseEntity.ok(debug);
        } catch (Exception e) {
            return ResponseEntity.status(500)
                .body(Map.of("error", "Failed to get debug info: " + e.getMessage()));
        }
    }

    @GetMapping("/debug/file/{fileId}")
    public ResponseEntity<?> debugSpecificFile(@PathVariable String fileId) {
        try {
            Map<String, Object> debug = new HashMap<>();
            
            // Validate ObjectId format
            if (!ObjectId.isValid(fileId)) {
                return ResponseEntity.badRequest()
                    .body(Map.of("error", "Invalid file ID format"));
            }
            
            // Find file metadata
            GridFSFile gridFSFile = gridFsTemplate.findOne(
                new Query(Criteria.where("_id").is(new ObjectId(fileId)))
            );
            
            if (gridFSFile == null) {
                debug.put("found", false);
                debug.put("message", "File not found in GridFS");
                debug.put("fileId", fileId);
                debug.put("suggestion", "Check fs.files collection for this ObjectId");
                return ResponseEntity.ok(debug);
            }
            
            // File found - return detailed info
            debug.put("found", true);
            debug.put("fileId", fileId);
            debug.put("filename", gridFSFile.getFilename());
            debug.put("length", gridFSFile.getLength());
            debug.put("uploadDate", gridFSFile.getUploadDate());
            debug.put("contentType", gridFSFile.getMetadata() != null ? 
                gridFSFile.getMetadata().getString("contentType") : "unknown");
            debug.put("metadata", gridFSFile.getMetadata());
            debug.put("message", "File found in GridFS");
            debug.put("collections", Map.of(
                "fs.files", "Contains this file's metadata",
                "fs.chunks", "Contains this file's binary data"
            ));
            
            return ResponseEntity.ok(debug);
            
        } catch (Exception e) {
            return ResponseEntity.status(500)
                .body(Map.of("error", "Failed to debug file: " + e.getMessage()));
        }
    }
}
