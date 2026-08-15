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
      <label className="block text-xs font-mono font-bold uppercase text-[#111111] flex items-center gap-1.5">
        <Camera className="w-4 h-4 text-[#CC0000]" />
        PHOTOGRAPHIC EVIDENCE PLATE (OPTIONAL)
      </label>
      
      {preview ? (
        <div className="relative border-2 border-[#111111] p-1 bg-[#111111]">
          <img
            src={preview}
            alt="Incident preview"
            className="w-full h-48 object-cover grayscale hover:grayscale-0 transition-all duration-300"
          />
          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-3 right-3 p-1.5 bg-[#CC0000] text-white hover:bg-black transition-colors border border-white font-mono text-xs font-bold"
            title="Remove Photo"
          >
            <X className="w-4 h-4" />
          </button>
          <div className="text-[10px] font-mono text-white p-1 text-center uppercase tracking-widest">
            PHOTO PLATE LOADED • READY FOR GAZETTE PUBLICATION
          </div>
        </div>
      ) : (
        <div className="border-2 border-dashed border-[#111111] p-6 text-center hover:bg-[#F9F9F7] transition-colors relative halftone-bg">
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
            <div className="border border-[#111111] p-2 bg-white hard-shadow-sm">
              <Upload className="w-6 h-6 text-[#111111]" />
            </div>
            <span className="font-mono text-xs font-bold uppercase text-[#111111] tracking-wider">
              CLICK TO ATTACH DISPATCH EVIDENCE PHOTO
            </span>
            <span className="font-mono text-[10px] uppercase text-neutral-500">
              SUPPORTS JPG, PNG FILE FORMATS UP TO 10MB
            </span>
          </label>
        </div>
      )}
    </div>
  );
};