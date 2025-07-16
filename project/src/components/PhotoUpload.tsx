import React, { useState } from 'react';
import { Camera, X, Upload } from 'lucide-react';

interface PhotoUploadProps {
  onPhotoSelect: (file: File | null) => void;
  currentPhoto?: string;
}

export const PhotoUpload: React.FC<PhotoUploadProps> = ({ onPhotoSelect, currentPhoto }) => {
  const [preview, setPreview] = useState<string | null>(currentPhoto || null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
      onPhotoSelect(file);
    }
  };

  const handleRemove = () => {
    setPreview(null);
    onPhotoSelect(null);
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        <Camera className="w-4 h-4 inline mr-2" />
        Photo Evidence (Optional)
      </label>
      
      {preview ? (
        <div className="relative">
          <img
            src={preview}
            alt="Incident preview"
            className="w-full h-48 object-cover rounded-lg border border-gray-300 dark:border-gray-600"
          />
          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center hover:border-blue-500 dark:hover:border-blue-400 transition-colors">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
            id="photo-upload"
          />
          <label
            htmlFor="photo-upload"
            className="cursor-pointer flex flex-col items-center gap-2"
          >
            <Upload className="w-8 h-8 text-gray-400" />
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Click to upload a photo
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-500">
              PNG, JPG up to 10MB
            </span>
          </label>
        </div>
      )}
    </div>
  );
};