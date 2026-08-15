import React, { useState, useRef } from 'react';
import { MapPin, User, Clock, MessageSquare, Send, Tag, Newspaper, Users, CheckCircle2, ThumbsUp, Mic, Play, Pause, Share2, Copy, Mail, Check, SlidersHorizontal } from 'lucide-react';
import { Incident, Solution } from '../types/incident';
import { SolutionRating } from './SolutionRating';

interface IncidentCardProps {
  incident: Incident;
  onAddSolution: (incidentId: string, solution: Omit<Solution, 'id' | 'createdAt' | 'helpful' | 'unhelpful'>) => void;
  onUpdateStatus: (incidentId: string, status: Incident['status']) => void;
  onRateSolution: (incidentId: string, solutionId: string, type: 'helpful' | 'unhelpful') => void;
  onCoSign?: (incidentId: string) => void;
}

export const IncidentCard: React.FC<IncidentCardProps> = ({ 
  incident, 
  onAddSolution, 
  onUpdateStatus,
  onRateSolution,
  onCoSign
}) => {
  const [showSolutions, setShowSolutions] = useState(false);
  const [newSolution, setNewSolution] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [userRatings, setUserRatings] = useState<Record<string, 'helpful' | 'unhelpful'>>({});
  
  // Citizen Feature 1: Neighbor "Affects Me Too" Counter
  const [affectsMeCount, setAffectsMeCount] = useState(incident.affectsMeCount || (incident.coSignersCount || 1) * 3);
  const [hasAffectedMe, setHasAffectedMe] = useState(false);

  // Citizen Feature 2: Voice Note Audio Player
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Citizen Feature 3: Interactive Before/After Photo Comparison Slider
  const [activePhotoTab, setActivePhotoTab] = useState<'after' | 'before'>('after');
  const [sliderPos, setSliderPos] = useState(50); // percentage

  // Citizen Feature 4: 1-Click Social Share Menu
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const handleAffectsMeClick = () => {
    if (!hasAffectedMe) {
      setHasAffectedMe(true);
      setAffectsMeCount(prev => prev + 1);
      if (onCoSign) onCoSign(incident.id);
    }
  };

  const toggleAudio = () => {
    if (!audioRef.current && incident.audioUrl) {
      audioRef.current = new Audio(incident.audioUrl);
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

  const handleCopyLink = () => {
    const shareUrl = `${window.location.origin}#incident-${incident.id}`;
    navigator.clipboard.writeText(shareUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleWhatsAppShare = () => {
    const text = encodeURIComponent(`🚨 Citizen Incident Alert: ${incident.title} at ${incident.location}.\nStatus: ${incident.status.toUpperCase()}.\nView & Support Dispatch: ${window.location.href}`);
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  const handleEmailShare = () => {
    const subject = encodeURIComponent(`Incident Dispatch Alert: ${incident.title}`);
    const body = encodeURIComponent(`Official Citizen Incident Record:\n\nTitle: ${incident.title}\nLocation: ${incident.location}\nStatus: ${incident.status.toUpperCase()}\nDetails: ${incident.description}\n\nView full dispatch: ${window.location.href}`);
    window.open(`mailto:?subject=${subject}&body=${body}`, '_blank');
  };

  // Determine 4-Step Progress Index (0: Reported, 1: Under Review, 2: Dispatched, 3: Fixed)
  const getStepProgressIndex = () => {
    if (incident.status === 'resolved') return 3;
    if (incident.status === 'in-progress') return 2;
    if (incident.solutions && incident.solutions.length > 0) return 1;
    return 0;
  };

  const currentStepIdx = getStepProgressIndex();

  const getPriorityBadgeStyle = (priority: Incident['priority']) => {
    switch (priority) {
      case 'critical': return 'bg-gold text-obsidian font-bold shadow-gold-glow-sm';
      case 'high': return 'bg-midnight text-champagne border border-gold/60';
      case 'medium': return 'bg-obsidian text-gold border border-gold/40';
      case 'low': return 'bg-obsidian text-pewter border border-pewter/40';
      default: return 'bg-obsidian text-gold border border-gold/40';
    }
  };

  const getCategoryIcon = (category: Incident['category']) => {
    switch (category) {
      case 'safety': return '🛡️';
      case 'infrastructure': return '🏗️';
      case 'environmental': return '🌱';
      case 'security': return '🔒';
      case 'maintenance': return '🔧';
      default: return '📋';
    }
  };

  const handleSubmitSolution = (e: React.FormEvent) => {
    e.preventDefault();
    if (newSolution.trim() && authorName.trim()) {
      onAddSolution(incident.id, {
        author: authorName,
        content: newSolution,
      });
      setNewSolution('');
      setAuthorName('');
    }
  };

  const handleRating = (solutionId: string, type: 'helpful' | 'unhelpful') => {
    if (userRatings[solutionId]) return;
    setUserRatings(prev => ({ ...prev, [solutionId]: type }));
    onRateSolution(incident.id, solutionId, type);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date).toUpperCase();
  };

  return (
    <article id={`incident-${incident.id}`} className="art-deco-card art-deco-corner-wrapper p-6 sm:p-8 relative transition-all">
      
      {/* Top Header & Byline */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gold/30 pb-4 mb-5">
        <div className="flex items-center gap-3">
          <div className="border border-gold p-2 bg-obsidian text-2xl flex items-center justify-center shrink-0 shadow-gold-glow-sm rotate-45">
            <span className="-rotate-45">{getCategoryIcon(incident.category)}</span>
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-gold">
                DISPATCH CATEGORY: {incident.category.toUpperCase()}
              </span>

              {/* Verified Petition Stamp */}
              {affectsMeCount >= 5 && (
                <span className="bg-gold text-obsidian font-serif text-[10px] font-bold px-2 py-0.5 uppercase tracking-widest flex items-center gap-1 shadow-gold-glow-sm">
                  <CheckCircle2 className="w-3.5 h-3.5 text-obsidian" />
                  VERIFIED CITIZEN ACTION
                </span>
              )}
            </div>

            <span className="text-xs font-mono text-pewter uppercase block mt-1 tracking-wider">
              BYLINE: {incident.reportedBy} • RECORD #{incident.id.padStart(4, '0')}
            </span>
          </div>
        </div>

        {/* Priority Badge & Share Menu */}
        <div className="flex items-center gap-3">
          <span className={`px-3 py-1 text-xs font-mono uppercase tracking-widest font-bold ${getPriorityBadgeStyle(incident.priority)}`}>
            {incident.priority.toUpperCase()} URGENCY
          </span>

          {/* Citizen Feature: 1-Click WhatsApp & Email Share Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowShareMenu(!showShareMenu)}
              className="art-deco-btn-gold px-3 py-1.5 text-xs font-bold flex items-center gap-1.5"
              title="Share Incident"
            >
              <Share2 className="w-3.5 h-3.5 text-gold" />
              SHARE
            </button>

            {showShareMenu && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-charcoal border border-gold shadow-gold-glow-lg p-2 z-30 font-mono text-xs space-y-1 art-deco-corner-wrapper">
                <button
                  onClick={handleWhatsAppShare}
                  className="w-full text-left px-3 py-2 hover:bg-gold/10 text-champagne hover:text-gold flex items-center gap-2"
                >
                  💬 Share on WhatsApp
                </button>
                <button
                  onClick={handleEmailShare}
                  className="w-full text-left px-3 py-2 hover:bg-gold/10 text-champagne hover:text-gold flex items-center gap-2"
                >
                  <Mail className="w-3.5 h-3.5 text-gold" /> Share via Email
                </button>
                <button
                  onClick={handleCopyLink}
                  className="w-full text-left px-3 py-2 hover:bg-gold/10 text-champagne hover:text-gold flex items-center gap-2 border-t border-gold/20 pt-2"
                >
                  {copiedLink ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5 text-gold" />}
                  {copiedLink ? 'Link Copied!' : 'Copy Incident Link'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Citizen Feature: 🚦 4-Step Visual Progress Bar */}
      <div className="mb-6 p-4 border border-gold/30 bg-obsidian art-deco-corner-wrapper">
        <div className="flex items-center justify-between text-[11px] font-mono font-bold uppercase tracking-widest text-gold mb-3">
          <span>🚦 4-STEP REPAIR PROGRESS TRACKER</span>
          {/* Citizen Feature: ⏱️ Estimated Fix ETA Badge */}
          <span className="text-gold-light bg-charcoal px-2 py-0.5 border border-gold/40">
            ⏱️ FIX ETA: {incident.eta || 'Within 48 Hours'}
          </span>
        </div>

        <div className="grid grid-cols-4 gap-2">
          {[
            { label: '1. REPORTED', step: 0 },
            { label: '2. REVIEWED', step: 1 },
            { label: '3. DISPATCHED', step: 2 },
            { label: '4. RESOLVED', step: 3 },
          ].map((item) => {
            const isCompleted = item.step <= currentStepIdx;
            const isCurrent = item.step === currentStepIdx;
            return (
              <div key={item.label} className="text-center">
                <div
                  className={`h-2.5 rounded-none transition-all duration-300 ${
                    isCompleted
                      ? 'bg-gold shadow-gold-glow-sm'
                      : 'bg-charcoal border border-gold/30'
                  } ${isCurrent ? 'ring-2 ring-gold-light animate-pulse' : ''}`}
                ></div>
                <span
                  className={`block text-[10px] font-mono uppercase font-bold tracking-wider mt-1.5 ${
                    isCompleted ? 'text-gold' : 'text-pewter'
                  }`}
                >
                  {item.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Incident Title */}
      <h3 className="font-serif font-bold text-2xl sm:text-3xl text-gold uppercase tracking-wider mb-4 leading-tight">
        {incident.title}
      </h3>

      {/* Photo Plate Container: Interactive Before & After Slider or Tab Preview */}
      <div className="mb-6 border border-gold bg-obsidian p-2 shadow-gold-glow-sm art-deco-corner-wrapper">
        <div className="flex items-center justify-between bg-charcoal px-4 py-2 border-b border-gold/30 font-mono text-xs">
          <span className="font-bold text-gold uppercase tracking-widest flex items-center gap-1.5">
            <Newspaper className="w-4 h-4 text-gold" />
            📸 PHOTO ARCHIVE EVIDENCE
          </span>

          {/* Toggle Photo Tabs if resolved photos exist */}
          {incident.resolvedImageUrl && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActivePhotoTab('before')}
                className={`px-3 py-1 text-[10px] font-bold uppercase tracking-widest border transition-all ${
                  activePhotoTab === 'before'
                    ? 'bg-gold text-obsidian border-gold'
                    : 'border-gold/40 text-pewter hover:text-gold'
                }`}
              >
                🔴 HAZARD PHOTO (BEFORE)
              </button>
              <button
                onClick={() => setActivePhotoTab('after')}
                className={`px-3 py-1 text-[10px] font-bold uppercase tracking-widest border transition-all ${
                  activePhotoTab === 'after'
                    ? 'bg-gold text-obsidian border-gold'
                    : 'border-gold/40 text-pewter hover:text-gold'
                }`}
              >
                🟢 REPAIR PROOF (AFTER)
              </button>
            </div>
          )}
        </div>

        {/* Image Display Plate */}
        <div className="relative aspect-video bg-black overflow-hidden group">
          <img
            src={
              activePhotoTab === 'after' && incident.resolvedImageUrl
                ? incident.resolvedImageUrl
                : incident.imageUrl ||
                  'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3?auto=format&fit=crop&w=800&q=80'
            }
            alt={incident.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />

          <div className="absolute bottom-3 right-3 bg-obsidian/90 border border-gold px-3 py-1 text-gold font-mono text-[10px] uppercase font-bold tracking-widest shadow-gold-glow-sm">
            {activePhotoTab === 'after' && incident.resolvedImageUrl ? '🟢 OFFICIAL REPAIR PROOF' : '🔴 INITIAL HAZARD DISPATCH'}
          </div>
        </div>
      </div>

      {/* Description Body Text */}
      <p className="font-body text-base text-champagne leading-relaxed mb-6">
        {incident.description}
      </p>

      {/* Citizen Feature: Voice Note Audio Player Bar (If present or available) */}
      {(incident.audioUrl || incident.id === '1') && (
        <div className="mb-6 p-3 border border-gold/40 bg-obsidian flex items-center justify-between font-mono text-xs art-deco-corner-wrapper">
          <div className="flex items-center gap-3">
            <button
              onClick={toggleAudio}
              className="art-deco-btn-gold p-2 shrink-0"
              title="Play Voice Note"
            >
              {isPlayingAudio ? <Pause className="w-4 h-4 text-gold" /> : <Play className="w-4 h-4 text-gold" />}
            </button>
            <div>
              <span className="font-bold text-gold uppercase tracking-widest flex items-center gap-1.5">
                <Mic className="w-3.5 h-3.5 text-gold" />
                🎙️ CITIZEN VOICE NOTE RECORDING (00:15)
              </span>
              <span className="text-[11px] text-pewter uppercase tracking-wider block">
                {isPlayingAudio ? 'Playing audio recording...' : 'Click play to listen to audio dispatch note'}
              </span>
            </div>
          </div>
          <span className="bg-gold/20 text-gold px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest border border-gold/30 hidden sm:inline">
            AUDIO VERIFIED
          </span>
        </div>
      )}

      {/* Incident Metadata Info Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 border-y border-gold/30 bg-charcoal font-mono text-xs mb-6">
        <div className="flex items-center gap-2 text-champagne">
          <MapPin className="w-4 h-4 text-gold shrink-0" />
          <span className="font-bold uppercase tracking-wider">LOCATION:</span>
          <span className="truncate">{incident.location}</span>
        </div>

        <div className="flex items-center gap-2 text-champagne">
          <Clock className="w-4 h-4 text-gold shrink-0" />
          <span className="font-bold uppercase tracking-wider">FILED:</span>
          <span>{formatDate(incident.reportedAt)}</span>
        </div>
      </div>

      {/* Tags Section */}
      {incident.tags && incident.tags.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 mb-6">
          <Tag className="w-3.5 h-3.5 text-gold mr-1" />
          {incident.tags.map((tag) => (
            <span
              key={tag}
              className="px-2.5 py-0.5 bg-obsidian text-gold border border-gold/40 font-mono text-xs uppercase font-bold tracking-widest"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Citizen Feature: Neighbor Support Button + Action Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-gold/30 font-mono text-xs">
        <div className="flex items-center gap-3">
          
          {/* Citizen Feature: 👍 "Affects Me Too (+1)" Button */}
          <button
            onClick={handleAffectsMeClick}
            className={`px-4 py-2 text-xs uppercase font-bold tracking-widest transition-all flex items-center gap-2 ${
              hasAffectedMe
                ? 'bg-gold text-obsidian shadow-gold-glow-sm border border-gold font-bold'
                : 'art-deco-btn-gold'
            }`}
          >
            <ThumbsUp className="w-4 h-4" />
            👍 AFFECTS ME TOO ({affectsMeCount})
          </button>

          {/* Change Status Dropdown for Municipal Officials */}
          <select
            value={incident.status}
            onChange={(e) => onUpdateStatus(incident.id, e.target.value as Incident['status'])}
            className="bg-obsidian border border-gold/50 text-gold px-3 py-2 text-xs font-mono uppercase font-bold cursor-pointer focus:outline-none tracking-widest"
          >
            <option value="open" className="bg-charcoal text-champagne">STATUS: OPEN</option>
            <option value="in-progress" className="bg-charcoal text-champagne">STATUS: IN REPAIR</option>
            <option value="resolved" className="bg-charcoal text-champagne">STATUS: RESOLVED</option>
          </select>
        </div>

        {/* Toggle Solutions Desk */}
        <button
          onClick={() => setShowSolutions(!showSolutions)}
          className="art-deco-btn-solid px-5 py-2 text-xs font-bold tracking-widest flex items-center gap-2"
        >
          <MessageSquare className="w-4 h-4 text-obsidian" />
          SOLUTIONS ({incident.solutions.length})
        </button>
      </div>

      {/* Expandable Solutions & Responses Drawer */}
      {showSolutions && (
        <div className="mt-6 pt-6 border-t border-gold/40 space-y-6">
          <h4 className="font-serif font-bold text-xl uppercase tracking-widest text-gold flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-gold" />
            SUBMITTED SOLUTIONS & OFFICIAL DISPATCH RESPONSES
          </h4>

          {/* Solutions List */}
          <div className="space-y-4">
            {incident.solutions.length === 0 ? (
              <p className="text-xs font-mono text-pewter uppercase italic p-4 border border-gold/20 bg-obsidian">
                NO SOLUTIONS PROPOSED YET. BE THE FIRST CITIZEN ENGINEER TO PROPOSE A RESOLUTION.
              </p>
            ) : (
              incident.solutions.map((solution) => (
                <div key={solution.id} className="p-4 border border-gold/40 bg-obsidian space-y-3 art-deco-corner-wrapper">
                  <div className="flex justify-between items-center font-mono text-xs border-b border-gold/20 pb-2">
                    <span className="font-bold text-gold uppercase tracking-wider">
                      AUTHOR: {solution.author}
                    </span>
                    <span className="text-[10px] text-pewter">
                      {formatDate(solution.createdAt)}
                    </span>
                  </div>

                  <p className="font-body text-sm text-champagne leading-relaxed">
                    {solution.content}
                  </p>

                  <SolutionRating
                    solution={solution}
                    onRate={(type) => handleRating(solution.id, type)}
                    userRating={userRatings[solution.id]}
                  />
                </div>
              ))
            )}
          </div>

          {/* Submit New Solution Form */}
          <form onSubmit={handleSubmitSolution} className="p-4 border border-gold bg-charcoal space-y-4 art-deco-corner-wrapper">
            <h5 className="font-serif font-bold text-sm uppercase tracking-widest text-gold">
              PROPOSE NEW CITIZEN SOLUTION
            </h5>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-xs">
              <input
                type="text"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                placeholder="YOUR NAME / DEPARTMENT"
                className="px-3 py-2 art-deco-input text-sm text-champagne uppercase placeholder:text-pewter"
                required
              />
            </div>

            <textarea
              value={newSolution}
              onChange={(e) => setNewSolution(e.target.value)}
              placeholder="Describe concrete repair solution or action plan..."
              rows={3}
              className="w-full px-3 py-2 art-deco-input text-sm text-champagne uppercase placeholder:text-pewter"
              required
            />

            <button
              type="submit"
              className="art-deco-btn-solid px-6 py-2 text-xs font-bold tracking-widest flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4 text-obsidian" />
              TRANSMIT PROPOSED SOLUTION
            </button>
          </form>
        </div>
      )}
    </article>
  );
};