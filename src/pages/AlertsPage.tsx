import React, { useState } from 'react';
import {
  Bell,
  AlertTriangle,
  CheckCircle2,
  Filter,
  Trash2,
  Briefcase,
  ChevronRight,
  ShieldAlert,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const AlertsPage: React.FC = () => {
  const { alerts, markAlertRead, createInvestigation, navigateTo, showToast } = useApp();

  const [filterPriority, setFilterPriority] = useState<string>('All');

  const filteredAlerts = alerts.filter((a) => {
    return filterPriority === 'All' || a.priority === filterPriority;
  });

  const handleEscalate = (alert: any) => {
    createInvestigation(`Investigation: ${alert.title}`, 'Escalated Alert', alert.description);
    markAlertRead(alert.id);
    navigateTo('investigations');
  };

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 font-sans tracking-tight">
            Active Intelligence Alerts
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Real-time notifications triggered by coordinated spikes, high-risk claims, and source anomalies.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          {(['All', 'CRITICAL', 'HIGH', 'MEDIUM'] as const).map((p) => (
            <button
              key={p}
              onClick={() => setFilterPriority(p)}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                filterPriority === p
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Alerts Feed */}
      <div className="space-y-3">
        {filteredAlerts.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-xs bg-white dark:bg-[#0f172a] rounded-lg border border-slate-200 dark:border-slate-800">
            No alerts found for priority level "{filterPriority}".
          </div>
        ) : (
          filteredAlerts.map((alert) => (
            <div
              key={alert.id}
              className={`p-4 rounded-lg border transition-colors flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-xs ${
                !alert.read
                  ? 'bg-blue-50/30 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900/60'
                  : 'bg-white dark:bg-[#0f172a] border-slate-200 dark:border-slate-800'
              }`}
            >
              <div className="space-y-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      alert.priority === 'CRITICAL'
                        ? 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-400 border border-rose-300 dark:border-rose-900'
                        : alert.priority === 'HIGH'
                        ? 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400 border border-amber-300 dark:border-amber-900'
                        : 'bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-400 border border-blue-300 dark:border-blue-900'
                    }`}
                  >
                    {alert.priority}
                  </span>
                  <span className="font-semibold text-slate-900 dark:text-white text-xs">
                    {alert.title}
                  </span>
                  <span className="text-[11px] text-slate-400 font-mono">• {alert.timestamp}</span>
                </div>

                <p className="text-slate-600 dark:text-slate-300 text-xs leading-relaxed max-w-3xl">
                  {alert.description}
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {!alert.read && (
                  <button
                    onClick={() => markAlertRead(alert.id)}
                    className="px-3 py-1.5 rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium"
                  >
                    Mark Read
                  </button>
                )}

                <button
                  onClick={() => handleEscalate(alert)}
                  className="px-3 py-1.5 rounded bg-blue-600 hover:bg-blue-500 text-white font-semibold flex items-center gap-1 shadow-2xs"
                >
                  <Briefcase className="w-3.5 h-3.5" />
                  <span>Escalate to Case</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
