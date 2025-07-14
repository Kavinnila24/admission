import React, { useRef, useState, forwardRef } from "react";

type ImageUploaderProps = {
  value: string; // URL or filename returned by server
  onChange: (fileUrl: string) => void; // callback with uploaded file URL
  required?: boolean;
};

export const ImageUploader = forwardRef<any, ImageUploaderProps>(
  ({ value, onChange, required = false }, ref) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [previewUrl, setPreviewUrl] = useState<string>("");
    const [error, setError] = useState<string | null>(null);
    const [uploading, setUploading] = useState<boolean>(false);

    const MAX_FILE_SIZE = 128 * 1024; // 128 KB

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      // Validate type and size
      if (!["image/jpeg", "image/jpg", "image/png"].includes(file.type)) {
        setError("Please select a JPG or PNG file.");
        return;
      }
      if (file.size > MAX_FILE_SIZE) {
        setError("File size exceeds 128KB limit.");
        return;
      }

      // Preview
      const localUrl = URL.createObjectURL(file);
      setPreviewUrl(localUrl);
      setError(null);
      setUploading(true);

      try {
        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch("http://localhost:8080/upload", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          throw new Error("Upload failed.");
        }

        const result = await response.json(); // expects { url: "uploaded/path.jpg" }
        onChange(result.url);
      } catch (err: any) {
        setError(err.message || "Failed to upload.");
      } finally {
        setUploading(false);
      }
    };

    const openFileDialog = () => fileInputRef.current?.click();

    return (
      <div>
        <button className="btn btn-primary" type="button" onClick={openFileDialog}>
          {uploading ? "Uploading..." : "Upload Photo"}
        </button>
        <input
          type="file"
          accept=".jpg,.jpeg,.png"
          ref={fileInputRef}
          onChange={handleFileChange}
          style={{ display: "none" }}
        />
        {error && <div className="alert alert-danger mt-2">{error}</div>}
        {(previewUrl || value) && (
          <div className="mt-3">
            <img
              src={previewUrl || value}
              alt="Preview"
              className="img-thumbnail"
              style={{ maxWidth: "200px" }}
            />
          </div>
        )}
      </div>
    );
  }
);
