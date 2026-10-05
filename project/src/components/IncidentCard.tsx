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
  ArrowUpRight,
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

const statusBadge = (s: Incident['status']) =>
  s === 'open' ? 'badge-status-open' : s === 'in-progress' ? 'badge-status-progress' : 'badge-status-resolved';

const statusLabel = (s: Incident['status']) => (s === 'open' ? 'Open' : s === 'in-progress' ? 'In repair' : 'Resolved');

const priorityBadge = (p: Incident['priority']) =>
  p === 'critical' ? 'badge-priority-critical' : p === 'high' ? 'badge-priority-high' : p === 'medium' ? 'badge-priority-medium' : 'badge-priority-low';

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
      setAffectsMeCount((prev) => prev + 1);
      if (onCoSign) onCoSign(incident.id);
    }
  };

  const toggleAudio = () => {
    if (!audioRef.current && incident.audioUrl) {
      audioRef.current = new Audio(incident.audioUrl);
      audioRef.current.onended = () => setIsPlayingAudio(false);
    }
    if (audioRef.current) {
      if (isPlayingAudio) { audioRef.current.pause(); setIsPlayingAudio(false); }
      else { audioRef.current.play(); setIsPlayingAudio(true); }
    }
  };

  const handleCopyLink = () => {
    const shareUrl = `${window.location.origin}#incident-${incident.id}`;
    navigator.clipboard.writeText(shareUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleWhatsAppShare = () => {
    const text = encodeURIComponent(`SnapReport: "${incident.title}" at ${incident.location} — ${incident.status.toUpperCase()}. Track it: ${window.location.href}`);
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
      onAddSolution(incident.id, { author: authorName, content: newSolution });
      setNewSolution(''); setAuthorName('');
    }
  };

  const handleRating = (solutionId: string, type: 'helpful' | 'unhelpful') => {
    if (userRatings[solutionId]) return;
    setUserRatings((prev) => ({ ...prev, [solutionId]: type }));
    onRateSolution(incident.id, solutionId, type);
  };

  const formatDate = (date: Date) =>
    new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }).format(date);

  const CategoryIcon = getCategoryIcon(incident.category);

  return (
    <article id={`incident-${incident.id}`} className="bezel reveal is-visible scroll-mt-32">
      <div className="bezel-inner">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b p-5 sm:px-7" style={{ borderColor: 'var(--border-default)' }}>
          <div className="flex items-center gap-3.5">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl" style={{ background: 'var(--accent-glow)', color: 'var(--accent-bright)' }}>
              <CategoryIcon className="h-5 w-5" />
            </span>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-[0.18em]" style={{ color: 'var(--accent-bright)' }}>{incident.category}</span>
                {affectsMeCount >= 5 && (
                  <span className="badge badge-status-resolved !py-1 text-[11px]"><CheckCircle2 className="h-3 w-3" /> Verified</span>
                )}
                <span className={`badge ${statusBadge(incident.status)} !py-1 text-[11px]`}>{statusLabel(incident.status)}</span>
              </div>
              <p className="text-body-sm mt-1">{incident.reportedBy} · <span className="tabular">#{incident.id.padStart(4, '0')}</span></p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className={`badge ${priorityBadge(incident.priority)} capitalize`}>{incident.priority}</span>
            <div className="relative">
              <button onClick={() => setShowShareMenu(!showShareMenu)} className="btn btn-ghost !min-h-[38px] !p-2.5" title="Share">
                <Share2 className="h-4 w-4" />
              </button>
              {showShareMenu && (
                <div className="surface-glass absolute right-0 top-full z-30 mt-2 w-52 space-y-0.5 p-2">
                  <button onClick={handleWhatsAppShare} className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors hover:bg-[var(--surface)]">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-extrabold text-white" style={{ background: '#25d366' }}>W</span> WhatsApp
                  </button>
                  <button onClick={handleEmailShare} className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors hover:bg-[var(--surface)]">
                    <Mail className="h-4 w-4" style={{ color: 'var(--accent-bright)' }} /> Email
                  </button>
                  <div className="mx-1 border-t" style={{ borderColor: 'var(--border-default)' }} />
                  <button onClick={handleCopyLink} className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors hover:bg-[var(--surface)]">
                    {copiedLink ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />} {copiedLink ? 'Copied!' : 'Copy link'}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="grid gap-0 lg:grid-cols-[1.15fr_0.85fr]">
          {/* Left: media + copy */}
          <div className="p-5 sm:p-7">
            <h3 className="text-heading-2 text-balance">{incident.title}</h3>

            <div className="mt-5 overflow-hidden rounded-2xl border" style={{ borderColor: 'var(--border-default)' }}>
              {incident.resolvedImageUrl && (
                <div className="flex items-center justify-between border-b px-4 py-2.5" style={{ borderColor: 'var(--border-default)', background: 'var(--surface)' }}>
                  <span className="text-[13px] font-bold">Photo proof</span>
                  <div className="flex gap-1 rounded-full border p-0.5" style={{ borderColor: 'var(--border-default)' }}>
                    {(['before', 'after'] as const).map((t) => (
                      <button key={t} onClick={() => setActivePhotoTab(t)}
                        className={`rounded-full px-3.5 py-1 text-[12.5px] font-bold capitalize transition-all duration-300 ${activePhotoTab === t ? 'text-white' : ''}`}
                        style={activePhotoTab === t ? { background: 'var(--foreground)', color: 'var(--background-base)' } : { color: 'var(--foreground-muted)' }}>
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              <div className="group relative aspect-[16/9] overflow-hidden">
                <img
                  src={activePhotoTab === 'after' && incident.resolvedImageUrl ? incident.resolvedImageUrl : incident.imageUrl || 'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3?auto=format&fit=crop&w=800&q=80'}
                  alt={incident.title}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                  style={{ transitionTimingFunction: 'cubic-bezier(0.32,0.72,0,1)' }}
                />
                <span className="absolute bottom-3 right-3 rounded-full px-3 py-1.5 text-[11.5px] font-bold text-white backdrop-blur-xl" style={{ background: 'rgba(0,0,0,0.55)' }}>
                  {activePhotoTab === 'after' && incident.resolvedImageUrl ? 'Repair proof' : 'Hazard report'}
                </span>
              </div>
            </div>

            <p className="text-body-sm mt-5 !text-[14.5px] !leading-relaxed" style={{ color: 'var(--foreground)', opacity: 0.82 }}>
              {incident.description}
            </p>

            {(incident.audioUrl || incident.id === '1') && (
              <div className="surface-panel mt-4 flex items-center gap-3.5 p-3.5">
                <button onClick={toggleAudio} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-white transition-transform duration-300 hover:scale-105 active:scale-95"
                  style={{ background: 'var(--accent)' }} title="Play voice note">
                  {isPlayingAudio ? <Pause className="h-4 w-4" /> : <Play className="ml-0.5 h-4 w-4" />}
                </button>
                <div className="flex-1">
                  <p className="flex items-center gap-1.5 text-[13.5px] font-bold"><Mic className="h-3.5 w-3.5" style={{ color: 'var(--accent-bright)' }} /> Voice note · 00:15</p>
                  <div className="mt-1.5 flex items-center gap-1">
                    {Array.from({ length: 24 }).map((_, i) => (
                      <span key={i} className="w-1 rounded-full" style={{ height: `${6 + (i % 5) * 4}px`, background: isPlayingAudio && i < 10 ? 'var(--accent)' : 'var(--border-hover)' }} />
                    ))}
                  </div>
                </div>
                <span className="text-[12px] font-semibold" style={{ color: 'var(--foreground-muted)' }}>{isPlayingAudio ? 'Playing' : 'Listen'}</span>
              </div>
            )}

            <div className="surface-panel mt-4 grid gap-2.5 p-4 text-[13.5px] sm:grid-cols-2">
              <span className="flex items-center gap-2 truncate"><MapPin className="h-4 w-4 shrink-0" style={{ color: 'var(--accent-bright)' }} /><strong>Location:</strong><span className="truncate" style={{ color: 'var(--foreground-muted)' }}>{incident.location}</span></span>
              <span className="flex items-center gap-2"><Clock className="h-4 w-4 shrink-0" style={{ color: 'var(--accent-bright)' }} /><strong>Filed:</strong><span style={{ color: 'var(--foreground-muted)' }}>{formatDate(incident.reportedAt)}</span></span>
            </div>

            {incident.tags && incident.tags.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-1.5">
                {incident.tags.map((t) => (
                  <span key={t} className="rounded-full border px-3 py-1 text-[12.5px] font-semibold" style={{ borderColor: 'var(--border-default)', background: 'var(--surface)', color: 'var(--foreground-muted)' }}>#{t}</span>
                ))}
              </div>
            )}
          </div>

          {/* Right: ops rail */}
          <div className="flex flex-col gap-4 border-t p-5 sm:p-7 lg:border-l lg:border-t-0" style={{ borderColor: 'var(--border-default)', background: 'color-mix(in srgb, var(--foreground) 2%, transparent)' }}>
            <div>
              <div className="mb-3 flex items-center justify-between">
                <p className="text-[12px] font-bold uppercase tracking-[0.14em]" style={{ color: 'var(--foreground-muted)' }}>Repair progress</p>
                <span className="badge badge-accent !text-[11.5px] tabular">ETA · {incident.eta || '48h'}</span>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {[{ label: 'Reported', step: 0 }, { label: 'Reviewed', step: 1 }, { label: 'Dispatched', step: 2 }, { label: 'Resolved', step: 3 }].map((s) => {
                  const done = s.step <= currentStepIdx;
                  const cur = s.step === currentStepIdx;
                  return (
                    <div key={s.label} className="text-center">
                      <div className="h-1.5 rounded-full transition-all duration-700"
                        style={done ? { background: 'var(--accent)', boxShadow: cur ? '0 0 0 3px var(--accent-glow)' : undefined, transitionTimingFunction: 'cubic-bezier(0.32,0.72,0,1)' } : { background: 'var(--border-default)' }} />
                      <span className="mt-1.5 block text-[10.5px] font-bold" style={{ color: done ? 'var(--accent-bright)' : 'var(--foreground-subtle)' }}>{s.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
                <div className="surface-panel p-3.5 text-center">
                  <p className="text-xl font-extrabold tabular">{incident.coSignersCount || 0}</p>
                  <p className="text-[11.5px] font-bold uppercase tracking-wider" style={{ color: 'var(--foreground-muted)' }}>Co-signs</p>
                </div>
                <div className="surface-panel p-3.5 text-center">
                  <p className="text-xl font-extrabold tabular">{affectsMeCount}</p>
                  <p className="text-[11.5px] font-bold uppercase tracking-wider" style={{ color: 'var(--foreground-muted)' }}>Affected</p>
                </div>
            </div>

            <button onClick={handleAffectsMeClick} disabled={hasAffectedMe}
              className={`btn w-full ${hasAffectedMe ? '' : 'btn-primary group'}`}
              style={hasAffectedMe ? { background: 'var(--surface)', color: 'var(--foreground)' } : undefined}>
              <ThumbsUp className="h-4 w-4" /> {hasAffectedMe ? `Counted · ${affectsMeCount}` : `Affects me · ${affectsMeCount}`}
              {!hasAffectedMe && <span className="btn-icon-circle"><ArrowUpRight className="h-4 w-4" /></span>}
            </button>

            <label className="text-[12px] font-bold uppercase tracking-[0.14em]" style={{ color: 'var(--foreground-muted)' }}>
              Case status
              <select value={incident.status} onChange={(e) => onUpdateStatus(incident.id, e.target.value as Incident['status'])}
                className="field-input field-select mt-2 cursor-pointer !rounded-full !py-2.5 text-center text-[13.5px] font-bold">
                <option value="open">● Open</option>
                <option value="in-progress">● In repair</option>
                <option value="resolved">● Resolved</option>
              </select>
            </label>

            <button onClick={() => setShowSolutions(!showSolutions)} className={`btn w-full ${showSolutions ? 'btn-secondary' : 'btn-secondary'}`}>
              <MessageSquare className="h-4 w-4" /> Solutions ({incident.solutions.length}) · {showSolutions ? 'Hide' : 'View'}
            </button>
          </div>
        </div>

        {showSolutions && (
          <div className="space-y-4 border-t p-5 sm:p-7" style={{ borderColor: 'var(--border-default)', background: 'color-mix(in srgb, var(--foreground) 2%, transparent)' }}>
            <h4 className="flex items-center gap-2 text-[15px] font-bold"><MessageSquare className="h-4 w-4" style={{ color: 'var(--accent-bright)' }} /> Solutions & official updates</h4>
            <div className="space-y-3">
              {incident.solutions.length === 0 ? (
                <p className="surface-panel p-4 text-center text-[13.5px] italic" style={{ color: 'var(--foreground-muted)' }}>No solutions yet — be the first to propose a fix.</p>
              ) : (
                incident.solutions.map((solution) => (
                  <div key={solution.id} className="surface-panel space-y-2.5 p-4">
                    <div className="flex items-center justify-between border-b pb-2.5" style={{ borderColor: 'var(--border-default)' }}>
                      <span className="text-[13.5px] font-bold">{solution.author}</span>
                      <span className="text-[11.5px] tabular" style={{ color: 'var(--foreground-muted)' }}>{formatDate(solution.createdAt)}</span>
                    </div>
                    <p className="text-body-sm !text-[13.5px]" style={{ color: 'var(--foreground)', opacity: 0.85 }}>{solution.content}</p>
                    <SolutionRating solution={solution} onRate={(t) => handleRating(solution.id, t)} userRating={userRatings[solution.id]} />
                  </div>
                ))
              )}
            </div>
            <form onSubmit={handleSubmitSolution} className="surface-panel space-y-3 p-5">
              <p className="text-caption">Propose a solution</p>
              <input type="text" value={authorName} onChange={(e) => setAuthorName(e.target.value)} placeholder="Your name or department" className="field-input !text-[13.5px]" required />
              <textarea value={newSolution} onChange={(e) => setNewSolution(e.target.value)} placeholder="Describe repair plan or action steps…" rows={3} className="field-input resize-none !text-[13.5px]" required />
              <button type="submit" className="btn btn-primary group px-5 py-2.5 text-[13.5px]">
                <Send className="h-3.5 w-3.5" /> Submit <span className="btn-icon-circle !h-6 !w-6"><ArrowUpRight className="h-3.5 w-3.5" /></span>
              </button>
            </form>
          </div>
        )}
      </div>
    </article>
  );
};
