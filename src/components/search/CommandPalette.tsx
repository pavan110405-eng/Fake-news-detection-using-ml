import React, { useState, useEffect } from 'react';
import {
  Search,
  CheckSquare,
  Globe,
  Briefcase,
  BookOpen,
  FileText,
  X,
  ArrowRight,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const CommandPalette: React.FC = () => {
  const {
    isSearchOpen,
    setIsSearchOpen,
    claims,
    sources,
    investigations,
    evidence,
    reports,
    navigateTo,
    setSelectedClaim,
    setSelectedInvestigation,
    setSelectedSource,
  } = useApp();

  const [query, setQuery] = useState('');

  useEffect(() => {
    if (!isSearchOpen) {
      setQuery('');
    }
  }, [isSearchOpen]);

  if (!isSearchOpen) return null;

  const q = query.toLowerCase().trim();

  const matchedClaims = claims.filter(
    (c) => c.originalText.toLowerCase().includes(q) || c.topic.toLowerCase().includes(q)
  );
  const matchedSources = sources.filter(
    (s) => s.name.toLowerCase().includes(q) || s.domain.toLowerCase().includes(q)
  );
  const matchedInvestigations = investigations.filter(
    (i) => i.name.toLowerCase().includes(q) || i.topic.toLowerCase().includes(q)
  );
  const matchedEvidence = evidence.filter(
    (e) => e.source.toLowerCase().includes(q) || e.excerpt.toLowerCase().includes(q)
  );
  const matchedReports = reports.filter(
    (r) => r.title.toLowerCase().includes(q) || r.type.toLowerCase().includes(q)
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-slate-900/60 backdrop-blur-xs">
      <div
        className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-4 border-b border-slate-200 dark:border-slate-800">
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search claims, articles, sources, investigations..."
            className="w-full h-13 px-3 bg-transparent text-slate-900 dark:text-slate-100 placeholder-slate-400 text-sm focus:outline-hidden"
            autoFocus
          />
          <button
            onClick={() => setIsSearchOpen(false)}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-md"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results Body */}
        <div className="max-h-96 overflow-y-auto p-3 space-y-4 custom-scrollbar text-xs">
          {query.length === 0 ? (
            <div className="py-8 text-center text-slate-400">
              <p className="font-medium text-slate-600 dark:text-slate-300">Quick Navigation</p>
              <p className="text-xs text-slate-400 mt-1">
                Type keywords like "climate", "cure", "reuters", "investigation", or press navigation keys.
              </p>
            </div>
          ) : (
            <>
              {/* Claims */}
              {matchedClaims.length > 0 && (
                <div>
                  <div className="px-2 py-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <CheckSquare className="w-3.5 h-3.5" />
                    Claims ({matchedClaims.length})
                  </div>
                  <div className="space-y-1 mt-1">
                    {matchedClaims.slice(0, 3).map((c) => (
                      <button
                        key={c.id}
                        onClick={() => {
                          navigateTo('analyze');
                          setIsSearchOpen(false);
                        }}
                        className="w-full text-left p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-between group transition-colors"
                      >
                        <div className="min-w-0 pr-2">
                          <div className="font-medium text-slate-800 dark:text-slate-200 truncate">
                            {c.originalText}
                          </div>
                          <div className="text-[11px] text-slate-400">
                            {c.topic} • Status: <span className="font-medium">{c.status}</span> ({c.confidence}%)
                          </div>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Investigations */}
              {matchedInvestigations.length > 0 && (
                <div>
                  <div className="px-2 py-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Briefcase className="w-3.5 h-3.5" />
                    Investigations ({matchedInvestigations.length})
                  </div>
                  <div className="space-y-1 mt-1">
                    {matchedInvestigations.slice(0, 3).map((inv) => (
                      <button
                        key={inv.id}
                        onClick={() => {
                          navigateTo('analyze');
                          setIsSearchOpen(false);
                        }}
                        className="w-full text-left p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-between group transition-colors"
                      >
                        <div className="min-w-0 pr-2">
                          <div className="font-medium text-slate-800 dark:text-slate-200 truncate">
                            {inv.name}
                          </div>
                          <div className="text-[11px] text-slate-400">
                            Topic: {inv.topic} • Status: {inv.status}
                          </div>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Sources */}
              {matchedSources.length > 0 && (
                <div>
                  <div className="px-2 py-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5" />
                    Sources ({matchedSources.length})
                  </div>
                  <div className="space-y-1 mt-1">
                    {matchedSources.slice(0, 3).map((src) => (
                      <button
                        key={src.id}
                        onClick={() => {
                          navigateTo('analyze');
                          setIsSearchOpen(false);
                        }}
                        className="w-full text-left p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-between group transition-colors"
                      >
                        <div className="min-w-0 pr-2">
                          <div className="font-medium text-slate-800 dark:text-slate-200 truncate">
                            {src.name} ({src.domain})
                          </div>
                          <div className="text-[11px] text-slate-400">
                            Reliability: {src.reliability} ({src.reliabilityScore}%)
                          </div>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Evidence */}
              {matchedEvidence.length > 0 && (
                <div>
                  <div className="px-2 py-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5" />
                    Evidence Excerpts ({matchedEvidence.length})
                  </div>
                  <div className="space-y-1 mt-1">
                    {matchedEvidence.slice(0, 2).map((evi) => (
                      <button
                        key={evi.id}
                        onClick={() => {
                          navigateTo('analyze');
                          setIsSearchOpen(false);
                        }}
                        className="w-full text-left p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-between group transition-colors"
                      >
                        <div className="min-w-0 pr-2">
                          <div className="font-medium text-slate-800 dark:text-slate-200 truncate">
                            {evi.source}: {evi.excerpt.slice(0, 75)}...
                          </div>
                          <div className="text-[11px] text-slate-400">
                            Rel: {evi.relationship} • Score: {evi.reliabilityScore}%
                          </div>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Reports */}
              {matchedReports.length > 0 && (
                <div>
                  <div className="px-2 py-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5" />
                    Reports ({matchedReports.length})
                  </div>
                  <div className="space-y-1 mt-1">
                    {matchedReports.slice(0, 2).map((rep) => (
                      <button
                        key={rep.id}
                        onClick={() => {
                          navigateTo('history');
                          setIsSearchOpen(false);
                        }}
                        className="w-full text-left p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-between group transition-colors"
                      >
                        <div className="min-w-0 pr-2">
                          <div className="font-medium text-slate-800 dark:text-slate-200 truncate">
                            {rep.title}
                          </div>
                          <div className="text-[11px] text-slate-400">
                            {rep.type} • {rep.created}
                          </div>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {matchedClaims.length === 0 &&
                matchedSources.length === 0 &&
                matchedInvestigations.length === 0 &&
                matchedEvidence.length === 0 &&
                matchedReports.length === 0 && (
                  <div className="py-8 text-center text-slate-400">
                    No matching records found for "{query}".
                  </div>
                )}
            </>
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
          <span>Navigate with mouse or click item to open drawer</span>
          <span>ESC to close</span>
        </div>
      </div>
    </div>
  );
};
