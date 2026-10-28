import React from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  HelpCircle,
  Save,
  Download,
  Share2,
  Bookmark,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ExternalLink,
  ChevronRight,
  Info,
  Sparkles,
  Cpu,
  FileText,
  Clock,
  Globe,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const AnalysisResultPage: React.FC = () => {
  const {
    currentAnalysis,
    saveCurrentAnalysis,
    toggleCurrentWatchlist,
    navigateTo,
    setSelectedClaim,
    showToast,
  } = useApp();

  const {
    title,
    content,
    createdAt,
    assessment,
    whyThisResult,
    claims,
    evidenceList,
    languageSignals,
    modelExplanation,
    isInWatchlist,
  } = currentAnalysis;

  const handleExportPDF = () => {
    window.print();
    showToast('Report print dialog initialized (Save as PDF)', 'info');
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      showToast('Permanent dossier link copied to clipboard', 'success');
    }
  };

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
      {/* Header Bar matching Screen 4 */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
            <span>Intelligence Analysis</span>
            <span>•</span>
            <span>ID: {currentAnalysis.id}</span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {createdAt}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 font-sans tracking-tight">
              Analysis Result
            </h1>

            {/* Status Badges dynamically reflecting model prediction */}
            <div className="flex items-center gap-2">
              {assessment.classification === 'Supported' ? (
                <span className="px-3 py-1 rounded-md bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 font-bold text-xs flex items-center gap-1.5 shadow-2xs">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Verified Authentic Fact</span>
                </span>
              ) : assessment.classification === 'False' ? (
                <span className="px-3 py-1 rounded-md bg-rose-500/15 border border-rose-500/30 text-rose-600 dark:text-rose-400 font-bold text-xs flex items-center gap-1.5 shadow-2xs">
                  <ShieldAlert className="w-3.5 h-3.5 text-rose-500" />
                  <span>False / Disinformation</span>
                </span>
              ) : assessment.classification === 'Misleading' ? (
                <span className="px-3 py-1 rounded-md bg-amber-500/15 border border-amber-500/30 text-amber-600 dark:text-amber-400 font-bold text-xs flex items-center gap-1.5 shadow-2xs">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                  <span>Potentially Misleading</span>
                </span>
              ) : (
                <span className="px-3 py-1 rounded-md bg-slate-500/15 border border-slate-500/30 text-slate-600 dark:text-slate-400 font-bold text-xs flex items-center gap-1.5 shadow-2xs">
                  <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
                  <span>Unverified Claim</span>
                </span>
              )}

              <span className="px-2.5 py-1 rounded-md bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400 font-semibold text-xs">
                Confidence {assessment.confidence}%
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons matching Screen 4 */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={saveCurrentAnalysis}
            className="px-3 py-1.5 rounded-md bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-medium flex items-center gap-1.5 transition-colors"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save</span>
          </button>

          <button
            onClick={handleExportPDF}
            className="px-3 py-1.5 rounded-md bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-medium flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export PDF</span>
          </button>

          <button
            onClick={handleShare}
            className="px-3 py-1.5 rounded-md bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-medium flex items-center gap-1.5 transition-colors"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Share</span>
          </button>

          <button
            onClick={toggleCurrentWatchlist}
            className={`px-3 py-1.5 rounded-md text-xs font-medium flex items-center gap-1.5 transition-colors ${
              isInWatchlist
                ? 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-700'
                : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200'
            }`}
          >
            <Bookmark className={`w-3.5 h-3.5 ${isInWatchlist ? 'fill-current' : ''}`} />
            <span>{isInWatchlist ? 'In Watchlist' : 'Watchlist'}</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Left Content (8 cols) & Right Assessment (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Article & Snippet Card */}
          <div className="p-5 rounded-lg bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 shadow-2xs space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-snug">
              {title}
            </h2>

            <div className="p-3.5 rounded-md bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800/80 text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-sans">
              <p className="line-clamp-4">{content}</p>
            </div>
          </div>

          {/* Section: Why this result? matching Screen 4 */}
          <div className="p-5 rounded-lg bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 shadow-2xs space-y-3">
            <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-blue-500" />
              <span>Why this result?</span>
            </h3>

            <ul className="space-y-2 text-xs">
              {whyThisResult.map((reason, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-slate-600 dark:text-slate-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0" />
                  <span className="leading-relaxed">{reason}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Section: Claim Breakdown matching Screen 4 */}
          <div className="p-5 rounded-lg bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                Proposition Breakdown ({claims.length})
              </h3>
              <span className="text-[11px] text-slate-400 font-mono">
                PA-II Hinge Margin Evaluation
              </span>
            </div>

            <div className="space-y-2.5">
              {claims.map((claim, idx) => (
                <div
                  key={claim.id}
                  className="p-3 rounded-md bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3 transition-colors"
                >
                  <div className="min-w-0 flex items-start gap-2.5">
                    <span className="text-xs font-bold text-slate-400 mt-0.5">{idx + 1}.</span>
                    <div>
                      <div className="font-medium text-slate-800 dark:text-slate-200 text-xs">
                        {claim.originalText}
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        PAC Attribution: {claim.notes || 'Evaluated against trained feature lexicon'}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
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
                    <span className="text-[11px] font-mono text-slate-400">{claim.confidence}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section: Evidence matching Screen 4 */}
          <div className="p-5 rounded-lg bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                PAC Empirical Grounding ({evidenceList.length} sources)
              </h3>
              <span className="text-[11px] text-slate-400 font-mono">
                Cross-Source Benchmark
              </span>
            </div>

            <div className="space-y-3">
              {evidenceList.map((evi) => (
                <div
                  key={evi.id}
                  className="p-3.5 rounded-md bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 space-y-2 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-800 dark:text-slate-200">
                        {evi.source}
                      </span>
                      <span className="text-[10px] text-slate-400">({evi.sourceType})</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          evi.relationship === 'Supporting'
                            ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400'
                            : 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-400'
                        }`}
                      >
                        {evi.relationship}
                      </span>
                      <span className="text-[11px] text-slate-400">Reliability {evi.reliabilityScore}%</span>
                    </div>
                  </div>

                  <p className="text-slate-600 dark:text-slate-300 italic text-[11px] pl-2 border-l-2 border-slate-300 dark:border-slate-700">
                    "{evi.excerpt}"
                  </p>

                  <div className="text-[11px] text-slate-500 dark:text-slate-400">
                    <span className="font-semibold">Analyst Note:</span> {evi.analystNote}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section: Language Signals matching Screen 4 */}
          <div className="p-5 rounded-lg bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 shadow-2xs space-y-4">
            <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
              Language Signals
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <div className="flex justify-between text-slate-600 dark:text-slate-400 mb-1">
                  <span>Clickbait</span>
                  <span className="font-bold text-rose-600 dark:text-rose-400">{languageSignals.clickbait}%</span>
                </div>
                <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div style={{ width: `${languageSignals.clickbait}%` }} className="h-full bg-rose-500" />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-slate-600 dark:text-slate-400 mb-1">
                  <span>Sensationalism</span>
                  <span className="font-bold text-rose-600 dark:text-rose-400">{languageSignals.sensationalism}%</span>
                </div>
                <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div style={{ width: `${languageSignals.sensationalism}%` }} className="h-full bg-rose-500" />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-slate-600 dark:text-slate-400 mb-1">
                  <span>Emotional Appeal</span>
                  <span className="font-bold text-amber-600 dark:text-amber-400">{languageSignals.emotionalAppeal}%</span>
                </div>
                <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div style={{ width: `${languageSignals.emotionalAppeal}%` }} className="h-full bg-amber-500" />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-slate-600 dark:text-slate-400 mb-1">
                  <span>Urgency</span>
                  <span className="font-bold text-amber-600 dark:text-amber-400">{languageSignals.urgency}%</span>
                </div>
                <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div style={{ width: `${languageSignals.urgency}%` }} className="h-full bg-amber-500" />
                </div>
              </div>

              <div className="sm:col-span-2">
                <div className="flex justify-between text-slate-600 dark:text-slate-400 mb-1">
                  <span>Epistemic Certainty (Claim Grounding)</span>
                  <span className="font-bold text-slate-700 dark:text-slate-300">{languageSignals.epistemicCertainty}%</span>
                </div>
                <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div style={{ width: `${languageSignals.epistemicCertainty}%` }} className="h-full bg-blue-500" />
                </div>
              </div>
            </div>
          </div>

          {/* Section: Model Explanation matching Screen 4 */}
          <div className="p-5 rounded-lg bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 shadow-2xs space-y-3">
            <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-indigo-500" />
              <span>Model Explanation</span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs mb-2">
              <div className="p-2 rounded bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800">
                <div className="text-[10px] text-slate-400">Model Architecture</div>
                <div className="font-bold text-slate-800 dark:text-slate-200 mt-0.5">
                  {modelExplanation.modelName}
                </div>
              </div>

              <div className="p-2 rounded bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800">
                <div className="text-[10px] text-slate-400">Version</div>
                <div className="font-bold text-slate-800 dark:text-slate-200 mt-0.5">
                  {modelExplanation.version}
                </div>
              </div>

              <div className="p-2 rounded bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800">
                <div className="text-[10px] text-slate-400">Features Extracted</div>
                <div className="font-bold text-slate-800 dark:text-slate-200 mt-0.5">
                  {modelExplanation.keyFeatures.length} Active
                </div>
              </div>

              <div className="p-2 rounded bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800">
                <div className="text-[10px] text-slate-400">Output Confidence</div>
                <div className="font-bold text-slate-800 dark:text-slate-200 mt-0.5">
                  {modelExplanation.confidence}%
                </div>
              </div>
            </div>

            <div className="space-y-1.5 text-xs">
              <div className="font-semibold text-slate-700 dark:text-slate-300">Feature Attributions:</div>
              <ul className="list-disc list-inside space-y-1 text-slate-500 dark:text-slate-400 text-[11px]">
                {modelExplanation.keyFeatures.map((feat, idx) => (
                  <li key={idx}>{feat}</li>
                ))}
              </ul>
            </div>

            {modelExplanation.shapExplanation && (
              <div className="p-3 rounded bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/50 text-[11px] text-indigo-900 dark:text-indigo-300">
                <span className="font-semibold">SHAP Explanation:</span> {modelExplanation.shapExplanation}
              </div>
            )}
          </div>
        </div>

        {/* Right Column (4 cols): Assessment Card matching Screen 4 */}
        <div className="lg:col-span-4 space-y-6">
          <div className="p-5 rounded-lg bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 shadow-2xs space-y-4">
            <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
              Assessment Summary
            </h3>

            <div className="space-y-3 divide-y divide-slate-100 dark:divide-slate-800/80 text-xs">
              <div className="flex items-center justify-between pt-1">
                <span className="text-slate-500 dark:text-slate-400">Classification</span>
                <span className={`font-bold ${
                  assessment.classification === 'Supported'
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : assessment.classification === 'False'
                    ? 'text-rose-600 dark:text-rose-400'
                    : 'text-amber-600 dark:text-amber-400'
                }`}>
                  {assessment.classification === 'Supported' ? 'Verified Authentic' : assessment.classification}
                </span>
              </div>

              <div className="flex items-center justify-between pt-3">
                <span className="text-slate-500 dark:text-slate-400">Confidence</span>
                <span className="font-bold text-blue-600 dark:text-blue-400">
                  {assessment.confidence}%
                </span>
              </div>

              <div className="flex items-center justify-between pt-3">
                <span className="text-slate-500 dark:text-slate-400">Evidence Status</span>
                <span className={`font-semibold ${
                  assessment.classification === 'Supported'
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : 'text-rose-600 dark:text-rose-400'
                }`}>
                  {assessment.evidenceStatus}
                </span>
              </div>

              <div className="flex items-center justify-between pt-3">
                <span className="text-slate-500 dark:text-slate-400">Source Reliability</span>
                <span className={`font-semibold ${
                  assessment.sourceReliability === 'High'
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : 'text-amber-600 dark:text-amber-400'
                }`}>
                  {assessment.sourceReliability}
                </span>
              </div>

              <div className="flex items-center justify-between pt-3">
                <span className="text-slate-500 dark:text-slate-400">Claim Risk</span>
                <span className={`font-bold ${
                  assessment.claimRisk === 'Low'
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : 'text-rose-600 dark:text-rose-400'
                }`}>
                  {assessment.claimRisk}
                </span>
              </div>

              <div className="flex items-center justify-between pt-3">
                <span className="text-slate-500 dark:text-slate-400">Propagation Risk</span>
                <span className={`font-bold ${
                  assessment.propagationRisk === 'Low'
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : 'text-rose-600 dark:text-rose-400'
                }`}>
                  {assessment.propagationRisk}
                </span>
              </div>
            </div>

            <div className="pt-3 space-y-2">
              <button
                onClick={() => navigateTo('analyze')}
                className="w-full py-2.5 px-3 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Cpu className="w-3.5 h-3.5" />
                <span>Verify Another Article (PAC)</span>
              </button>

              <button
                onClick={() => navigateTo('history')}
                className="w-full py-2 px-3 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Clock className="w-3.5 h-3.5" />
                <span>View Verification History</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
