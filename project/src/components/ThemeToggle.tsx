import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

export const ThemeToggle: React.FC = () => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-2 border border-gold/60 bg-charcoal text-gold hover:border-gold hover:bg-gold hover:text-obsidian transition-all font-mono text-xs shadow-gold-glow-sm flex items-center gap-1.5 font-bold uppercase tracking-widest"
      aria-label="Toggle edition theme"
      title="Toggle Night / Gold Edition"
    >
      {isDark ? (
        <>
          <Sun className="w-4 h-4 text-gold" />
          <span className="hidden sm:inline">GOLD EDITION</span>
        </>
      ) : (
        <>
          <Moon className="w-4 h-4 text-gold" />
          <span className="hidden sm:inline">OBSIDIAN EDITION</span>
        </>
      )}
    </button>
  );
};