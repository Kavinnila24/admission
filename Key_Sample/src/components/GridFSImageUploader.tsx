import React, { useRef, useState, useEffect, forwardRef } from "react";
import gridFSImageService, { FileInfo, FileUploadResponse } from '../services/GridFSImageService';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

type ImageUploaderProps = {
  value: string; // GridFS file ID
  onChange: (fileId: string) => void;
  required?: boolean;
  placeholder?: string;
  showPreview?: boolean;
  allowedTypes?: string[];
  className?: string;
  style?: React.CSSProperties;
  metadata?: { [key: string]: any };
};

export const GridFSImageUploader = forwardRef<any, ImageUploaderProps>(
  ({ 
    value, 
    onChange, 
    required = false, 
    placeholder = "Click to upload file",
    showPreview = true,
    allowedTypes = ["image/jpeg", "image/png", "image/webp", "application/pdf"],
    className = "",
    style = {},
    metadata = {},
  }, ref) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [error, setError] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState<boolean>(false);
    const [imageUrl, setImageUrl] = useState<string>("");
    const [dragOver, setDragOver] = useState<boolean>(false);
    const [fileInfo, setFileInfo] = useState<FileInfo | null>(null);

    // Effect to fetch file info and secure image URL when the fileId (value) changes
    useEffect(() => {
      let objectUrl: string | null = null;

      const loadData = async () => {
        if (value) {
          try {
            // Fetch both file info and the image URL concurrently
            const [info, url] = await Promise.all([
              gridFSImageService.getFileInfo(value),
              gridFSImageService.getImageUrl(value)
            ]);
            setFileInfo(info);
            objectUrl = url;
            setImageUrl(url);
          } catch (err) {
            console.error("Failed to load file data:", err);
            setError("Could not load file details.");
            setImageUrl("");
            setFileInfo(null);
          }
        } else {
          setImageUrl("");
          setFileInfo(null);
        }
      };

      loadData();

      // Cleanup function to revoke the object URL on unmount or value change
      return () => {
        if (objectUrl) {
          URL.revokeObjectURL(objectUrl);
        }
      };
    }, [value]);

    const handleFileChange = async (file: File) => {
      if (!file) return;

      if (!allowedTypes.includes(file.type)) {
        setError(`Invalid file type. Please select: ${allowedTypes.join(', ')}`);
        return;
      }
      if (file.size > MAX_FILE_SIZE) {
        setError("File size exceeds 5MB limit.");
        return;
      }

      setIsUploading(true);
      setError(null);

      try {
        const uploadMetadata = { ...metadata };
        const response = await gridFSImageService.uploadImage(file, uploadMetadata);
        
        if (response.success && response.filename) {
          onChange(response.filename); // Propagate the new file ID
        } else {
          throw new Error(response.message || 'Upload failed');
        }
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setIsUploading(false);
      }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        handleFileChange(file);
      }
    };

    const handleDrop = (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const file = e.dataTransfer.files?.[0];
      if (file) {
        handleFileChange(file);
      }
    };

    const openFileDialog = () => fileInputRef.current?.click();

    const handleDragOver = (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
    };

    const removeFile = async () => {
      if (value) {
        try {
          await gridFSImageService.deleteFile(value);
        } catch (err) {
          console.warn('Could not delete file from GridFS:', err);
        }
      }
      onChange(""); // Clear the value
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    };
    
    
    // UI rendering logic remains largely the same, but simplified...
    // You can now rely on `isUploading`, `error`, `fileInfo`, and `imageUrl` states.
    
    const uploadContainerStyle: React.CSSProperties = {
      border: `2px dashed ${dragOver ? '#007bff' : '#dee2e6'}`,
      borderRadius: '8px',
      padding: '20px',
      textAlign: 'center',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      backgroundColor: dragOver ? '#f8f9fa' : 'transparent',
      position: 'relative',
      minHeight: '120px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      ...style
    };

    return (
      <div className={`gridfs-image-uploader ${className}`}>
        {/* Upload Area */}
        <div
          style={uploadContainerStyle}
          onClick={openFileDialog}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          // Replace the file input with this more explicit version:

        <input
          type="file"
          accept={allowedTypes.join(",")}
          ref={fileInputRef}
          onChange={(e) => {
            console.log("📋 Direct onChange fired!");
            console.log("📁 Files:", e.target.files);
            handleInputChange(e);
          }}
          style={{ display: "none" }}
          required={required}
          id="gridfs-file-input" // Add an ID for debugging
        />
          
          {isUploading ? (
            <div>
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Uploading...</span>
              </div>
              <p className="mt-2 mb-0">Uploading...</p>
              
            </div>
          ) : imageUrl && showPreview ? (
            <div className="uploaded-image-container">
              {fileInfo && fileInfo.contentType && fileInfo.contentType.startsWith('image/') ? (
                <img 
                  src={imageUrl} 
                  alt="Uploaded preview" 
                  className="img-thumbnail mb-2" 
                  style={{ 
                    maxWidth: "200px", 
                    maxHeight: "150px",
                    objectFit: "contain"
                  }} 
                />
              ) : (
                <div className="document-preview mb-2" style={{ 
                  width: "200px", 
                  height: "150px",
                  border: "2px dashed #ddd",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "#f8f9fa"
                }}>
                  <i className="bi bi-file-earmark-pdf display-4 text-muted mb-2"></i>
                  <small className="text-muted text-center">
                    {fileInfo ? fileInfo.filename : 'Document uploaded'}
                  </small>
                </div>
              )}
              {fileInfo && (
                <div className="file-info mb-2">
                  <small className="text-muted d-block">
                    {fileInfo.filename} • {Math.round(fileInfo.length / 1024)}KB
                  </small>
                </div>
              )}
              <div className="image-actions">
                <button 
                  type="button" 
                  className="btn btn-sm btn-outline-primary me-2"
                  onClick={(e) => { e.stopPropagation(); openFileDialog(); }}
                >
                  Change
                </button>
                <button 
                  type="button" 
                  className="btn btn-sm btn-outline-danger"
                  onClick={(e) => { e.stopPropagation(); removeFile(); }}
                >
                  Remove
                </button>
              </div>
            </div>
          ) : (
            <div className="upload-placeholder">
              <i className="bi bi-cloud-upload display-6 text-muted mb-2"></i>
              <p className="mb-1">{placeholder}</p>
              <small className="text-muted">
                {allowedTypes.map(type => type.split('/')[1]).join(', ').toUpperCase()} • Max 5MB
                {<span className="d-block">Stored in GridFS</span>}
              </small>
              {dragOver && (
                <p className="text-primary mt-2 mb-0">Drop your file here!</p>
              )}
            </div>
          )}
        </div>

        {/* Error Display */}
        {error && (
          <div className="alert alert-danger mt-2 mb-0">
            <i className="bi bi-exclamation-triangle me-2"></i>
            {error}
          </div>
        )}

        {/* Success Message */}
        {imageUrl && !error && !isUploading && (
          <div className="alert alert-success mt-2 mb-0">
            <i className="bi bi-check-circle me-2"></i>
          </div>
        )}
        {/* {uploadToGridFS ? `File stored in GridFS (ID: ${value})` : 'File uploaded successfully!'} */}

        {/* File Info */}
        {fileInfo && (
          <div className="mt-2">
            <small className="text-muted">
              <strong>File ID:</strong> {fileInfo.id}<br />
              <strong>Size:</strong> {Math.round(fileInfo.length / 1024)}KB<br />
              <strong>Type:</strong> {fileInfo.contentType}<br />
              <strong>Uploaded:</strong> {new Date(fileInfo.uploadDate).toLocaleString()}
            </small>
          </div>
        )}
      </div>
    );
  }
);

export default GridFSImageUploader;