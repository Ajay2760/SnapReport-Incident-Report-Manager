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
    <div className="flex items-center gap-3 pt-2 border-t border-slate-200/60 dark:border-slate-800 text-xs">
      <span className="text-slate-500 dark:text-slate-400 font-semibold">Was this solution helpful?</span>
      
      <div className="flex items-center gap-2">
        <button
          onClick={() => onRate('helpful')}
          disabled={!!userRating}
          className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
            userRating === 'helpful'
              ? 'bg-emerald-600 text-white'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
          }`}
        >
          <ThumbsUp className="w-3.5 h-3.5" />
          <span>{solution.helpful}</span>
        </button>

        <button
          onClick={() => onRate('unhelpful')}
          disabled={!!userRating}
          className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
            userRating === 'unhelpful'
              ? 'bg-rose-600 text-white'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
          }`}
        >
          <ThumbsDown className="w-3.5 h-3.5" />
          <span>{solution.unhelpful}</span>
        </button>
      </div>
    </div>
  );
};