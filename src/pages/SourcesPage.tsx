import React, { useState } from 'react';
import {
  Globe,
  Search,
  Filter,
  Plus,
  ShieldCheck,
  ShieldAlert,
  ExternalLink,
  ChevronRight,
  X,
  Award,
  Calendar,
  AlertTriangle,
  Building,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { SourceInfo, ReliabilityTier, SourceType } from '../types';

export const SourcesPage: React.FC = () => {
  const { sources, selectedSource, setSelectedSource, showToast } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedReliability, setSelectedReliability] = useState<string>('All');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', 'News', 'Academic', 'Gov/Org', 'Social', 'Blog'];
  const reliabilityOptions = ['All', 'High', 'Medium', 'Low', 'Questionable'];

  const filteredSources = sources.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.domain.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRel = selectedReliability === 'All' || s.reliability === selectedReliability;
    const matchesCat = selectedCategory === 'All' || s.type === selectedCategory;
    return matchesSearch && matchesRel && matchesCat;
  });

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
      {/* Header matching Screen 7 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 font-sans tracking-tight">
            Source Intelligence & Credibility
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Audit domain ownership, historical factual track record, and journalistic standard adherence.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-lg bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 shadow-2xs space-y-3">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search publisher name or domain (e.g. reuters.com, curehealthnews.xyz)..."
              className="w-full h-9 pl-9 pr-3 rounded-md bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-hidden"
            />
          </div>

          <div className="flex items-center gap-2 text-xs">
            <select
              value={selectedReliability}
              onChange={(e) => setSelectedReliability(e.target.value)}
              className="h-9 px-2.5 rounded-md bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 focus:outline-hidden"
            >
              {reliabilityOptions.map((r) => (
                <option key={r} value={r}>
                  Reliability: {r}
                </option>
              ))}
            </select>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="h-9 px-2.5 rounded-md bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 focus:outline-hidden"
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  Category: {c}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Quick View Pills */}
        <div className="flex items-center gap-2 pt-1 overflow-x-auto text-[11px]">
          <span className="font-semibold text-slate-400 shrink-0">Credibility Tier:</span>
          {reliabilityOptions.map((r) => (
            <button
              key={r}
              onClick={() => setSelectedReliability(r)}
              className={`px-2.5 py-1 rounded-full whitespace-nowrap transition-colors font-medium ${
                selectedReliability === r
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Sources Table matching Screen 7 */}
      <div className="rounded-lg bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/50 text-slate-400 text-[11px] font-semibold uppercase">
                <th className="py-3 px-4">Publisher / Source</th>
                <th className="py-3 px-3">Reliability Tier</th>
                <th className="py-3 px-3">Trust Score</th>
                <th className="py-3 px-3">Transparency</th>
                <th className="py-3 px-3">Category</th>
                <th className="py-3 px-3">Articles Analyzed</th>
                <th className="py-3 px-3">Domain Age</th>
                <th className="py-3 px-4 text-right">Dossier</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
              {filteredSources.map((src) => (
                <tr
                  key={src.id}
                  onClick={() => setSelectedSource(src)}
                  className="hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors"
                >
                  <td className="py-3 px-4">
                    <div className="font-semibold text-slate-800 dark:text-slate-200">{src.name}</div>
                    <div className="text-[11px] font-mono text-slate-400">{src.domain}</div>
                  </td>

                  <td className="py-3 px-3 whitespace-nowrap">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        src.reliability === 'High'
                          ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400'
                          : src.reliability === 'Medium'
                          ? 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400'
                          : 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-400'
                      }`}
                    >
                      {src.reliability}
                    </span>
                  </td>

                  <td className="py-3 px-3 font-mono font-bold text-slate-700 dark:text-slate-300">
                    <div className="flex items-center gap-2">
                      <span>{src.reliabilityScore}%</span>
                      <div className="w-12 h-1.5 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                        <div
                          style={{ width: `${src.reliabilityScore}%` }}
                          className={`h-full ${
                            src.reliabilityScore > 80
                              ? 'bg-emerald-500'
                              : src.reliabilityScore > 50
                              ? 'bg-amber-500'
                              : 'bg-rose-500'
                          }`}
                        />
                      </div>
                    </div>
                  </td>

                  <td className="py-3 px-3 text-slate-600 dark:text-slate-300 whitespace-nowrap">
                    {src.authorTransparency}
                  </td>

                  <td className="py-3 px-3 text-slate-500 dark:text-slate-400 whitespace-nowrap">
                    {src.type}
                  </td>

                  <td className="py-3 px-3 font-mono text-slate-600 dark:text-slate-300 whitespace-nowrap">
                    {src.articlesAnalyzed} articles
                  </td>

                  <td className="py-3 px-3 text-slate-400 text-[11px] whitespace-nowrap">
                    {src.domainAgeYears} yrs
                  </td>

                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedSource(src);
                      }}
                      className="text-blue-600 dark:text-blue-400 hover:text-blue-800 font-medium inline-flex items-center gap-1"
                    >
                      <span>Profile</span>
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Selected Source Detail Drawer / Modal */}
      {selectedSource && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/40 backdrop-blur-xs flex justify-end">
          <div
            className="w-full max-w-lg bg-white dark:bg-slate-900 h-full shadow-2xl border-l border-slate-200 dark:border-slate-800 flex flex-col p-5 space-y-5 animate-in slide-in-from-right duration-200 text-xs overflow-y-auto custom-scrollbar"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {selectedSource.name}
                </h3>
                <span className="font-mono text-slate-400 text-xs">{selectedSource.domain}</span>
              </div>
              <button
                onClick={() => setSelectedSource(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-md bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Trust Score</span>
                <div className="text-lg font-bold text-slate-800 dark:text-slate-100 mt-0.5">
                  {selectedSource.reliabilityScore}%
                </div>
              </div>

              <div className="p-3 rounded-md bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Reliability Tier</span>
                <div className="font-bold text-slate-800 dark:text-slate-100 mt-0.5">
                  {selectedSource.reliability}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Corporate Governance & Ownership
              </div>
              <div className="p-3 rounded-md bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300">
                {selectedSource.ownership || selectedSource.publisher}
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Journalistic Signals & Citation Transparency
              </div>
              <div className="p-3 rounded-md bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 leading-relaxed space-y-1">
                <div>Author transparency: <span className="font-semibold">{selectedSource.authorTransparency}</span></div>
                <div>Citation pattern: <span className="font-semibold">{selectedSource.citationBehavior}</span></div>
                <div>Articles scrutinized: <span className="font-semibold">{selectedSource.articlesAnalyzed}</span></div>
              </div>
            </div>

            <div className="pt-4 flex gap-2">
              <a
                href={`https://${selectedSource.domain}`}
                target="_blank"
                rel="noreferrer"
                className="flex-1 py-2 rounded-md bg-blue-600 hover:bg-blue-500 text-white font-semibold text-center flex items-center justify-center gap-1.5"
              >
                <span>Visit Domain</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <button
                onClick={() => {
                  showToast(`Domain ${selectedSource.domain} added to real-time watchlist`, 'success');
                  setSelectedSource(null);
                }}
                className="py-2 px-3 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium"
              >
                Add to Watchlist
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
