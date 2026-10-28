import React, { useState } from 'react';
import {
  Terminal,
  Key,
  Copy,
  CheckCircle2,
  Code,
  Play,
  ExternalLink,
  Shield,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const ApiPage: React.FC = () => {
  const { showToast } = useApp();

  const [apiKey, setApiKey] = useState('tl_live_9f83a01b72e482cd93910c2834b9');
  const [selectedEndpoint, setSelectedEndpoint] = useState<'verify' | 'claims' | 'evidence'>('verify');
  const [testPayload, setTestPayload] = useState(
    JSON.stringify(
      {
        text: 'Scientists discover miracle cure for all diseases, claims study.',
        source_url: 'https://example.com/breaking-news',
        options: {
          depth: 'deep_forensic',
          evidence_grounding: true,
          social_signals: true,
        },
      },
      null,
      2
    )
  );
  const [apiResponse, setApiResponse] = useState<string | null>(null);
  const [isCalling, setIsCalling] = useState(false);

  const handleCopyKey = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(apiKey);
      showToast('API Key copied to clipboard', 'success');
    }
  };

  const handleRunTest = () => {
    setIsCalling(true);
    setTimeout(() => {
      setIsCalling(false);
      setApiResponse(
        JSON.stringify(
          {
            status: 'success',
            execution_time_ms: 184,
            analysis_id: 'ana-live-api-492',
            classification: 'POTENTIALLY_MISLEADING',
            confidence: 0.84,
            claims: [
              {
                id: 'clm-001',
                text: 'New treatment cures all diseases',
                status: 'Misleading',
                confidence: 0.9,
              },
            ],
            evidence: [
              {
                source: 'World Health Organization',
                relationship: 'Contradicting',
                reliability: 0.98,
              },
            ],
            language_signals: {
              clickbait_score: 0.88,
              sensationalism: 0.94,
            },
          },
          null,
          2
        )
      );
      showToast('Live API test request completed (200 OK)', 'success');
    }, 400);
  };

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 font-sans tracking-tight">
            Developer API & Integration Sandbox
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Embed automated claim extraction and verification directly into news CMS, browser extensions, or chat bots.
          </p>
        </div>

        <button
          onClick={() => {
            setApiKey(`tl_live_${Math.random().toString(36).substring(2)}${Date.now()}`);
            showToast('New production API token generated', 'success');
          }}
          className="px-3.5 py-2 rounded-md bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-colors"
        >
          <Key className="w-3.5 h-3.5" />
          <span>Rotate API Key</span>
        </button>
      </div>

      {/* Key Management Card */}
      <div className="p-5 rounded-lg bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 shadow-2xs space-y-3 text-xs">
        <div className="flex items-center justify-between">
          <span className="font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
            Active Workspace API Credentials
          </span>
          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
            Status: Unlimited Tier (Enterprise)
          </span>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="text"
            readOnly
            value={apiKey}
            className="flex-1 h-9 px-3 rounded-md bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-mono text-xs text-slate-800 dark:text-slate-200"
          />
          <button
            onClick={handleCopyKey}
            className="px-3 h-9 rounded-md bg-slate-800 hover:bg-slate-700 text-white font-medium flex items-center gap-1.5"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>Copy</span>
          </button>
        </div>
      </div>

      {/* Interactive Sandbox */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Request Side */}
        <div className="p-5 rounded-lg bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 shadow-2xs space-y-3 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
              Endpoint: <span className="text-blue-600 font-mono">POST /v1/verify</span>
            </span>
            <button
              onClick={handleRunTest}
              disabled={isCalling}
              className="px-3 py-1.5 rounded-md bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-semibold flex items-center gap-1.5 shadow-2xs"
            >
              <Play className="w-3.5 h-3.5" />
              <span>{isCalling ? 'Executing...' : 'Execute Request'}</span>
            </button>
          </div>

          <div>
            <label className="block text-slate-500 dark:text-slate-400 mb-1 font-mono">
              Payload Body (JSON):
            </label>
            <textarea
              rows={12}
              value={testPayload}
              onChange={(e) => setTestPayload(e.target.value)}
              className="w-full p-3 rounded-md bg-slate-900 text-slate-100 font-mono text-xs focus:outline-hidden leading-relaxed"
            />
          </div>
        </div>

        {/* Response Side */}
        <div className="p-5 rounded-lg bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 shadow-2xs space-y-3 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
              Response (200 OK)
            </span>
            <span className="font-mono text-slate-400">Content-Type: application/json</span>
          </div>

          <div className="p-3 rounded-md bg-slate-900 text-emerald-400 font-mono text-xs h-72 overflow-y-auto custom-scrollbar leading-relaxed whitespace-pre">
            {apiResponse || '// Click "Execute Request" to test live inference output...'}
          </div>
        </div>
      </div>
    </div>
  );
};
