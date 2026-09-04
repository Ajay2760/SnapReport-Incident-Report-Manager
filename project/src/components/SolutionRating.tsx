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
    <div className="flex items-center gap-3 pt-2.5 border-t border-silver/30 dark:border-white/[0.08] text-[13px]">
      <span className="text-steel font-medium">Helpful?</span>
      
      <div className="flex items-center gap-2">
        <button
          onClick={() => onRate('helpful')}
          disabled={!!userRating}
          className={`px-3 py-1.5 rounded-pill text-[13px] font-semibold flex items-center gap-1.5 transition-all ${
            userRating === 'helpful'
              ? 'bg-signal-blue text-white'
              : 'bg-linen dark:bg-white/[0.06] text-carbon dark:text-silver hover:bg-silver/30 dark:hover:bg-white/[0.10]'
          } ${userRating && userRating !== 'helpful' ? 'opacity-40 cursor-not-allowed' : ''}`}
        >
          <ThumbsUp className="w-3.5 h-3.5" />
          <span>{solution.helpful}</span>
        </button>

        <button
          onClick={() => onRate('unhelpful')}
          disabled={!!userRating}
          className={`px-3 py-1.5 rounded-pill text-[13px] font-semibold flex items-center gap-1.5 transition-all ${
            userRating === 'unhelpful'
              ? 'bg-alert-red text-white'
              : 'bg-linen dark:bg-white/[0.06] text-carbon dark:text-silver hover:bg-silver/30 dark:hover:bg-white/[0.10]'
          } ${userRating && userRating !== 'unhelpful' ? 'opacity-40 cursor-not-allowed' : ''}`}
        >
          <ThumbsDown className="w-3.5 h-3.5" />
          <span>{solution.unhelpful}</span>
        </button>
      </div>
    </div>
  );
};