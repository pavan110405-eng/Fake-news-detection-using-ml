import React, { useState } from 'react';
import {
  FileText,
  Download,
  Share2,
  Plus,
  Calendar,
  CheckCircle2,
  Filter,
  Eye,
  Trash2,
  FileCheck,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ReportItem } from '../types';

export const ReportsPage: React.FC = () => {
  const { reports, createReport, deleteReport, showToast } = useApp();

  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);
  const [reportTitle, setReportTitle] = useState('');
  const [reportType, setReportType] = useState<ReportItem['type']>('Brief');
  const [reportSummary, setReportSummary] = useState('');

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportTitle.trim()) return;

    createReport({
      title: reportTitle,
      type: reportType,
      status: 'Completed',
      analyst: 'Alex Carter',
      summary: reportSummary || 'Automated multi-source evidentiary synthesis and stance classification audit.',
      sections: ['Executive Summary', 'Claim Taxonomy', 'Evidentiary Cross-Reference', 'Propagation Network Telemetry'],
    });

    setReportTitle('');
    setReportSummary('');
    setIsGenerateModalOpen(false);
    showToast(`Dossier "${reportTitle}" compiled and ready for dissemination`, 'success');
  };

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 font-sans tracking-tight">
            Intelligence Reports & Briefings
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Exportable dossiers, executive summaries, and forensic audit PDFs for newsrooms and policy analysts.
          </p>
        </div>

        <button
          onClick={() => setIsGenerateModalOpen(true)}
          className="px-3.5 py-2 rounded-md bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Generate New Report</span>
        </button>
      </div>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {reports.map((rep) => (
          <div
            key={rep.id}
            className="p-5 rounded-lg bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 shadow-2xs space-y-3 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <span className="text-[10px] px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-400 font-bold uppercase">
                  {rep.type}
                </span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    rep.status === 'Completed'
                      ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400'
                      : 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400'
                  }`}
                >
                  {rep.status}
                </span>
              </div>

              <h3 className="font-bold text-slate-900 dark:text-white text-sm leading-snug">
                {rep.title}
              </h3>

              <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2">
                {rep.summary}
              </p>

              <div className="p-2.5 rounded bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 text-xs space-y-1">
                <div className="flex justify-between text-slate-500 dark:text-slate-400 text-[11px]">
                  <span>Lead Analyst:</span>
                  <span className="font-medium text-slate-700 dark:text-slate-300">{rep.analyst}</span>
                </div>
                <div className="flex justify-between text-slate-500 dark:text-slate-400 text-[11px]">
                  <span>Generated:</span>
                  <span className="text-slate-700 dark:text-slate-300">{rep.created}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => {
                  window.print();
                  showToast('Exporting PDF dossier...', 'info');
                }}
                className="flex-1 py-1.5 rounded bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-2xs"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download PDF</span>
              </button>
              <button
                onClick={() => {
                  if (navigator.clipboard) {
                    navigator.clipboard.writeText(`https://truthlens.ai/reports/${rep.id}`);
                    showToast('Shareable dossier link copied', 'success');
                  }
                }}
                className="p-1.5 rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300"
                title="Share link"
              >
                <Share2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => deleteReport(rep.id)}
                className="p-1.5 rounded bg-slate-100 dark:bg-slate-800 hover:bg-rose-100 dark:hover:bg-rose-950 text-slate-400 hover:text-rose-600"
                title="Delete report"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isGenerateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 p-5 space-y-4 text-xs">
            <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm">
              Generate Verification Dossier
            </h3>
            <form onSubmit={handleGenerate} className="space-y-3">
              <div>
                <label className="block text-slate-600 dark:text-slate-400 mb-1">Report Title</label>
                <input
                  type="text"
                  value={reportTitle}
                  onChange={(e) => setReportTitle(e.target.value)}
                  placeholder="e.g. Executive Audit: Miracle Cure Disinformation Wave"
                  className="w-full h-8 px-2.5 rounded-md bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs focus:outline-hidden"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-400 mb-1">Report Scope & Classification</label>
                <select
                  value={reportType}
                  onChange={(e) => setReportType(e.target.value as ReportItem['type'])}
                  className="w-full h-8 px-2 rounded-md bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs"
                >
                  <option value="Brief">Intelligence Brief</option>
                  <option value="Investigation">Comprehensive Investigation</option>
                  <option value="Social">Social Media Intelligence Audit</option>
                  <option value="Forensic">Media Forensics Report</option>
                  <option value="Analysis">Single-Claim Deep Dive</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-400 mb-1">Executive Summary Scope</label>
                <textarea
                  value={reportSummary}
                  onChange={(e) => setReportSummary(e.target.value)}
                  placeholder="Summarize high-level findings and risk impacts..."
                  rows={3}
                  className="w-full p-2 rounded-md bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs resize-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsGenerateModalOpen(false)}
                  className="px-3 py-1.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-1.5 rounded-md bg-blue-600 text-white font-semibold"
                >
                  Compile Dossier
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
