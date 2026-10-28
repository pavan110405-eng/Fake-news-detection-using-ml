import React, { useState } from 'react';
import {
  BookOpen,
  Search,
  Filter,
  Plus,
  CheckCircle2,
  XCircle,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  RefreshCw,
  Sparkles,
  ArrowRight,
  SlidersHorizontal,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { EvidenceItem, SourceType } from '../types';

export const EvidencePage: React.FC = () => {
  const { evidence, addEvidence, claims, showToast } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRelationship, setSelectedRelationship] = useState<string>('All');
  const [selectedSourceType, setSelectedSourceType] = useState<string>('All');
  const [viewMode, setViewMode] = useState<'comparison' | 'library'>('comparison');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New Evidence form
  const [newSource, setNewSource] = useState('');
  const [newExcerpt, setNewExcerpt] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [newRel, setNewRel] = useState<'Supporting' | 'Contradicting' | 'Context' | 'Unverified'>('Contradicting');
  const [newType, setNewType] = useState<SourceType>('Gov/Org');
  const [newScore, setNewScore] = useState(90);

  const relationships = ['All', 'Supporting', 'Contradicting', 'Context', 'Unverified'];
  const sourceTypes = ['All', 'Academic', 'Gov/Org', 'News', 'Social', 'Blog'];

  const filteredEvidence = evidence.filter((e) => {
    const matchesSearch =
      e.source.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (e.claimSnippet && e.claimSnippet.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesRel = selectedRelationship === 'All' || e.relationship === selectedRelationship;
    const matchesType = selectedSourceType === 'All' || e.sourceType === selectedSourceType;
    return matchesSearch && matchesRel && matchesType;
  });

  const handleAddEvidence = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSource.trim() || !newExcerpt.trim()) return;

    const created: EvidenceItem = {
      id: `evi-${Date.now().toString().slice(-4)}`,
      claimId: claims[0]?.id || 'clm-001',
      claimSnippet: claims[0]?.originalText || 'Extracted claim',
      source: newSource,
      sourceType: newType,
      sourceUrl: newUrl || 'https://verified-source.org/report',
      reliabilityScore: newScore,
      relationship: newRel,
      excerpt: newExcerpt,
      publicationDate: 'Sep 2026',
      analystNote: 'Manual evidence item submitted by intelligence analyst.',
    };

    addEvidence(created);
    setNewSource('');
    setNewExcerpt('');
    setNewUrl('');
    setIsAddModalOpen(false);
    showToast('Evidence documented in cross-reference registry', 'success');
  };

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
      {/* Header matching Screen 6 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 font-sans tracking-tight">
            Evidence Verification & Retrieval
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Cross-reference claims with primary databases, institutional papers, and verified fact archives.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="bg-slate-100 dark:bg-slate-800 p-0.5 rounded-md flex text-xs">
            <button
              onClick={() => setViewMode('comparison')}
              className={`px-3 py-1.5 rounded font-medium transition-colors ${
                viewMode === 'comparison'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-2xs'
                  : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              Comparison View
            </button>
            <button
              onClick={() => setViewMode('library')}
              className={`px-3 py-1.5 rounded font-medium transition-colors ${
                viewMode === 'library'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-2xs'
                  : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              Registry Table
            </button>
          </div>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-3.5 py-2 rounded-md bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Evidence</span>
          </button>
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
              placeholder="Search evidence excerpts, publication titles, or claim keywords..."
              className="w-full h-9 pl-9 pr-3 rounded-md bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-hidden"
            />
          </div>

          <div className="flex items-center gap-2 text-xs">
            <select
              value={selectedRelationship}
              onChange={(e) => setSelectedRelationship(e.target.value)}
              className="h-9 px-2.5 rounded-md bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 focus:outline-hidden"
            >
              {relationships.map((rel) => (
                <option key={rel} value={rel}>
                  Relationship: {rel}
                </option>
              ))}
            </select>

            <select
              value={selectedSourceType}
              onChange={(e) => setSelectedSourceType(e.target.value)}
              className="h-9 px-2.5 rounded-md bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 focus:outline-hidden"
            >
              {sourceTypes.map((type) => (
                <option key={type} value={type}>
                  Source Type: {type}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Quick Relationship Pills */}
        <div className="flex items-center gap-2 pt-1 overflow-x-auto text-[11px]">
          <span className="font-semibold text-slate-400 shrink-0">Filter by Relationship:</span>
          {relationships.map((rel) => (
            <button
              key={rel}
              onClick={() => setSelectedRelationship(rel)}
              className={`px-2.5 py-1 rounded-full whitespace-nowrap transition-colors font-medium ${
                selectedRelationship === rel
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {rel}
            </button>
          ))}
        </div>
      </div>

      {/* View Mode: Comparison (Screen 6 style) */}
      {viewMode === 'comparison' ? (
        <div className="space-y-4">
          {filteredEvidence.map((item) => (
            <div
              key={item.id}
              className="p-5 rounded-lg bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 shadow-2xs space-y-4"
            >
              {/* Header row with Relationship & Reliability */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800/80">
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2.5 py-1 rounded text-xs font-bold flex items-center gap-1.5 ${
                      item.relationship === 'Supporting'
                        ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400'
                        : item.relationship === 'Contradicting'
                        ? 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-400'
                        : 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400'
                    }`}
                  >
                    {item.relationship === 'Supporting' ? (
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    ) : item.relationship === 'Contradicting' ? (
                      <XCircle className="w-3.5 h-3.5" />
                    ) : (
                      <Sparkles className="w-3.5 h-3.5" />
                    )}
                    <span>{item.relationship} Evidence</span>
                  </span>

                  <span className="text-xs text-slate-400 font-mono">ID: {item.id}</span>
                </div>

                <div className="flex items-center gap-3 text-xs">
                  <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                    <ShieldCheck className="w-4 h-4 text-emerald-500" />
                    <span>Reliability Score:</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">
                      {item.reliabilityScore}%
                    </span>
                  </div>

                  <a
                    href={item.sourceUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                  >
                    <span>Inspect Source</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>

              {/* Side-by-side Comparison Grid matching Screen 6 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Left: Original Target Claim */}
                <div className="p-3.5 rounded-md bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-1.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Associated Claim Proposition
                  </span>
                  <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 leading-relaxed">
                    "{item.claimSnippet}"
                  </p>
                </div>

                {/* Right: Retrieved Evidence Excerpt */}
                <div className="p-3.5 rounded-md bg-blue-50/40 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/40 space-y-1.5">
                  <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    <span>{item.source} ({item.sourceType})</span>
                    <span>{item.publicationDate}</span>
                  </div>
                  <p className="text-xs italic text-slate-700 dark:text-slate-300 leading-relaxed">
                    "{item.excerpt}"
                  </p>
                </div>
              </div>

              {/* Analyst Note */}
              {item.analystNote && (
                <div className="text-xs text-slate-500 dark:text-slate-400 pt-1 flex items-start gap-2">
                  <span className="font-semibold text-slate-700 dark:text-slate-300 shrink-0">
                    Verification Note:
                  </span>
                  <span>{item.analystNote}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        /* View Mode: Table Registry */
        <div className="rounded-lg bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/50 text-slate-400 text-[11px] font-semibold uppercase">
                  <th className="py-3 px-4">Source Organization</th>
                  <th className="py-3 px-3">Type</th>
                  <th className="py-3 px-3">Relationship</th>
                  <th className="py-3 px-3">Reliability</th>
                  <th className="py-3 px-4">Excerpt / Findings</th>
                  <th className="py-3 px-3">Date</th>
                  <th className="py-3 px-4 text-right">Link</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                {filteredEvidence.map((e) => (
                  <tr key={e.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td className="py-3 px-4 font-semibold text-slate-800 dark:text-slate-200">
                      {e.source}
                    </td>
                    <td className="py-3 px-3 text-slate-500 dark:text-slate-400">{e.sourceType}</td>
                    <td className="py-3 px-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          e.relationship === 'Supporting'
                            ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400'
                            : e.relationship === 'Contradicting'
                            ? 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-400'
                            : 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400'
                        }`}
                      >
                        {e.relationship}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-mono font-bold text-slate-700 dark:text-slate-300">
                      {e.reliabilityScore}%
                    </td>
                    <td className="py-3 px-4 text-slate-600 dark:text-slate-300 max-w-sm truncate">
                      "{e.excerpt}"
                    </td>
                    <td className="py-3 px-3 text-slate-400">{e.publicationDate}</td>
                    <td className="py-3 px-4 text-right">
                      <a
                        href={e.sourceUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        Source ↗
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Evidence Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 p-5 space-y-4">
            <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm">
              Link New Evidence Source
            </h3>
            <form onSubmit={handleAddEvidence} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 dark:text-slate-400 mb-1">Source Name / Organization</label>
                <input
                  type="text"
                  value={newSource}
                  onChange={(e) => setNewSource(e.target.value)}
                  placeholder="e.g. World Health Organization, Reuters, Nature Journal"
                  className="w-full h-8 px-2.5 rounded-md bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs focus:outline-hidden"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-400 mb-1">Source URL</label>
                <input
                  type="url"
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full h-8 px-2.5 rounded-md bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 mb-1">Relationship</label>
                  <select
                    value={newRel}
                    onChange={(e) => setNewRel(e.target.value as any)}
                    className="w-full h-8 px-2 rounded-md bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs"
                  >
                    <option value="Supporting">Supporting</option>
                    <option value="Contradicting">Contradicting</option>
                    <option value="Context">Context</option>
                    <option value="Insufficient">Insufficient</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-600 dark:text-slate-400 mb-1">Source Type</label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as any)}
                    className="w-full h-8 px-2 rounded-md bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs"
                  >
                    <option value="Official Registry">Official Registry</option>
                    <option value="Academic Journal">Academic Journal</option>
                    <option value="Verified News">Verified News</option>
                    <option value="Government Archive">Government Archive</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-400 mb-1">
                  Reliability Score ({newScore}%)
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={newScore}
                  onChange={(e) => setNewScore(parseInt(e.target.value))}
                  className="w-full accent-blue-600"
                />
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-400 mb-1">Evidence Excerpt / Key Findings</label>
                <textarea
                  rows={3}
                  value={newExcerpt}
                  onChange={(e) => setNewExcerpt(e.target.value)}
                  placeholder="Direct citation or factual finding..."
                  className="w-full p-2.5 rounded-md bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs focus:outline-hidden"
                  required
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-3 py-1.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-1.5 rounded-md bg-blue-600 text-white font-semibold"
                >
                  Document Evidence
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
