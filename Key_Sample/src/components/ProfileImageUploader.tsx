
import React, { useRef, useState } from 'react';
import './ProfileImageUploader.css';

const ProfileImageUploader: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [profilePicUrl, setProfilePicUrl] = useState<string | null>(
    '/profile_none.jpg'
  );

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setProfilePicUrl(imageUrl);
    }
  };

  const handleRemove = () => {
    setProfilePicUrl('/profile_none.jpg');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div id="id-profile">
      {profilePicUrl ? (
        <img
          src={profilePicUrl}
          alt="Profile"
          id="id-profilepic"
        />
      ) : (
        <div className="profile-placeholder">No Image</div>
      )}

      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleImageChange}
        style={{ display: 'none' }}
      />

      <div className="dropdown mt-2">
        <button
          className="btn btn-secondary dropdown-toggle"
          type="button"
          id="dropdownMenuButton"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          Options
        </button>
        <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton">
          <li>
            <button className="dropdown-item" onClick={handleUploadClick}>
              Change Photo
            </button>
          </li>
          {profilePicUrl && (
            <li>
              <button className="dropdown-item text-danger" onClick={handleRemove}>
                Remove Photo
              </button>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default ProfileImageUploader;