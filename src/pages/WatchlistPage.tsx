import React, { useState } from 'react';
import {
  Bookmark,
  Plus,
  Trash2,
  TrendingUp,
  TrendingDown,
  Bell,
  Search,
  ExternalLink,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { WatchItem } from '../types';

export const WatchlistPage: React.FC = () => {
  const { watchlist, addWatchItem, deleteWatchItem, toggleWatchItemStatus, navigateTo, showToast } = useApp();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newType, setNewType] = useState<WatchItem['type']>('Topic');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    addWatchItem({
      name: newName,
      type: newType,
      mentions: 12,
      riskChange: '+0%',
      riskIsPositive: false,
      status: 'Active',
    });

    setNewName('');
    setIsAddModalOpen(false);
    showToast(`Added "${newName}" to monitored intelligence watchlist`, 'success');
  };

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 font-sans tracking-tight">
            Monitored Watchlist
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Automated alerts when narrative keywords, suspect domains, or claims exceed velocity thresholds.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-3.5 py-2 rounded-md bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Monitored Target</span>
        </button>
      </div>

      {/* Watchlist Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {watchlist.map((item) => (
          <div
            key={item.id}
            className="p-5 rounded-lg bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 shadow-2xs space-y-3"
          >
            <div className="flex items-start justify-between">
              <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold uppercase">
                {item.type}
              </span>
              <button
                onClick={() => toggleWatchItemStatus(item.id)}
                className={`text-[10px] font-bold px-2 py-0.5 rounded transition-colors ${
                  item.status === 'Active'
                    ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400'
                    : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                {item.status}
              </button>
            </div>

            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                {item.name}
              </h3>
              <div className="text-[11px] text-slate-400 mt-0.5">
                Last activity: {item.lastActivity}
              </div>
            </div>

            <div className="p-3 rounded-md bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
              <div>
                <span className="text-[10px] text-slate-400 uppercase">Mentions Velocity</span>
                <div className="font-mono font-bold text-slate-800 dark:text-slate-100 mt-0.5">
                  {item.mentions.toLocaleString()} spikes
                </div>
              </div>

              <div className="text-right">
                <span className="text-[10px] text-slate-400 uppercase">Trajectory</span>
                <div
                  className={`flex items-center gap-1 font-mono font-bold text-xs mt-0.5 ${
                    item.riskIsPositive ? 'text-emerald-600' : 'text-rose-600'
                  }`}
                >
                  {item.riskIsPositive ? (
                    <TrendingDown className="w-3.5 h-3.5" />
                  ) : (
                    <TrendingUp className="w-3.5 h-3.5" />
                  )}
                  <span>{item.riskChange}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
              <button
                onClick={() => {
                  navigateTo('analyze');
                  showToast(`Pre-filling scan for ${item.name}`, 'info');
                }}
                className="text-blue-600 dark:text-blue-400 hover:underline font-medium inline-flex items-center gap-1"
              >
                <span>Trigger Live Audit</span>
                <ExternalLink className="w-3 h-3" />
              </button>

              <button
                onClick={() => deleteWatchItem(item.id)}
                className="text-slate-400 hover:text-rose-600 p-1 rounded"
                title="Remove from watchlist"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 p-5 space-y-4 text-xs">
            <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm">
              Add Target to Watchlist
            </h3>
            <form onSubmit={handleAdd} className="space-y-3">
              <div>
                <label className="block text-slate-600 dark:text-slate-400 mb-1">Target Name or Query</label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. #miraclecure2026, or healthnews-fake.com"
                  className="w-full h-8 px-2.5 rounded-md bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs focus:outline-hidden"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-400 mb-1">Target Entity Type</label>
                <select
                  value={newType}
                  onChange={(e) => setNewType(e.target.value as WatchItem['type'])}
                  className="w-full h-8 px-2 rounded-md bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs"
                >
                  <option value="Topic">Topic Narrative</option>
                  <option value="Claim">Specific Claim</option>
                  <option value="Domain">Domain / Publisher</option>
                  <option value="Keyword">Keyword</option>
                  <option value="Hashtag">Hashtag</option>
                  <option value="Source">Social Account</option>
                </select>
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
                  Add to Watchlist
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
