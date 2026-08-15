import React, { useState, useRef } from 'react';
import { MapPin, User, Clock, MessageSquare, Send, Tag, Newspaper, Users, CheckCircle2, ThumbsUp, Mic, Play, Pause, Share2, Copy, Mail, Check } from 'lucide-react';
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
  
  // Neighbor Support Counter
  const [affectsMeCount, setAffectsMeCount] = useState(incident.affectsMeCount || (incident.coSignersCount || 1) * 3);
  const [hasAffectedMe, setHasAffectedMe] = useState(false);

  // Audio Player
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Photo Tabs
  const [activePhotoTab, setActivePhotoTab] = useState<'after' | 'before'>('after');

  // Social Share Menu
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
    const text = encodeURIComponent(`🚨 Incident Alert: ${incident.title} at ${incident.location}.\nStatus: ${incident.status.toUpperCase()}.\nView & Support: ${window.location.href}`);
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  const handleEmailShare = () => {
    const subject = encodeURIComponent(`Incident Alert: ${incident.title}`);
    const body = encodeURIComponent(`Incident Record:\n\nTitle: ${incident.title}\nLocation: ${incident.location}\nStatus: ${incident.status.toUpperCase()}\nDetails: ${incident.description}\n\nView details: ${window.location.href}`);
    window.open(`mailto:?subject=${subject}&body=${body}`, '_blank');
  };

  const getStepProgressIndex = () => {
    if (incident.status === 'resolved') return 3;
    if (incident.status === 'in-progress') return 2;
    if (incident.solutions && incident.solutions.length > 0) return 1;
    return 0;
  };

  const currentStepIdx = getStepProgressIndex();

  const getPriorityBadgeStyle = (priority: Incident['priority']) => {
    switch (priority) {
      case 'critical': return 'bg-rose-100 dark:bg-rose-900/50 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-700';
      case 'high': return 'bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-700';
      case 'medium': return 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-700';
      case 'low': return 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-600';
      default: return 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300';
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
    }).format(date);
  };

  return (
    <article id={`incident-${incident.id}`} className="app-card p-6 sm:p-8 relative transition-all">
      
      {/* Top Header & Priority */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-700/60 pb-4 mb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-xl shrink-0">
            {getCategoryIcon(incident.category)}
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                {incident.category}
              </span>

              {affectsMeCount >= 5 && (
                <span className="bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 text-[11px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Verified Petition
                </span>
              )}
            </div>

            <span className="text-xs text-slate-500 dark:text-slate-400 block mt-0.5">
              Reported by {incident.reportedBy} • #{incident.id.padStart(4, '0')}
            </span>
          </div>
        </div>

        {/* Priority Badge & Share Button */}
        <div className="flex items-center gap-2">
          <span className={`px-3 py-1 text-xs font-semibold rounded-full uppercase tracking-wider ${getPriorityBadgeStyle(incident.priority)}`}>
            {incident.priority} Priority
          </span>

          {/* Social Share Menu */}
          <div className="relative">
            <button
              onClick={() => setShowShareMenu(!showShareMenu)}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-all"
              title="Share Incident"
            >
              <Share2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            </button>

            {showShareMenu && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl p-2 z-30 font-sans text-xs space-y-1">
                <button
                  onClick={handleWhatsAppShare}
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-medium flex items-center gap-2"
                >
                  💬 Share on WhatsApp
                </button>
                <button
                  onClick={handleEmailShare}
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-medium flex items-center gap-2"
                >
                  <Mail className="w-4 h-4 text-indigo-500" /> Share via Email
                </button>
                <button
                  onClick={handleCopyLink}
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-medium flex items-center gap-2 border-t border-slate-100 dark:border-slate-700/50 pt-2"
                >
                  {copiedLink ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4 text-indigo-500" />}
                  {copiedLink ? 'Link Copied!' : 'Copy Incident Link'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 🚦 4-Step Repair Status Timeline */}
      <div className="mb-6 p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-700/60">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 mb-3">
          <span className="flex items-center gap-1.5">🚦 Repair Progress Tracker</span>
          <span className="text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/40 px-2.5 py-0.5 rounded-full text-[11px] font-bold">
            Target ETA: {incident.eta || 'Within 48 Hours'}
          </span>
        </div>

        <div className="grid grid-cols-4 gap-2">
          {[
            { label: '1. Reported', step: 0 },
            { label: '2. Reviewed', step: 1 },
            { label: '3. Dispatched', step: 2 },
            { label: '4. Resolved', step: 3 },
          ].map((item) => {
            const isCompleted = item.step <= currentStepIdx;
            const isCurrent = item.step === currentStepIdx;
            return (
              <div key={item.label} className="text-center">
                <div
                  className={`h-2 rounded-full transition-all duration-300 ${
                    isCompleted
                      ? 'bg-indigo-600 dark:bg-indigo-500 shadow-sm'
                      : 'bg-slate-200 dark:bg-slate-700'
                  } ${isCurrent ? 'ring-2 ring-indigo-400 animate-pulse' : ''}`}
                ></div>
                <span
                  className={`block text-[11px] font-semibold mt-1.5 ${
                    isCompleted ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400 dark:text-slate-500'
                  }`}
                >
                  {item.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Title */}
      <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight mb-3">
        {incident.title}
      </h3>

      {/* Photo Plate */}
      <div className="mb-6 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-900">
        {incident.resolvedImageUrl && (
          <div className="flex items-center justify-between bg-slate-100 dark:bg-slate-800 px-4 py-2 text-xs font-semibold border-b border-slate-200 dark:border-slate-700">
            <span className="text-slate-600 dark:text-slate-300">Photo Proof Comparison</span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActivePhotoTab('before')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  activePhotoTab === 'before'
                    ? 'bg-indigo-600 text-white'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                🔴 Hazard Photo
              </button>
              <button
                onClick={() => setActivePhotoTab('after')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  activePhotoTab === 'after'
                    ? 'bg-emerald-600 text-white'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                🟢 Repair Proof
              </button>
            </div>
          </div>
        )}

        <div className="relative aspect-video bg-slate-950 overflow-hidden group">
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

          <div className="absolute bottom-3 right-3 bg-slate-900/90 text-white backdrop-blur-md px-3 py-1 rounded-lg text-[11px] font-semibold">
            {activePhotoTab === 'after' && incident.resolvedImageUrl ? '🟢 Official Repair Proof' : '🔴 Initial Hazard Report'}
          </div>
        </div>
      </div>

      {/* Description */}
      <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed mb-6">
        {incident.description}
      </p>

      {/* Voice Note Bar */}
      {(incident.audioUrl || incident.id === '1') && (
        <div className="mb-6 p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/50 flex items-center justify-between text-xs">
          <div className="flex items-center gap-3">
            <button
              onClick={toggleAudio}
              className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center shrink-0 hover:bg-indigo-700 transition-all"
              title="Play Voice Note"
            >
              {isPlayingAudio ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
            </button>
            <div>
              <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <Mic className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                🎙️ Citizen Voice Note (00:15)
              </span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">
                {isPlayingAudio ? 'Playing audio recording...' : 'Click play to listen to audio dispatch'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Incident Metadata */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/50 text-xs text-slate-600 dark:text-slate-400 mb-6">
        <div className="flex items-center gap-2 truncate">
          <MapPin className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
          <span className="font-semibold text-slate-900 dark:text-slate-200">Location:</span>
          <span className="truncate">{incident.location}</span>
        </div>

        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
          <span className="font-semibold text-slate-900 dark:text-slate-200">Filed:</span>
          <span>{formatDate(incident.reportedAt)}</span>
        </div>
      </div>

      {/* Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-100 dark:border-slate-700/60 text-xs">
        <div className="flex items-center gap-3">
          <button
            onClick={handleAffectsMeClick}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 ${
              hasAffectedMe
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'app-btn-secondary'
            }`}
          >
            <ThumbsUp className="w-4 h-4" />
            👍 Affects Me Too ({affectsMeCount})
          </button>

          <select
            value={incident.status}
            onChange={(e) => onUpdateStatus(incident.id, e.target.value as Incident['status'])}
            className="app-input px-3 py-2 text-xs font-semibold cursor-pointer"
          >
            <option value="open">Status: Open</option>
            <option value="in-progress">Status: In Repair</option>
            <option value="resolved">Status: Resolved</option>
          </select>
        </div>

        <button
          onClick={() => setShowSolutions(!showSolutions)}
          className="app-btn-primary px-4 py-2 text-xs flex items-center gap-2"
        >
          <MessageSquare className="w-4 h-4" />
          Solutions ({incident.solutions.length})
        </button>
      </div>

      {/* Solutions Drawer */}
      {showSolutions && (
        <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700 space-y-6">
          <h4 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            Proposed Solutions & Official Updates
          </h4>

          <div className="space-y-4">
            {incident.solutions.length === 0 ? (
              <p className="text-xs text-slate-500 dark:text-slate-400 italic p-4 rounded-xl bg-slate-50 dark:bg-slate-900">
                No solutions proposed yet. Be the first to suggest a fix!
              </p>
            ) : (
              incident.solutions.map((solution) => (
                <div key={solution.id} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 space-y-2 border border-slate-200/60 dark:border-slate-800">
                  <div className="flex justify-between items-center text-xs text-slate-500 dark:text-slate-400 border-b border-slate-200/60 dark:border-slate-800 pb-2">
                    <span className="font-bold text-slate-900 dark:text-white">{solution.author}</span>
                    <span className="text-[11px]">{formatDate(solution.createdAt)}</span>
                  </div>

                  <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
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

          <form onSubmit={handleSubmitSolution} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
            <h5 className="font-bold text-xs text-slate-900 dark:text-white uppercase tracking-wider">
              Propose a Solution
            </h5>

            <input
              type="text"
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              placeholder="Your Name or Department"
              className="w-full px-3.5 py-2 app-input text-xs"
              required
            />

            <textarea
              value={newSolution}
              onChange={(e) => setNewSolution(e.target.value)}
              placeholder="Describe repair plan or action steps..."
              rows={3}
              className="w-full px-3.5 py-2 app-input text-xs"
              required
            />

            <button
              type="submit"
              className="app-btn-primary px-5 py-2 text-xs flex items-center gap-2"
            >
              <Send className="w-3.5 h-3.5" />
              Submit Solution
            </button>
          </form>
        </div>
      )}
    </article>
  );
};