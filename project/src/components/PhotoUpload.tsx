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
    <div className="space-y-2">
      <label className="block text-xs font-mono font-bold uppercase text-gold tracking-widest flex items-center gap-2">
        <Camera className="w-4 h-4 text-gold" />
        PHOTOGRAPHIC EVIDENCE PLATE (OPTIONAL)
      </label>
      
      {preview ? (
        <div className="art-deco-frame">
          <div className="art-deco-frame-inner relative">
            <img
              src={preview}
              alt="Incident preview"
              className="w-full h-48 object-cover grayscale hover:grayscale-0 transition-all duration-300"
            />
            <button
              type="button"
              onClick={handleRemove}
              className="absolute top-3 right-3 p-1.5 bg-obsidian text-gold border border-gold hover:bg-gold hover:text-obsidian transition-colors font-mono text-xs font-bold shadow-gold-glow-sm"
              title="Remove Photo"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="text-[10px] font-mono text-gold bg-obsidian p-1.5 text-center uppercase tracking-widest border-t border-gold/40">
              ✦ PHOTO PLATE LOADED • READY FOR GAZETTE PUBLICATION ✦
            </div>
          </div>
        </div>
      ) : (
        <div className="border border-dashed border-gold/60 p-6 text-center bg-charcoal/80 hover:border-gold hover:bg-charcoal transition-all relative">
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
            <div className="border border-gold p-3 bg-obsidian text-gold shadow-gold-glow-sm rotate-45 mb-1">
              <Upload className="w-5 h-5 -rotate-45" />
            </div>
            <span className="font-serif text-xs font-bold uppercase text-gold tracking-widest mt-1">
              CLICK TO ATTACH DISPATCH EVIDENCE PHOTO
            </span>
            <span className="font-mono text-[10px] uppercase text-pewter tracking-wider">
              SUPPORTS JPG, PNG FILE FORMATS UP TO 10MB
            </span>
          </label>
        </div>
      )}
    </div>
  );
};