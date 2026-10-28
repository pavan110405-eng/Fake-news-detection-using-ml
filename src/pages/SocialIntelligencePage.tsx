import React, { useState } from 'react';
import {
  Share2,
  Users,
  Radio,
  TrendingUp,
  AlertTriangle,
  Bot,
  Zap,
  Globe,
  Filter,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import { useApp } from '../context/AppContext';

export const SocialIntelligencePage: React.FC = () => {
  const { theme, showToast } = useApp();

  const [activePlatform, setActivePlatform] = useState<string>('All');

  const hourlySpikeData = [
    { hour: '06:00', mentions: 120, botActivity: 35 },
    { hour: '08:00', mentions: 450, botActivity: 190 },
    { hour: '10:00', mentions: 1820, botActivity: 1150 }, // Massive coordinated spike!
    { hour: '12:00', mentions: 3400, botActivity: 2100 },
    { hour: '14:00', mentions: 2900, botActivity: 1700 },
    { hour: '16:00', mentions: 2100, botActivity: 1200 },
    { hour: '18:00', mentions: 1400, botActivity: 780 },
  ];

  const platformDistribution = [
    { name: 'X / Twitter', share: 45, fill: '#3b82f6' },
    { name: 'Telegram', share: 25, fill: '#06b6d4' },
    { name: 'TikTok', share: 15, fill: '#ec4899' },
    { name: 'Reddit', share: 10, fill: '#f97316' },
    { name: 'Facebook', share: 5, fill: '#6366f1' },
  ];

  const suspiciousClusters = [
    {
      id: 'cluster-alpha',
      name: 'Bot Cluster Alpha (Russian/Eastern EU Proxies)',
      accountCount: 624,
      coordinationScore: 94,
      creationWindow: 'March 2026',
      primaryNarrative: 'Universal cure suppression by regulatory bodies',
      sampleHandle: '@HealthTruthNet49',
    },
    {
      id: 'cluster-beta',
      name: 'Syndicated Affiliate Click-Ring',
      accountCount: 215,
      coordinationScore: 88,
      creationWindow: 'August 2026',
      primaryNarrative: 'Redirecting traffic to supplement checkout funnel',
      sampleHandle: '@MiracleDailyNews',
    },
    {
      id: 'cluster-gamma',
      name: 'Organic Amplifier Network',
      accountCount: 1420,
      coordinationScore: 42,
      creationWindow: 'Mixed (2018-2025)',
      primaryNarrative: 'Wellness influencers re-posting claim without verification',
      sampleHandle: '@BioHackLifestyle',
    },
  ];

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 font-sans tracking-tight">
            Social Intelligence & Astroturfing Detection
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Identify bot farms, coordinated inauthentic behavior, and algorithmic amplification vectors.
          </p>
        </div>

        <button
          onClick={() => showToast('Social signal scraping refreshed across 5 API feeds', 'success')}
          className="px-3.5 py-2 rounded-md bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-colors"
        >
          <Radio className="w-3.5 h-3.5 animate-pulse" />
          <span>Live Ingestion Active</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-lg bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 shadow-2xs">
          <div className="text-xs font-medium text-slate-500 dark:text-slate-400">Total Monitored Posts</div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white mt-1">42,890</div>
          <div className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-0.5 font-medium">+124% in last 6h</div>
        </div>

        <div className="p-4 rounded-lg bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 shadow-2xs">
          <div className="text-xs font-medium text-slate-500 dark:text-slate-400">Coordinated Inauthentic Accounts</div>
          <div className="text-2xl font-bold text-rose-600 dark:text-rose-400 mt-1">839</div>
          <div className="text-[11px] text-rose-500 mt-0.5 font-medium">94% Co-posting synchronicity</div>
        </div>

        <div className="p-4 rounded-lg bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 shadow-2xs">
          <div className="text-xs font-medium text-slate-500 dark:text-slate-400">Astroturfing Index</div>
          <div className="text-2xl font-bold text-amber-600 dark:text-amber-400 mt-1">78 / 100</div>
          <div className="text-[11px] text-amber-500 mt-0.5 font-medium">Severe synthetic volume</div>
        </div>

        <div className="p-4 rounded-lg bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 shadow-2xs">
          <div className="text-xs font-medium text-slate-500 dark:text-slate-400">Viral Velocity Peak</div>
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mt-1">3.4k / hr</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Peak at 12:00 UTC</div>
        </div>
      </div>

      {/* Chart Section: Temporal Volume & Inauthentic Spike */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 p-4 rounded-lg bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                Diffusion Velocity vs. Bot Activity
              </h3>
              <p className="text-[11px] text-slate-400">Temporal correlation between coordinated bots and total reach</p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5 text-blue-500 font-medium">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500" /> Total Mentions
              </span>
              <span className="flex items-center gap-1.5 text-rose-500 font-medium">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500" /> Bot Activity
              </span>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={hourlySpikeData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#1e293b' : '#f1f5f9'} />
                <XAxis dataKey="hour" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: theme === 'dark' ? '#0f172a' : '#ffffff',
                    borderColor: theme === 'dark' ? '#334155' : '#e2e8f0',
                    fontSize: '12px',
                    borderRadius: '8px',
                  }}
                />
                <Area type="monotone" dataKey="mentions" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.2} />
                <Area type="monotone" dataKey="botActivity" stroke="#f43f5e" fill="#f43f5e" fillOpacity={0.4} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Platform Share */}
        <div className="lg:col-span-4 p-4 rounded-lg bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 shadow-2xs space-y-4">
          <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
            Propagation by Platform
          </h3>

          <div className="space-y-3 text-xs">
            {platformDistribution.map((p) => (
              <div key={p.name} className="space-y-1">
                <div className="flex justify-between font-medium text-slate-700 dark:text-slate-300">
                  <span>{p.name}</span>
                  <span className="font-bold">{p.share}%</span>
                </div>
                <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div style={{ width: `${p.share}%`, backgroundColor: p.fill }} className="h-full rounded-full" />
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 rounded-md bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 text-xs text-amber-900 dark:text-amber-300">
            <span className="font-bold">Astroturfing Alert:</span> 62% of cross-platform posts were shared within 4.2 seconds of initial publication, indicating programmatic API triggers.
          </div>
        </div>
      </div>

      {/* Detected Inauthentic Account Clusters */}
      <div className="p-5 rounded-lg bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 shadow-2xs space-y-4">
        <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
          <Bot className="w-4 h-4 text-rose-500" />
          <span>Coordinated Inauthentic Account Clusters</span>
        </h3>

        <div className="space-y-3">
          {suspiciousClusters.map((cluster) => (
            <div
              key={cluster.id}
              className="p-4 rounded-md bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-xs"
            >
              <div className="space-y-1 min-w-0">
                <div className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <span>{cluster.name}</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-400">
                    {cluster.coordinationScore}% Coordinated
                  </span>
                </div>
                <p className="text-slate-500 dark:text-slate-400 text-[11px]">
                  Narrative Focus: {cluster.primaryNarrative}
                </p>
                <div className="text-[10px] text-slate-400">
                  Creation: {cluster.creationWindow} • Example Node: <span className="font-mono text-slate-700 dark:text-slate-300">{cluster.sampleHandle}</span>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <div className="text-right">
                  <div className="font-mono font-bold text-base text-slate-800 dark:text-slate-200">
                    {cluster.accountCount}
                  </div>
                  <div className="text-[10px] text-slate-400">Linked Accounts</div>
                </div>

                <button
                  onClick={() => showToast(`Added ${cluster.name} to isolation watch list`, 'info')}
                  className="px-3 py-1.5 rounded-md bg-slate-800 hover:bg-slate-700 text-white font-medium text-xs"
                >
                  Flag Cluster
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
