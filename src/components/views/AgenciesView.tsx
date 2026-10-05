import React from 'react';
import {
  Building2,
  Shield,
  Phone,
  Radio,
  FileCheck,
  ExternalLink,
  Users,
  Lock,
} from 'lucide-react';
import { AgencyPartner } from '../../types';

interface AgenciesViewProps {
  agencies: AgencyPartner[];
}

export const AgenciesView: React.FC<AgenciesViewProps> = ({ agencies }) => {
  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl shadow-sm">
        <div className="flex items-center gap-2">
          <Building2 className="w-5 h-5 text-amber-500" />
          <h1 className="text-xl sm:text-2xl font-black text-slate-100 tracking-tight">
            Authorized Partner Agencies & Regional Task Forces
          </h1>
        </div>
        <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-3xl">
          Multi-jurisdictional collaboration roster: certified federal bureaus, international police organizations, state police intelligence desks, and regional task force commanders.
        </p>
      </div>

      {/* Agencies Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {agencies.map((agency) => (
          <div
            key={agency.id}
            className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4 hover:border-slate-700 transition"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                  {agency.jurisdictionType}
                </span>
                <h2 className="text-base font-bold text-slate-100 mt-1.5 leading-snug">
                  {agency.name}
                </h2>
                <div className="text-xs text-slate-400 font-mono">
                  {agency.badgeEmblem}
                </div>
              </div>

              <div className="w-9 h-9 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-center text-slate-300 shrink-0 font-mono font-bold text-xs">
                {agency.shortCode}
              </div>
            </div>

            <div className="space-y-2 text-xs font-mono text-slate-300 pt-2 border-t border-slate-800">
              <div>
                <span className="text-slate-500 text-[10px] block">HEADQUARTERS:</span>
                <span className="text-slate-200">{agency.headquarters}</span>
              </div>

              <div>
                <span className="text-slate-500 text-[10px] block">LIAISON OFFICER:</span>
                <span className="text-slate-200 font-semibold">{agency.activeLiaison}</span>
              </div>

              <div>
                <span className="text-slate-500 text-[10px] block">ENCRYPTED PROTOCOL:</span>
                <span className="text-cyan-400 flex items-center gap-1">
                  <Lock className="w-3 h-3" /> {agency.secureCommsProtocol}
                </span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs font-mono">
              <span className="text-slate-400">
                Shared Cases: <strong className="text-amber-400">{agency.activeSharedCasesCount} active</strong>
              </span>
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <Radio className="w-3 h-3" /> Online
              </span>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
};
