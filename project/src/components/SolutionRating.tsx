import React from 'react';
import { ThumbsUp, ThumbsDown } from 'lucide-react';

interface SolutionRatingProps {
  helpful: number;
  unhelpful: number;
  onRate: (type: 'helpful' | 'unhelpful') => void;
  userRating?: 'helpful' | 'unhelpful' | null;
}

export const SolutionRating: React.FC<SolutionRatingProps> = ({
  helpful,
  unhelpful,
  onRate,
  userRating
}) => {
  return (
    <div className="flex items-center gap-3">
      <button
        onClick={() => onRate('helpful')}
        className={`flex items-center gap-1 px-2 py-1 rounded-lg text-sm transition-colors ${
          userRating === 'helpful'
            ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
            : 'text-gray-500 hover:text-green-600 hover:bg-green-50 dark:text-gray-400 dark:hover:text-green-400 dark:hover:bg-green-900/20'
        }`}
      >
        <ThumbsUp className="w-3 h-3" />
        <span>{helpful}</span>
      </button>
      
      <button
        onClick={() => onRate('unhelpful')}
        className={`flex items-center gap-1 px-2 py-1 rounded-lg text-sm transition-colors ${
          userRating === 'unhelpful'
            ? 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
            : 'text-gray-500 hover:text-red-600 hover:bg-red-50 dark:text-gray-400 dark:hover:text-red-400 dark:hover:bg-red-900/20'
        }`}
      >
        <ThumbsDown className="w-3 h-3" />
        <span>{unhelpful}</span>
      </button>
    </div>
  );
};