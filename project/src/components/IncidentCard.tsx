import React, { useState } from 'react';
import { MapPin, User, Clock, MessageSquare, Send, Tag, Newspaper, Users, CheckCircle2 } from 'lucide-react';
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
  const [hasCoSigned, setHasCoSigned] = useState(false);
  const [activePhotoTab, setActivePhotoTab] = useState<'before' | 'after'>('after');

  const coSignCount = (incident.coSignersCount || 1) + (hasCoSigned ? 1 : 0);
  const isVerifiedPetition = coSignCount >= 3 || incident.isVerified;

  const handleCoSignClick = () => {
    if (!hasCoSigned) {
      setHasCoSigned(true);
      if (onCoSign) onCoSign(incident.id);
    }
  };

  const getPriorityBadgeStyle = (priority: Incident['priority']) => {
    switch (priority) {
      case 'critical': return 'bg-gold text-obsidian font-bold shadow-gold-glow-sm';
      case 'high': return 'bg-midnight text-champagne border border-gold/60';
      case 'medium': return 'bg-obsidian text-gold border border-gold/40';
      case 'low': return 'bg-obsidian text-pewter border border-pewter/40';
      default: return 'bg-obsidian text-gold border border-gold/40';
    }
  };

  const getStatusBadgeStyle = (status: Incident['status']) => {
    switch (status) {
      case 'open': return 'bg-gold text-obsidian';
      case 'in-progress': return 'bg-midnight text-champagne';
      case 'resolved': return 'bg-obsidian text-gold border border-gold/40';
      default: return 'bg-obsidian text-champagne';
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
      
      {/* Top Banner / Byline & Verification Stamps */}
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

              {/* Verification Stamp */}
              {isVerifiedPetition && (
                <span className="bg-gold text-obsidian font-serif text-[10px] font-bold px-2 py-0.5 uppercase tracking-widest flex items-center gap-1 shadow-gold-glow-sm">
                  <CheckCircle2 className="w-3.5 h-3.5 text-obsidian" />
                  VERIFIED CITIZEN PETITION
                </span>
              )}
            </div>

            <span className="text-xs font-mono text-pewter uppercase block mt-1 tracking-wider">
              ID #{incident.id} • FILED BY {incident.reportedBy.toUpperCase()} • {coSignCount} CITIZEN CO-SIGNERS
            </span>
          </div>
        </div>

        {/* Priority & Status Controls */}
        <div className="flex flex-wrap items-center gap-3 font-mono text-xs">
          <span className={`px-3 py-1 border uppercase font-bold tracking-widest ${getPriorityBadgeStyle(incident.priority)}`}>
            {incident.priority.toUpperCase()} PRIORITY
          </span>

          <select
            value={incident.status}
            onChange={(e) => onUpdateStatus(incident.id, e.target.value as Incident['status'])}
            className={`px-3 py-1 font-bold uppercase cursor-pointer border border-gold bg-obsidian ${getStatusBadgeStyle(incident.status)} focus:outline-none tracking-widest`}
          >
            <option value="open" className="bg-charcoal text-champagne">STATUS: OPEN</option>
            <option value="in-progress" className="bg-charcoal text-champagne">STATUS: IN PROGRESS</option>
            <option value="resolved" className="bg-charcoal text-champagne">STATUS: RESOLVED</option>
          </select>
        </div>
      </div>

      {/* Article Headline */}
      <h3 className="text-2xl sm:text-3xl font-serif font-bold text-gold leading-tight tracking-wider uppercase mb-3 hover:text-gold-light transition-colors">
        {incident.title}
      </h3>

      {/* Article Body */}
      <p className="font-body text-base text-champagne leading-relaxed mb-6">
        {incident.description}
      </p>

      {/* BEFORE vs. AFTER Photo Comparison Plate */}
      {incident.imageUrl && (
        <div className="mb-6 art-deco-frame">
          <div className="art-deco-frame-inner">
            {/* Photo Mode Switcher Tabs if Resolved Image exists */}
            {incident.resolvedImageUrl && (
              <div className="flex border-b border-gold/40 bg-obsidian font-mono text-xs">
                <button
                  onClick={() => setActivePhotoTab('before')}
                  className={`flex-1 py-2 uppercase font-bold tracking-widest text-center border-r border-gold/40 transition-colors ${
                    activePhotoTab === 'before'
                      ? 'bg-gold text-obsidian shadow-gold-glow-sm'
                      : 'text-pewter hover:text-gold'
                  }`}
                >
                  📷 BEFORE (ORIGINAL HAZARD)
                </button>
                <button
                  onClick={() => setActivePhotoTab('after')}
                  className={`flex-1 py-2 uppercase font-bold tracking-widest text-center transition-colors ${
                    activePhotoTab === 'after'
                      ? 'bg-gold text-obsidian shadow-gold-glow-sm'
                      : 'text-pewter hover:text-gold'
                  }`}
                >
                  ✅ AFTER (REPAIR PROOF)
                </button>
              </div>
            )}

            {/* Active Image Display */}
            <img
              src={
                incident.resolvedImageUrl && activePhotoTab === 'after'
                  ? incident.resolvedImageUrl
                  : incident.imageUrl
              }
              alt={incident.title}
              className="w-full h-64 sm:h-80 object-cover grayscale hover:grayscale-0 transition-all duration-500 cursor-pointer"
            />

            <div className="bg-obsidian text-gold font-mono text-[10px] uppercase tracking-widest px-3 py-1.5 flex justify-between items-center border-t border-gold/30">
              <span>
                {incident.resolvedImageUrl && activePhotoTab === 'after'
                  ? 'FIG ' + incident.id + '.II • COMPLETED MUNICIPAL REPAIR PROOF'
                  : 'FIG ' + incident.id + '.I • INITIAL DISPATCH HAZARD EVIDENCE'}
              </span>
              <span className="hidden sm:inline">HOVER TO REVEAL FULL COLOR PLATE</span>
            </div>
          </div>
        </div>
      )}

      {/* Tags Section */}
      {incident.tags && incident.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6 pb-4 border-b border-gold/20">
          {incident.tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1.5 px-3 py-0.5 border border-gold/40 bg-obsidian text-gold font-mono text-xs uppercase font-bold tracking-widest"
            >
              <Tag className="w-3 h-3 text-gold" />
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Metadata Bar */}
      <div className="flex flex-wrap gap-6 text-xs font-mono text-champagne mb-6 bg-obsidian/70 p-4 border border-gold/40">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-gold" />
          <span className="font-bold text-gold tracking-wider">LOCATION:</span> {incident.location}
        </div>
        <div className="flex items-center gap-2">
          <User className="w-4 h-4 text-gold" />
          <span className="font-bold text-gold tracking-wider">REPORTER:</span> {incident.reportedBy}
        </div>
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-gold" />
          <span className="font-bold text-gold tracking-wider">FILED:</span> {formatDate(incident.reportedAt)}
        </div>
      </div>

      {/* Footer Action Bar (Co-Sign Petition & Solutions Toggle) */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-5 border-t border-gold/40">
        
        {/* Co-Sign Petition Button */}
        <button
          onClick={handleCoSignClick}
          disabled={hasCoSigned}
          className={`px-5 py-2.5 font-serif text-xs uppercase font-bold tracking-widest border transition-all flex items-center justify-center gap-2 ${
            hasCoSigned
              ? 'bg-gold text-obsidian border-gold cursor-default shadow-gold-glow-sm'
              : 'art-deco-btn-gold'
          }`}
        >
          <Users className="w-4 h-4 text-gold" />
          {hasCoSigned
            ? `✦ YOU CO-SIGNED THIS DISPATCH (${coSignCount})`
            : `✦ CO-SIGN DISPATCH (${coSignCount} AFFECTED)`}
        </button>

        {/* Solutions Toggle */}
        <button
          onClick={() => setShowSolutions(!showSolutions)}
          className="art-deco-btn-solid px-5 py-2.5 text-xs flex items-center justify-center gap-2"
        >
          <MessageSquare className="w-4 h-4 text-obsidian" />
          {showSolutions ? '[-] HIDE DISPATCHES' : `[+] ${incident.solutions.length} COMMUNITY SOLUTIONS`}
        </button>
      </div>

      {/* Solutions Section Drawer */}
      {showSolutions && (
        <div className="mt-6 border-t border-gold/40 pt-6 space-y-6">
          <div className="flex items-center justify-between border-b border-gold/30 pb-2">
            <h4 className="font-serif font-bold text-lg uppercase tracking-wider text-gold">
              OFFICIAL RESPONSES & COMMUNITY RESOLUTIONS ({incident.solutions.length})
            </h4>
            <span className="font-mono text-xs text-pewter uppercase tracking-widest">TESTIMONIAL LOG</span>
          </div>

          <div className="space-y-4">
            {incident.solutions.length === 0 ? (
              <div className="p-5 border border-dashed border-gold/40 bg-obsidian text-center font-mono text-xs text-pewter tracking-wider">
                NO SOLUTIONS FILED YET. BE THE FIRST CITIZEN TO SUBMIT A RESOLUTION PROPOSAL BELOW.
              </div>
            ) : (
              incident.solutions.map((solution) => (
                <div key={solution.id} className="border-l-2 border-gold bg-obsidian p-4 border-y border-r border-gold/20 art-deco-corner-wrapper">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3 pb-2 border-b border-gold/20 font-mono text-xs">
                    <span className="font-bold text-gold uppercase flex items-center gap-1.5 tracking-wider">
                      <Newspaper className="w-3.5 h-3.5 text-gold" />
                      RESPONSE BY: {solution.author}
                    </span>
                    <div className="flex items-center gap-3">
                      <SolutionRating
                        helpful={solution.helpful}
                        unhelpful={solution.unhelpful}
                        onRate={(type) => handleRating(solution.id, type)}
                        userRating={userRatings[solution.id]}
                      />
                      <span className="text-[10px] text-pewter">
                        {formatDate(solution.createdAt)}
                      </span>
                    </div>
                  </div>
                  <p className="font-body text-sm text-champagne leading-relaxed">
                    "{solution.content}"
                  </p>
                </div>
              ))
            )}
          </div>

          {/* New Solution Submission Form */}
          <form onSubmit={handleSubmitSolution} className="border border-gold/40 bg-obsidian p-5 space-y-4 art-deco-corner-wrapper">
            <h5 className="font-serif font-bold text-xs uppercase text-gold tracking-widest border-b border-gold/30 pb-2">
              FILE RESOLUTION OR SOLUTION TESTIMONIAL
            </h5>
            
            <div className="flex gap-2">
              <input
                type="text"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                placeholder="YOUR NAME / OFFICIAL TITLE..."
                className="w-full px-3 py-2 art-deco-input font-mono text-xs text-champagne placeholder:text-pewter uppercase"
              />
            </div>
            
            <div className="flex gap-2">
              <textarea
                value={newSolution}
                onChange={(e) => setNewSolution(e.target.value)}
                placeholder="DESCRIBE PROPOSED ACTION OR RESOLUTION DETAILS..."
                rows={3}
                className="w-full px-3 py-2 art-deco-input font-mono text-xs text-champagne placeholder:text-pewter uppercase"
              />
            </div>

            <button
              type="submit"
              disabled={!newSolution.trim() || !authorName.trim()}
              className="w-full art-deco-btn-solid py-2.5 px-4 text-xs font-bold tracking-widest disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Send className="w-3.5 h-3.5 text-obsidian" />
              SUBMIT COMMUNITY SOLUTION DISPATCH
            </button>
          </form>
        </div>
      )}
    </article>
  );
};