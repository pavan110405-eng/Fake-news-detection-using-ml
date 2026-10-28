import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  PageId,
  AnalysisResult,
  Claim,
  EvidenceItem,
  SourceInfo,
  Investigation,
  WatchItem,
  AlertItem,
  ReportItem,
  DatasetItem,
  MLModelItem,
  ExperimentItem,
  AuditLogItem,
} from '../types';
import {
  INITIAL_ANALYSIS_RESULT,
  INITIAL_CLAIMS,
  INITIAL_SOURCES,
  INITIAL_INVESTIGATIONS,
  INITIAL_WATCHLIST,
  INITIAL_ALERTS,
  INITIAL_REPORTS,
  INITIAL_DATASETS,
  INITIAL_MODELS,
  INITIAL_EXPERIMENTS,
  INITIAL_AUDIT_LOGS,
} from '../data/mockData';
import { runContentAnalysis, AnalysisInputOptions } from '../services/analyzer';

interface Toast {
  id: string;
  message: string;
  type: 'info' | 'success' | 'warn' | 'error';
}

interface AppContextType {
  currentPage: PageId;
  navigateTo: (page: PageId) => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  isCommandPaletteOpen: boolean;
  setIsCommandPaletteOpen: (open: boolean) => void;

  // Analysis State
  currentAnalysis: AnalysisResult;
  isAnalyzing: boolean;
  analysisProgressStep: string;
  analysisProgressPercent: number;
  runAnalysis: (input: AnalysisInputOptions) => Promise<void>;
  saveCurrentAnalysis: () => void;
  toggleCurrentWatchlist: () => void;

  // Claims
  claims: Claim[];
  selectedClaim: Claim | null;
  setSelectedClaim: (claim: Claim | null) => void;
  addClaim: (claim: Partial<Claim>) => void;
  updateClaim: (id: string, updates: Partial<Claim>) => void;

  // Evidence
  evidence: EvidenceItem[];
  selectedEvidence: EvidenceItem | null;
  setSelectedEvidence: (evidence: EvidenceItem | null) => void;
  addEvidence: (evidence: Partial<EvidenceItem>) => void;

  // Sources
  sources: SourceInfo[];
  selectedSource: SourceInfo | null;
  setSelectedSource: (source: SourceInfo | null) => void;

  // Investigations
  investigations: Investigation[];
  selectedInvestigation: Investigation | null;
  setSelectedInvestigation: (inv: Investigation | null) => void;
  createInvestigation: (name: string, topic: string, summary: string) => Investigation;
  updateInvestigation: (id: string, updates: Partial<Investigation>) => void;
  addInvestigationNote: (id: string, note: string) => void;

  // Watchlist
  watchlist: WatchItem[];
  addWatchItem: (item: Omit<WatchItem, 'id' | 'lastActivity'>) => void;
  addToWatchlist: (item: Partial<WatchItem>) => void;
  toggleWatchItemStatus: (id: string) => void;
  deleteWatchItem: (id: string) => void;
  removeFromWatchlist: (id: string) => void;

  // Alerts
  alerts: AlertItem[];
  markAlertRead: (id: string) => void;
  dismissAlert: (id: string) => void;

  // Reports
  reports: ReportItem[];
  createReport: (report: Omit<ReportItem, 'id' | 'created'>) => void;
  addReport: (report: Partial<ReportItem>) => void;
  deleteReport: (id: string) => void;

  // History
  analysisHistory: AnalysisResult[];
  deleteHistoryItem: (id: string) => void;

  // Datasets
  datasets: DatasetItem[];
  addDataset: (ds: Omit<DatasetItem, 'id' | 'created'>) => void;
  cleanDataset: (id: string) => void;

  // ML Models
  models: MLModelItem[];
  trainModel: (name: string, dataset: string, epochs: number) => Promise<void>;
  toggleModelStatus: (id: string) => void;

  // Experiments
  experiments: ExperimentItem[];
  createExperiment: (exp: Omit<ExperimentItem, 'id' | 'created'>) => void;

  // Audit Logs
  auditLogs: AuditLogItem[];

  // Toasts
  toasts: Toast[];
  showToast: (message: string, type?: Toast['type']) => void;
  toast: (message: string, type?: Toast['type']) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentPage, setCurrentPage] = useState<PageId>('analyze');
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('truthlens-theme');
      if (saved === 'dark' || saved === 'light') return saved;
    }
    return 'dark';
  });
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Core entities
  const [currentAnalysis, setCurrentAnalysis] = useState<AnalysisResult>(INITIAL_ANALYSIS_RESULT);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgressStep, setAnalysisProgressStep] = useState('');
  const [analysisProgressPercent, setAnalysisProgressPercent] = useState(0);

  const [claims, setClaims] = useState<Claim[]>(INITIAL_CLAIMS);
  const [selectedClaim, setSelectedClaim] = useState<Claim | null>(null);

  const [evidence, setEvidence] = useState<EvidenceItem[]>(INITIAL_ANALYSIS_RESULT.evidenceList);
  const [selectedEvidence, setSelectedEvidence] = useState<EvidenceItem | null>(null);

  const [sources, setSources] = useState<SourceInfo[]>(INITIAL_SOURCES);
  const [selectedSource, setSelectedSource] = useState<SourceInfo | null>(null);

  const [investigations, setInvestigations] = useState<Investigation[]>(INITIAL_INVESTIGATIONS);
  const [selectedInvestigation, setSelectedInvestigation] = useState<Investigation | null>(INITIAL_INVESTIGATIONS[0]);

  const [watchlist, setWatchlist] = useState<WatchItem[]>(INITIAL_WATCHLIST);
  const [alerts, setAlerts] = useState<AlertItem[]>(INITIAL_ALERTS);
  const [reports, setReports] = useState<ReportItem[]>(INITIAL_REPORTS);
  const [analysisHistory, setAnalysisHistory] = useState<AnalysisResult[]>([INITIAL_ANALYSIS_RESULT]);

  const [datasets, setDatasets] = useState<DatasetItem[]>(INITIAL_DATASETS);
  const [models, setModels] = useState<MLModelItem[]>(INITIAL_MODELS);
  const [experiments, setExperiments] = useState<ExperimentItem[]>(INITIAL_EXPERIMENTS);
  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>(INITIAL_AUDIT_LOGS);

  const [toasts, setToasts] = useState<Toast[]>([]);

  // Apply dark class to document root and body
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('truthlens-theme', theme);
    }
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
    }
  }, [theme]);

  // Global Ctrl + K shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const showToast = (message: string, type: Toast['type'] = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  };

  const navigateTo = (page: PageId) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
    showToast(`Switched to ${theme === 'light' ? 'Dark' : 'Light'} Mode`, 'info');
  };

  const runAnalysis = async (input: AnalysisInputOptions) => {
    setIsAnalyzing(true);
    setAnalysisProgressPercent(5);
    setAnalysisProgressStep('Initializing verification engine...');

    try {
      const result = await runContentAnalysis(input, (step, percent) => {
        setAnalysisProgressStep(step);
        setAnalysisProgressPercent(percent);
      });

      setCurrentAnalysis(result);
      setAnalysisHistory((prev) => [result, ...prev]);

      // Add newly extracted claims to database
      if (result.claims.length > 0) {
        setClaims((prev) => [...result.claims, ...prev]);
      }
      if (result.evidenceList.length > 0) {
        setEvidence((prev) => [...result.evidenceList, ...prev]);
      }

      // Add audit log
      setAuditLogs((prev) => [
        {
          id: `aud-${Date.now()}`,
          timestamp: 'Just now',
          user: 'alex.carter@truthlens.ai',
          action: 'POST /api/analyze',
          resource: result.title.slice(0, 30),
          ip: '192.168.1.104',
          status: 'SUCCESS',
        },
        ...prev,
      ]);

      showToast('Analysis completed successfully!', 'success');
      navigateTo('result');
    } catch {
      showToast('Error during analysis. Please try again.', 'error');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const saveCurrentAnalysis = () => {
    setCurrentAnalysis((prev) => ({ ...prev, saved: true }));
    showToast('Analysis saved to workspace!', 'success');
  };

  const toggleCurrentWatchlist = () => {
    const nextState = !currentAnalysis.isInWatchlist;
    setCurrentAnalysis((prev) => ({ ...prev, isInWatchlist: nextState }));
    if (nextState) {
      addWatchItem({
        name: currentAnalysis.title.slice(0, 35),
        type: 'Claim',
        mentions: 48,
        riskChange: '+18%',
        riskIsPositive: false,
        status: 'Active',
      });
      showToast('Added claim to active Watchlist', 'success');
    } else {
      showToast('Removed from Watchlist', 'info');
    }
  };

  const addClaim = (newClaim: Partial<Claim>) => {
    const claim: Claim = {
      id: `clm-${Date.now()}`,
      originalText: newClaim.originalText || 'New Claim Proposition',
      normalizedClaim: newClaim.normalizedClaim || newClaim.originalText || 'Normalized proposition',
      status: newClaim.status || 'Unverified',
      confidence: newClaim.confidence || 75,
      evidenceCount: newClaim.evidenceCount || 1,
      source: newClaim.source || 'Manual Entry',
      sourceType: newClaim.sourceType || 'News',
      firstSeen: 'Today',
      lastUpdated: 'Just now',
      topic: newClaim.topic || 'General',
      risk: newClaim.risk || 'Medium',
      entities: newClaim.entities || [],
      locations: newClaim.locations || [],
      dates: newClaim.dates || [],
      contradictions: newClaim.contradictions || [],
      relatedClaimIds: [],
      socialActivityVelocity: 'Moderate',
      notes: newClaim.notes || '',
    };
    setClaims((prev) => [claim, ...prev]);
    showToast('Claim added to database', 'success');
  };

  const updateClaim = (id: string, updates: Partial<Claim>) => {
    setClaims((prev) => prev.map((c) => (c.id === id ? { ...c, ...updates, lastUpdated: 'Just now' } : c)));
    if (selectedClaim && selectedClaim.id === id) {
      setSelectedClaim((prev) => (prev ? { ...prev, ...updates } : null));
    }
    showToast('Claim record updated', 'success');
  };

  const addEvidence = (newEvidence: Partial<EvidenceItem>) => {
    const item: EvidenceItem = {
      id: `evi-${Date.now()}`,
      claimId: newEvidence.claimId || 'clm-001',
      claimSnippet: newEvidence.claimSnippet || 'General proposition',
      source: newEvidence.source || 'Verified Source',
      sourceUrl: newEvidence.sourceUrl || 'https://verified.org',
      sourceType: newEvidence.sourceType || 'Gov/Org',
      relationship: newEvidence.relationship || 'Supporting',
      publicationDate: 'Sep 22, 2026',
      reliabilityScore: newEvidence.reliabilityScore || 90,
      analystNote: newEvidence.analystNote || 'Manually cataloged corroborating source.',
      excerpt: newEvidence.excerpt || 'Empirical evidence excerpt verifying findings.',
    };
    setEvidence((prev) => [item, ...prev]);
    showToast('Evidence cataloged into library', 'success');
  };

  const createInvestigation = (name: string, topic: string, summary: string): Investigation => {
    const newInv: Investigation = {
      id: `inv-${Date.now()}`,
      name,
      topic,
      claimsCount: 2,
      risk: 'High',
      status: 'Open',
      updated: 'Just now',
      created: 'Today',
      leadAnalyst: 'Alex Carter',
      progressPercent: 10,
      summary,
      timelineEvents: [
        {
          id: `evt-${Date.now()}`,
          timestamp: 'Today, 10:00 AM',
          title: 'Investigation opened',
          description: summary,
          type: 'claim',
        },
      ],
      claims: [claims[0]],
      notes: ['Initial dossier setup by Alex Carter.'],
    };
    setInvestigations((prev) => [newInv, ...prev]);
    setSelectedInvestigation(newInv);
    showToast('New investigation dossier initialized', 'success');
    return newInv;
  };

  const updateInvestigation = (id: string, updates: Partial<Investigation>) => {
    setInvestigations((prev) => prev.map((inv) => (inv.id === id ? { ...inv, ...updates, updated: 'Just now' } : inv)));
    if (selectedInvestigation && selectedInvestigation.id === id) {
      setSelectedInvestigation((prev) => (prev ? { ...prev, ...updates } : null));
    }
  };

  const addInvestigationNote = (id: string, note: string) => {
    updateInvestigation(id, {
      notes: [...(investigations.find((i) => i.id === id)?.notes || []), note],
    });
    showToast('Note added to investigation dossier', 'info');
  };

  const addWatchItem = (item: Omit<WatchItem, 'id' | 'lastActivity'>) => {
    const watch: WatchItem = {
      ...item,
      id: `wtch-${Date.now()}`,
      lastActivity: 'Just now',
    };
    setWatchlist((prev) => [watch, ...prev]);
  };

  const addToWatchlist = (item: Partial<WatchItem>) => {
    const watch: WatchItem = {
      id: item.id || `wtch-${Date.now()}`,
      name: item.name || 'Monitored Topic',
      type: item.type || 'Topic',
      mentions: item.mentions || 25,
      riskChange: item.riskChange || '+5%',
      riskIsPositive: item.riskIsPositive ?? false,
      lastActivity: item.lastActivity || 'Just now',
      status: item.status || 'Active',
    };
    setWatchlist((prev) => [watch, ...prev]);
    showToast(`Added "${watch.name}" to watchlist`, 'success');
  };

  const removeFromWatchlist = (id: string) => {
    deleteWatchItem(id);
  };

  const addReport = (report: Partial<ReportItem>) => {
    const newReport: ReportItem = {
      id: report.id || `rep-${Date.now()}`,
      title: report.title || 'Intelligence Briefing',
      type: report.type || 'Brief',
      created: report.created || 'Sep 22, 2026',
      status: report.status || 'Completed',
      analyst: report.analyst || 'Alex Carter',
      summary: report.summary || 'Summary of investigative findings.',
      sections: report.sections || ['Executive Summary', 'Key Findings'],
    };
    setReports((prev) => [newReport, ...prev]);
    showToast(`Report "${newReport.title}" created`, 'success');
  };

  const toggleModelStatus = (id: string) => {
    setModels((prev) =>
      prev.map((m) =>
        m.id === id
          ? { ...m, status: m.status === 'Deployed' ? 'Trained' : 'Deployed' }
          : m
      )
    );
    showToast('Model deployment status updated', 'info');
  };

  const toggleWatchItemStatus = (id: string) => {
    setWatchlist((prev) =>
      prev.map((w) => (w.id === id ? { ...w, status: w.status === 'Active' ? 'Paused' : 'Active' } : w))
    );
    showToast('Watchlist item status updated', 'info');
  };

  const deleteWatchItem = (id: string) => {
    setWatchlist((prev) => prev.filter((w) => w.id !== id));
    showToast('Item removed from Watchlist', 'info');
  };

  const markAlertRead = (id: string) => {
    setAlerts((prev) => prev.map((a) => (a.id === id ? { ...a, read: true } : a)));
  };

  const dismissAlert = (id: string) => {
    setAlerts((prev) => prev.filter((a) => a.id !== id));
    showToast('Alert dismissed', 'info');
  };

  const createReport = (report: Omit<ReportItem, 'id' | 'created'>) => {
    const newReport: ReportItem = {
      ...report,
      id: `rep-${Date.now()}`,
      created: 'Sep 22, 2026',
    };
    setReports((prev) => [newReport, ...prev]);
    showToast('Report generated successfully', 'success');
  };

  const deleteReport = (id: string) => {
    setReports((prev) => prev.filter((r) => r.id !== id));
    showToast('Report deleted', 'info');
  };

  const deleteHistoryItem = (id: string) => {
    setAnalysisHistory((prev) => prev.filter((h) => h.id !== id));
    showToast('Analysis removed from history', 'info');
  };

  const addDataset = (ds: Omit<DatasetItem, 'id' | 'created'>) => {
    const item: DatasetItem = {
      ...ds,
      id: `ds-${Date.now()}`,
      created: 'Today',
    };
    setDatasets((prev) => [item, ...prev]);
    showToast(`Dataset "${item.name}" registered and ready for validation`, 'success');
  };

  const cleanDataset = (id: string) => {
    setDatasets((prev) =>
      prev.map((d) => (d.id === id ? { ...d, missingValuesPercent: 0, duplicatesCount: 0, status: 'Ready' } : d))
    );
    showToast('Dataset cleaned: removed duplicates and imputed missing labels', 'success');
  };

  const trainModel = async (name: string, dataset: string, epochs: number) => {
    showToast(`Starting training job for ${name} (${epochs} epochs)...`, 'info');
    await new Promise((resolve) => setTimeout(resolve, 1200));

    const newModel: MLModelItem = {
      id: `mdl-${Date.now()}`,
      name,
      version: 'v1.0-exp',
      dataset,
      status: 'Trained',
      trainingDate: 'Just now',
      precision: +(0.84 + Math.random() * 0.08).toFixed(3),
      recall: +(0.82 + Math.random() * 0.08).toFixed(3),
      f1: +(0.83 + Math.random() * 0.08).toFixed(3),
      rocAuc: +(0.89 + Math.random() * 0.05).toFixed(3),
      confusionMatrix: [
        [790, 40, 20, 15],
        [35, 810, 45, 20],
        [22, 38, 710, 30],
        [15, 18, 25, 780],
      ],
    };

    setModels((prev) => [newModel, ...prev]);
    setAuditLogs((prev) => [
      {
        id: `aud-${Date.now()}`,
        timestamp: 'Just now',
        user: 'alex.carter@truthlens.ai',
        action: 'POST /api/models/train',
        resource: `${name} (Dataset: ${dataset})`,
        ip: '192.168.1.104',
        status: 'SUCCESS',
      },
      ...prev,
    ]);

    showToast(`Training complete! ${name} achieved F1: ${newModel.f1}`, 'success');
  };

  const createExperiment = (exp: Omit<ExperimentItem, 'id' | 'created'>) => {
    const item: ExperimentItem = {
      ...exp,
      id: `exp-${Date.now()}`,
      created: 'Just now',
    };
    setExperiments((prev) => [item, ...prev]);
    showToast('Experiment tracked in ML registry', 'success');
  };

  return (
    <AppContext.Provider
      value={{
        currentPage,
        navigateTo,
        theme,
        toggleTheme,
        isSearchOpen,
        setIsSearchOpen,
        isCommandPaletteOpen: isSearchOpen,
        setIsCommandPaletteOpen: setIsSearchOpen,
        currentAnalysis,
        isAnalyzing,
        analysisProgressStep,
        analysisProgressPercent,
        runAnalysis,
        saveCurrentAnalysis,
        toggleCurrentWatchlist,
        claims,
        selectedClaim,
        setSelectedClaim,
        addClaim,
        updateClaim,
        evidence,
        selectedEvidence,
        setSelectedEvidence,
        addEvidence,
        sources,
        selectedSource,
        setSelectedSource,
        investigations,
        selectedInvestigation,
        setSelectedInvestigation,
        createInvestigation,
        updateInvestigation,
        addInvestigationNote,
        watchlist,
        addWatchItem,
        addToWatchlist,
        toggleWatchItemStatus,
        deleteWatchItem,
        removeFromWatchlist,
        alerts,
        markAlertRead,
        dismissAlert,
        reports,
        createReport,
        addReport,
        deleteReport,
        analysisHistory,
        deleteHistoryItem,
        datasets,
        addDataset,
        cleanDataset,
        models,
        trainModel,
        toggleModelStatus,
        experiments,
        createExperiment,
        auditLogs,
        toasts,
        showToast,
        toast: showToast,
      }}
    >
      {children}
      {/* Toast container */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`pointer-events-auto flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg border text-sm font-medium transition-all duration-200 transform translate-y-0 ${
              t.type === 'success'
                ? 'bg-emerald-900/90 text-emerald-100 border-emerald-700'
                : t.type === 'error'
                ? 'bg-rose-900/90 text-rose-100 border-rose-700'
                : t.type === 'warn'
                ? 'bg-amber-900/90 text-amber-100 border-amber-700'
                : 'bg-slate-900/90 text-slate-100 border-slate-700'
            }`}
          >
            <span>{t.message}</span>
          </div>
        ))}
      </div>
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
