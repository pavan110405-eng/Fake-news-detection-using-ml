import React from 'react';
import {
  Search,
  Sun,
  Moon,
  Menu,
  ShieldCheck,
  Plus,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface TopHeaderProps {
  onToggleMobileMenu: () => void;
}

export const TopHeader: React.FC<TopHeaderProps> = ({ onToggleMobileMenu }) => {
  const {
    setIsSearchOpen,
    theme,
    toggleTheme,
    navigateTo,
  } = useApp();

  return (
    <header
      id="truthlens-topheader"
      className="h-14 w-full shrink-0 bg-white/90 dark:bg-[#0c121e]/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800/80 px-4 flex items-center justify-between z-30 transition-colors"
    >
      {/* Left: Hamburger (mobile) + Global Search */}
      <div className="flex items-center gap-3 flex-1 max-w-xl">
        <button
          onClick={onToggleMobileMenu}
          className="p-1.5 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md lg:hidden cursor-pointer"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Global Search Bar */}
        <button
          onClick={() => setIsSearchOpen(true)}
          className="w-full max-w-md h-9 px-3 rounded-lg bg-slate-100/90 dark:bg-slate-800/70 hover:bg-slate-200/80 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 text-xs flex items-center justify-between border border-transparent hover:border-slate-300 dark:hover:border-slate-700 transition-all text-left shadow-2xs group cursor-pointer"
        >
          <div className="flex items-center gap-2 truncate">
            <Search className="w-3.5 h-3.5 shrink-0 text-slate-400 group-hover:text-blue-500 transition-colors" />
            <span className="truncate">Search verified claims, articles, documents...</span>
          </div>
          <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-mono font-medium rounded bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700 shadow-2xs">
            Ctrl + K
          </kbd>
        </button>
      </div>

      {/* Right Section: SOTA PAC Engine Badge, New Verification CTA, Theme Toggle */}
      <div className="flex items-center gap-2 sm:gap-3 text-xs">
        {/* Real-time PAC Engine Status */}
        <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-emerald-700 dark:text-emerald-400 text-[11px] font-medium font-mono">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>PA-II Model Active (&lt;4ms)</span>
        </div>

        {/* Quick New Verification CTA */}
        <button
          onClick={() => navigateTo('analyze')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-sm transition-colors cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Verification</span>
        </button>

        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          className="p-2 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
          aria-label="Toggle dark/light theme"
        >
          {theme === 'dark' ? (
            <Sun className="w-4 h-4 text-amber-400" />
          ) : (
            <Moon className="w-4 h-4 text-slate-600" />
          )}
        </button>
      </div>
    </header>
  );
};
