import React, { useState } from 'react';
import {
  X,
  CheckSquare,
  AlertTriangle,
  Globe,
  Share2,
  Calendar,
  MapPin,
  Tag,
  Plus,
  CheckCircle2,
  Briefcase,
  FileText,
  Clock,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { Claim } from '../../types';
import { useApp } from '../../context/AppContext';

interface ClaimDrawerProps {
  claim: Claim | null;
  onClose: () => void;
}

export const ClaimDrawer: React.FC<ClaimDrawerProps> = ({ claim, onClose }) => {
  const { updateClaim, createInvestigation, navigateTo, showToast } = useApp();
  const [noteInput, setNoteInput] = useState('');

  if (!claim) return null;

  const handleMarkReviewed = () => {
    updateClaim(claim.id, { isReviewed: true });
    showToast(`Claim marked as reviewed by analyst`, 'success');
  };

  const handleCreateInvestigation = () => {
    createInvestigation(
      `Investigation: ${claim.normalizedClaim.slice(0, 40)}`,
      claim.topic,
      `Dedicated investigation dossier initiated for proposition: "${claim.originalText}"`
    );
    onClose();
    navigateTo('investigations');
  };

  const handleAddNote = () => {
    if (!noteInput.trim()) return;
    const existing = claim.notes ? `${claim.notes}\n• ${noteInput}` : `• ${noteInput}`;
    updateClaim(claim.id, { notes: existing });
    setNoteInput('');
    showToast('Analyst note appended to claim audit', 'info');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/40 backdrop-blur-xs flex justify-end">
      <div
        className="w-full max-w-xl bg-white dark:bg-slate-900 h-full shadow-2xl border-l border-slate-200 dark:border-slate-800 flex flex-col animate-in slide-in-from-right duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-950/40">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs text-slate-400 font-semibold">{claim.id}</span>
            <span
              className={`px-2.5 py-0.5 rounded text-[11px] font-bold ${
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
            <span className="text-xs text-slate-500 font-medium">({claim.confidence}% confidence)</span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-md"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6 text-xs custom-scrollbar">
          {/* Original & Normalized Claim */}
          <div className="space-y-3">
            <div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                Original Claim
              </div>
              <div className="p-3 rounded-md bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 font-medium leading-relaxed">
                "{claim.originalText}"
              </div>
            </div>

            <div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                Normalized Factual Proposition
              </div>
              <div className="p-3 rounded-md bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/50 text-blue-900 dark:text-blue-200 leading-relaxed">
                {claim.normalizedClaim}
              </div>
            </div>
          </div>

          {/* Metadata Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-md bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase font-semibold">Topic</span>
              <div className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">{claim.topic}</div>
            </div>

            <div className="p-3 rounded-md bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase font-semibold">Risk Classification</span>
              <div className="font-semibold text-rose-600 dark:text-rose-400 mt-0.5">{claim.risk} Risk</div>
            </div>

            <div className="p-3 rounded-md bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase font-semibold">Primary Source</span>
              <div className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">{claim.source}</div>
            </div>

            <div className="p-3 rounded-md bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase font-semibold">Social Velocity</span>
              <div className="font-semibold text-amber-600 dark:text-amber-400 mt-0.5">
                {claim.socialActivityVelocity}
              </div>
            </div>
          </div>

          {/* Extracted Entities */}
          <div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-blue-500" />
              <span>Extracted Entities & Metadata</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {claim.entities.map((ent, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium"
                >
                  {ent}
                </span>
              ))}
              {claim.locations.map((loc, idx) => (
                <span
                  key={`loc-${idx}`}
                  className="px-2.5 py-1 rounded bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-medium flex items-center gap-1"
                >
                  <MapPin className="w-3 h-3" />
                  <span>{loc}</span>
                </span>
              ))}
              {claim.dates.map((d, idx) => (
                <span
                  key={`d-${idx}`}
                  className="px-2.5 py-1 rounded bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 font-medium flex items-center gap-1"
                >
                  <Calendar className="w-3 h-3" />
                  <span>{d}</span>
                </span>
              ))}
            </div>
          </div>

          {/* Contradictions & Counter-Evidence */}
          {claim.contradictions && claim.contradictions.length > 0 && (
            <div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />
                <span>Identified Contradictions</span>
              </div>
              <div className="space-y-1.5">
                {claim.contradictions.map((c, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded bg-rose-50/60 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/50 text-rose-800 dark:text-rose-300"
                  >
                    • {c}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Analyst Notes Section */}
          <div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
              Analyst Notes & Audit Trail
            </div>
            {claim.notes && (
              <div className="p-3 rounded bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 whitespace-pre-line mb-2">
                {claim.notes}
              </div>
            )}
            <div className="flex gap-2">
              <input
                type="text"
                value={noteInput}
                onChange={(e) => setNoteInput(e.target.value)}
                placeholder="Append verification note..."
                className="flex-1 h-9 px-3 rounded-md bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs focus:outline-hidden"
              />
              <button
                onClick={handleAddNote}
                className="px-3 h-9 rounded-md bg-slate-800 hover:bg-slate-700 text-white font-medium"
              >
                Add Note
              </button>
            </div>
          </div>
        </div>

        {/* Drawer Actions matching Screen 5 specification */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex flex-wrap items-center gap-2">
          <button
            onClick={() => {
              onClose();
              navigateTo('evidence');
            }}
            className="flex-1 py-2 px-3 rounded-md bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Evidence</span>
          </button>

          <button
            onClick={handleMarkReviewed}
            className="py-2 px-3 rounded-md bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Mark Reviewed</span>
          </button>

          <button
            onClick={handleCreateInvestigation}
            className="py-2 px-3 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-xs flex items-center justify-center gap-1.5 transition-colors"
          >
            <Briefcase className="w-3.5 h-3.5" />
            <span>Create Investigation</span>
          </button>
        </div>
      </div>
    </div>
  );
};
