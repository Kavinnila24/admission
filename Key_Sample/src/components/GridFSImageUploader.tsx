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
    metadata = {}
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
    
    // ... (rest of the JSX from your original file)
    return (
        // The JSX from your provided `GridFSImageUploader.tsx` file fits here.
        // It will now work correctly with the updated state logic.
      <div className={`gridfs-image-uploader ${className}`}>
        {/* ... existing JSX ... */}
      </div>
    );
  }
);

export default GridFSImageUploader;