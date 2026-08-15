import React, { useState } from 'react';
import { MapPin, User, Clock, MessageSquare, Send, Tag, Newspaper, Users, CheckCircle2, ArrowRightLeft } from 'lucide-react';
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
      case 'critical': return 'bg-[#CC0000] text-white font-bold border-[#CC0000]';
      case 'high': return 'bg-[#111111] text-white font-bold border-[#111111]';
      case 'medium': return 'bg-neutral-200 text-[#111111] border-[#111111]';
      case 'low': return 'bg-[#F9F9F7] text-[#111111] border-[#111111]';
      default: return 'bg-white text-[#111111] border-[#111111]';
    }
  };

  const getStatusBadgeStyle = (status: Incident['status']) => {
    switch (status) {
      case 'open': return 'bg-[#CC0000] text-white';
      case 'in-progress': return 'bg-[#111111] text-white';
      case 'resolved': return 'bg-neutral-300 text-[#111111] border border-[#111111]';
      default: return 'bg-white text-[#111111] border border-[#111111]';
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
    <article id={`incident-${incident.id}`} className="border-2 border-[#111111] bg-white p-6 sm:p-8 hard-shadow-hover relative transition-all newsprint-texture">
      
      {/* Top Banner / Byline & Verification Stamps */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#111111] pb-4 mb-5">
        <div className="flex items-center gap-3">
          <div className="border border-[#111111] p-2 bg-[#F9F9F7] text-2xl flex items-center justify-center shrink-0">
            {getCategoryIcon(incident.category)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#CC0000]">
                DISPATCH CATEGORY: {incident.category.toUpperCase()}
              </span>

              {/* Verification Stamp */}
              {isVerifiedPetition && (
                <span className="bg-[#111111] text-white font-mono text-[9px] font-bold px-2 py-0.5 uppercase tracking-widest flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-[#CC0000]" />
                  VERIFIED CITIZEN PETITION
                </span>
              )}
            </div>

            <span className="text-xs font-mono text-neutral-500 uppercase block mt-0.5">
              ID #{incident.id} • FILED BY {incident.reportedBy.toUpperCase()} • {coSignCount} CITIZEN CO-SIGNERS
            </span>
          </div>
        </div>

        {/* Priority & Status Controls */}
        <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
          <span className={`px-3 py-1 border uppercase font-bold tracking-wider ${getPriorityBadgeStyle(incident.priority)}`}>
            {incident.priority.toUpperCase()} PRIORITY
          </span>

          <select
            value={incident.status}
            onChange={(e) => onUpdateStatus(incident.id, e.target.value as Incident['status'])}
            className={`px-3 py-1 font-bold uppercase cursor-pointer border border-[#111111] ${getStatusBadgeStyle(incident.status)} focus:outline-none`}
          >
            <option value="open" className="bg-white text-[#111111]">STATUS: OPEN</option>
            <option value="in-progress" className="bg-white text-[#111111]">STATUS: IN PROGRESS</option>
            <option value="resolved" className="bg-white text-[#111111]">STATUS: RESOLVED</option>
          </select>
        </div>
      </div>

      {/* Article Headline */}
      <h3 className="text-2xl sm:text-3xl font-black font-serif text-[#111111] leading-tight tracking-tight uppercase mb-3">
        {incident.title}
      </h3>

      {/* Article Body */}
      <p className="font-body text-base text-neutral-900 leading-relaxed mb-6 text-justify">
        {incident.description}
      </p>

      {/* BEFORE vs. AFTER Photo Comparison Plate */}
      {incident.imageUrl && (
        <div className="mb-6 border-2 border-[#111111] bg-[#111111] p-1 relative">
          
          {/* Photo Mode Switcher Tabs if Resolved Image exists */}
          {incident.resolvedImageUrl && (
            <div className="flex border-b border-white bg-black font-mono text-xs mb-1">
              <button
                onClick={() => setActivePhotoTab('before')}
                className={`flex-1 py-1.5 uppercase font-bold text-center border-r border-white transition-colors ${
                  activePhotoTab === 'before'
                    ? 'bg-[#CC0000] text-white'
                    : 'text-neutral-300 hover:text-white'
                }`}
              >
                📷 BEFORE (ORIGINAL HAZARD)
              </button>
              <button
                onClick={() => setActivePhotoTab('after')}
                className={`flex-1 py-1.5 uppercase font-bold text-center transition-colors ${
                  activePhotoTab === 'after'
                    ? 'bg-white text-[#111111]'
                    : 'text-neutral-300 hover:text-white'
                }`}
              >
                ✅ AFTER (MUNICIPAL REPAIR PROOF)
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

          <div className="bg-[#111111] text-[#F9F9F7] font-mono text-[10px] uppercase tracking-widest px-3 py-1 flex justify-between items-center">
            <span>
              {incident.resolvedImageUrl && activePhotoTab === 'after'
                ? 'FIG ' + incident.id + '.2 • COMPLETED MUNICIPAL REPAIR PROOF'
                : 'FIG ' + incident.id + '.1 • INITIAL DISPATCH HAZARD EVIDENCE'}
            </span>
            <span className="hidden sm:inline">HOVER TO REVEAL FULL COLOR PLATE</span>
          </div>
        </div>
      )}

      {/* Tags Section */}
      {incident.tags && incident.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-5 pb-4 border-b border-neutral-200">
          {incident.tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 px-2.5 py-0.5 border border-[#111111] bg-[#F9F9F7] text-[#111111] font-mono text-xs uppercase font-bold"
            >
              <Tag className="w-3 h-3 text-[#CC0000]" />
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Metadata Bar */}
      <div className="flex flex-wrap gap-6 text-xs font-mono text-neutral-700 mb-6 bg-neutral-100 p-3 border border-[#111111]">
        <div className="flex items-center gap-1.5">
          <MapPin className="w-4 h-4 text-[#111111]" />
          <span className="font-bold text-[#111111]">LOCATION:</span> {incident.location}
        </div>
        <div className="flex items-center gap-1.5">
          <User className="w-4 h-4 text-[#111111]" />
          <span className="font-bold text-[#111111]">REPORTER:</span> {incident.reportedBy}
        </div>
        <div className="flex items-center gap-1.5">
          <Clock className="w-4 h-4 text-[#111111]" />
          <span className="font-bold text-[#111111]">FILED:</span> {formatDate(incident.reportedAt)}
        </div>
      </div>

      {/* Footer Action Bar (Co-Sign Petition & Solutions Toggle) */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-4 border-t-2 border-[#111111]">
        
        {/* Co-Sign Petition Button */}
        <button
          onClick={handleCoSignClick}
          disabled={hasCoSigned}
          className={`px-4 py-2 font-mono text-xs uppercase font-bold tracking-wider border border-[#111111] transition-all flex items-center justify-center gap-2 ${
            hasCoSigned
              ? 'bg-[#111111] text-white cursor-default'
              : 'bg-white text-[#111111] hover:bg-[#CC0000] hover:text-white hard-shadow-hover'
          }`}
        >
          <Users className="w-4 h-4 text-[#CC0000]" />
          {hasCoSigned
            ? `✦ YOU CO-SIGNED THIS DISPATCH (${coSignCount})`
            : `✦ CO-SIGN DISPATCH (${coSignCount} AFFECTED)`}
        </button>

        {/* Solutions Toggle */}
        <button
          onClick={() => setShowSolutions(!showSolutions)}
          className="border border-[#111111] bg-[#111111] text-white px-4 py-2 font-mono text-xs uppercase font-bold tracking-wider hover:bg-[#CC0000] transition-colors flex items-center justify-center gap-2"
        >
          <MessageSquare className="w-4 h-4 text-white" />
          {showSolutions ? '[-] HIDE DISPATCHES' : `[+] ${incident.solutions.length} COMMUNITY SOLUTIONS`}
        </button>
      </div>

      {/* Solutions Section Drawer */}
      {showSolutions && (
        <div className="mt-6 border-t-2 border-[#111111] pt-6 space-y-6">
          <div className="flex items-center justify-between border-b border-[#111111] pb-2">
            <h4 className="font-serif font-bold text-lg uppercase text-[#111111]">
              OFFICIAL RESPONSES & COMMUNITY RESOLUTIONS ({incident.solutions.length})
            </h4>
            <span className="font-mono text-xs text-neutral-500 uppercase">TESTIMONIAL LOG</span>
          </div>

          <div className="space-y-4">
            {incident.solutions.length === 0 ? (
              <div className="p-4 border border-dashed border-[#111111] bg-[#F9F9F7] text-center font-mono text-xs text-neutral-600">
                NO SOLUTIONS FILED YET. BE THE FIRST CITIZEN TO SUBMIT A RESOLUTION PROPOSAL BELOW.
              </div>
            ) : (
              incident.solutions.map((solution) => (
                <div key={solution.id} className="border-l-4 border-[#111111] bg-[#F9F9F7] p-4 border-y border-r border-neutral-300">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2 pb-2 border-b border-neutral-300 font-mono text-xs">
                    <span className="font-bold text-[#111111] uppercase flex items-center gap-1.5">
                      <Newspaper className="w-3.5 h-3.5 text-[#CC0000]" />
                      RESPONSE BY: {solution.author}
                    </span>
                    <div className="flex items-center gap-3">
                      <SolutionRating
                        helpful={solution.helpful}
                        unhelpful={solution.unhelpful}
                        onRate={(type) => handleRating(solution.id, type)}
                        userRating={userRatings[solution.id]}
                      />
                      <span className="text-[10px] text-neutral-500">
                        {formatDate(solution.createdAt)}
                      </span>
                    </div>
                  </div>
                  <p className="font-body text-sm text-neutral-900 leading-relaxed">
                    "{solution.content}"
                  </p>
                </div>
              ))
            )}
          </div>

          {/* New Solution Submission Form */}
          <form onSubmit={handleSubmitSolution} className="border border-[#111111] bg-white p-4 space-y-3">
            <h5 className="font-mono font-bold text-xs uppercase text-[#111111] tracking-wider border-b border-neutral-200 pb-1">
              FILE RESOLUTION OR SOLUTION TESTIMONIAL
            </h5>
            
            <div className="flex gap-2">
              <input
                type="text"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                placeholder="YOUR NAME / OFFICIAL TITLE..."
                className="w-full px-3 py-2 border border-[#111111] font-mono text-xs bg-[#F9F9F7] text-[#111111] focus:bg-white focus:outline-none"
              />
            </div>
            
            <div className="flex gap-2">
              <textarea
                value={newSolution}
                onChange={(e) => setNewSolution(e.target.value)}
                placeholder="DESCRIBE PROPOSED ACTION OR RESOLUTION DETAILS..."
                rows={3}
                className="w-full px-3 py-2 border border-[#111111] font-mono text-xs bg-[#F9F9F7] text-[#111111] focus:bg-white focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={!newSolution.trim() || !authorName.trim()}
              className="w-full bg-[#111111] text-white py-2 px-4 font-mono text-xs uppercase font-bold tracking-widest hover:bg-[#CC0000] disabled:bg-neutral-300 disabled:text-neutral-500 transition-colors flex items-center justify-center gap-2"
            >
              <Send className="w-3.5 h-3.5" />
              SUBMIT COMMUNITY SOLUTION DISPATCH
            </button>
          </form>
        </div>
      )}
    </article>
  );
};