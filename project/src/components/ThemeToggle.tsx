import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

export const ThemeToggle: React.FC = () => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-2 border border-[#111111] bg-white text-[#111111] hover:bg-[#111111] hover:text-white transition-all font-mono text-xs hard-shadow-sm flex items-center gap-1.5 font-bold uppercase"
      aria-label="Toggle edition theme"
      title="Toggle Night Edition"
    >
      {isDark ? (
        <>
          <Sun className="w-4 h-4 text-yellow-400" />
          <span className="hidden sm:inline">DAY EDITION</span>
        </>
      ) : (
        <>
          <Moon className="w-4 h-4 text-[#111111]" />
          <span className="hidden sm:inline">NIGHT EDITION</span>
        </>
      )}
    </button>
  );
};