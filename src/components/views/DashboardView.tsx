import React from 'react';
import {
  ShieldAlert,
  Flame,
  Target,
  FileCheck,
  MessageSquareWarning,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Clock,
  ExternalLink,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';
import { WantedCase, MissionPlan, PublicTip, AuditLogEntry } from '../../types';
import { MainNavTab } from '../layout/Navigation';

interface DashboardViewProps {
  cases: WantedCase[];
  missions: MissionPlan[];
  tips: PublicTip[];
  auditLogs: AuditLogEntry[];
  onNavigate: (tab: MainNavTab) => void;
  onSelectCase: (caseItem: WantedCase) => void;
  onSelectMission: (mission: MissionPlan) => void;
  onSelectTip: (tip: PublicTip) => void;
  onOpenQuickAi: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  cases,
  missions,
  tips,
  auditLogs,
  onNavigate,
  onSelectCase,
  onSelectMission,
  onSelectTip,
  onOpenQuickAi,
}) => {
  const tier1Cases = cases.filter((c) => c.priorityLevel === 'Tier 1 - Critical');
  const pendingTips = tips.filter((t) => t.status === 'PENDING_REVIEW' || t.status === 'INVESTIGATING');
  const criticalTips = tips.filter((t) => t.credibilityScore >= 80);

  const workflowStages = [
    { label: 'CASE RECEIVED', count: 1, active: true },
    { label: 'SOURCE VERIFIED', count: 2, active: true },
    { label: 'RISK ASSESSED', count: 3, active: true },
    { label: 'MISSION CREATED', count: 2, active: true },
    { label: 'TEAM ASSIGNED', count: 2, active: true },
    { label: 'TIPS COLLECTED', count: tips.length, active: true },
    { label: 'HUMAN REVIEW', count: pendingTips.length, active: true, alert: true },
    { label: 'LAWFUL ACTION', count: 1, active: false },
    { label: 'CASE RESOLVED', count: 3, active: false },
    { label: 'FINAL REPORT', count: 2, active: false },
  ];

  return (
    <div className="space-y-6">
      
      {/* Top Welcome & Mission Status Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950/60 border border-slate-800 rounded-xl p-5 shadow-lg relative overflow-hidden">
        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                ACTIVE LAW ENFORCEMENT BRIEFING
              </span>
              <span className="text-slate-400 text-xs font-mono">• FEDNET ENCRYPTED</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-100 mt-1 tracking-tight">
              Most Wanted Command & Intelligence Center
            </h1>
            <p className="text-sm text-slate-300 max-w-2xl mt-1">
              Authorized mission management platform for verified wanted-person cases, multi-agency task force coordination, secure citizen tips, and lawful administrative reporting.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={onOpenQuickAi}
              className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white px-4 py-2 rounded-lg text-xs font-bold transition shadow-md shadow-indigo-950/40"
            >
              <Sparkles className="w-4 h-4 text-indigo-300" />
              <span>AI Mission Briefing</span>
            </button>
            <button
              onClick={() => onNavigate('Intelligence')}
              className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-3.5 py-2 rounded-lg text-xs font-medium transition"
            >
              <span>Verify Intelligence</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Metric KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Metric 1 */}
        <div 
          onClick={() => onNavigate('Most Wanted')}
          className="bg-slate-900 border border-slate-800 hover:border-red-500/40 rounded-xl p-4 transition cursor-pointer group shadow-sm"
        >
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-mono font-bold uppercase tracking-wider">Tier 1 Fugitives</span>
            <div className="p-2 rounded-lg bg-red-500/10 text-red-400 group-hover:scale-105 transition">
              <Flame className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-100">{tier1Cases.length}</span>
            <span className="text-xs text-red-400 font-medium">Critical Priority</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-400 flex items-center justify-between pt-2 border-t border-slate-800/80">
            <span>Total Published: {cases.length}</span>
            <span className="text-amber-400 font-mono flex items-center">View list &rarr;</span>
          </div>
        </div>

        {/* Metric 2 */}
        <div 
          onClick={() => onNavigate('Missions')}
          className="bg-slate-900 border border-slate-800 hover:border-amber-500/40 rounded-xl p-4 transition cursor-pointer group shadow-sm"
        >
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-mono font-bold uppercase tracking-wider">Active Missions</span>
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 group-hover:scale-105 transition">
              <Target className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-100">{missions.length}</span>
            <span className="text-xs text-amber-400 font-medium">Task Forces Deployed</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-400 flex items-center justify-between pt-2 border-t border-slate-800/80">
            <span>Avg Progress: 65%</span>
            <span className="text-amber-400 font-mono flex items-center">Track &rarr;</span>
          </div>
        </div>

        {/* Metric 3 */}
        <div 
          onClick={() => onNavigate('Tips')}
          className="bg-slate-900 border border-slate-800 hover:border-emerald-500/40 rounded-xl p-4 transition cursor-pointer group shadow-sm"
        >
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-mono font-bold uppercase tracking-wider">Public Tips Queue</span>
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 group-hover:scale-105 transition">
              <MessageSquareWarning className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-100">{tips.length}</span>
            <span className="text-xs text-emerald-400 font-medium">{criticalTips.length} High Corroboration</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-400 flex items-center justify-between pt-2 border-t border-slate-800/80">
            <span>Pending Review: {pendingTips.length}</span>
            <span className="text-emerald-400 font-mono flex items-center">Vetting queue &rarr;</span>
          </div>
        </div>

        {/* Metric 4 */}
        <div 
          onClick={() => onNavigate('Intelligence')}
          className="bg-slate-900 border border-slate-800 hover:border-cyan-500/40 rounded-xl p-4 transition cursor-pointer group shadow-sm"
        >
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-mono font-bold uppercase tracking-wider">Human Verification</span>
            <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 group-hover:scale-105 transition">
              <FileCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-100">4</span>
            <span className="text-xs text-cyan-400 font-medium">Pending Sign-off</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-400 flex items-center justify-between pt-2 border-t border-slate-800/80">
            <span>AI Discrepancies: 2</span>
            <span className="text-cyan-400 font-mono flex items-center">Audit &rarr;</span>
          </div>
        </div>

      </div>

      {/* 10-Step Mission Workflow Visual Progress Pipeline */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-amber-400" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-200">
              Standard Lawful Mission Workflow Pipeline
            </h2>
          </div>
          <span className="text-xs text-slate-400 font-mono">10 Mandatory Stages</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 lg:grid-cols-10 gap-2 pt-2">
          {workflowStages.map((stage, idx) => (
            <div
              key={stage.label}
              className={`p-2.5 rounded-lg border text-center transition flex flex-col justify-between ${
                stage.alert
                  ? 'bg-red-950/40 border-red-500/50 text-red-200'
                  : stage.active
                  ? 'bg-slate-950 border-amber-500/40 text-slate-200'
                  : 'bg-slate-950/50 border-slate-800/60 text-slate-500'
              }`}
            >
              <div className="text-[10px] font-mono text-slate-400 font-bold mb-1">
                STEP {idx + 1}
              </div>
              <div className="text-[11px] font-extrabold leading-tight tracking-tight">
                {stage.label}
              </div>
              <div className="mt-2 text-[10px] font-mono">
                {stage.count > 0 ? (
                  <span className={`px-1.5 py-0.2 rounded font-bold ${stage.alert ? 'bg-red-600 text-white' : 'bg-slate-800 text-slate-300'}`}>
                    {stage.count} items
                  </span>
                ) : (
                  <span className="text-slate-600">—</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Two Column Layout: High-Priority Most Wanted & Urgent Public Tips Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Active High-Priority Cases */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-red-400" />
              <h2 className="text-base font-bold text-slate-100">Top Priority Wanted Persons</h2>
            </div>
            <button
              onClick={() => onNavigate('Most Wanted')}
              className="text-xs text-amber-400 hover:text-amber-300 font-mono flex items-center gap-1"
            >
              <span>View All Most Wanted</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {cases.slice(0, 3).map((caseItem) => (
              <div
                key={caseItem.id}
                onClick={() => onSelectCase(caseItem)}
                className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl p-4 transition cursor-pointer group flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between shadow-sm"
              >
                <div className="flex items-center gap-3.5">
                  <div className="relative shrink-0">
                    <img
                      src={caseItem.photoUrl}
                      alt={caseItem.fullName}
                      className="w-14 h-14 rounded-lg object-cover border border-slate-700 group-hover:border-amber-500/50 transition"
                    />
                    <span className="absolute -top-1.5 -left-1.5 px-1 py-0.2 rounded bg-red-600 text-[9px] font-mono font-bold text-white uppercase">
                      {caseItem.priorityLevel.split(' - ')[0]}
                    </span>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-sm font-bold text-slate-100 group-hover:text-amber-400 transition">
                        {caseItem.fullName}
                      </h3>
                      {caseItem.aliases[0] && (
                        <span className="text-xs text-slate-400 font-mono">
                          a.k.a. {caseItem.aliases[0]}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-300 line-clamp-1 mt-0.5 font-medium">
                      {caseItem.primaryCharge}
                    </p>
                    <div className="flex items-center gap-3 text-[11px] text-slate-400 font-mono mt-1.5">
                      <span>Warrant: {caseItem.warrantNumber}</span>
                      <span>•</span>
                      <span className="text-amber-400 font-bold">Reward: {caseItem.rewardAmount}</span>
                    </div>
                  </div>
                </div>

                <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-800">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-950 text-emerald-400 border border-slate-800">
                    VERIFIED
                  </span>
                  <span className="text-[11px] text-slate-400">
                    {caseItem.leadAgency.split(' (')[0]}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Live Incoming Tips Review Feed */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageSquareWarning className="w-4 h-4 text-emerald-400" />
              <h2 className="text-base font-bold text-slate-100">Live Public Tip Review Queue</h2>
            </div>
            <button
              onClick={() => onNavigate('Tips')}
              className="text-xs text-emerald-400 hover:text-emerald-300 font-mono flex items-center gap-1"
            >
              <span>Open Queue ({tips.length})</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {tips.slice(0, 3).map((tip) => (
              <div
                key={tip.id}
                onClick={() => onSelectTip(tip)}
                className="bg-slate-900 border border-slate-800 hover:border-emerald-500/40 rounded-xl p-3.5 transition cursor-pointer group shadow-sm"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-mono font-bold text-amber-400">
                    {tip.referenceNumber}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-950 text-slate-300 border border-slate-800">
                      Score: {tip.credibilityScore}%
                    </span>
                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold ${
                      tip.status === 'CORROBORATED'
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                    }`}>
                      {tip.status}
                    </span>
                  </div>
                </div>

                <div className="mt-1.5">
                  <div className="text-xs font-semibold text-slate-200">
                    Subject: {tip.targetSubjectName || 'Unspecified'}
                  </div>
                  <p className="text-xs text-slate-400 line-clamp-2 mt-0.5">
                    "{tip.detailedDescription}"
                  </p>
                </div>

                <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-400">
                  <span>Loc: {tip.locationReported.city}, {tip.locationReported.stateOrRegion}</span>
                  <span className="text-slate-500">
                    {tip.attachments.length} files attached
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Quick AI Task Generator Card */}
          <div className="bg-gradient-to-br from-indigo-950/40 via-slate-900 to-slate-900 border border-indigo-900/40 rounded-xl p-4 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 shrink-0">
                <Sparkles className="w-5 h-5 text-indigo-400" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-indigo-200">
                  AI Mission Intelligence Assistant
                </h3>
                <p className="text-xs text-slate-300 mt-1">
                  Cross-examine records for contradictions, generate lawful task checklists, or prepare tactical mission briefings with verified human review.
                </p>
                <div className="mt-3 flex items-center gap-2">
                  <button
                    onClick={onOpenQuickAi}
                    className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold px-3 py-1.5 rounded-md transition shadow-sm"
                  >
                    Open AI Mission Assistant
                  </button>
                  <button
                    onClick={() => onNavigate('Intelligence')}
                    className="text-xs text-indigo-300 hover:text-white font-mono"
                  >
                    Compare records &rarr;
                  </button>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
