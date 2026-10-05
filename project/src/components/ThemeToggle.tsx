import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

export const ThemeToggle: React.FC = () => {
  const { isDark, toggleTheme } = useTheme();
  return (
    <button
      onClick={toggleTheme}
      className="btn btn-ghost !min-h-[40px] !gap-2 !px-3.5 text-[13px]"
      aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      title="Switch theme"
    >
      <span className="relative flex h-4 w-4 items-center justify-center">
        {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
      </span>
      <span className="hidden font-bold lg:inline">{isDark ? 'Light' : 'Dark'}</span>
    </button>
  );
};
