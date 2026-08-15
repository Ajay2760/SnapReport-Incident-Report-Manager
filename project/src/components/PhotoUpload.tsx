import React, { useState } from 'react';
import { Camera, Upload, X, Image as ImageIcon } from 'lucide-react';

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
      <label className="block font-bold text-xs text-slate-900 dark:text-slate-200 flex items-center gap-1.5">
        <Camera className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
        Photo Evidence Attachment (Optional)
      </label>

      {previewUrl ? (
        <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-900 aspect-video">
          <img src={previewUrl} alt="Incident Evidence" className="w-full h-full object-cover" />
          <button
            type="button"
            onClick={removePhoto}
            className="absolute top-3 right-3 bg-rose-600 text-white p-1.5 rounded-xl shadow-lg hover:bg-rose-700 transition-all text-xs font-bold"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <label className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer hover:border-indigo-500 dark:hover:border-indigo-400 bg-slate-50 dark:bg-slate-900/50 transition-all">
          <Upload className="w-8 h-8 text-indigo-600 dark:text-indigo-400 mb-2" />
          <span className="font-bold text-xs text-slate-900 dark:text-white">
            Upload Hazard Photo Evidence
          </span>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
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