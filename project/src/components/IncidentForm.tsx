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
  const [selectedPhoto, setSelectedPhoto] = useState<File | null>(null);
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');

  // Audio Voice Note Recording State
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [audioBlobUrl, setAudioBlobUrl] = useState<string | null>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerIntervalRef = useRef<any>(null);
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
    } catch (err) {
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
    if (!formData.title.trim()) newErrors.title = 'Incident title is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.location.trim()) newErrors.location = 'Location is required';
    if (!formData.reportedBy.trim()) newErrors.reportedBy = 'Reporter name is required';

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
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-2xl max-w-2xl w-full my-8 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-700/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                File New Incident Dispatch
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Official Municipal Report • Public Citizen Record
              </p>
            </div>
          </div>

          <button
            onClick={onCancel}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5 font-sans text-xs">
          
          {/* Headline Title */}
          <div>
            <label className="block font-bold text-slate-900 dark:text-slate-200 mb-1.5 flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              Incident Headline Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              className={`w-full px-3.5 py-2.5 app-input text-xs ${
                errors.title ? 'border-rose-500' : ''
              }`}
              placeholder="e.g. Hazardous Pothole near Main Street Intersection"
            />
            {errors.title && <p className="text-rose-500 font-semibold mt-1 text-[11px]">{errors.title}</p>}
          </div>

          {/* Description */}
          <div>
            <label className="block font-bold text-slate-900 dark:text-slate-200 mb-1.5">
              Detailed Description & Summary *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              rows={3}
              className={`w-full px-3.5 py-2.5 app-input text-xs ${
                errors.description ? 'border-rose-500' : ''
              }`}
              placeholder="Provide complete details, safety hazards, and community impact..."
            />
            {errors.description && <p className="text-rose-500 font-semibold mt-1 text-[11px]">{errors.description}</p>}
          </div>

          {/* Voice Note Recorder */}
          <div className="p-4 rounded-xl border border-indigo-100 dark:border-indigo-900/50 bg-indigo-50/50 dark:bg-indigo-950/30 space-y-2">
            <label className="block font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <Mic className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              🎙️ Citizen Voice Note (Optional)
            </label>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Record a 15-second voice description for your incident report.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-1">
              {!isRecording ? (
                <button
                  type="button"
                  onClick={startRecording}
                  className="app-btn-primary px-4 py-2 text-xs flex items-center gap-2"
                >
                  <Mic className="w-4 h-4" />
                  Start Recording Voice Note
                </button>
              ) : (
                <button
                  type="button"
                  onClick={stopRecording}
                  className="bg-rose-600 hover:bg-rose-700 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 animate-pulse"
                >
                  <Square className="w-4 h-4" />
                  Stop Recording ({15 - recordingSeconds}s remaining)
                </button>
              )}

              {audioBlobUrl && !isRecording && (
                <div className="flex items-center gap-3 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  <button
                    type="button"
                    onClick={togglePlayAudio}
                    className="text-indigo-600 dark:text-indigo-400"
                  >
                    {isPlayingAudio ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </button>
                  <span className="text-xs font-bold text-slate-900 dark:text-white">
                    {isPlayingAudio ? 'Playing...' : 'Voice Note Ready'}
                  </span>
                  <button
                    type="button"
                    onClick={() => { setAudioBlobUrl(null); setFormData(prev => ({ ...prev, audioUrl: undefined })); }}
                    className="text-slate-400 hover:text-rose-500 text-xs ml-2"
                  >
                    ✕ Clear
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Classification & Urgency & ETA */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block font-bold text-slate-900 dark:text-slate-200 mb-1.5 flex items-center gap-1">
                <Tag className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => handleChange('category', e.target.value)}
                className="w-full px-3 py-2.5 app-input text-xs font-semibold cursor-pointer"
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
              <label className="block font-bold text-slate-900 dark:text-slate-200 mb-1.5 flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                Urgency Priority
              </label>
              <select
                value={formData.priority}
                onChange={(e) => handleChange('priority', e.target.value)}
                className="w-full px-3 py-2.5 app-input text-xs font-semibold cursor-pointer"
              >
                <option value="low">Low (Routine)</option>
                <option value="medium">Medium (Attention)</option>
                <option value="high">High (Urgent)</option>
                <option value="critical">Critical (Emergency)</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-900 dark:text-slate-200 mb-1.5 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                Target Fix ETA
              </label>
              <select
                value={formData.eta || 'Within 48 Hours'}
                onChange={(e) => handleChange('eta', e.target.value)}
                className="w-full px-3 py-2.5 app-input text-xs font-semibold cursor-pointer"
              >
                <option value="Within 24 Hours">Within 24 Hours</option>
                <option value="Within 48 Hours">Within 48 Hours</option>
                <option value="Within 3 Days">Within 3 Days</option>
                <option value="Within 1 Week">Within 1 Week</option>
              </select>
            </div>
          </div>

          {/* Location & Reporter */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-900 dark:text-slate-200 mb-1.5 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                Address / Location *
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => handleChange('location', e.target.value)}
                className={`w-full px-3.5 py-2.5 app-input text-xs ${
                  errors.location ? 'border-rose-500' : ''
                }`}
                placeholder="Specific street address or landmark"
              />
              {errors.location && <p className="text-rose-500 font-semibold mt-1 text-[11px]">{errors.location}</p>}
            </div>

            <div>
              <label className="block font-bold text-slate-900 dark:text-slate-200 mb-1.5 flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                Reporter Name *
              </label>
              <input
                type="text"
                value={formData.reportedBy}
                onChange={(e) => handleChange('reportedBy', e.target.value)}
                className={`w-full px-3.5 py-2.5 app-input text-xs ${
                  errors.reportedBy ? 'border-rose-500' : ''
                }`}
                placeholder="Full Name or Handle"
              />
              {errors.reportedBy && <p className="text-rose-500 font-semibold mt-1 text-[11px]">{errors.reportedBy}</p>}
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block font-bold text-slate-900 dark:text-slate-200 mb-1.5">
              Tags (Optional)
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-300 rounded-full text-xs font-semibold"
                >
                  #{tag}
                  <button type="button" onClick={() => removeTag(tag)} className="hover:text-rose-500">
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
                className="flex-1 px-3.5 py-2 app-input text-xs"
                placeholder="Add tag..."
              />
              <button
                type="button"
                onClick={addTag}
                className="app-btn-secondary px-4 py-2 text-xs flex items-center gap-1"
              >
                <Plus className="w-4 h-4" />
                Add
              </button>
            </div>
          </div>

          {/* Photo Evidence */}
          <PhotoUpload onPhotoSelect={setSelectedPhoto} />

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-slate-100 dark:border-slate-700/60">
            <button
              type="submit"
              className="flex-1 app-btn-primary py-3 px-6 text-xs font-bold"
            >
              Submit Incident Report
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="app-btn-secondary py-3 px-6 text-xs font-bold"
            >
              Cancel
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};