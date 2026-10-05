import React, { useState } from 'react';
import {
  Search,
  Filter,
  Flame,
  ShieldAlert,
  AlertTriangle,
  Award,
  Calendar,
  Building,
  Target,
  FileText,
  MessageSquarePlus,
  Sparkles,
  CheckCircle2,
  ExternalLink,
  Download,
} from 'lucide-react';
import { WantedCase, PriorityLevel } from '../../types';
import { downloadWantedPosterHtml } from '../../utils/downloadHelpers';

interface MostWantedViewProps {
  cases: WantedCase[];
  onSelectCase: (caseItem: WantedCase) => void;
  onPlanMission: (caseItem: WantedCase) => void;
  onSubmitTipForCase: (caseItem: WantedCase) => void;
  onOpenAiForCase: (caseItem: WantedCase) => void;
}

export const MostWantedView: React.FC<MostWantedViewProps> = ({
  cases,
  onSelectCase,
  onPlanMission,
  onSubmitTipForCase,
  onOpenAiForCase,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPriority, setSelectedPriority] = useState<string>('ALL');
  const [selectedAgency, setSelectedAgency] = useState<string>('ALL');

  const filteredCases = cases.filter((c) => {
    const matchesSearch =
      c.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.aliases.some((a) => a.toLowerCase().includes(searchQuery.toLowerCase())) ||
      c.warrantNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.primaryCharge.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.leadAgency.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesPriority =
      selectedPriority === 'ALL' || c.priorityLevel === selectedPriority;

    const matchesAgency =
      selectedAgency === 'ALL' || c.leadAgency.includes(selectedAgency);

    return matchesSearch && matchesPriority && matchesAgency;
  });

  return (
    <div className="space-y-6">
      
      {/* Header and Filter Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-5 rounded-xl shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-red-500" />
            <h1 className="text-xl sm:text-2xl font-black text-slate-100 tracking-tight">
              Most Wanted Public & Law Enforcement Dossiers
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            Officially verified active arrest warrants published by authorized federal, state, and international judicial authorities.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs font-mono text-slate-400">
            Showing <strong className="text-amber-400">{filteredCases.length}</strong> of {cases.length} Published
          </span>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
        <div className="md:col-span-6 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search by legal name, alias, warrant #, charges, jurisdiction..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-9 pr-4 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500"
          />
        </div>

        <div className="md:col-span-3">
          <select
            aria-label="Filter cases by priority tier"
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500 font-mono"
          >
            <option value="ALL">All Priority Tiers</option>
            <option value="Tier 1 - Critical">Tier 1 - Critical</option>
            <option value="Tier 2 - High">Tier 2 - High</option>
            <option value="Tier 3 - Medium">Tier 3 - Medium</option>
          </select>
        </div>

        <div className="md:col-span-3">
          <select
            aria-label="Filter cases by lead agency"
            value={selectedAgency}
            onChange={(e) => setSelectedAgency(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500 font-mono"
          >
            <option value="ALL">All Lead Agencies</option>
            <option value="Federal Bureau of Investigation">FBI</option>
            <option value="United States Marshals Service">USMS</option>
            <option value="Drug Enforcement Administration">DEA</option>
            <option value="New York State Police">NY State Police</option>
            <option value="Homeland Security Investigations">HSI</option>
          </select>
        </div>
      </div>

      {/* Grid of Wanted Case Cards (Official Poster Style) */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredCases.map((caseItem) => {
          const isCritical = caseItem.priorityLevel === 'Tier 1 - Critical';

          return (
            <div
              key={caseItem.id}
              className={`bg-slate-900 border rounded-xl overflow-hidden flex flex-col justify-between transition-all duration-200 hover:shadow-xl ${
                isCritical
                  ? 'border-red-900/60 hover:border-red-600/80 shadow-red-950/20'
                  : 'border-slate-800 hover:border-amber-500/50 shadow-slate-950/40'
              }`}
            >
              {/* Card Header (Tactical Police Bulletin Header) */}
              <div>
                <div
                  className={`px-4 py-2 border-b flex items-center justify-between text-xs font-mono font-bold uppercase tracking-wider ${
                    isCritical
                      ? 'bg-red-950/90 text-red-200 border-red-800/80'
                      : 'bg-amber-950/80 text-amber-200 border-amber-800/80'
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    <ShieldAlert className="w-3.5 h-3.5" />
                    <span>{caseItem.priorityLevel}</span>
                  </div>
                  <span className="text-[11px] font-mono tracking-normal text-slate-300">
                    {caseItem.warrantNumber}
                  </span>
                </div>

                {/* Subject Image & Key Descriptors */}
                <div className="p-4">
                  <div className="flex gap-4">
                    <div className="relative shrink-0">
                      <img
                        src={caseItem.photoUrl}
                        alt={caseItem.fullName}
                        className="w-24 h-28 sm:w-28 sm:h-32 rounded-lg object-cover border border-slate-700 shadow-md"
                      />
                      <div className="absolute bottom-1 left-1 right-1 bg-slate-950/90 backdrop-blur-xs text-[9px] font-mono font-bold text-center text-emerald-400 py-0.5 rounded border border-slate-800">
                        VERIFIED 2026
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <h2 
                        onClick={() => onSelectCase(caseItem)}
                        className="text-base font-black text-slate-100 hover:text-amber-400 transition cursor-pointer leading-snug"
                      >
                        {caseItem.fullName}
                      </h2>

                      {caseItem.aliases.length > 0 && (
                        <div className="text-xs text-slate-400 font-mono mt-0.5 truncate">
                          Aliases: {caseItem.aliases.join(', ')}
                        </div>
                      )}

                      <div className="mt-2 space-y-1 text-[11px] text-slate-300 font-mono">
                        <div className="flex items-center gap-1">
                          <span className="text-slate-500">Age:</span>
                          <span className="text-slate-200 font-semibold">{caseItem.descriptors.age}</span>
                          <span className="text-slate-500 ml-2">Ht:</span>
                          <span className="text-slate-200">{caseItem.descriptors.height}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="text-slate-500">Nationality:</span>
                          <span className="text-slate-200 truncate">{caseItem.descriptors.nationality}</span>
                        </div>
                        <div className="flex items-center gap-1 text-amber-400 font-bold">
                          <Award className="w-3 h-3 text-amber-400 shrink-0" />
                          <span>Reward: {caseItem.rewardAmount}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Primary Charge Box */}
                  <div className="mt-3.5 bg-slate-950/80 border border-slate-800/80 rounded-lg p-2.5">
                    <div className="text-[10px] uppercase font-mono font-bold text-slate-400">
                      Primary Charge:
                    </div>
                    <div className="text-xs font-semibold text-slate-200 mt-0.5 line-clamp-2">
                      {caseItem.primaryCharge}
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono mt-1 truncate">
                      Authority: {caseItem.statutoryReference}
                    </div>
                  </div>

                  {/* Caution Warning Box */}
                  {caseItem.weaponsCaution && (
                    <div className="mt-2.5 flex items-start gap-2 bg-red-950/40 border border-red-900/60 rounded-md p-2 text-red-200 text-[11px]">
                      <AlertTriangle className="w-3.5 h-3.5 text-red-400 shrink-0 mt-0.5" />
                      <span className="font-semibold leading-tight">
                        CAUTION: CONSIDER ARMED & DANGEROUS.
                      </span>
                    </div>
                  )}

                  {/* Verification Provenance */}
                  <div className="mt-3 pt-2 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between font-mono">
                    <span className="truncate">Lead: {caseItem.leadAgency.split(' (')[0]}</span>
                    <span className="text-emerald-400 font-semibold shrink-0">
                      ✓ Verified {caseItem.lastVerifiedDate}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons Footer */}
              <div className="p-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between gap-1.5 flex-wrap">
                <button
                  onClick={() => onSelectCase(caseItem)}
                  className="flex-1 min-w-[70px] bg-slate-800 hover:bg-slate-700 text-slate-200 px-2 py-1.5 rounded text-xs font-semibold text-center transition flex items-center justify-center gap-1"
                >
                  <FileText className="w-3 h-3 text-slate-400" />
                  <span>Dossier</span>
                </button>

                <button
                  onClick={() => onPlanMission(caseItem)}
                  className="flex-1 min-w-[80px] bg-amber-600/90 hover:bg-amber-600 text-slate-950 font-bold px-2 py-1.5 rounded text-xs text-center transition flex items-center justify-center gap-1"
                >
                  <Target className="w-3 h-3" />
                  <span>Mission</span>
                </button>

                <button
                  onClick={() => onOpenAiForCase(caseItem)}
                  className="bg-indigo-900/60 hover:bg-indigo-800/80 text-indigo-300 border border-indigo-700/50 px-2 py-1.5 rounded text-xs font-semibold transition flex items-center justify-center gap-1"
                  title="AI Mission Briefing"
                >
                  <Sparkles className="w-3 h-3 text-indigo-400" />
                  <span>AI</span>
                </button>

                <button
                  onClick={() => downloadWantedPosterHtml(caseItem)}
                  className="bg-slate-800 hover:bg-red-950 text-slate-300 hover:text-red-300 border border-slate-700 hover:border-red-800 px-2 py-1.5 rounded text-xs font-semibold transition flex items-center justify-center gap-1"
                  title="Download Printable Wanted Poster"
                >
                  <Download className="w-3 h-3 text-red-400" />
                  <span className="hidden sm:inline">Poster</span>
                </button>

                <button
                  onClick={() => onSubmitTipForCase(caseItem)}
                  className="bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 border border-emerald-700/60 px-2 py-1.5 rounded text-xs font-semibold transition flex items-center justify-center gap-1"
                  title="Submit Citizen Tip"
                >
                  <MessageSquarePlus className="w-3 h-3 text-emerald-400" />
                  <span>Tip</span>
                </button>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
