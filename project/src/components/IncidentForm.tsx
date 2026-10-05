import React, { useState, useRef } from 'react';
import { FileText, Tag, AlertTriangle, Plus, X, ShieldAlert, Mic, Square, Play, Pause, Clock, MapPin, User, Send, ArrowUpRight } from 'lucide-react';
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={onCancel} />
      <div className="bezel relative max-w-2xl w-full my-8 max-h-[90vh] overflow-y-auto">
        <div className="bezel-inner p-6 sm:p-7">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border-default pb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-card bg-surface flex items-center justify-center">
              <ShieldAlert className="w-5 h-5 text-accent" />
            </div>
            <div>
              <h2 className="text-base font-semibold">
                New Incident Report
              </h2>
              <p className="text-body-sm mt-0.5">
                Municipal Report · Public Record
              </p>
            </div>
          </div>

          <button
            onClick={onCancel}
            className="btn btn-ghost p-2"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 pt-6">
          
          {/* Title */}
          <div className="field">
            <label className="flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-accent" />
              <span className="text-caption">Incident Title</span>
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              className={`field-input text-sm ${errors.title ? 'border-accent' : ''}`}
              placeholder="e.g. Hazardous Pothole near Main Street"
            />
            {errors.title && <p className="field-error">{errors.title}</p>}
          </div>

          {/* Description */}
          <div className="field">
            <label className="flex items-center gap-1.5">
              <span className="text-caption">Description</span>
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              rows={3}
              className={`field-input text-sm resize-none ${errors.description ? 'border-accent' : ''}`}
              placeholder="Provide complete details, safety hazards, and community impact..."
            />
            {errors.description && <p className="field-error">{errors.description}</p>}
          </div>

          {/* Voice Note */}
<div className="rounded-card border border-border-default bg-surface p-4 space-y-2.5">
            <label className="flex items-center gap-1.5">
              <Mic className="w-4 h-4 text-accent" />
              <span className="text-caption">Voice Note (Optional)</span>
            </label>
            <p className="text-body-sm">Record a 15-second voice description.</p>

            <div className="flex flex-wrap items-center gap-3 pt-1">
              {!isRecording ? (
                <button
                  type="button"
                  onClick={startRecording}
                  className="btn btn-primary px-4 py-2 text-sm flex items-center gap-2"
                >
                  <Mic className="w-4 h-4" />
                  Record
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={stopRecording}
                    className="btn btn-primary px-4 py-2 text-sm flex items-center gap-2 animate-pulse"
                  >
                    <Square className="w-4 h-4" />
                    Stop ({15 - recordingSeconds}s)
                  </button>
                  <span className="text-body-sm">
                    {recordingSeconds}s
                  </span>
                </div>
              )}

              {audioBlobUrl && !isRecording && (
                <div className="flex items-center gap-3 rounded-pill border border-border-default bg-surface px-3.5 py-2">
                  <button
                    type="button"
                    onClick={togglePlayAudio}
                    className="text-accent"
                  >
                    {isPlayingAudio ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </button>
                  <span className="text-sm font-semibold">
                    {isPlayingAudio ? 'Playing...' : 'Ready'}
                  </span>
                  <button
                    type="button"
                    onClick={() => { setAudioBlobUrl(null); setFormData(prev => ({ ...prev, audioUrl: undefined })); }}
                    className="text-foreground-muted text-sm ml-1 hover:text-foreground"
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
              <div className="field">
                <label className="flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-accent" />
                  <span className="text-caption">Category</span>
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => handleChange('category', e.target.value)}
                  className="field-input field-select text-sm font-medium cursor-pointer"
                >
                  <option value="safety">Safety Hazard</option>
                  <option value="infrastructure">Infrastructure</option>
                  <option value="environmental">Environmental</option>
                  <option value="security">Public Security</option>
                  <option value="maintenance">Maintenance</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <div>
              <div className="field">
                <label className="flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-accent" />
                  <span className="text-caption">Priority</span>
                </label>
                <select
                  value={formData.priority}
                  onChange={(e) => handleChange('priority', e.target.value)}
                  className="field-input field-select text-sm font-medium cursor-pointer"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </select>
              </div>
            </div>

            <div>
              <div className="field">
                <label className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-accent" />
                  <span className="text-caption">Target ETA</span>
                </label>
                <select
                  value={formData.eta || 'Within 48 Hours'}
                  onChange={(e) => handleChange('eta', e.target.value)}
                  className="field-input field-select text-sm font-medium cursor-pointer"
                >
                  <option value="Within 24 Hours">24 Hours</option>
                  <option value="Within 48 Hours">48 Hours</option>
                  <option value="Within 3 Days">3 Days</option>
                  <option value="Within 1 Week">1 Week</option>
                </select>
              </div>
            </div>
          </div>

          {/* Location & Reporter */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="field">
                <label className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-accent" />
                  <span className="text-caption">Location</span>
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => handleChange('location', e.target.value)}
                  className={`field-input text-sm ${errors.location ? 'border-accent' : ''}`}
                  placeholder="Street address or landmark"
                />
                {errors.location && <p className="field-error">{errors.location}</p>}
              </div>
            </div>

            <div>
              <div className="field">
                <label className="flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-accent" />
                  <span className="text-caption">Your Name</span>
                </label>
                <input
                  type="text"
                  value={formData.reportedBy}
                  onChange={(e) => handleChange('reportedBy', e.target.value)}
                  className={`field-input text-sm ${errors.reportedBy ? 'border-accent' : ''}`}
                  placeholder="Full name"
                />
                {errors.reportedBy && <p className="field-error">{errors.reportedBy}</p>}
              </div>
            </div>
          </div>

          {/* Tags */}
          <div className="field">
            <span className="text-caption">Tags (Optional)</span>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-2.5">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="relative inline-flex items-center gap-1.5 rounded-pill bg-accent-glow border border-border-accent px-3 py-1 text-sm font-semibold"
                  >
                    #{tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="absolute right-1.5 top-1/2 -translate-y-1/2 text-[11px] hover:text-accent"
                    >
                      <X className="w-3 h-3" />
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
                className="field-input flex-1 rounded-xl px-3.5 py-2 text-sm placeholder:text-foreground-subtle"
                placeholder="Add tag..."
              />
              <button
                type="button"
                onClick={addTag}
                className="btn btn-primary px-4 py-2 text-sm font-medium rounded-xl"
              >
                <Plus className="w-3.5 h-3.5" />
                Add
              </button>
            </div>
          </div>

          {/* Photo */}
          <PhotoUpload onPhotoSelect={setSelectedPhoto} />

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t" style={{ borderColor: 'var(--border-default)' }}>
            <button
              type="submit"
              className="btn btn-primary group flex-1 py-3 px-6 text-sm font-bold"
            >
              Submit report
              <span className="btn-icon-circle"><Send className="h-4 w-4" /></span>
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="btn btn-ghost py-3 px-6 text-sm font-semibold"
            >
              Cancel
            </button>
          </div>

        </form>
        </div>
      </div>
    </div>
  );
};