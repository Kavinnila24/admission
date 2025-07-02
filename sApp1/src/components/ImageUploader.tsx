import React, { useRef, useState, useImperativeHandle, forwardRef } from "react";

const MAX_FILE_SIZE = 128 * 1024; // 128 KB

export const readImageFile = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    if (!["image/jpeg", "image/jpg", "image/png"].includes(file.type)) {
      reject(new Error("Please select a JPG or PNG file."));
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      reject(new Error("File size exceeds 128KB limit."));
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

type ImageUploaderProps = {
  value: string;
  onChange: (dataUrl: string) => void;
  required?: boolean;
};

export const ImageUploader = forwardRef<any, ImageUploaderProps>(
  ({ value, onChange, required = false }, ref) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [error, setError] = useState<string | null>(null);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      try {
        const dataUrl = await readImageFile(file);
        onChange(dataUrl);
        setError(null);
      } catch (err) {
        setError((err as Error).message);
      }
    };

    const openFileDialog = () => fileInputRef.current?.click();

    return (
      <div>
        <button className="btn btn-primary" type="button" onClick={openFileDialog}>
          Upload Photo
        </button>
        <input
          type="file"
          accept=".jpg,.jpeg,.png"
          ref={fileInputRef}
          onChange={handleFileChange}
          style={{ display: "none" }}
        />
        {error && <div className="alert alert-danger mt-2">{error}</div>}
        {value && (
          <div className="mt-3">
            <img src={value} alt="Preview" className="img-thumbnail" style={{ maxWidth: "200px" }} />
          </div>
        )}
      </div>
    );
  }
);
