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
        className={`flex items-center gap-1.5 px-3 py-1 border transition-all ${
          userRating === 'helpful'
            ? 'bg-gold text-obsidian border-gold font-bold shadow-gold-glow-sm'
            : 'border-gold/50 bg-obsidian text-gold hover:border-gold hover:bg-gold/10'
        }`}
        title="Mark Solution as Helpful"
      >
        <ThumbsUp className="w-3.5 h-3.5" />
        <span className="font-bold">{helpful}</span>
      </button>
      
      <button
        onClick={() => onRate('unhelpful')}
        className={`flex items-center gap-1.5 px-3 py-1 border transition-all ${
          userRating === 'unhelpful'
            ? 'bg-midnight text-champagne border-gold font-bold'
            : 'border-gold/50 bg-obsidian text-pewter hover:border-gold hover:text-champagne'
        }`}
        title="Mark Solution as Unhelpful"
      >
        <ThumbsDown className="w-3.5 h-3.5" />
        <span className="font-bold">{unhelpful}</span>
      </button>
    </div>
  );
};