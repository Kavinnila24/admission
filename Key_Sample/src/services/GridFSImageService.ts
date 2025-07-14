import apiConfig from '../config/apiConfig';

// Helper to get the access token from cookies
const getCookie = (name: string): string | null => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(";").shift() || null;
    return null;
};

export interface FileUploadResponse {
  filename: string;
  originalFilename: string;
  contentType: string;
  size: number;
  message: string;
  success?: boolean;
}

export interface FileInfo {
  id: string;
  filename:string;
  contentType: string;
  length: number;
  uploadDate: string;
}

class GridFSImageService {

  async uploadImage(file: File, metadata?: { [key: string]: any }): Promise<FileUploadResponse> {
    const formData = new FormData();
    formData.append('file', file);
    if (metadata) {
      formData.append('metadata', JSON.stringify(metadata));
    }

    const accessToken = getCookie("access_token");
    if (!accessToken) {
      throw new Error("Access token not found");
    }

    const response = await fetch(`${apiConfig.API_BASE_URL}/file_upload`, {
      method: 'POST',
      body: formData,
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
      credentials: 'include',
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Upload failed');
    }

    return response.json();
  }

  async getFileInfo(fileId: string): Promise<FileInfo> {
    const accessToken = getCookie("access_token");
    if (!accessToken) {
      throw new Error("Access token not found");
    }

    const response = await fetch(`${apiConfig.API_BASE_URL}/file_info?fileName=${fileId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Failed to get file info');
    }

    return response.json();
  }

  async deleteFile(fileId: string): Promise<boolean> {
    const accessToken = getCookie("access_token");
    if (!accessToken) {
      throw new Error("Access token not found");
    }

    const response = await fetch(`${apiConfig.API_BASE_URL}/file_delete?fileName=${fileId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Failed to delete file');
    }

    const result = await response.json();
    return result.success === true;
  }

  /**
   * Fetches a protected image using a Bearer token and returns a local blob URL.
   * This is necessary because <img> tags cannot send Authorization headers directly.
   * @param fileId - The GridFS file ID of the image to retrieve.
   * @returns A promise that resolves to a local object URL for the image.
   */
  async getImageUrl(fileId: string): Promise<string> {
    if (!fileId) return '';

    const params = new URLSearchParams();
    const queryId: any = "GET_ALL";
    params.append("queryId", queryId);

    const accessToken = getCookie("access_token");
    if (!accessToken) {
      throw new Error("Access token not found for retrieving image");
    }

    const response = await fetch(`${apiConfig.API_BASE_URL}/file_retrieve?fileName=${fileId}&${params.toString()}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Failed to retrieve image');
    }

    const imageBlob = await response.blob();
    return URL.createObjectURL(imageBlob);
  }
}

export const gridFSImageService = new GridFSImageService();
export default gridFSImageService;