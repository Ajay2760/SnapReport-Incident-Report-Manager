import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

export const ThemeToggle: React.FC = () => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:border-indigo-500 dark:hover:border-indigo-400 transition-all font-sans text-xs font-semibold flex items-center gap-2 shadow-sm active:scale-95"
      aria-label="Toggle Light or Dark Theme"
      title="Switch Theme"
    >
      {isDark ? (
        <>
          <Sun className="w-4 h-4 text-amber-400 fill-amber-400 animate-spin-slow" />
          <span className="hidden sm:inline">LIGHT MODE</span>
        </>
      ) : (
        <>
          <Moon className="w-4 h-4 text-indigo-600 fill-indigo-600" />
          <span className="hidden sm:inline">DARK MODE</span>
        </>
      )}
    </button>
  );
};