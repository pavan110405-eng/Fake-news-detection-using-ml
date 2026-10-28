import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Sidebar } from './Sidebar';
import { TopHeader } from './TopHeader';
import { CommandPalette } from '../search/CommandPalette';

// Core Pages
import { AnalyzePage } from '../../pages/AnalyzePage';
import { AnalysisResultPage } from '../../pages/AnalysisResultPage';
import { HistoryPage } from '../../pages/HistoryPage';
import { SettingsPage } from '../../pages/SettingsPage';
import { TestingDataPage } from '../../pages/TestingDataPage';

export const AppLayout: React.FC = () => {
  const { currentPage } = useApp();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const renderPage = () => {
    switch (currentPage) {
      case 'overview':
      case 'analyze':
        return <AnalyzePage />;
      case 'datasets':
        return <TestingDataPage />;
      case 'result':
        return <AnalysisResultPage />;
      case 'history':
        return <HistoryPage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <AnalyzePage />;
    }
  };

  return (
    <div className="h-screen w-screen flex overflow-hidden bg-[#f8fafc] dark:bg-[#070b13] text-slate-900 dark:text-slate-100 font-sans antialiased transition-colors duration-150">
      {/* Persistent Dark Sidebar */}
      <Sidebar
        isMobileOpen={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
      />

      {/* Main Workspace Column: TopHeader + Main Content */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        <TopHeader onToggleMobileMenu={() => setIsMobileMenuOpen((prev) => !prev)} />
        <main className="flex-1 overflow-y-auto custom-scrollbar bg-slate-50/70 dark:bg-[#070b13] min-w-0 relative">
          {/* Subtle ambient cyber glow in dark mode */}
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-600/5 dark:bg-blue-500/10 rounded-full blur-3xl pointer-events-none -z-0" />
          <div className="relative z-10 transition-opacity duration-150">
            {renderPage()}
          </div>
        </main>
      </div>

      {/* Global Command Palette (Ctrl+K) */}
      <CommandPalette />
    </div>
  );
};
