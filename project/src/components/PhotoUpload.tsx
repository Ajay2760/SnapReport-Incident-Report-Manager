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
      <label className="block font-semibold text-[13px] text-ink-charcoal dark:text-ink-light flex items-center gap-1.5">
        <Camera className="w-4 h-4 text-royal-violet" />
        Photo Evidence (Optional)
      </label>

      {previewUrl ? (
        <div className="relative rounded-cards overflow-hidden border border-soft-mist dark:border-white/[0.12] bg-card-dark aspect-video">
          <img src={previewUrl} alt="Incident Evidence" className="w-full h-full object-cover" />
          <button
            type="button"
            onClick={removePhoto}
            className="absolute top-3 right-3 bg-midnight-wine text-white p-1.5 rounded-pill hover:bg-midnight-wine/90 transition-all"
            aria-label="Remove photo"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <label className="border-2 border-dashed border-soft-mist dark:border-white/[0.14] rounded-cards p-8 flex flex-col items-center justify-center cursor-pointer hover:border-royal-violet dark:hover:border-royal-violet bg-warm-parchment dark:bg-white/[0.02] transition-all group">
          <div className="w-12 h-12 rounded-full bg-lilac-mist/50 flex items-center justify-center mb-3 group-hover:bg-lilac-mist/80 transition-all">
            <Upload className="w-5 h-5 text-royal-violet" />
          </div>
          <span className="font-semibold text-[13px] text-ink-charcoal dark:text-ink-light">
            Upload Hazard Photo
          </span>
          <span className="text-[11px] text-stone-gray mt-1">
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