import React, { useState } from 'react';
import {
  GitFork,
  ArrowRight,
  User,
  Clock,
  Sparkles,
  Share2,
  AlertTriangle,
  CheckCircle2,
  ExternalLink,
  Zap,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const PropagationPage: React.FC = () => {
  const { showToast } = useApp();

  const [selectedNode, setSelectedNode] = useState<any>(null);

  const propagationNodes = [
    {
      id: 'node-0',
      label: 'Patient Zero (Origin)',
      entity: 'curehealthnews.xyz',
      time: 'Sep 22, 06:12 UTC',
      reach: 'Origin Post',
      role: 'Seed Publisher',
      type: 'origin',
      narrativeMutation: 'Original assertion: Miracle cure removes all human illness.',
    },
    {
      id: 'node-1',
      label: 'First Amplification Vector',
      entity: '@HealthFreedomDaily (Telegram)',
      time: 'Sep 22, 07:30 UTC',
      reach: '48,000 subscribers',
      role: 'Super Spreader',
      type: 'spreader',
      narrativeMutation: 'Added claim that FDA is actively raiding the research laboratory.',
    },
    {
      id: 'node-2',
      label: 'Bot Syndication Gateway',
      entity: 'Automated Bot Cluster Alpha',
      time: 'Sep 22, 08:45 UTC',
      reach: '624 coordinated accounts',
      role: 'Astroturfing Network',
      type: 'bot',
      narrativeMutation: 'Mass duplicated identical link across 1,200 comment threads.',
    },
    {
      id: 'node-3',
      label: 'Mainstream Exposure Point',
      entity: '@AltWellnessGuru (X/Twitter)',
      time: 'Sep 22, 10:15 UTC',
      reach: '310,000 followers',
      role: 'High-Impact Influencer',
      type: 'influencer',
      narrativeMutation: 'Re-framed as "natural botanical breakthrough big pharma doesn\'t want you to see".',
    },
    {
      id: 'node-4',
      label: 'Counter-Narrative & Debunk',
      entity: 'Reuters Fact Check & WHO',
      time: 'Sep 22, 12:40 UTC',
      reach: 'Global Wire Distribution',
      role: 'Factual Clarification',
      type: 'factcheck',
      narrativeMutation: 'Confirmed zero clinical backing or clinical trial registry entries.',
    },
  ];

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 font-sans tracking-tight">
            Propagation & Viral Diffusion Analysis
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Trace rumors back to origin "Patient Zero" and reconstruct narrative evolution across media bridges.
          </p>
        </div>

        <button
          onClick={() => showToast('Propagation graph exported to SVG/JSON', 'success')}
          className="px-3.5 py-2 rounded-md bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
        >
          <Share2 className="w-3.5 h-3.5" />
          <span>Export Graph</span>
        </button>
      </div>

      {/* Target Claim Header */}
      <div className="p-4 rounded-lg bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
        <div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Trace Target
          </span>
          <div className="font-bold text-slate-900 dark:text-white text-sm mt-0.5">
            "Scientists discover miracle cure for all diseases, claims study"
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-400 font-bold text-[11px]">
            High Diffusion Velocity
          </span>
          <span className="text-slate-400">Duration: 6h 28m elapsed</span>
        </div>
      </div>

      {/* Interactive Propagation Chain */}
      <div className="p-5 rounded-lg bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 shadow-2xs space-y-6">
        <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
          Chronological Diffusion Tree
        </h3>

        <div className="relative pl-6 sm:pl-8 border-l-2 border-slate-200 dark:border-slate-800 space-y-6">
          {propagationNodes.map((node, idx) => (
            <div
              key={node.id}
              onClick={() => setSelectedNode(node)}
              className="relative group cursor-pointer"
            >
              {/* Node indicator */}
              <div
                className={`absolute -left-[31px] sm:-left-[39px] top-1 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border-2 ${
                  node.type === 'origin'
                    ? 'bg-rose-500 text-white border-white dark:border-[#0f172a]'
                    : node.type === 'bot'
                    ? 'bg-amber-500 text-white border-white dark:border-[#0f172a]'
                    : node.type === 'factcheck'
                    ? 'bg-emerald-500 text-white border-white dark:border-[#0f172a]'
                    : 'bg-blue-600 text-white border-white dark:border-[#0f172a]'
                }`}
              >
                {idx + 1}
              </div>

              {/* Node Card */}
              <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 group-hover:border-blue-400 transition-colors space-y-2 text-xs">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 dark:text-white text-xs">
                      {node.label}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold">
                      {node.role}
                    </span>
                  </div>

                  <span className="text-slate-400 text-[11px] font-mono">{node.time}</span>
                </div>

                <div className="font-semibold text-blue-600 dark:text-blue-400">
                  {node.entity} <span className="text-slate-400 font-normal">({node.reach})</span>
                </div>

                <div className="p-2.5 rounded bg-white dark:bg-slate-950/40 border border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-300 text-[11px]">
                  <span className="font-semibold text-slate-700 dark:text-slate-200">
                    Narrative State:
                  </span>{' '}
                  {node.narrativeMutation}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Super-Spreaders and Influence Hubs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
        <div className="p-4 rounded-lg bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 shadow-2xs space-y-1">
          <div className="text-[10px] text-slate-400 uppercase font-bold">Patient Zero Origin</div>
          <div className="font-bold text-slate-800 dark:text-slate-200 text-sm">curehealthnews.xyz</div>
          <div className="text-slate-500 dark:text-slate-400 text-[11px]">First detected 06:12 UTC via RSS feed</div>
        </div>

        <div className="p-4 rounded-lg bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 shadow-2xs space-y-1">
          <div className="text-[10px] text-slate-400 uppercase font-bold">Largest Diffusion Bridge</div>
          <div className="font-bold text-slate-800 dark:text-slate-200 text-sm">Telegram Health Ring</div>
          <div className="text-slate-500 dark:text-slate-400 text-[11px]">Bridged isolated web to 48k subscribers</div>
        </div>

        <div className="p-4 rounded-lg bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 shadow-2xs space-y-1">
          <div className="text-[10px] text-slate-400 uppercase font-bold">First Fact-Check Refutation</div>
          <div className="font-bold text-emerald-600 dark:text-emerald-400 text-sm">Reuters & WHO Wire</div>
          <div className="text-slate-500 dark:text-slate-400 text-[11px]">Published 6h 28m post-outbreak</div>
        </div>
      </div>
    </div>
  );
};
