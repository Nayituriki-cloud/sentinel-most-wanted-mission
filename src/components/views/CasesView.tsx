import React, { useState } from 'react';
import {
  FolderLock,
  Plus,
  Search,
  Filter,
  Eye,
  Target,
  Sparkles,
  Download,
  ShieldCheck,
  FileText,
  AlertTriangle,
  UserCheck,
} from 'lucide-react';
import { WantedCase } from '../../types';

interface CasesViewProps {
  cases: WantedCase[];
  onSelectCase: (caseItem: WantedCase) => void;
  onPlanMission: (caseItem: WantedCase) => void;
  onAddCase: () => void;
  onAnalyzeAi: (caseItem: WantedCase) => void;
}

export const CasesView: React.FC<CasesViewProps> = ({
  cases,
  onSelectCase,
  onPlanMission,
  onAddCase,
  onAnalyzeAi,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const filtered = cases.filter((c) => {
    const matchesSearch =
      c.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.caseNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.warrantNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-5 rounded-xl shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <FolderLock className="w-5 h-5 text-amber-500" />
            <h1 className="text-xl sm:text-2xl font-black text-slate-100 tracking-tight">
              Case Records & Provenance Repository
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            Complete judicial case dossiers, verified statutory citations, certified indictment attachments, and multi-agency records.
          </p>
        </div>

        <button
          onClick={onAddCase}
          className="flex items-center gap-1.5 bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold px-3.5 py-2 rounded-lg text-xs transition shadow-sm self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Register New Case</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search case #, warrant #, name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-9 pr-4 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500 font-mono"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            aria-label="Filter cases by status"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-500 font-mono"
          >
            <option value="ALL">All Case Statuses</option>
            <option value="ACTIVE_HUNT">Active Hunt</option>
            <option value="LOCATED_SURVEILLANCE">Located / Surveillance</option>
            <option value="APPREHENDED">Apprehended</option>
            <option value="EXTRADITION_PENDING">Extradition Pending</option>
          </select>
        </div>
      </div>

      {/* Table of Cases */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 border-b border-slate-800 text-slate-400 font-mono uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4">Subject</th>
                <th className="py-3 px-4">Case / Warrant #</th>
                <th className="py-3 px-4">Lead Agency</th>
                <th className="py-3 px-4">Priority</th>
                <th className="py-3 px-4">Verification</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-slate-200 font-mono">
              {filtered.map((caseItem) => (
                <tr key={caseItem.id} className="hover:bg-slate-800/50 transition">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={caseItem.photoUrl}
                        alt={caseItem.fullName}
                        className="w-10 h-10 rounded-lg object-cover border border-slate-700 shrink-0"
                      />
                      <div>
                        <div 
                          onClick={() => onSelectCase(caseItem)}
                          className="font-bold text-slate-100 hover:text-amber-400 cursor-pointer font-sans text-xs"
                        >
                          {caseItem.fullName}
                        </div>
                        <div className="text-[11px] text-slate-400 font-mono">
                          {caseItem.descriptors.age} yrs • {caseItem.descriptors.nationality}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="py-3 px-4">
                    <div className="text-slate-200 font-semibold">{caseItem.caseNumber}</div>
                    <div className="text-[10px] text-slate-400">{caseItem.warrantNumber}</div>
                  </td>

                  <td className="py-3 px-4">
                    <div className="text-slate-300 font-sans text-xs">{caseItem.leadAgency.split(' (')[0]}</div>
                    <div className="text-[10px] text-slate-500 font-mono">{caseItem.jurisdiction.split(' / ')[0]}</div>
                  </td>

                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      caseItem.priorityLevel === 'Tier 1 - Critical'
                        ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                        : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                    }`}>
                      {caseItem.priorityLevel}
                    </span>
                  </td>

                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1 text-emerald-400 text-[11px]">
                      <UserCheck className="w-3.5 h-3.5" />
                      <span>{caseItem.lastVerifiedDate}</span>
                    </div>
                    <div className="text-[10px] text-slate-500 truncate max-w-[140px]">
                      {caseItem.verifiedByOfficer}
                    </div>
                  </td>

                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-950 text-slate-300 border border-slate-800">
                      {caseItem.status}
                    </span>
                  </td>

                  <td className="py-3 px-4 text-right space-x-1 whitespace-nowrap">
                    <button
                      onClick={() => onSelectCase(caseItem)}
                      className="p-1.5 rounded hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition"
                      title="View Complete Dossier"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onPlanMission(caseItem)}
                      className="p-1.5 rounded hover:bg-amber-600/30 text-amber-400 transition"
                      title="Mission Workspace"
                    >
                      <Target className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onAnalyzeAi(caseItem)}
                      className="p-1.5 rounded hover:bg-indigo-600/30 text-indigo-400 transition"
                      title="Run AI Analysis"
                    >
                      <Sparkles className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
