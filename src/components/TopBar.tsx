import React from 'react';
import {
  Activity,
  Zap,
  Globe2,
  FolderHeart,
  TrendingUp,
  PackageSearch,
  Users2,
  BarChart3,
  Bot,
  Smartphone,
  ShieldCheck,
  Wifi,
  WifiOff
} from 'lucide-react';
import { UserRole } from '../types';

export type NavTab =
  | 'map'
  | 'response'
  | 'speed'
  | 'recovery'
  | 'development'
  | 'resources'
  | 'community'
  | 'scorecard'
  | 'ai'
  | 'ussd'
  | 'audit';

interface TopBarProps {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  onOpenSpeedMode: () => void;
  lowBandwidth: boolean;
  setLowBandwidth: (val: boolean) => void;
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  criticalIncidentCount: number;
}

export const TopBar: React.FC<TopBarProps> = ({
  activeTab,
  setActiveTab,
  onOpenSpeedMode,
  lowBandwidth,
  setLowBandwidth,
  currentRole,
  setCurrentRole,
  criticalIncidentCount,
}) => {
  const navItems: { id: NavTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'map', label: 'Africa Map', icon: Globe2 },
    { id: 'response', label: 'Rapid Response', icon: Activity },
    { id: 'recovery', label: 'Recovery Missions', icon: FolderHeart },
    { id: 'development', label: 'Development Accelerator', icon: TrendingUp },
    { id: 'resources', label: 'Resource Matching', icon: PackageSearch },
    { id: 'community', label: 'Communities & Reports', icon: Users2 },
    { id: 'scorecard', label: 'Scorecard', icon: BarChart3 },
    { id: 'ai', label: 'AI Assistant', icon: Bot },
    { id: 'ussd', label: 'USSD *788#', icon: Smartphone },
    { id: 'audit', label: 'Audit Log', icon: ShieldCheck },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-950/95 backdrop-blur-md px-4 lg:px-6 py-2.5 transition-colors">
      <div className="flex items-center justify-between gap-4 max-w-[1720px] mx-auto">
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setActiveTab('map')}
            className="text-left group cursor-pointer focus:outline-none"
          >
            <span className="text-base lg:text-lg font-bold tracking-tight text-white flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              AFRICA FIRST
              <span className="text-xs font-normal text-slate-400 hidden sm:inline">
                · Rapid Response & Development
              </span>
            </span>
          </button>
        </div>

        {/* Zone 2: Navigation Links (Clean text with subtle active state) */}
        <nav className="hidden xl:flex items-center gap-1 overflow-x-auto py-0.5 scrollbar-none">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-slate-800 text-emerald-400 font-semibold'
                    : 'text-slate-300 hover:text-white hover:bg-slate-900/60'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
                {item.id === 'response' && criticalIncidentCount > 0 && (
                  <span className="ml-1 text-[10px] font-mono px-1 py-0.2 rounded bg-rose-500/20 text-rose-400 border border-rose-500/30">
                    {criticalIncidentCount}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: 1-2 primary actions + operational controls */}
        <div className="flex items-center gap-2.5 shrink-0">
          {/* Speed Mode Direct Action Button */}
          <button
            onClick={onOpenSpeedMode}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-rose-200 bg-rose-950/80 border border-rose-700/60 rounded-md hover:bg-rose-900/80 transition-colors shadow-sm cursor-pointer whitespace-nowrap"
            title="Open Rapid Action Cockpit for Critical Emergencies"
          >
            <Zap className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
            <span className="hidden sm:inline">Speed Mode</span>
            <span className="font-mono text-[10px] px-1 py-0.2 bg-rose-500/20 text-rose-300 rounded">
              CRITICAL
            </span>
          </button>

          {/* Low Bandwidth Toggle */}
          <button
            onClick={() => setLowBandwidth(!lowBandwidth)}
            className={`flex items-center gap-1 px-2.5 py-1.5 text-xs rounded-md border transition-colors cursor-pointer whitespace-nowrap ${
              lowBandwidth
                ? 'bg-amber-950/60 border-amber-600/60 text-amber-300'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
            title="Toggle Low-Bandwidth Mode for slow mobile networks"
          >
            {lowBandwidth ? <WifiOff className="w-3.5 h-3.5 text-amber-400" /> : <Wifi className="w-3.5 h-3.5" />}
            <span className="hidden md:inline">{lowBandwidth ? 'Low-BW Active' : 'Low-BW'}</span>
          </button>

          {/* Role selector */}
          <div className="relative">
            <select
              value={currentRole}
              onChange={(e) => setCurrentRole(e.target.value as UserRole)}
              className="bg-slate-900 border border-slate-800 text-slate-200 text-xs rounded-md px-2.5 py-1.5 focus:outline-none focus:border-emerald-500 cursor-pointer max-w-[150px] sm:max-w-[200px] truncate"
            >
              <option value="Emergency Coordinator (MINEMA / AU)">MINEMA / AU Coordinator</option>
              <option value="Field Responder">Field Responder</option>
              <option value="NGO Recovery Lead">NGO Recovery Lead</option>
              <option value="Community Scout">Community Scout</option>
              <option value="System Administrator">System Administrator</option>
            </select>
          </div>
        </div>
      </div>

      {/* Mobile Secondary Nav Bar */}
      <div className="flex xl:hidden items-center gap-1 overflow-x-auto pt-2 pb-0.5 border-t border-slate-900 mt-2 scrollbar-none">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-1 px-2.5 py-1 text-xs rounded-md whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'bg-slate-800 text-emerald-400 font-semibold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Icon className="w-3 h-3" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
};
