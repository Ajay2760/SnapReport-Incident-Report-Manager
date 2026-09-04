import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

export const ThemeToggle: React.FC = () => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="app-btn-ghost px-3 py-2 text-[13px] flex items-center gap-2"
      aria-label="Toggle Light or Dark Theme"
      title="Switch Theme"
    >
      {isDark ? (
        <>
          <Sun className="w-4 h-4 text-amber-alert" />
          <span className="hidden sm:inline">Light</span>
        </>
      ) : (
        <>
          <Moon className="w-4 h-4 text-deep-indigo" />
          <span className="hidden sm:inline">Dark</span>
        </>
      )}
    </button>
  );
};