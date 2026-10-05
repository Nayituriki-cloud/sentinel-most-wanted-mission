import React from 'react';
import { Shield, ShieldAlert, Lock, UserCheck, Eye, Sparkles, MessageSquarePlus, RefreshCw, KeyRound, FolderDown } from 'lucide-react';
import { UserRole, UserSession } from '../../types';
import { PWAInstallButton } from '../common/PWAInstallButton';

interface HeaderProps {
  userSession: UserSession;
  onChangeRole: (role: UserRole) => void;
  onOpenTipModal: () => void;
  onQuickAiBriefing: () => void;
  onOpenDownloadCenter: () => void;
  activeTipsCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  userSession,
  onChangeRole,
  onOpenTipModal,
  onQuickAiBriefing,
  onOpenDownloadCenter,
  activeTipsCount,
}) => {
  return (
    <header className="bg-slate-900 border-b border-slate-800 text-slate-100 sticky top-0 z-30 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">
          
          {/* Logo & Operational Agency Branding */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-600 via-amber-500 to-amber-700 flex items-center justify-center shadow-md shadow-amber-950/50 border border-amber-400/40">
                <Shield className="w-5 h-5 text-slate-950 stroke-[2.5]" />
              </div>
              <span className="absolute -bottom-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 border border-slate-900"></span>
              </span>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-lg tracking-wider text-slate-100 flex items-center gap-1.5">
                  SENTINEL
                  <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30">
                    MISSION OS
                  </span>
                </span>
              </div>
              <div className="text-[11px] font-mono text-slate-400 flex items-center gap-2">
                <span>MOST WANTED MISSION ASSISTANT</span>
                <span className="text-slate-600">•</span>
                <span className="text-emerald-400 flex items-center gap-1 font-semibold">
                  <Lock className="w-2.5 h-2.5" /> CJIS COMPLIANT
                </span>
              </div>
            </div>
          </div>

          {/* Quick Central Action: Security Clearance & Anti-Vigilantism Notice */}
          <div className="hidden xl:flex items-center gap-2 bg-slate-950/80 border border-slate-800 px-3 py-1 rounded-full text-xs font-mono">
            <span className="text-amber-400 flex items-center gap-1 font-bold">
              <KeyRound className="w-3.5 h-3.5" /> CLEARANCE:
            </span>
            <span className="text-slate-300 font-semibold">{userSession.clearanceLevel}</span>
            <span className="text-slate-600">|</span>
            <span className="text-emerald-400 flex items-center gap-1">
              <UserCheck className="w-3.5 h-3.5" /> 2FA ENFORCED
            </span>
          </div>

          {/* Actions & Role Switcher */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Install / Download Standalone PWA */}
            <PWAInstallButton variant="header" />

            {/* Downloads / Export Center */}
            <button
              onClick={onOpenDownloadCenter}
              className="inline-flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-2.5 sm:px-3 py-1.5 rounded-md text-xs font-medium transition shadow-sm"
              title="Download Posters, Case Packages, and Reports"
            >
              <FolderDown className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Exports</span>
            </button>

            {/* AI Assistant Quick Briefing */}
            <button
              onClick={onQuickAiBriefing}
              className="hidden md:inline-flex items-center gap-1.5 bg-gradient-to-r from-indigo-900/70 to-indigo-800/80 hover:from-indigo-800 hover:to-indigo-700 text-indigo-200 border border-indigo-600/50 px-3 py-1.5 rounded-md text-xs font-medium transition shadow-sm"
              title="Launch AI Mission Briefing"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>AI Briefing</span>
            </button>

            {/* Public Tip Portal CTA Button */}
            <button
              onClick={onOpenTipModal}
              className="hidden lg:inline-flex items-center gap-1.5 bg-gradient-to-r from-slate-800 to-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold px-3 py-1.5 rounded-md text-xs transition shadow-sm"
            >
              <MessageSquarePlus className="w-3.5 h-3.5 text-emerald-400" />
              <span>Tip</span>
              {activeTipsCount > 0 && (
                <span className="bg-slate-950 text-amber-300 text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold">
                  {activeTipsCount}
                </span>
              )}
            </button>

            {/* Role Switcher for simulation / testing */}
            <div className="relative flex items-center bg-slate-950 border border-slate-800 rounded-md p-1">
              <Eye className="w-3.5 h-3.5 text-slate-400 ml-1 mr-1.5 shrink-0" />
              <select
                aria-label="Investigative Access Role"
                value={userSession.role}
                onChange={(e) => onChangeRole(e.target.value as UserRole)}
                className="bg-transparent text-xs text-slate-200 font-mono focus:outline-none cursor-pointer pr-1"
              >
                <option value="SUPERVISORY_AGENT" className="bg-slate-900 text-slate-100">
                  Supervisor (SSA Miller)
                </option>
                <option value="TASK_FORCE_DETECTIVE" className="bg-slate-900 text-slate-100">
                  Detective (Insp. Gallagher)
                </option>
                <option value="INTEL_ANALYST" className="bg-slate-900 text-slate-100">
                  Intel Analyst (Cooper)
                </option>
                <option value="AGENCY_DIRECTOR" className="bg-slate-900 text-slate-100">
                  Agency Director (Sterling)
                </option>
                <option value="PUBLIC_VIEW" className="bg-slate-900 text-slate-100">
                  Public Citizen View
                </option>
              </select>
            </div>

          </div>
        </div>
      </div>
    </header>
  );
};
