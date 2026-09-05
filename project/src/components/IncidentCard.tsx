import React, { useState, useRef } from 'react';
import {
  MapPin,
  Clock,
  MessageSquare,
  Send,
  CheckCircle2,
  ThumbsUp,
  Mic,
  Play,
  Pause,
  Share2,
  Copy,
  Mail,
  Check,
  ShieldAlert,
  Building2,
  Leaf,
  Lock,
  Wrench,
  FileText,
} from 'lucide-react';
import { Incident, Solution } from '../types/incident';
import { SolutionRating } from './SolutionRating';

interface IncidentCardProps {
  incident: Incident;
  onAddSolution: (incidentId: string, solution: Omit<Solution, 'id' | 'createdAt' | 'helpful' | 'unhelpful'>) => void;
  onUpdateStatus: (incidentId: string, status: Incident['status']) => void;
  onRateSolution: (incidentId: string, solutionId: string, type: 'helpful' | 'unhelpful') => void;
  onCoSign?: (incidentId: string) => void;
}

const getCategoryIcon = (category: Incident['category']) => {
  switch (category) {
    case 'safety': return ShieldAlert;
    case 'infrastructure': return Building2;
    case 'environmental': return Leaf;
    case 'security': return Lock;
    case 'maintenance': return Wrench;
    default: return FileText;
  }
};

const getPriorityStyle = (priority: Incident['priority']) => {
  switch (priority) {
    case 'critical': return 'bg-midnight-wine text-white';
    case 'high': return 'bg-royal-violet text-white';
    case 'medium': return 'bg-lilac-mist text-ink-charcoal';
    case 'low': return 'bg-warm-parchment text-stone-gray border border-soft-mist';
    default: return 'bg-warm-parchment text-stone-gray border border-soft-mist';
  }
};

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
  
  const [affectsMeCount, setAffectsMeCount] = useState(incident.affectsMeCount || (incident.coSignersCount || 1) * 3);
  const [hasAffectedMe, setHasAffectedMe] = useState(false);

  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [activePhotoTab, setActivePhotoTab] = useState<'after' | 'before'>('after');

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
    const text = encodeURIComponent(`SNapReport: Incident alert "${incident.title}" at ${incident.location} — Status: ${incident.status.toUpperCase()}. Track it: ${window.location.href}`);
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  const handleEmailShare = () => {
    const subject = encodeURIComponent(`Incident Alert: ${incident.title}`);
    const body = encodeURIComponent(`Title: ${incident.title}\nLocation: ${incident.location}\nStatus: ${incident.status.toUpperCase()}\nDetails: ${incident.description}`);
    window.open(`mailto:?subject=${subject}&body=${body}`, '_blank');
  };

  const getStepProgressIndex = () => {
    if (incident.status === 'resolved') return 3;
    if (incident.status === 'in-progress') return 2;
    if (incident.solutions && incident.solutions.length > 0) return 1;
    return 0;
  };

  const currentStepIdx = getStepProgressIndex();

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

  const CategoryIcon = getCategoryIcon(incident.category);
  const priorityStyle = getPriorityStyle(incident.priority);

  return (
    <article id={`incident-${incident.id}`} className="app-card p-6 sm:p-8 relative animate-in">
      
      {/* ─── Header ─── */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-soft-mist dark:border-white/[0.12] pb-4 mb-5">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-cards bg-lilac-mist/60 flex items-center justify-center shrink-0">
            <CategoryIcon className="w-5 h-5 text-royal-violet" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-caption text-royal-violet uppercase tracking-wider font-semibold">
                {incident.category}
              </span>

              {affectsMeCount >= 5 && (
                <span className="app-badge bg-lilac-mist/50 text-royal-violet text-[11px]">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Verified
                </span>
              )}
            </div>

            <span className="text-[13px] text-stone-gray block mt-0.5">
              {incident.reportedBy} · #{incident.id.padStart(4, '0')}
            </span>
          </div>
        </div>

        {/* Priority + Share */}
        <div className="flex items-center gap-2">
          <span className={`app-badge ${priorityStyle} text-[11px]`}>
            {incident.priority}
          </span>

          <div className="relative">
            <button
              onClick={() => setShowShareMenu(!showShareMenu)}
              className="app-btn-ghost p-2"
              title="Share"
            >
              <Share2 className="w-4 h-4" />
            </button>

            {showShareMenu && (
              <div className="absolute right-0 top-full mt-2 w-52 app-card p-2 z-30 space-y-0.5 border-soft-mist">
                <button
                  onClick={handleWhatsAppShare}
                  className="w-full text-left px-3 py-2.5 rounded-small hover:bg-warm-parchment dark:hover:bg-white/[0.06] text-[13px] text-ink-charcoal dark:text-ink-light font-medium flex items-center gap-2 transition-all"
                >
                  <span className="w-5 h-5 rounded-full bg-midnight-wine text-white text-[9px] font-bold flex items-center justify-center">W</span>
                  WhatsApp
                </button>
                <button
                  onClick={handleEmailShare}
                  className="w-full text-left px-3 py-2.5 rounded-small hover:bg-warm-parchment dark:hover:bg-white/[0.06] text-[13px] text-ink-charcoal dark:text-ink-light font-medium flex items-center gap-2 transition-all"
                >
                  <Mail className="w-4 h-4 text-royal-violet" /> Email
                </button>
                <div className="border-t border-soft-mist dark:border-white/[0.12] my-1"></div>
                <button
                  onClick={handleCopyLink}
                  className="w-full text-left px-3 py-2.5 rounded-small hover:bg-warm-parchment dark:hover:bg-white/[0.06] text-[13px] text-ink-charcoal dark:text-ink-light font-medium flex items-center gap-2 transition-all"
                >
                  {copiedLink ? <Check className="w-4 h-4 text-deep-lagoon" /> : <Copy className="w-4 h-4 text-royal-violet" />}
                  {copiedLink ? 'Copied!' : 'Copy Link'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ─── Progress Tracker ─── */}
      <div className="mb-6 p-4 rounded-cards bg-warm-parchment dark:bg-white/[0.03] border border-soft-mist dark:border-white/[0.08]">
        <div className="flex items-center justify-between text-[13px] text-ink-charcoal dark:text-ink-light mb-3">
          <span className="font-semibold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-royal-violet inline-block" />
            Repair Progress
          </span>
          <span className="app-badge bg-lilac-mist/50 text-royal-violet text-[11px]">
            ETA: {incident.eta || 'Within 48 Hours'}
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
                  className={`h-1.5 rounded-pill transition-all duration-300 ${
                    isCompleted
                      ? 'bg-royal-violet'
                      : 'bg-soft-mist dark:bg-white/[0.08]'
                  } ${isCurrent ? 'ring-2 ring-lilac-mist' : ''}`}
                ></div>
                <span
                  className={`block text-[11px] font-semibold mt-1.5 ${
                    isCompleted ? 'text-royal-violet' : 'text-stone-gray'
                  }`}
                >
                  {item.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* ─── Title ─── */}
      <h3 className="text-heading-sm mb-3">
        {incident.title}
      </h3>

      {/* ─── Photo ─── */}
      <div className="mb-6 rounded-cards overflow-hidden border border-soft-mist dark:border-white/[0.10] bg-card-dark">
        {incident.resolvedImageUrl && (
          <div className="flex items-center justify-between bg-warm-parchment dark:bg-white/[0.05] px-4 py-2 text-[13px] font-semibold border-b border-soft-mist dark:border-white/[0.10]">
            <span className="text-ink-charcoal dark:text-ink-light">Photo Comparison</span>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setActivePhotoTab('before')}
                className={`px-3 py-1 rounded-pill text-[13px] font-medium transition-all ${
                  activePhotoTab === 'before'
                    ? 'bg-lilac-mist text-ink-charcoal'
                    : 'text-stone-gray hover:text-ink-charcoal dark:hover:text-ink-light'
                }`}
              >
                Before
              </button>
              <button
                onClick={() => setActivePhotoTab('after')}
                className={`px-3 py-1 rounded-pill text-[13px] font-medium transition-all ${
                  activePhotoTab === 'after'
                    ? 'bg-lilac-mist text-ink-charcoal'
                    : 'text-stone-gray hover:text-ink-charcoal dark:hover:text-ink-light'
                }`}
              >
                After
              </button>
            </div>
          </div>
        )}

        <div className="relative aspect-video overflow-hidden group">
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

          <div className={`absolute bottom-3 right-3 px-3 py-1.5 rounded-pill text-[11px] font-semibold ${
            activePhotoTab === 'after' && incident.resolvedImageUrl
              ? 'bg-deep-lagoon text-white'
              : 'bg-midnight-wine text-white'
          }`}>
            {activePhotoTab === 'after' && incident.resolvedImageUrl ? 'Repair Proof' : 'Hazard Report'}
          </div>
        </div>
      </div>

      {/* ─── Description ─── */}
      <p className="text-body-sm text-stone-gray mb-6">
        {incident.description}
      </p>

      {/* ─── Voice Note ─── */}
      {(incident.audioUrl || incident.id === '1') && (
        <div className="mb-6 p-3.5 rounded-cards bg-lilac-mist/25 dark:bg-royal-violet/10 border border-lilac-mist/50 dark:border-royal-violet/20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={toggleAudio}
              className="w-9 h-9 rounded-full bg-royal-violet text-white flex items-center justify-center shrink-0 hover:bg-royal-violet/90 transition-all"
              title="Play Voice Note"
            >
              {isPlayingAudio ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
            </button>
            <div>
              <span className="font-semibold text-[13px] text-ink-charcoal dark:text-ink-light flex items-center gap-1.5">
                <Mic className="w-3.5 h-3.5 text-royal-violet" />
                Voice Note (00:15)
              </span>
              <span className="text-[11px] text-stone-gray">
                {isPlayingAudio ? 'Playing...' : 'Click to listen'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ─── Metadata ─── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 rounded-cards bg-warm-parchment dark:bg-white/[0.03] text-[13px] text-stone-gray mb-6 border border-soft-mist dark:border-white/[0.08]">
        <div className="flex items-center gap-2 truncate">
          <MapPin className="w-4 h-4 text-royal-violet shrink-0" />
          <span className="font-semibold text-ink-charcoal dark:text-ink-light">Location:</span>
          <span className="truncate">{incident.location}</span>
        </div>

        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-royal-violet shrink-0" />
          <span className="font-semibold text-ink-charcoal dark:text-ink-light">Filed:</span>
          <span>{formatDate(incident.reportedAt)}</span>
        </div>
      </div>

      {/* ─── Actions ─── */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-soft-mist dark:border-white/[0.12]">
        <div className="flex items-center gap-2.5">
          <button
            onClick={handleAffectsMeClick}
            className={`px-4 py-2 rounded-pill text-[13px] font-medium transition-all flex items-center gap-2 ${
              hasAffectedMe
                ? 'bg-midnight-wine text-white'
                : 'bg-transparent text-ink-charcoal dark:text-ink-light border border-royal-violet/40 hover:bg-lilac-mist/30'
            }`}
          >
            <ThumbsUp className="w-4 h-4" />
            Affects Me ({affectsMeCount})
          </button>

          <select
            value={incident.status}
            onChange={(e) => onUpdateStatus(incident.id, e.target.value as Incident['status'])}
            className="app-input px-3 py-2 text-[13px] font-medium cursor-pointer rounded-pill"
          >
            <option value="open">Open</option>
            <option value="in-progress">In Repair</option>
            <option value="resolved">Resolved</option>
          </select>
        </div>

        <button
          onClick={() => setShowSolutions(!showSolutions)}
          className="app-btn-primary px-4 py-2 text-[13px] flex items-center gap-2"
        >
          <MessageSquare className="w-4 h-4" />
          Solutions ({incident.solutions.length})
        </button>
      </div>

      {/* ─── Solutions Drawer ─── */}
      {showSolutions && (
        <div className="mt-6 pt-6 border-t border-soft-mist dark:border-white/[0.12] space-y-5">
          <h4 className="font-bold text-[17px] text-ink-charcoal dark:text-ink-light flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-royal-violet" />
            Solutions & Updates
          </h4>

          <div className="space-y-3">
            {incident.solutions.length === 0 ? (
              <p className="text-[13px] text-stone-gray italic p-4 rounded-cards bg-warm-parchment dark:bg-white/[0.03] border border-soft-mist dark:border-white/[0.08]">
                No solutions proposed yet. Be the first to suggest a fix!
              </p>
            ) : (
              incident.solutions.map((solution) => (
                <div key={solution.id} className="p-4 rounded-cards bg-warm-parchment dark:bg-white/[0.03] space-y-2.5 border border-soft-mist dark:border-white/[0.08]">
                  <div className="flex justify-between items-center text-[13px] border-b border-soft-mist dark:border-white/[0.10] pb-2.5">
                    <span className="font-bold text-ink-charcoal dark:text-ink-light">{solution.author}</span>
                    <span className="text-[11px] text-stone-gray">{formatDate(solution.createdAt)}</span>
                  </div>

                  <p className="text-body-sm text-stone-gray">
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

          {/* New Solution Form */}
          <form onSubmit={handleSubmitSolution} className="p-5 rounded-cards bg-warm-parchment dark:bg-white/[0.03] border border-soft-mist dark:border-white/[0.08] space-y-3">
            <h5 className="text-micro text-stone-gray">
              Propose a Solution
            </h5>

            <input
              type="text"
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              placeholder="Your name or department"
              className="w-full px-3.5 py-2.5 app-input text-[13px]"
              required
            />

            <textarea
              value={newSolution}
              onChange={(e) => setNewSolution(e.target.value)}
              placeholder="Describe repair plan or action steps..."
              rows={3}
              className="w-full px-3.5 py-2.5 app-input text-[13px]"
              required
            />

            <button
              type="submit"
              className="app-btn-primary px-5 py-2.5 text-[13px] flex items-center gap-2"
            >
              <Send className="w-3.5 h-3.5" />
              Submit
            </button>
          </form>
        </div>
      )}
    </article>
  );
};