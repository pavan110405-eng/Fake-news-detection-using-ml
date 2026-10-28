import React from 'react';
import {
  Search,
  Clock,
  Settings,
  ShieldCheck,
  Cpu,
  Database,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PageId } from '../../types';

interface SidebarProps {
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isMobileOpen, onCloseMobile }) => {
  const { currentPage, navigateTo } = useApp();

  const mainNavItems: { id: PageId; label: string; icon: React.ElementType; badge?: string }[] = [
    { id: 'analyze', label: 'Detector & Verifier', icon: Search },
    { id: 'datasets', label: 'Testing Data & Benchmark', icon: Database, badge: 'Tests' },
    { id: 'history', label: 'Verification History', icon: Clock },
  ];

  const handleNavClick = (id: PageId) => {
    navigateTo(id);
    if (onCloseMobile) onCloseMobile();
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      <aside
        id="truthlens-sidebar"
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-[#0c121e] text-slate-300 flex flex-col border-r border-slate-800/80 transition-transform duration-200 ease-in-out lg:static lg:z-auto lg:translate-x-0 lg:shrink-0 h-full ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="h-14 flex items-center px-4 border-b border-slate-800/80 bg-[#090d16] select-none justify-between shrink-0">
          <button
            onClick={() => handleNavClick('analyze')}
            className="flex items-center gap-2.5 text-left group cursor-pointer"
            title="TruthLens Platform"
          >
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:bg-blue-500 transition-colors">
              <ShieldCheck className="w-4 h-4 stroke-[2.5]" />
            </div>
            <div>
              <div className="font-bold text-base tracking-wide text-white flex items-center gap-1.5 font-sans">
                TRUTHLENS
                <span className="text-[10px] uppercase font-semibold tracking-wider px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30">
                  PAC
                </span>
              </div>
            </div>
          </button>
        </div>

        {/* Navigation scrollable */}
        <div className="flex-1 overflow-y-auto px-2.5 py-4 space-y-4 text-[13px] font-medium custom-scrollbar">
          <div>
            <div className="px-2.5 mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Core Platform
            </div>
            <nav className="space-y-1">
              {mainNavItems.map((item) => {
                const Icon = item.icon;
                const isActive =
                  currentPage === item.id || (item.id === 'analyze' && currentPage === 'result');
                return (
                  <button
                    key={item.id}
                    id={`nav-${item.id}`}
                    onClick={() => handleNavClick(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors text-left group relative cursor-pointer ${
                      isActive
                        ? 'text-white font-semibold'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                    }`}
                  >
                    {isActive && (
                      <span
                        className="absolute inset-0 bg-blue-600 rounded-lg shadow-sm shadow-blue-600/30 transition-all duration-150"
                      />
                    )}

                    <div className="flex items-center gap-3 min-w-0 relative z-10 flex-1">
                      <Icon
                        className={`w-4 h-4 shrink-0 transition-colors ${
                          isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'
                        }`}
                      />
                      <span className="truncate">{item.label}</span>
                    </div>

                    {item.badge && (
                      <span
                        className={`relative z-10 text-[10px] font-bold px-1.5 py-0.5 rounded tracking-wider uppercase ${
                          isActive
                            ? 'bg-white/20 text-white'
                            : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Bottom Panel */}
        <div className="p-3 border-t border-slate-800/80 bg-[#090d16]/95 space-y-2 shrink-0">
          <button
            onClick={() => handleNavClick('settings')}
            className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
              currentPage === 'settings'
                ? 'bg-blue-600 text-white font-semibold'
                : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Settings className="w-4 h-4 text-slate-400" />
              <span>Platform Settings</span>
            </div>
          </button>

          {/* Model Engine Status Card */}
          <div className="pt-2 border-t border-slate-800/60 flex items-center gap-2.5 px-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Cpu className="w-3.5 h-3.5" />
            </div>
            <div className="min-w-0">
              <div className="text-[11px] font-semibold text-slate-200 truncate">
                PA-II SOTA Classifier
              </div>
              <div className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>98.7% Accuracy</span>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
