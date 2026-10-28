import React from 'react';
import {
  Shield,
  Users,
  Activity,
  Server,
  Lock,
  CheckCircle2,
  AlertTriangle,
  RotateCw,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const AdminPage: React.FC = () => {
  const { showToast } = useApp();

  const teamMembers = [
    { name: 'Alex Carter', email: 'a.carter@truthlens.ai', role: 'Senior Intelligence Analyst', status: 'Active' },
    { name: 'Dr. Sarah Lin', email: 's.lin@truthlens.ai', role: 'Lead ML Researcher', status: 'Active' },
    { name: 'Marcus Vance', email: 'm.vance@truthlens.ai', role: 'Fact-Check Desk Editor', status: 'Active' },
    { name: 'Elena Rostova', email: 'e.rostova@truthlens.ai', role: 'OSINT Investigator', status: 'Active' },
  ];

  const systemServices = [
    { service: 'Ingestion Cluster (Kafka/Debezium)', status: 'Operational', latency: '4ms', uptime: '99.99%' },
    { service: 'Vector Embedding Store (Pinecone/Milvus)', status: 'Operational', latency: '12ms', uptime: '99.98%' },
    { service: 'Inference GPU Pool (A100 TensorRT)', status: 'Operational', latency: '65ms', uptime: '100.0%' },
    { service: 'Primary PostgreSQL Database', status: 'Operational', latency: '2ms', uptime: '99.99%' },
  ];

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 font-sans tracking-tight">
            System Administration & Security Governance
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Role-Based Access Control (RBAC), ingestion cluster health, and cryptographic audit logs.
          </p>
        </div>

        <button
          onClick={() => showToast('Cluster diagnostics healthy. All pods in ready state.', 'success')}
          className="px-3.5 py-2 rounded-md bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-colors"
        >
          <RotateCw className="w-3.5 h-3.5" />
          <span>Run Health Probe</span>
        </button>
      </div>

      {/* Cluster Health */}
      <div className="p-5 rounded-lg bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 shadow-2xs space-y-4">
        <h3 className="font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider text-xs flex items-center gap-1.5">
          <Server className="w-4 h-4 text-emerald-500" />
          <span>Core Infrastructure Services</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          {systemServices.map((s) => (
            <div
              key={s.service}
              className="p-3.5 rounded-md bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex items-center justify-between"
            >
              <div>
                <div className="font-semibold text-slate-800 dark:text-slate-200">{s.service}</div>
                <div className="text-[11px] text-slate-400">
                  Latency: {s.latency} • Uptime: {s.uptime}
                </div>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                <span>{s.status}</span>
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Team Access */}
      <div className="p-5 rounded-lg bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider text-xs flex items-center gap-1.5">
            <Users className="w-4 h-4 text-blue-500" />
            <span>Team Workspace Access ({teamMembers.length})</span>
          </h3>
          <button
            onClick={() => showToast('Team invitation modal opened', 'info')}
            className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
          >
            + Invite Member
          </button>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
          {teamMembers.map((member) => (
            <div key={member.email} className="py-3 flex items-center justify-between">
              <div>
                <div className="font-semibold text-slate-800 dark:text-slate-200">{member.name}</div>
                <div className="text-[11px] text-slate-400">{member.email}</div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[11px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium">
                  {member.role}
                </span>
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold text-[11px]">
                  {member.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
