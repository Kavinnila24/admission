import apiConfig from '../config/apiConfig';

export interface FileUploadResponse {
  filename: string;
  originalFilename: string;
  contentType: string;
  size: number;
  sessionId: string;
  message: string;
  success?: boolean;
}

export interface FileInfo {
  id: string;
  filename: string;
  contentType: string;
  length: number;
  uploadDate: string;
  metadata?: {
    session_id?: string;
    originalFilename?: string;
    contentType?: string;
    uploadDate?: number;
    fileSize?: number;
  };
}

class GridFSImageService {
  
  /**
   * Upload an image file to GridFS
   * @param file - The image file to upload
   * @param metadata - Optional metadata to store with the file
   * @returns Promise with file upload response
   */
  async uploadImage(file: File, metadata?: { [key: string]: any }): Promise<FileUploadResponse> {
    try {
      const formData = new FormData();
      formData.append('file', file);

      // Get session info for authentication
      const sessionId = sessionStorage.getItem('key') || 'default-session';
      formData.append('session_id', sessionId);

      const response = await fetch(`${apiConfig.API_BASE_URL}/file_upload`, {
        method: 'POST',
        body: formData,
        // Don't set Content-Type header - let browser set it with boundary for FormData
      });

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.status} ${response.statusText}`);
      }

      const result: FileUploadResponse = await response.json();
      console.log('Image uploaded successfully:', result);
      
      // Add success flag for compatibility
      result.success = true;
      return result;
      
    } catch (error) {
      console.error('Error uploading image:', error);
      throw new Error(`Failed to upload image: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Upload image from base64 data (for compatibility with existing ImageUploader)
   * @param base64Data - Base64 encoded image data
   * @param filename - Original filename
   * @param metadata - Optional metadata
   * @returns Promise with file upload response
   */
  async uploadImageFromBase64(base64Data: string, filename: string, metadata?: { [key: string]: any }): Promise<FileUploadResponse> {
    try {
      // Convert base64 to blob
      const response = await fetch(base64Data);
      const blob = await response.blob();
      
      // Create File object from blob
      const file = new File([blob], filename, {
        type: blob.type || 'image/jpeg'
      });

      return await this.uploadImage(file, {
        originalName: filename,
        ...metadata
      });
      
    } catch (error) {
      console.error('Error uploading base64 image:', error);
      throw new Error(`Failed to upload image: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get image URL for displaying
   * @param fileId - GridFS file ID
   * @returns Image URL
   */
  getImageUrl(fileId: string): string {
    if (!fileId) return '';
    return `${apiConfig.API_BASE_URL}/file_retrieve?fileName=${fileId}`;
  }

  /**
   * Get thumbnail URL for displaying (if your backend supports thumbnails)
   * @param fileId - GridFS file ID
   * @returns Thumbnail URL
   */
  getThumbnailUrl(fileId: string): string {
    if (!fileId) return '';
    return `${apiConfig.API_BASE_URL}/file_retrieve?fileName=${fileId}`;
  }

  /**
   * Get file information
   * @param fileId - GridFS file ID
   * @returns Promise with file information
   */
  async getFileInfo(fileId: string): Promise<FileInfo> {
    try {
      const response = await fetch(`${apiConfig.API_BASE_URL}/file_info?fileName=${fileId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to get file info: ${response.status} ${response.statusText}`);
      }

      const fileInfo: FileInfo = await response.json();
      return fileInfo;
      
    } catch (error) {
      console.error('Error getting file info:', error);
      throw new Error(`Failed to get file info: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Delete a file from GridFS
   * @param fileId - GridFS file ID
   * @returns Promise indicating success
   */
  async deleteFile(fileId: string): Promise<boolean> {
    try {
      const response = await fetch(`${apiConfig.API_BASE_URL}/file_delete?fileName=${fileId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to delete file: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      return result.success === true;
      
    } catch (error) {
      console.error('Error deleting file:', error);
      throw new Error(`Failed to delete file: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Download file as blob (useful for saving files)
   * @param fileId - GridFS file ID
   * @returns Promise with blob data
   */
  async downloadFile(fileId: string): Promise<Blob> {
    try {
      const response = await fetch(`${apiConfig.API_BASE_URL}/file_retrieve?fileName=${fileId}`, {
        method: 'GET',
      });

      if (!response.ok) {
        throw new Error(`Failed to download file: ${response.status} ${response.statusText}`);
      }

      return await response.blob();
      
    } catch (error) {
      console.error('Error downloading file:', error);
      throw new Error(`Failed to download file: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Check if a file exists in GridFS
   * @param fileId - GridFS file ID
   * @returns Promise indicating if file exists
   */
  async fileExists(fileId: string): Promise<boolean> {
    try {
      await this.getFileInfo(fileId);
      return true;
    } catch (error) {
      return false;
    }
  }
}

// Export singleton instance
export const gridFSImageService = new GridFSImageService();
export default gridFSImageService;
