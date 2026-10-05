import React from 'react';
import {
  BarChart3,
  Clock,
  CheckCircle2,
  TrendingUp,
  Users,
  Building,
  Zap,
  Droplets,
  HeartPulse,
  Briefcase,
  ShieldCheck,
  Award
} from 'lucide-react';
import { CountryProfile } from '../types';

interface ScorecardDashboardProps {
  countries: CountryProfile[];
}

export const ScorecardDashboard: React.FC<ScorecardDashboardProps> = ({ countries }) => {
  const kpis = [
    {
      label: 'Avg Response Time',
      value: '31.4 min',
      target: 'Target: < 45m',
      trend: '-28% vs 2024 baseline',
      icon: Clock,
      color: 'text-emerald-400',
    },
    {
      label: 'Avg Recovery Velocity',
      value: '42 Days',
      target: 'Target: < 60d',
      trend: '3x faster than traditional aid',
      icon: TrendingUp,
      color: 'text-teal-400',
    },
    {
      label: 'People Protected & Helped',
      value: '1.85M',
      target: 'Across 6 Member States',
      trend: '+450K during 2026 rains',
      icon: Users,
      color: 'text-sky-400',
    },
    {
      label: 'Budget Utilization Efficiency',
      value: '94.2%',
      target: 'Zero Waste Audit Standard',
      trend: 'Audited by Supreme Audit',
      icon: ShieldCheck,
      color: 'text-amber-400',
    },
    {
      label: 'Infrastructure Restored',
      value: '420 km',
      target: 'Trunk & Feeder Roads',
      trend: '18 Bailey bridges erected',
      icon: Building,
      color: 'text-emerald-400',
    },
    {
      label: 'Clean Water Gain',
      value: '+9.1%',
      target: 'National Rwanda Pilot',
      trend: '87% population reach',
      icon: Droplets,
      color: 'text-blue-400',
    },
    {
      label: 'Energy Access Uplift',
      value: '+12.0%',
      target: 'Solar Microgrids & Grid',
      trend: '82% total coverage',
      icon: Zap,
      color: 'text-amber-400',
    },
    {
      label: 'Local Green Jobs Created',
      value: '24,800',
      target: 'Youth & Cooperative Works',
      trend: 'Umuganda + Civil Corps',
      icon: Briefcase,
      color: 'text-teal-400',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 lg:p-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
              <span>Auditable Institutional Performance</span>
              <span aria-hidden="true">·</span>
              <span>AU Agenda 2063 & Rwanda Vision 2050 Alignment</span>
            </div>
            <h1 className="text-xl lg:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              <Award className="w-6 h-6 text-emerald-400" />
              Africa Development Scorecard
            </h1>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>Audited: October 2026 (Continuous Verification)</span>
          </div>
        </div>
      </div>

      {/* 8 Primary KPI Tiles */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {kpis.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div
              key={idx}
              className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-slate-400 block">{kpi.label}</span>
                <Icon className={`w-4 h-4 ${kpi.color}`} />
              </div>
              <div className="text-2xl font-mono font-black text-white">{kpi.value}</div>
              <div className="flex items-baseline justify-between text-[10px] font-mono text-slate-400 pt-1 border-t border-slate-800/60">
                <span>{kpi.target}</span>
                <span className="text-emerald-400">{kpi.trend}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Continental Benchmark Table */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white">
            Country Network Resilience & Acceleration Matrix
          </h3>
          <span className="text-xs text-slate-400 font-mono">Ranked by Composite Index</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-mono">
                <th className="py-2.5">Country / Flagship</th>
                <th className="py-2.5">Region</th>
                <th className="py-2.5 text-right">Composite Index</th>
                <th className="py-2.5 text-right">Resilience Score</th>
                <th className="py-2.5 text-right">Water Access</th>
                <th className="py-2.5 text-right">Electricity</th>
                <th className="py-2.5 text-right">Active Projects</th>
                <th className="py-2.5 text-right">Audit Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {countries.map((c) => {
                const water = c.indicators.find((i) => i.category === 'Water access')?.score || 50;
                const power = c.indicators.find((i) => i.category === 'Electricity')?.score || 50;

                return (
                  <tr key={c.id} className="hover:bg-slate-950/40">
                    <td className="py-3 font-sans font-bold text-white flex items-center gap-2">
                      <span>{c.name}</span>
                      {c.pilotStatus && (
                        <span className="text-[9px] px-1 py-0.2 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                          PILOT
                        </span>
                      )}
                    </td>
                    <td className="py-3 text-slate-400 font-sans">{c.region}</td>
                    <td className="py-3 text-right font-bold text-emerald-400">
                      {c.compositeIndex}%
                    </td>
                    <td className="py-3 text-right text-teal-400">{c.resilienceScore}%</td>
                    <td className="py-3 text-right text-blue-400">{water}%</td>
                    <td className="py-3 text-right text-amber-400">{power}%</td>
                    <td className="py-3 text-right text-slate-200">{c.activeProjectsCount}</td>
                    <td className="py-3 text-right text-emerald-400 font-sans flex items-center justify-end gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Certified</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
