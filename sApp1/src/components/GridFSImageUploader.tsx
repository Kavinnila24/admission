import React, { useRef, useState, useImperativeHandle, forwardRef, useEffect } from "react";
import gridFSImageService, { FileUploadResponse } from '../services/GridFSImageService';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB for documents

export const readImageFile = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    if (!["image/jpeg", "image/jpg", "image/png", "image/webp"].includes(file.type)) {
      reject(new Error("Please select a JPG, PNG, or WebP file."));
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      reject(new Error("File size exceeds 2MB limit."));
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      if (reader.result) {
        resolve(reader.result as string);
      } else {
        reject(new Error("Failed to read file."));
      }
    };
    reader.onerror = () => reject(new Error("Error reading file."));
    reader.readAsDataURL(file);
  });
};

// Helper function to format image URLs (GridFS file ID to URL)
export const formatImageUrl = (fileId: string): string => {
  if (!fileId) return '';
  return gridFSImageService.getImageUrl(fileId);
};

type ImageUploaderProps = {
  value: string; // GridFS file ID
  onChange: (fileId: string) => void; // Returns GridFS file ID
  required?: boolean;
  placeholder?: string;
  showPreview?: boolean;
  enableCompression?: boolean;
  allowedTypes?: string[];
  className?: string;
  style?: React.CSSProperties;
  uploadToGridFS?: boolean; // New prop to enable GridFS upload
  metadata?: { [key: string]: any }; // Metadata to store with file
};

export const GridFSImageUploader = forwardRef<any, ImageUploaderProps>(
  ({ 
    value, 
    onChange, 
    required = false, 
    placeholder = "Click to upload image",
    showPreview = true,
    enableCompression = true,
    allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"],
    className = "",
    style = {},
    uploadToGridFS = true,
    metadata = {}
  }, ref) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [error, setError] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState<boolean>(false);
    const [imageUrl, setImageUrl] = useState<string>("");
    const [dragOver, setDragOver] = useState<boolean>(false);
    const [uploadProgress, setUploadProgress] = useState<number>(0);
    const [fileInfo, setFileInfo] = useState<any>(null);

    // Update image URL when value (fileId) changes
    useEffect(() => {
      if (value) {
        if (uploadToGridFS) {
          // Value is GridFS file ID
          setImageUrl(formatImageUrl(value));
          // Optionally fetch file info
          loadFileInfo(value);
        } else {
          // Value is base64 data URL
          setImageUrl(value);
        }
      } else {
        setImageUrl("");
        setFileInfo(null);
      }
    }, [value, uploadToGridFS]);

    const loadFileInfo = async (fileId: string) => {
      try {
        const info = await gridFSImageService.getFileInfo(fileId);
        setFileInfo(info);
      } catch (error) {
        console.warn('Could not load file info:', error);
      }
    };

    const handleFileChange = async (file: File) => {
      console.log("HI");
      if (!file) return;

      // Validate file type based on allowedTypes prop
      if (!allowedTypes.includes(file.type)) {
        const allowedExtensions = allowedTypes.map(type => type.split('/')[1]).join(', ').toUpperCase();
        setError(`Please select a ${allowedExtensions} file.`);
        return;
      }

      // Validate file size
      if (file.size > MAX_FILE_SIZE) {
        setError("File size exceeds 5MB limit.");
        return;
      }

      setIsUploading(true);
      setError(null);
      setUploadProgress(0);

      try {
        if (uploadToGridFS) {
          // Upload to GridFS
          const uploadMetadata = {
            category: file.type.startsWith('image/') ? 'image' : 'document',
            uploadedBy: sessionStorage.getItem('userId') || 'anonymous',
            originalSize: file.size,
            ...metadata
          };

          setUploadProgress(25);
          const response: FileUploadResponse = await gridFSImageService.uploadImage(file, uploadMetadata);
          setUploadProgress(75);
          
          if (response.success && response.filename) {
            onChange(response.filename); // Return GridFS file ID (stored in filename field)
            setUploadProgress(100);
          } else {
            console.log('Upload failed:', response);
            throw new Error(response.message || 'Upload failed');
          }
        } else {
          // Legacy base64 upload (only for images)
          if (file.type.startsWith('image/')) {
            const dataUrl = await readImageFile(file);
            onChange(dataUrl);
          } else {
            throw new Error('Base64 upload only supports images. Use GridFS for other file types.');
          }
        }
        
        setError(null);
      } catch (err) {
        setError((err as Error).message);
        setUploadProgress(0);
      } finally {
        setIsUploading(false);
        setTimeout(() => setUploadProgress(0), 2000);
      }
    };

    const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      console.log("Entered handleInputChange with file:", file);
      if (file) {
        console.log("Entered handleInputChange with file");
        await handleFileChange(file);
      }
    };

    const handleDrop = async (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      
      const files = e.dataTransfer.files;
      if (files.length > 0) {
        await handleFileChange(files[0]);
      }
    };

    const handleDragOver = (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
    };

    const openFileDialog = () => fileInputRef.current?.click();

    const removeImage = async () => {
      if (value && uploadToGridFS) {
        try {
          // Delete from GridFS
          await gridFSImageService.deleteFile(value);
        } catch (error) {
          console.warn('Could not delete file from GridFS:', error);
        }
      }
      
      onChange("");
      setImageUrl("");
      setFileInfo(null);
      setError(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    };

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
              {uploadProgress > 0 && (
                <div className="progress mt-2" style={{ width: '200px' }}>
                  <div 
                    className="progress-bar" 
                    role="progressbar" 
                    style={{ width: `${uploadProgress}%` }}
                    aria-valuenow={uploadProgress} 
                    aria-valuemin={0} 
                    aria-valuemax={100}
                  >
                    {uploadProgress}%
                  </div>
                </div>
              )}
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
                  onClick={(e) => { e.stopPropagation(); removeImage(); }}
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
                {uploadToGridFS && <span className="d-block">Stored in GridFS</span>}
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
            {uploadToGridFS ? `File stored in GridFS (ID: ${value})` : 'File uploaded successfully!'}
          </div>
        )}

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

// Backward compatibility export
export const ImageUploader = GridFSImageUploader;

export default GridFSImageUploader;
