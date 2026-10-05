import React, { useState } from 'react';
import { Camera, Upload, X } from 'lucide-react';

interface PhotoUploadProps {
  onPhotoSelect: (file: File | null) => void;
}

export const PhotoUpload: React.FC<PhotoUploadProps> = ({ onPhotoSelect }) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      onPhotoSelect(file);
    }
  };

  const removePhoto = () => {
    setPreviewUrl(null);
    onPhotoSelect(null);
  };

  return (
    <div className="space-y-2">
      <label className="flex items-center gap-1.5 text-sm font-semibold">
        <Camera className="w-4 h-4 text-accent" />
        Photo Evidence (Optional)
      </label>

      {previewUrl ? (
        <div className="relative overflow-hidden rounded-card border border-border-default bg-surface aspect-video">
          <img src={previewUrl} alt="Incident Evidence" className="w-full h-full object-cover" />
          <button
            type="button"
            onClick={removePhoto}
            className="absolute top-3 right-3 rounded-full bg-surface-hover text-foreground px-1.5 py-1 transition-colors hover:bg-accent hover:text-white"
            aria-label="Remove photo"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <label className="relative border-2 border-dashed border-border-default rounded-card bg-surface p-8 flex flex-col items-center justify-center cursor-pointer hover:border-border-hover group">
          <div className="w-12 h-12 rounded-full bg-surface flex items-center justify-center mb-3 group-hover:bg-surface-hover transition-colors">
            <Upload className="w-5 h-5 text-accent" />
          </div>
          <span className="text-sm font-semibold">Upload Hazard Photo</span>
          <span className="text-body-sm mt-1">PNG, JPG up to 10MB</span>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
        </label>
      )}
    </div>
  );
};