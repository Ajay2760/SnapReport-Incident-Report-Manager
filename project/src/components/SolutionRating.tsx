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
    <div className="flex items-center gap-2 font-mono text-xs">
      <button
        onClick={() => onRate('helpful')}
        className={`flex items-center gap-1.5 px-2.5 py-1 border transition-all ${
          userRating === 'helpful'
            ? 'bg-[#111111] text-white border-[#111111]'
            : 'border-[#111111] bg-white text-[#111111] hover:bg-neutral-100'
        }`}
        title="Mark Solution as Helpful"
      >
        <ThumbsUp className="w-3.5 h-3.5" />
        <span className="font-bold">{helpful}</span>
      </button>
      
      <button
        onClick={() => onRate('unhelpful')}
        className={`flex items-center gap-1.5 px-2.5 py-1 border transition-all ${
          userRating === 'unhelpful'
            ? 'bg-[#CC0000] text-white border-[#CC0000]'
            : 'border-[#111111] bg-white text-[#111111] hover:bg-neutral-100'
        }`}
        title="Mark Solution as Unhelpful"
      >
        <ThumbsDown className="w-3.5 h-3.5" />
        <span className="font-bold">{unhelpful}</span>
      </button>
    </div>
  );
};