import React, { useState } from 'react';
import {
  Briefcase,
  Search,
  Filter,
  Plus,
  ChevronRight,
  Clock,
  User,
  CheckCircle2,
  AlertTriangle,
  FolderOpen,
  FileText,
  X,
  Share2,
  Download,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Investigation } from '../types';

export const InvestigationsPage: React.FC = () => {
  const {
    investigations,
    selectedInvestigation,
    setSelectedInvestigation,
    createInvestigation,
    updateInvestigation,
    claims,
    showToast,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Form
  const [newName, setNewName] = useState('');
  const [newTopic, setNewTopic] = useState('Public Health');
  const [newDescription, setNewDescription] = useState('');

  const statuses = ['All', 'In Progress', 'Open', 'In Review', 'Closed'];

  const filteredInvestigations = investigations.filter((inv) => {
    const matchesSearch =
      inv.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.topic.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatus === 'All' || inv.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    createInvestigation(newName, newTopic, newDescription);
    setNewName('');
    setNewDescription('');
    setIsCreateModalOpen(false);
  };

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
      {/* Header matching Screen 8 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 font-sans tracking-tight">
            Investigations Workspace
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Collaborative case management, claim dossiers, and forensic timelines for disinformation taskforces.
          </p>
        </div>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="px-3.5 py-2 rounded-md bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Investigation</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-lg bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search case dossiers by name or topic..."
              className="w-full h-9 pl-9 pr-3 rounded-md bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-hidden"
            />
          </div>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="h-9 px-2.5 rounded-md bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 focus:outline-hidden"
          >
            {statuses.map((s) => (
              <option key={s} value={s}>
                Status: {s}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Investigations Table matching Screen 8 */}
      <div className="rounded-lg bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/50 text-slate-400 text-[11px] font-semibold uppercase">
                <th className="py-3 px-4">Investigation Dossier</th>
                <th className="py-3 px-3">Topic</th>
                <th className="py-3 px-3">Claims</th>
                <th className="py-3 px-3">Evidence</th>
                <th className="py-3 px-3">Risk Level</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3">Lead Analyst</th>
                <th className="py-3 px-3">Last Active</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
              {filteredInvestigations.map((inv) => (
                <tr
                  key={inv.id}
                  onClick={() => setSelectedInvestigation(inv)}
                  className="hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors"
                >
                  <td className="py-3 px-4 font-semibold text-slate-800 dark:text-slate-200">
                    <div className="flex items-center gap-2">
                      <FolderOpen className="w-4 h-4 text-blue-500 shrink-0" />
                      <span>{inv.name}</span>
                    </div>
                  </td>

                  <td className="py-3 px-3 text-slate-600 dark:text-slate-300">{inv.topic}</td>
                  <td className="py-3 px-3 font-mono font-medium text-slate-700 dark:text-slate-300">
                    {inv.claimsCount}
                  </td>
                  <td className="py-3 px-3 font-mono text-slate-500 dark:text-slate-400">
                    {inv.claimsCount * 2}
                  </td>

                  <td className="py-3 px-3 whitespace-nowrap">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        inv.risk === 'Critical'
                          ? 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-400'
                          : inv.risk === 'High'
                          ? 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400'
                          : 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400'
                      }`}
                    >
                      {inv.risk}
                    </span>
                  </td>

                  <td className="py-3 px-3 whitespace-nowrap">
                    <span className="font-medium text-slate-700 dark:text-slate-300">{inv.status}</span>
                  </td>

                  <td className="py-3 px-3 text-slate-500 dark:text-slate-400 whitespace-nowrap">
                    {inv.leadAnalyst}
                  </td>

                  <td className="py-3 px-3 text-slate-400 text-[11px] whitespace-nowrap">
                    {inv.updated}
                  </td>

                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedInvestigation(inv);
                      }}
                      className="text-blue-600 dark:text-blue-400 hover:text-blue-800 font-medium inline-flex items-center gap-1"
                    >
                      <span>Open Dossier</span>
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Selected Investigation Dossier Modal / View */}
      {selectedInvestigation && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/40 backdrop-blur-xs flex justify-end">
          <div
            className="w-full max-w-2xl bg-white dark:bg-slate-900 h-full shadow-2xl border-l border-slate-200 dark:border-slate-800 flex flex-col p-5 space-y-5 animate-in slide-in-from-right duration-200 text-xs overflow-y-auto custom-scrollbar"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">
                  {selectedInvestigation.id}
                </span>
                <h3 className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
                  {selectedInvestigation.name}
                </h3>
              </div>
              <button
                onClick={() => setSelectedInvestigation(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Dossier Overview Grid */}
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 rounded-md bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Status</span>
                <div className="font-bold text-slate-800 dark:text-slate-200 mt-0.5">
                  {selectedInvestigation.status}
                </div>
              </div>

              <div className="p-3 rounded-md bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Risk Rating</span>
                <div className="font-bold text-rose-600 dark:text-rose-400 mt-0.5">
                  {selectedInvestigation.risk}
                </div>
              </div>

              <div className="p-3 rounded-md bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Lead Investigator</span>
                <div className="font-bold text-slate-800 dark:text-slate-200 mt-0.5">
                  {selectedInvestigation.leadAnalyst}
                </div>
              </div>
            </div>

            {/* Scope & Description */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Case Summary & Scope
              </span>
              <p className="p-3 rounded-md bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 leading-relaxed">
                {selectedInvestigation.summary}
              </p>
            </div>

            {/* Attached Claims List */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Associated Claims Under Audit ({claims.slice(0, 3).length})
                </span>
              </div>
              <div className="space-y-2">
                {claims.slice(0, 3).map((c) => (
                  <div
                    key={c.id}
                    className="p-3 rounded-md bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 flex items-center justify-between"
                  >
                    <div className="min-w-0 pr-3">
                      <div className="font-semibold text-slate-800 dark:text-slate-200 truncate">
                        {c.originalText}
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">
                        Status: <span className="font-medium text-slate-600 dark:text-slate-300">{c.status}</span> • Confidence: {c.confidence}%
                      </div>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-400 shrink-0 font-medium">
                      Audited
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="pt-4 flex gap-2 border-t border-slate-200 dark:border-slate-800">
              <button
                onClick={() => {
                  updateInvestigation(selectedInvestigation.id, { status: 'Closed' });
                  showToast('Investigation status updated to Closed', 'info');
                  setSelectedInvestigation(null);
                }}
                className="py-2 px-3 rounded-md bg-slate-800 hover:bg-slate-700 text-white font-medium"
              >
                Close Case
              </button>

              <button
                onClick={() => {
                  window.print();
                  showToast('Exporting comprehensive investigation dossier', 'info');
                }}
                className="flex-1 py-2 rounded-md bg-blue-600 hover:bg-blue-500 text-white font-semibold flex items-center justify-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Dossier (PDF)</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Investigation Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 p-5 space-y-4">
            <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm">
              Initiate Disinformation Investigation
            </h3>
            <form onSubmit={handleCreate} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 dark:text-slate-400 mb-1">Investigation Name</label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Coordinated Health Miracle Disinformation"
                  className="w-full h-8 px-2.5 rounded-md bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs focus:outline-hidden"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-400 mb-1">Topic</label>
                <input
                  type="text"
                  value={newTopic}
                  onChange={(e) => setNewTopic(e.target.value)}
                  placeholder="e.g. Health Policy, Election Integrity"
                  className="w-full h-8 px-2.5 rounded-md bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs focus:outline-hidden"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-400 mb-1">Scope & Objectives</label>
                <textarea
                  rows={3}
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Describe focus, target networks, and operational goals..."
                  className="w-full p-2.5 rounded-md bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs focus:outline-hidden"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-3 py-1.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-1.5 rounded-md bg-blue-600 text-white font-semibold"
                >
                  Create Case
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
