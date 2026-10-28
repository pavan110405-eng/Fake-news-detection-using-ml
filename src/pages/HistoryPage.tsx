import React from 'react';
import {
  Clock,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  ShieldAlert,
  Search,
  Plus,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const HistoryPage: React.FC = () => {
  const { analysisHistory, navigateTo } = useApp();

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 font-sans tracking-tight">
            Verification History
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Log of all content verifications evaluated by the Passive-Aggressive SOTA classifier.
          </p>
        </div>

        <button
          onClick={() => navigateTo('analyze')}
          className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm w-fit"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New PAC Verification</span>
        </button>
      </div>

      {/* History Table */}
      {analysisHistory.length > 0 ? (
        <div className="rounded-xl bg-white dark:bg-[#0c121e] border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/50 text-slate-400 text-[11px] font-semibold uppercase">
                  <th className="py-3 px-4">Subject Headline / Excerpt</th>
                  <th className="py-3 px-3">Type</th>
                  <th className="py-3 px-3">Verdict</th>
                  <th className="py-3 px-3">Confidence</th>
                  <th className="py-3 px-3">Propositions</th>
                  <th className="py-3 px-3">Timestamp</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                {analysisHistory.map((item) => {
                  const isReal = item.assessment.classification === 'Supported';
                  return (
                    <tr
                      key={item.id}
                      onClick={() => {
                        navigateTo('result');
                      }}
                      className="hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors"
                    >
                      <td className="py-3 px-4 max-w-md">
                        <div className="font-semibold text-slate-900 dark:text-slate-100 truncate">
                          {item.title}
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                          {item.content}
                        </div>
                      </td>

                      <td className="py-3 px-3 whitespace-nowrap">
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                          {item.inputType}
                        </span>
                      </td>

                      <td className="py-3 px-3 whitespace-nowrap">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            isReal
                              ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800'
                              : 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-400 border border-rose-300 dark:border-rose-800'
                          }`}
                        >
                          {isReal ? 'Verified Authentic' : 'Fake / Disinformation'}
                        </span>
                      </td>

                      <td className="py-3 px-3 font-mono font-bold text-slate-700 dark:text-slate-300">
                        {item.assessment.confidence}%
                      </td>

                      <td className="py-3 px-3 text-slate-500 dark:text-slate-400 whitespace-nowrap font-mono">
                        {item.claims.length} propositions
                      </td>

                      <td className="py-3 px-3 text-slate-400 text-[11px] whitespace-nowrap">
                        {item.createdAt}
                      </td>

                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <span className="text-blue-600 dark:text-blue-400 font-semibold hover:underline inline-flex items-center gap-1">
                          <span>Inspect Dossier</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="text-center py-16 rounded-xl bg-white dark:bg-[#0c121e] border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
          <div className="w-12 h-12 rounded-full bg-blue-50 dark:bg-blue-950 flex items-center justify-center text-blue-500 mx-auto">
            <Clock className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            No Verification History Yet
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
            Any news article, image clipping, or document verified with the Passive-Aggressive Classifier will be logged here.
          </p>
          <button
            onClick={() => navigateTo('analyze')}
            className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold inline-flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Run First Verification</span>
          </button>
        </div>
      )}
    </div>
  );
};
