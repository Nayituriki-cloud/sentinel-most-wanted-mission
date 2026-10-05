import React from 'react';
import {
  LayoutDashboard,
  Flame,
  Target,
  FolderLock,
  Binary,
  MessageSquareWarning,
  FileText,
  Building2,
  Bot,
  ScrollText,
  Settings as SettingsIcon,
} from 'lucide-react';

export type MainNavTab = 
  | 'Dashboard'
  | 'Most Wanted'
  | 'Missions'
  | 'Cases'
  | 'Intelligence'
  | 'Tips'
  | 'Reports'
  | 'Agencies'
  | 'AI Assistant'
  | 'Audit Logs'
  | 'Settings';

interface NavigationProps {
  currentTab: MainNavTab;
  onSelectTab: (tab: MainNavTab) => void;
  badgeCounts: {
    mostWanted: number;
    activeMissions: number;
    pendingTips: number;
    unverifiedIntel: number;
  };
}

export const Navigation: React.FC<NavigationProps> = ({
  currentTab,
  onSelectTab,
  badgeCounts,
}) => {
  const navItems: { label: MainNavTab; icon: React.ElementType; badge?: number; badgeColor?: string }[] = [
    { label: 'Dashboard', icon: LayoutDashboard },
    { label: 'Most Wanted', icon: Flame, badge: badgeCounts.mostWanted, badgeColor: 'bg-red-500/20 text-red-400 border-red-500/40' },
    { label: 'Missions', icon: Target, badge: badgeCounts.activeMissions, badgeColor: 'bg-amber-500/20 text-amber-400 border-amber-500/40' },
    { label: 'Cases', icon: FolderLock },
    { label: 'Intelligence', icon: Binary, badge: badgeCounts.unverifiedIntel, badgeColor: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/40' },
    { label: 'Tips', icon: MessageSquareWarning, badge: badgeCounts.pendingTips, badgeColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40' },
    { label: 'Reports', icon: FileText },
    { label: 'Agencies', icon: Building2 },
    { label: 'AI Assistant', icon: Bot, badgeColor: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/40' },
    { label: 'Audit Logs', icon: ScrollText },
    { label: 'Settings', icon: SettingsIcon },
  ];

  return (
    <nav className="bg-slate-950 border-b border-slate-800/80 sticky top-16 z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center space-x-1 overflow-x-auto py-2.5 no-scrollbar scroll-smooth">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.label;

            return (
              <button
                key={item.label}
                onClick={() => onSelectTab(item.label)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all whitespace-nowrap shrink-0 ${
                  isActive
                    ? 'bg-amber-500/15 text-amber-400 border border-amber-500/40 shadow-sm shadow-amber-950/40'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900 border border-transparent'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-amber-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
                {item.badge !== undefined && item.badge > 0 && (
                  <span
                    className={`ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold border ${
                      item.badgeColor || 'bg-slate-800 text-slate-300 border-slate-700'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
