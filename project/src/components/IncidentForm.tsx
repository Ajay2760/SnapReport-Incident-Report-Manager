import React, { useState, useRef } from 'react';
import { AlertCircle, MapPin, User, FileText, Tag, AlertTriangle, Plus, X, ShieldAlert, Mic, Square, Play, Pause, Clock } from 'lucide-react';
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
      alert('Microphone access unavailable. Simulated voice note recorded.');
      // Fallback demo audio url
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
    <div className="fixed inset-0 bg-obsidian/90 backdrop-blur-md flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-charcoal border border-gold shadow-gold-glow-lg max-w-2xl w-full my-8 max-h-[90vh] overflow-y-auto art-deco-corner-wrapper">
        {/* Form Header Banner */}
        <div className="bg-obsidian text-champagne p-5 border-b border-gold/40 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="border border-gold p-2 bg-obsidian text-gold shadow-gold-glow-sm rotate-45">
              <ShieldAlert className="w-5 h-5 -rotate-45" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-serif font-bold uppercase tracking-widest text-gold leading-none">
                OFFICIAL INCIDENT TELEGRAM DISPATCH
              </h2>
              <span className="font-mono text-[10px] text-pewter uppercase tracking-widest block mt-1">
                FORM REF #SRG-2026 • OFFICIAL MUNICIPAL FILING
              </span>
            </div>
          </div>

          <button
            onClick={onCancel}
            className="border border-gold/50 text-gold px-3 py-1 font-mono text-xs hover:border-gold hover:bg-gold hover:text-obsidian transition-all font-bold uppercase tracking-widest"
          >
            ✕ CLOSE
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6 font-mono text-xs">
          
          {/* Headline Title Field */}
          <div>
            <label className="block font-bold uppercase text-gold tracking-widest mb-2 flex items-center gap-2">
              <FileText className="w-4 h-4 text-gold" />
              DISPATCH HEADLINE TITLE *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              className={`w-full px-3 py-2.5 art-deco-input text-sm text-champagne placeholder:text-pewter uppercase ${
                errors.title ? 'border-red-500' : ''
              }`}
              placeholder="e.g. Hazardous Pothole near Main Street Intersection"
            />
            {errors.title && <p className="text-red-400 font-bold mt-1 uppercase text-[10px] tracking-wider">{errors.title}</p>}
          </div>

          {/* Description Textarea */}
          <div>
            <label className="block font-bold uppercase text-gold tracking-widest mb-2">
              DETAILED DISPATCH DESCRIPTION & INCIDENT SUMMARY *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              rows={3}
              className={`w-full px-3 py-2.5 art-deco-input text-sm text-champagne placeholder:text-pewter uppercase ${
                errors.description ? 'border-red-500' : ''
              }`}
              placeholder="Provide complete details, safety hazards, and impact on local community..."
            />
            {errors.description && <p className="text-red-400 font-bold mt-1 uppercase text-[10px] tracking-wider">{errors.description}</p>}
          </div>

          {/* Citizen Feature: Voice Note Recorder */}
          <div className="p-4 border border-gold/40 bg-obsidian art-deco-corner-wrapper">
            <label className="block font-bold uppercase text-gold tracking-widest mb-2 flex items-center gap-2">
              <Mic className="w-4 h-4 text-gold" />
              🎙️ CITIZEN VOICE NOTE DESCRIPTION (OPTIONAL)
            </label>
            <p className="text-[11px] text-pewter mb-3">
              Record up to a 15-second audio note so citizens can listen to your dispatch description.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              {!isRecording ? (
                <button
                  type="button"
                  onClick={startRecording}
                  className="art-deco-btn-gold px-4 py-2 text-xs flex items-center gap-2"
                >
                  <Mic className="w-4 h-4 text-gold" />
                  START RECORDING VOICE NOTE
                </button>
              ) : (
                <button
                  type="button"
                  onClick={stopRecording}
                  className="bg-red-600 text-white border border-red-400 px-4 py-2 text-xs font-bold uppercase tracking-widest flex items-center gap-2 animate-pulse"
                >
                  <Square className="w-4 h-4" />
                  STOP RECORDING ({15 - recordingSeconds}s LEFT)
                </button>
              )}

              {audioBlobUrl && !isRecording && (
                <div className="flex items-center gap-3 border border-gold/40 px-3 py-1.5 bg-charcoal">
                  <button
                    type="button"
                    onClick={togglePlayAudio}
                    className="text-gold hover:text-gold-light"
                  >
                    {isPlayingAudio ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </button>
                  <span className="text-[11px] text-gold font-bold uppercase">
                    {isPlayingAudio ? 'PLAYING VOICE NOTE...' : 'VOICE NOTE READY'}
                  </span>
                  <button
                    type="button"
                    onClick={() => { setAudioBlobUrl(null); setFormData(prev => ({ ...prev, audioUrl: undefined })); }}
                    className="text-pewter hover:text-red-400 text-xs ml-2"
                  >
                    ✕ DELETE
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Category & Priority & ETA Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block font-bold uppercase text-gold tracking-widest mb-2 flex items-center gap-1.5">
                <Tag className="w-4 h-4 text-gold" />
                CLASSIFICATION
              </label>
              <select
                value={formData.category}
                onChange={(e) => handleChange('category', e.target.value)}
                className="w-full px-3 py-2.5 bg-obsidian border-b-2 border-gold text-champagne font-mono text-sm focus:outline-none cursor-pointer uppercase font-bold tracking-widest"
              >
                <option value="safety" className="bg-charcoal text-champagne">SAFETY HAZARD</option>
                <option value="infrastructure" className="bg-charcoal text-champagne">INFRASTRUCTURE DAMAGE</option>
                <option value="environmental" className="bg-charcoal text-champagne">ENVIRONMENTAL ISSUE</option>
                <option value="security" className="bg-charcoal text-champagne">PUBLIC SECURITY</option>
                <option value="maintenance" className="bg-charcoal text-champagne">MUNICIPAL MAINTENANCE</option>
                <option value="other" className="bg-charcoal text-champagne">OTHER DISPATCH</option>
              </select>
            </div>

            <div>
              <label className="block font-bold uppercase text-gold tracking-widest mb-2 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-gold" />
                URGENCY
              </label>
              <select
                value={formData.priority}
                onChange={(e) => handleChange('priority', e.target.value)}
                className="w-full px-3 py-2.5 bg-obsidian border-b-2 border-gold text-champagne font-mono text-sm focus:outline-none cursor-pointer uppercase font-bold tracking-widest"
              >
                <option value="low" className="bg-charcoal text-champagne">LOW (ROUTINE)</option>
                <option value="medium" className="bg-charcoal text-champagne">MEDIUM (ATTENTION)</option>
                <option value="high" className="bg-charcoal text-champagne">HIGH (URGENT)</option>
                <option value="critical" className="bg-charcoal text-champagne">CRITICAL (EMERGENCY)</option>
              </select>
            </div>

            {/* Citizen Feature: Expected Fix ETA Dropdown */}
            <div>
              <label className="block font-bold uppercase text-gold tracking-widest mb-2 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-gold" />
                ⏱️ TARGET FIX ETA
              </label>
              <select
                value={formData.eta || 'Within 48 Hours'}
                onChange={(e) => handleChange('eta', e.target.value)}
                className="w-full px-3 py-2.5 bg-obsidian border-b-2 border-gold text-champagne font-mono text-sm focus:outline-none cursor-pointer uppercase font-bold tracking-widest"
              >
                <option value="Within 24 Hours" className="bg-charcoal text-champagne">WITHIN 24 HOURS</option>
                <option value="Within 48 Hours" className="bg-charcoal text-champagne">WITHIN 48 HOURS</option>
                <option value="Within 3 Days" className="bg-charcoal text-champagne">WITHIN 3 DAYS</option>
                <option value="Within 1 Week" className="bg-charcoal text-champagne">WITHIN 1 WEEK</option>
              </select>
            </div>
          </div>

          {/* Location & Reporter Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block font-bold uppercase text-gold tracking-widest mb-2 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-gold" />
                LOCATION & ADDRESS *
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => handleChange('location', e.target.value)}
                className={`w-full px-3 py-2.5 art-deco-input text-sm text-champagne placeholder:text-pewter uppercase ${
                  errors.location ? 'border-red-500' : ''
                }`}
                placeholder="Specific street address or landmark"
              />
              {errors.location && <p className="text-red-400 font-bold mt-1 uppercase text-[10px] tracking-wider">{errors.location}</p>}
            </div>

            <div>
              <label className="block font-bold uppercase text-gold tracking-widest mb-2 flex items-center gap-2">
                <User className="w-4 h-4 text-gold" />
                CITIZEN REPORTER BYLINE *
              </label>
              <input
                type="text"
                value={formData.reportedBy}
                onChange={(e) => handleChange('reportedBy', e.target.value)}
                className={`w-full px-3 py-2.5 art-deco-input text-sm text-champagne placeholder:text-pewter uppercase ${
                  errors.reportedBy ? 'border-red-500' : ''
                }`}
                placeholder="Full Name or Reporter Handle"
              />
              {errors.reportedBy && <p className="text-red-400 font-bold mt-1 uppercase text-[10px] tracking-wider">{errors.reportedBy}</p>}
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block font-bold uppercase text-gold tracking-widest mb-2">
              INDEX TAGS (OPTIONAL)
            </label>
            <div className="flex flex-wrap gap-2 mb-3">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-2 px-3 py-1 bg-obsidian text-gold border border-gold font-mono text-xs uppercase font-bold tracking-widest"
                >
                  #{tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="hover:text-gold-light"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-3">
              <input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                className="flex-1 px-3 py-2 art-deco-input font-mono text-sm text-champagne placeholder:text-pewter uppercase"
                placeholder="Add tag..."
              />
              <button
                type="button"
                onClick={addTag}
                className="art-deco-btn-gold px-5 py-2 text-xs flex items-center gap-1"
              >
                <Plus className="w-4 h-4" />
                ADD
              </button>
            </div>
          </div>

          {/* Photo Evidence Component */}
          <PhotoUpload onPhotoSelect={setSelectedPhoto} />

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gold/40">
            <button
              type="submit"
              className="flex-1 art-deco-btn-solid py-3 px-6 text-sm font-bold tracking-widest"
            >
              SUBMIT & TRANSMIT TELEGRAM
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="art-deco-btn-gold py-3 px-6 text-sm font-bold tracking-widest"
            >
              CANCEL FILING
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};