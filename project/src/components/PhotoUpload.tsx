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
      <label className="block font-semibold text-[13px] text-black dark:text-white flex items-center gap-1.5">
        <Camera className="w-4 h-4 text-signal-blue" />
        Photo Evidence (Optional)
      </label>

      {previewUrl ? (
        <div className="relative rounded-card overflow-hidden border border-silver/30 dark:border-white/[0.08] bg-black aspect-video">
          <img src={previewUrl} alt="Incident Evidence" className="w-full h-full object-cover" />
          <button
            type="button"
            onClick={removePhoto}
            className="absolute top-3 right-3 bg-alert-red text-white p-1.5 rounded-pill shadow-lg hover:bg-alert-red/90 transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <label className="border-2 border-dashed border-silver/50 dark:border-white/[0.12] rounded-card p-8 flex flex-col items-center justify-center cursor-pointer hover:border-signal-blue dark:hover:border-signal-blue bg-linen dark:bg-white/[0.02] transition-all group">
          <div className="w-12 h-12 rounded-full bg-signal-blue/10 flex items-center justify-center mb-3 group-hover:bg-signal-blue/20 transition-all">
            <Upload className="w-5 h-5 text-signal-blue" />
          </div>
          <span className="font-semibold text-[13px] text-black dark:text-white">
            Upload Hazard Photo
          </span>
          <span className="text-[11px] text-steel mt-1">
            PNG, JPG up to 10MB
          </span>
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