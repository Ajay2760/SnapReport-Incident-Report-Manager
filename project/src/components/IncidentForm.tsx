import React, { useState } from 'react';
import { AlertCircle, MapPin, User, FileText, Tag, AlertTriangle, Plus, X, ShieldAlert } from 'lucide-react';
import { IncidentFormData } from '../types/incident';
import { PhotoUpload } from './PhotoUpload';

interface IncidentFormProps {
  onSubmit: (data: IncidentFormData) => void;
  onCancel: () => void;
}

export const IncidentForm: React.FC<IncidentFormProps> = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState<IncidentFormData>({
    title: '',
    description: '',
    category: 'other',
    priority: 'medium',
    location: '',
    reportedBy: '',
  });

  const [errors, setErrors] = useState<Partial<IncidentFormData>>({});
  const [selectedPhoto, setSelectedPhoto] = useState<File | null>(null);
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors: Partial<IncidentFormData> = {};
    if (!formData.title.trim()) newErrors.title = 'INCIDENT TITLE IS REQUIRED';
    if (!formData.description.trim()) newErrors.description = 'INCIDENT DESCRIPTION IS REQUIRED';
    if (!formData.location.trim()) newErrors.location = 'LOCATION IS REQUIRED';
    if (!formData.reportedBy.trim()) newErrors.reportedBy = 'REPORTER IDENTIFIER IS REQUIRED';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSubmit({ ...formData, tags });
  };

  const handleChange = (field: keyof IncidentFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <div className="fixed inset-0 bg-[#111111]/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-[#F9F9F7] border-4 border-[#111111] hard-shadow-lg max-w-2xl w-full my-8 max-h-[90vh] overflow-y-auto newsprint-texture">
        {/* Form Header Banner */}
        <div className="bg-[#111111] text-white p-5 border-b-2 border-[#111111] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="border border-white p-1.5 bg-[#CC0000]">
              <ShieldAlert className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black font-serif uppercase tracking-tight text-white leading-none">
                OFFICIAL INCIDENT TELEGRAM DISPATCH
              </h2>
              <span className="font-mono text-[10px] text-neutral-300 uppercase tracking-widest block mt-1">
                FORM REF #SRG-2026 • OFFICIAL MUNICIPAL FILING
              </span>
            </div>
          </div>

          <button
            onClick={onCancel}
            className="border border-white text-white px-2.5 py-1 font-mono text-xs hover:bg-[#CC0000] hover:border-[#CC0000] transition-colors font-bold uppercase"
          >
            ✕ CLOSE
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6 font-mono text-xs">
          
          {/* Headline Title Field */}
          <div>
            <label className="block font-bold uppercase text-[#111111] mb-1.5 flex items-center gap-1">
              <FileText className="w-4 h-4 text-[#CC0000]" />
              DISPATCH HEADLINE TITLE *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              className={`w-full px-3 py-2.5 border-2 font-mono text-sm bg-white text-[#111111] focus:outline-none ${
                errors.title ? 'border-[#CC0000]' : 'border-[#111111]'
              }`}
              placeholder="e.g. Hazardous Pothole near Main Street Intersection"
            />
            {errors.title && <p className="text-[#CC0000] font-bold mt-1 uppercase text-[10px]">{errors.title}</p>}
          </div>

          {/* Description Textarea */}
          <div>
            <label className="block font-bold uppercase text-[#111111] mb-1.5">
              DETAILED DISPATCH DESCRIPTION & INCIDENT SUMMARY *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              rows={4}
              className={`w-full px-3 py-2.5 border-2 font-mono text-sm bg-white text-[#111111] focus:outline-none ${
                errors.description ? 'border-[#CC0000]' : 'border-[#111111]'
              }`}
              placeholder="Provide complete details, safety hazards, and impact on local community..."
            />
            {errors.description && <p className="text-[#CC0000] font-bold mt-1 uppercase text-[10px]">{errors.description}</p>}
          </div>

          {/* Category & Priority Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold uppercase text-[#111111] mb-1.5 flex items-center gap-1">
                <Tag className="w-4 h-4 text-[#111111]" />
                INCIDENT CLASSIFICATION
              </label>
              <select
                value={formData.category}
                onChange={(e) => handleChange('category', e.target.value)}
                className="w-full px-3 py-2.5 border-2 border-[#111111] font-mono text-sm bg-white text-[#111111] focus:outline-none cursor-pointer uppercase font-bold"
              >
                <option value="safety">SAFETY HAZARD</option>
                <option value="infrastructure">INFRASTRUCTURE DAMAGE</option>
                <option value="environmental">ENVIRONMENTAL ISSUE</option>
                <option value="security">PUBLIC SECURITY</option>
                <option value="maintenance">MUNICIPAL MAINTENANCE</option>
                <option value="other">OTHER DISPATCH</option>
              </select>
            </div>

            <div>
              <label className="block font-bold uppercase text-[#111111] mb-1.5 flex items-center gap-1">
                <AlertTriangle className="w-4 h-4 text-[#CC0000]" />
                URGENCY & PRIORITY LEVEL
              </label>
              <select
                value={formData.priority}
                onChange={(e) => handleChange('priority', e.target.value)}
                className="w-full px-3 py-2.5 border-2 border-[#111111] font-mono text-sm bg-white text-[#111111] focus:outline-none cursor-pointer uppercase font-bold"
              >
                <option value="low">LOW (ROUTINE NOTICE)</option>
                <option value="medium">MEDIUM (ATTENTION REQUIRED)</option>
                <option value="high">HIGH (URGENT HAZARD)</option>
                <option value="critical">CRITICAL (EMERGENCY DISPATCH)</option>
              </select>
            </div>
          </div>

          {/* Location & Reporter Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold uppercase text-[#111111] mb-1.5 flex items-center gap-1">
                <MapPin className="w-4 h-4 text-[#111111]" />
                LOCATION & ADDRESS *
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => handleChange('location', e.target.value)}
                className={`w-full px-3 py-2.5 border-2 font-mono text-sm bg-white text-[#111111] focus:outline-none ${
                  errors.location ? 'border-[#CC0000]' : 'border-[#111111]'
                }`}
                placeholder="Specific street address or landmark"
              />
              {errors.location && <p className="text-[#CC0000] font-bold mt-1 uppercase text-[10px]">{errors.location}</p>}
            </div>

            <div>
              <label className="block font-bold uppercase text-[#111111] mb-1.5 flex items-center gap-1">
                <User className="w-4 h-4 text-[#111111]" />
                CITIZEN REPORTER BYLINE *
              </label>
              <input
                type="text"
                value={formData.reportedBy}
                onChange={(e) => handleChange('reportedBy', e.target.value)}
                className={`w-full px-3 py-2.5 border-2 font-mono text-sm bg-white text-[#111111] focus:outline-none ${
                  errors.reportedBy ? 'border-[#CC0000]' : 'border-[#111111]'
                }`}
                placeholder="Full Name or Reporter Handle"
              />
              {errors.reportedBy && <p className="text-[#CC0000] font-bold mt-1 uppercase text-[10px]">{errors.reportedBy}</p>}
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block font-bold uppercase text-[#111111] mb-1.5">
              INDEX TAGS (OPTIONAL)
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#111111] text-white font-mono text-xs uppercase font-bold"
                >
                  #{tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="hover:text-[#CC0000]"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                className="flex-1 px-3 py-2 border-2 border-[#111111] font-mono text-sm bg-white text-[#111111] focus:outline-none"
                placeholder="Add tag..."
              />
              <button
                type="button"
                onClick={addTag}
                className="px-4 py-2 bg-[#111111] text-white font-mono text-xs uppercase font-bold tracking-widest hover:bg-[#CC0000] transition-colors flex items-center gap-1"
              >
                <Plus className="w-4 h-4" />
                ADD
              </button>
            </div>
          </div>

          {/* Photo Evidence Component */}
          <PhotoUpload onPhotoSelect={setSelectedPhoto} />

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t-2 border-[#111111]">
            <button
              type="submit"
              className="flex-1 bg-[#111111] text-white py-3 px-6 font-mono text-sm uppercase tracking-widest font-bold hover:bg-[#CC0000] transition-all hard-shadow-hover"
            >
              SUBMIT & TRANSMIT TELEGRAM
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="border-2 border-[#111111] bg-white text-[#111111] py-3 px-6 font-mono text-sm uppercase tracking-widest font-bold hover:bg-neutral-200 transition-colors"
            >
              CANCEL FILING
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};