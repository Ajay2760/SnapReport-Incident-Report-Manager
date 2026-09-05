import React, { useState, useRef } from 'react';
import { FileText, Tag, AlertTriangle, Plus, X, ShieldAlert, Mic, Square, Play, Pause, Clock, MapPin, User } from 'lucide-react';
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
    eta: 'Within 48 Hours',
  });

  const [errors, setErrors] = useState<Partial<IncidentFormData>>({});
  const [, setSelectedPhoto] = useState<File | null>(null);
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');

  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [audioBlobUrl, setAudioBlobUrl] = useState<string | null>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(audioBlob);
        setAudioBlobUrl(url);
        setFormData(prev => ({ ...prev, audioUrl: url }));
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      setRecordingSeconds(0);

      timerIntervalRef.current = setInterval(() => {
        setRecordingSeconds(prev => {
          if (prev >= 15) {
            stopRecording();
            return 15;
          }
          return prev + 1;
        });
      }, 1000);
    } catch {
      alert('Microphone access unavailable. Demo voice note recorded.');
      const fallbackUrl = "https://actions.google.com/sounds/v1/ambiences/outdoor_park.ogg";
      setAudioBlobUrl(fallbackUrl);
      setFormData(prev => ({ ...prev, audioUrl: fallbackUrl }));
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }
    setIsRecording(false);
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
  };

  const togglePlayAudio = () => {
    if (!audioRef.current && audioBlobUrl) {
      audioRef.current = new Audio(audioBlobUrl);
      audioRef.current.onended = () => setIsPlayingAudio(false);
    }

    if (audioRef.current) {
      if (isPlayingAudio) {
        audioRef.current.pause();
        setIsPlayingAudio(false);
      } else {
        audioRef.current.play();
        setIsPlayingAudio(true);
      }
    }
  };

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
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.location.trim()) newErrors.location = 'Location is required';
    if (!formData.reportedBy.trim()) newErrors.reportedBy = 'Name is required';

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
    <div className="fixed inset-0 bg-ink-charcoal/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="app-card max-w-2xl w-full my-8 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-5 border-b border-soft-mist dark:border-white/[0.12] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-cards bg-lilac-mist flex items-center justify-center">
              <ShieldAlert className="w-5 h-5 text-royal-violet" />
            </div>
            <div>
              <h2 className="text-heading-sm">
                New Incident Report
              </h2>
              <p className="text-[13px] text-stone-gray mt-0.5">
                Municipal Report · Public Record
              </p>
            </div>
          </div>

          <button
            onClick={onCancel}
            className="app-btn-ghost p-2"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          
          {/* Title */}
          <div>
            <label className="block font-semibold text-[13px] text-ink-charcoal dark:text-ink-light mb-1.5 flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-royal-violet" />
              Incident Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              className={`w-full px-3.5 py-2.5 app-input text-[13px] ${
                errors.title ? 'border-royal-violet ring-1 ring-lilac-mist' : ''
              }`}
              placeholder="e.g. Hazardous Pothole near Main Street"
            />
            {errors.title && <p className="text-royal-violet font-semibold mt-1.5 text-[11px]">{errors.title}</p>}
          </div>

          {/* Description */}
          <div>
            <label className="block font-semibold text-[13px] text-ink-charcoal dark:text-ink-light mb-1.5">
              Description *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              rows={3}
              className={`w-full px-3.5 py-2.5 app-input text-[13px] ${
                errors.description ? 'border-royal-violet ring-1 ring-lilac-mist' : ''
              }`}
              placeholder="Provide complete details, safety hazards, and community impact..."
            />
            {errors.description && <p className="text-royal-violet font-semibold mt-1.5 text-[11px]">{errors.description}</p>}
          </div>

          {/* Voice Note */}
          <div className="p-4 rounded-cards border border-lilac-mist/50 dark:border-royal-violet/20 bg-lilac-mist/25 dark:bg-royal-violet/10 space-y-2.5">
            <label className="block font-semibold text-[13px] text-ink-charcoal dark:text-ink-light flex items-center gap-1.5">
              <Mic className="w-4 h-4 text-royal-violet" />
              Voice Note (Optional)
            </label>
            <p className="text-[11px] text-stone-gray">
              Record a 15-second voice description.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-1">
              {!isRecording ? (
                <button
                  type="button"
                  onClick={startRecording}
                  className="app-btn-primary px-4 py-2 text-[13px] flex items-center gap-2"
                >
                  <Mic className="w-4 h-4" />
                  Record
                </button>
              ) : (
                <button
                  type="button"
                  onClick={stopRecording}
                  className="bg-midnight-wine hover:bg-midnight-wine/90 text-white px-4 py-2 rounded-pill text-[13px] font-medium flex items-center gap-2 animate-pulse"
                >
                  <Square className="w-4 h-4" />
                  Stop ({15 - recordingSeconds}s)
                </button>
              )}

              {audioBlobUrl && !isRecording && (
                <div className="flex items-center gap-3 px-3.5 py-2 rounded-pill bg-paper-white dark:bg-white/[0.06] border border-soft-mist dark:border-white/[0.12]">
                  <button
                    type="button"
                    onClick={togglePlayAudio}
                    className="text-royal-violet"
                  >
                    {isPlayingAudio ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </button>
                  <span className="text-[13px] font-semibold text-ink-charcoal dark:text-ink-light">
                    {isPlayingAudio ? 'Playing...' : 'Ready'}
                  </span>
                  <button
                    type="button"
                    onClick={() => { setAudioBlobUrl(null); setFormData(prev => ({ ...prev, audioUrl: undefined })); }}
                    className="text-stone-gray hover:text-midnight-wine text-[13px] ml-1"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Classification Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block font-semibold text-[13px] text-ink-charcoal dark:text-ink-light mb-1.5 flex items-center gap-1">
                <Tag className="w-3.5 h-3.5 text-royal-violet" />
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => handleChange('category', e.target.value)}
                className="w-full px-3 py-2.5 app-input text-[13px] font-medium cursor-pointer"
              >
                <option value="safety">Safety Hazard</option>
                <option value="infrastructure">Infrastructure</option>
                <option value="environmental">Environmental</option>
                <option value="security">Public Security</option>
                <option value="maintenance">Maintenance</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-[13px] text-ink-charcoal dark:text-ink-light mb-1.5 flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5 text-royal-violet" />
                Priority
              </label>
              <select
                value={formData.priority}
                onChange={(e) => handleChange('priority', e.target.value)}
                className="w-full px-3 py-2.5 app-input text-[13px] font-medium cursor-pointer"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-[13px] text-ink-charcoal dark:text-ink-light mb-1.5 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-royal-violet" />
                Target ETA
              </label>
              <select
                value={formData.eta || 'Within 48 Hours'}
                onChange={(e) => handleChange('eta', e.target.value)}
                className="w-full px-3 py-2.5 app-input text-[13px] font-medium cursor-pointer"
              >
                <option value="Within 24 Hours">24 Hours</option>
                <option value="Within 48 Hours">48 Hours</option>
                <option value="Within 3 Days">3 Days</option>
                <option value="Within 1 Week">1 Week</option>
              </select>
            </div>
          </div>

          {/* Location & Reporter */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-[13px] text-ink-charcoal dark:text-ink-light mb-1.5 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-royal-violet" />
                Location *
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => handleChange('location', e.target.value)}
                className={`w-full px-3.5 py-2.5 app-input text-[13px] ${
                  errors.location ? 'border-royal-violet ring-1 ring-lilac-mist' : ''
                }`}
                placeholder="Street address or landmark"
              />
              {errors.location && <p className="text-royal-violet font-semibold mt-1.5 text-[11px]">{errors.location}</p>}
            </div>

            <div>
              <label className="block font-semibold text-[13px] text-ink-charcoal dark:text-ink-light mb-1.5 flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-royal-violet" />
                Your Name *
              </label>
              <input
                type="text"
                value={formData.reportedBy}
                onChange={(e) => handleChange('reportedBy', e.target.value)}
                className={`w-full px-3.5 py-2.5 app-input text-[13px] ${
                  errors.reportedBy ? 'border-royal-violet ring-1 ring-lilac-mist' : ''
                }`}
                placeholder="Full name"
              />
              {errors.reportedBy && <p className="text-royal-violet font-semibold mt-1.5 text-[11px]">{errors.reportedBy}</p>}
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block font-semibold text-[13px] text-ink-charcoal dark:text-ink-light mb-1.5">
              Tags (Optional)
            </label>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-2.5">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1.5 px-3 py-1 bg-lilac-mist text-royal-violet rounded-pill text-[13px] font-semibold"
                  >
                    #{tag}
                    <button type="button" onClick={() => removeTag(tag)} className="hover:text-midnight-wine">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </span>
                ))}
              </div>
            )}
            <div className="flex gap-2">
              <input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                className="flex-1 px-3.5 py-2 app-input text-[13px]"
                placeholder="Add tag..."
              />
              <button
                type="button"
                onClick={addTag}
                className="app-btn-outline px-4 py-2 text-[13px] flex items-center gap-1"
              >
                <Plus className="w-4 h-4" />
                Add
              </button>
            </div>
          </div>

          {/* Photo */}
          <PhotoUpload onPhotoSelect={setSelectedPhoto} />

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-soft-mist dark:border-white/[0.12]">
            <button
              type="submit"
              className="flex-1 app-btn-primary py-3 px-6 text-[15px] font-semibold"
            >
              Submit Report
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="app-btn-ghost py-3 px-6 text-[15px] font-semibold"
            >
              Cancel
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};