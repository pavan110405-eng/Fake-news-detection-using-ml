import React, { useState } from 'react';
import {
  Search,
  Filter,
  Plus,
  CheckSquare,
  AlertTriangle,
  ChevronRight,
  Download,
  Tag,
  ArrowUpDown,
  ExternalLink,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Claim, ClaimStatus, RiskLevel } from '../types';
import { ClaimDrawer } from '../components/claims/ClaimDrawer';

export const ClaimsPage: React.FC = () => {
  const { claims, selectedClaim, setSelectedClaim, addClaim, showToast } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [selectedTopic, setSelectedTopic] = useState<string>('All');
  const [selectedRisk, setSelectedRisk] = useState<string>('All');
  const [minConfidence, setMinConfidence] = useState<number>(0);
  const [isNewClaimModalOpen, setIsNewClaimModalOpen] = useState(false);

  // New claim form state
  const [newText, setNewText] = useState('');
  const [newTopic, setNewTopic] = useState('Public Health');
  const [newStatus, setNewStatus] = useState<ClaimStatus>('Unverified');
  const [newSource, setNewSource] = useState('Online Post');

  const topics = ['All', 'Health & Medicine', 'Climate & Policy', 'Politics', 'Technology', 'Public Health', 'Environment'];
  const statuses = ['All', 'Supported', 'False', 'Misleading', 'Unverified', 'Opinion', 'Satire'];
  const risks = ['All', 'Critical', 'High', 'Medium', 'Low'];

  const filteredClaims = claims.filter((c) => {
    const matchesSearch =
      c.originalText.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.normalizedClaim.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.topic.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatus === 'All' || c.status === selectedStatus;
    const matchesTopic = selectedTopic === 'All' || c.topic === selectedTopic;
    const matchesRisk = selectedRisk === 'All' || c.risk === selectedRisk;
    const matchesConfidence = c.confidence >= minConfidence;
    return matchesSearch && matchesStatus && matchesTopic && matchesRisk && matchesConfidence;
  });

  const handleCreateNewClaim = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newText.trim()) return;

    const created: Claim = {
      id: `clm-${Date.now().toString().slice(-4)}`,
      originalText: newText,
      normalizedClaim: newText,
      status: newStatus,
      confidence: 75,
      evidenceCount: 0,
      source: newSource,
      sourceType: 'News',
      firstSeen: 'Just now',
      lastUpdated: 'Just now',
      topic: newTopic,
      entities: ['Proposition'],
      locations: [],
      dates: ['2026'],
      contradictions: [],
      relatedClaimIds: [],
      risk: 'Medium',
      socialActivityVelocity: 'Moderate',
    };

    addClaim(created);
    setNewText('');
    setIsNewClaimModalOpen(false);
    showToast('New claim registered in truth database', 'success');
  };

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
      {/* Header matching Screen 5 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 font-sans tracking-tight">
            Claims Database
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Indexed atomic claims extracted from articles, transcripts, and social media signals.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsNewClaimModalOpen(true)}
            className="px-3.5 py-2 rounded-md bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Claim</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar matching Screen 5 */}
      <div className="p-4 rounded-lg bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 shadow-2xs space-y-3">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Search Field */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search propositions, statements, or entities..."
              className="w-full h-9 pl-9 pr-3 rounded-md bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-hidden focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* Quick Filter Dropdowns */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="h-9 px-2.5 rounded-md bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 focus:outline-hidden"
            >
              {statuses.map((st) => (
                <option key={st} value={st}>
                  Status: {st}
                </option>
              ))}
            </select>

            <select
              value={selectedTopic}
              onChange={(e) => setSelectedTopic(e.target.value)}
              className="h-9 px-2.5 rounded-md bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 focus:outline-hidden"
            >
              {topics.map((t) => (
                <option key={t} value={t}>
                  Topic: {t}
                </option>
              ))}
            </select>

            <select
              value={selectedRisk}
              onChange={(e) => setSelectedRisk(e.target.value)}
              className="h-9 px-2.5 rounded-md bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 focus:outline-hidden"
            >
              {risks.map((r) => (
                <option key={r} value={r}>
                  Risk: {r}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Status Pills */}
        <div className="flex items-center gap-2 pt-1 overflow-x-auto text-[11px]">
          <span className="font-semibold text-slate-400 shrink-0">Quick View:</span>
          {statuses.map((s) => (
            <button
              key={s}
              onClick={() => setSelectedStatus(s)}
              className={`px-2.5 py-1 rounded-full whitespace-nowrap transition-colors font-medium ${
                selectedStatus === s
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Claims Table matching Screen 5 */}
      <div className="rounded-lg bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/50 text-slate-400 text-[11px] font-semibold uppercase tracking-wider">
                <th className="py-3 px-4">Claim Proposition</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3">Confidence</th>
                <th className="py-3 px-3">Evidence</th>
                <th className="py-3 px-3">Topic</th>
                <th className="py-3 px-3">Source</th>
                <th className="py-3 px-3">First Seen</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
              {filteredClaims.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400 text-xs">
                    No claims matched your filter criteria.
                  </td>
                </tr>
              ) : (
                filteredClaims.map((claim) => (
                  <tr
                    key={claim.id}
                    onClick={() => setSelectedClaim(claim)}
                    className="hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors"
                  >
                    <td className="py-3 px-4 font-medium text-slate-800 dark:text-slate-200 max-w-xs sm:max-w-md truncate">
                      {claim.originalText}
                    </td>

                    <td className="py-3 px-3 whitespace-nowrap">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          claim.status === 'Supported'
                            ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400'
                            : claim.status === 'False'
                            ? 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-400'
                            : claim.status === 'Misleading'
                            ? 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400'
                            : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        {claim.status}
                      </span>
                    </td>

                    <td className="py-3 px-3 font-mono font-medium text-slate-700 dark:text-slate-300">
                      {claim.confidence}%
                    </td>

                    <td className="py-3 px-3 text-slate-500 dark:text-slate-400 whitespace-nowrap">
                      {claim.evidenceCount} sources
                    </td>

                    <td className="py-3 px-3 text-slate-600 dark:text-slate-300 whitespace-nowrap">
                      {claim.topic}
                    </td>

                    <td className="py-3 px-3 text-slate-500 dark:text-slate-400 whitespace-nowrap">
                      {claim.source}
                    </td>

                    <td className="py-3 px-3 text-slate-400 text-[11px] whitespace-nowrap">
                      {claim.firstSeen}
                    </td>

                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedClaim(claim);
                        }}
                        className="text-blue-600 dark:text-blue-400 hover:text-blue-800 font-medium inline-flex items-center gap-1"
                      >
                        <span>Inspect</span>
                        <ChevronRight className="w-3 h-3" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Claim Detail Drawer matching Screen 5 */}
      <ClaimDrawer claim={selectedClaim} onClose={() => setSelectedClaim(null)} />

      {/* New Claim Modal */}
      {isNewClaimModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 p-5 space-y-4">
            <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm">
              Register New Factual Claim
            </h3>
            <form onSubmit={handleCreateNewClaim} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 dark:text-slate-400 mb-1">Claim Statement</label>
                <textarea
                  rows={3}
                  value={newText}
                  onChange={(e) => setNewText(e.target.value)}
                  placeholder="Enter verifiable factual statement..."
                  className="w-full p-2.5 rounded-md bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs focus:outline-hidden"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 mb-1">Topic</label>
                  <select
                    value={newTopic}
                    onChange={(e) => setNewTopic(e.target.value)}
                    className="w-full h-8 px-2 rounded-md bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs"
                  >
                    {topics.filter((t) => t !== 'All').map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-600 dark:text-slate-400 mb-1">Initial Status</label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value as ClaimStatus)}
                    className="w-full h-8 px-2 rounded-md bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs"
                  >
                    {statuses.filter((s) => s !== 'All').map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-400 mb-1">Source / Attribution</label>
                <input
                  type="text"
                  value={newSource}
                  onChange={(e) => setNewSource(e.target.value)}
                  className="w-full h-8 px-2 rounded-md bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsNewClaimModalOpen(false)}
                  className="px-3 py-1.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-1.5 rounded-md bg-blue-600 text-white font-semibold"
                >
                  Save Claim
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
