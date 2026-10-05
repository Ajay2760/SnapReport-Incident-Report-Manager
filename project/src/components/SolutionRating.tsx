import React from 'react';
import { ThumbsUp, ThumbsDown } from 'lucide-react';
import { Solution } from '../types/incident';

interface SolutionRatingProps {
  solution: Solution;
  onRate: (type: 'helpful' | 'unhelpful') => void;
  userRating?: 'helpful' | 'unhelpful';
}

export const SolutionRating: React.FC<SolutionRatingProps> = ({
  solution,
  onRate,
  userRating,
}) => {
  return (
    <div className="flex items-center gap-3 pt-2.5 border-t text-sm" style={{ borderColor: 'var(--border-default)' }}>
      <span className="font-semibold" style={{ color: 'var(--foreground-muted)' }}>Helpful?</span>
      
      <div className="flex items-center gap-2">
        <button
          onClick={() => onRate('helpful')}
          disabled={!!userRating}
          className={`rounded-full px-3.5 py-1.5 text-[13px] font-bold flex items-center gap-1.5 transition-all duration-300 ${
            userRating === 'helpful' ? 'text-white' : ''
          } ${userRating && userRating !== 'helpful' ? 'opacity-40 cursor-not-allowed' : ''}`}
          style={userRating === 'helpful' ? { background: 'var(--accent)', color: '#fff' } : { background: 'var(--surface)', border: '1px solid var(--border-default)' }}
        >
          <ThumbsUp className="w-3.5 h-3.5" />
          <span className="tabular">{solution.helpful}</span>
        </button>

        <button
          onClick={() => onRate('unhelpful')}
          disabled={!!userRating}
          className={`rounded-full px-3.5 py-1.5 text-[13px] font-bold flex items-center gap-1.5 transition-all duration-300 ${
            userRating && userRating !== 'unhelpful' ? 'opacity-40 cursor-not-allowed' : ''
          }`}
          style={{ background: 'var(--surface)', border: '1px solid var(--border-default)' }}
        >
          <ThumbsDown className="w-3.5 h-3.5" />
          <span className="tabular">{solution.unhelpful}</span>
        </button>
      </div>
    </div>
  );
};