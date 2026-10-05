import React, { useState } from 'react';
import {
  X,
  ShieldAlert,
  Award,
  Calendar,
  FileText,
  CheckCircle2,
  AlertTriangle,
  Building,
  Target,
  Sparkles,
  Printer,
  ExternalLink,
  MessageSquarePlus,
  HelpCircle,
  Clock,
  UserCheck,
  Download,
} from 'lucide-react';
import { WantedCase } from '../../types';
import { downloadWantedPosterHtml, downloadCasePackageJson } from '../../utils/downloadHelpers';

interface CaseDetailModalProps {
  caseItem: WantedCase | null;
  onClose: () => void;
  onPlanMission: (caseItem: WantedCase) => void;
  onAnalyzeAi: (caseItem: WantedCase) => void;
  onSubmitTip: (caseItem: WantedCase) => void;
}

export const CaseDetailModal: React.FC<CaseDetailModalProps> = ({
  caseItem,
  onClose,
  onPlanMission,
  onAnalyzeAi,
  onSubmitTip,
}) => {
  if (!caseItem) return null;

  const [activeTab, setActiveTab] = useState<'profile' | 'warrants' | 'intelligence' | 'verification'>('profile');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Modal Top Header (Law Enforcement Classified Banner) */}
        <div className="px-5 py-3.5 bg-slate-950 border-b border-slate-800 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping"></span>
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-red-400">
              OFFICIAL WANTED DOSSIER // {caseItem.priorityLevel}
            </span>
            <span className="text-slate-600">|</span>
            <span className="text-xs font-mono text-slate-300">
              CASE #{caseItem.caseNumber}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => downloadWantedPosterHtml(caseItem)}
              className="flex items-center gap-1 bg-red-950/80 hover:bg-red-900 text-red-200 border border-red-700/60 px-2.5 py-1.5 rounded-md text-xs font-mono font-semibold transition"
              title="Download High-Resolution Official Wanted Poster"
            >
              <Download className="w-3.5 h-3.5 text-red-400" />
              <span>Poster</span>
            </button>
            <button
              onClick={() => downloadCasePackageJson(caseItem)}
              className="flex items-center gap-1 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 px-2.5 py-1.5 rounded-md text-xs font-mono font-semibold transition"
              title="Download Certified Case Package JSON"
            >
              <Download className="w-3.5 h-3.5 text-amber-400" />
              <span>Data</span>
            </button>
            <button
              onClick={() => window.print()}
              className="p-1.5 rounded-md text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition"
              title="Print Official Dossier"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Tabs */}
        <div className="flex items-center px-5 border-b border-slate-800 bg-slate-950/60 shrink-0 overflow-x-auto gap-2">
          {[
            { id: 'profile', label: 'Case Profile & Descriptors' },
            { id: 'warrants', label: 'Legal Authority & Warrants' },
            { id: 'intelligence', label: 'Tactical Intelligence' },
            { id: 'verification', label: 'Official Source Verification' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-3 px-3 text-xs font-bold transition border-b-2 whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-amber-400 text-amber-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6">
          
          {/* Top Profile Summary Card */}
          <div className="flex flex-col sm:flex-row gap-5 items-start bg-slate-950/80 border border-slate-800 rounded-xl p-4">
            <div className="relative shrink-0">
              <img
                src={caseItem.photoUrl}
                alt={caseItem.fullName}
                className="w-32 h-40 sm:w-36 sm:h-44 rounded-xl object-cover border border-slate-700 shadow-md"
              />
              <div className="absolute top-2 left-2 px-1.5 py-0.5 rounded bg-red-600/90 text-white font-mono text-[10px] font-bold">
                {caseItem.status}
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-black text-slate-100">
                  {caseItem.fullName}
                </h1>
                <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  Reward: {caseItem.rewardAmount}
                </span>
              </div>

              {caseItem.aliases.length > 0 && (
                <div className="text-xs text-slate-400 font-mono mt-1">
                  <strong>Aliases:</strong> {caseItem.aliases.join(' • ')}
                </div>
              )}

              <div className="mt-3 p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                <div className="text-[10px] font-mono uppercase font-bold text-slate-400">
                  Primary Allegation:
                </div>
                <div className="text-xs font-semibold text-slate-100 mt-0.5">
                  {caseItem.primaryCharge}
                </div>
              </div>

              <div className="mt-3 flex items-center gap-3 text-xs font-mono text-slate-400 flex-wrap">
                <span>Lead: <strong className="text-slate-200">{caseItem.leadAgency}</strong></span>
                <span>•</span>
                <span>Jurisdiction: <strong className="text-slate-200">{caseItem.jurisdiction}</strong></span>
              </div>
            </div>
          </div>

          {/* Tab 1: Profile & Descriptors */}
          {activeTab === 'profile' && (
            <div className="space-y-5">
              <div>
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 font-mono">
                  Physical Descriptors & Identifying Markers
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 text-xs font-mono">
                  <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                    <span className="text-slate-500 block text-[10px]">SEX:</span>
                    <span className="font-semibold text-slate-200">{caseItem.descriptors.sex}</span>
                  </div>
                  <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                    <span className="text-slate-500 block text-[10px]">RACE:</span>
                    <span className="font-semibold text-slate-200">{caseItem.descriptors.race}</span>
                  </div>
                  <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                    <span className="text-slate-500 block text-[10px]">DATE OF BIRTH:</span>
                    <span className="font-semibold text-slate-200">{caseItem.descriptors.dob} ({caseItem.descriptors.age} yrs)</span>
                  </div>
                  <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                    <span className="text-slate-500 block text-[10px]">HEIGHT:</span>
                    <span className="font-semibold text-slate-200">{caseItem.descriptors.height}</span>
                  </div>
                  <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                    <span className="text-slate-500 block text-[10px]">WEIGHT:</span>
                    <span className="font-semibold text-slate-200">{caseItem.descriptors.weight}</span>
                  </div>
                  <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                    <span className="text-slate-500 block text-[10px]">HAIR / EYES:</span>
                    <span className="font-semibold text-slate-200">{caseItem.descriptors.hair} / {caseItem.descriptors.eyes}</span>
                  </div>
                  <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                    <span className="text-slate-500 block text-[10px]">NATIONALITY:</span>
                    <span className="font-semibold text-slate-200">{caseItem.descriptors.nationality}</span>
                  </div>
                  <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                    <span className="text-slate-500 block text-[10px]">LANGUAGES:</span>
                    <span className="font-semibold text-slate-200">{caseItem.descriptors.languages.join(', ')}</span>
                  </div>
                </div>
              </div>

              {/* Scars and Marks */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider block mb-2">
                  Scars, Tattoos, and Distinguishing Marks:
                </span>
                <ul className="list-disc list-inside space-y-1 text-xs text-slate-200">
                  {caseItem.descriptors.scarsAndMarks.map((mark, i) => (
                    <li key={i}>{mark}</li>
                  ))}
                </ul>
              </div>

              {/* Case Narrative Summary */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider block mb-2">
                  Investigative Case Overview:
                </span>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {caseItem.summary}
                </p>
              </div>
            </div>
          )}

          {/* Tab 2: Legal Authority & Warrants */}
          {activeTab === 'warrants' && (
            <div className="space-y-4">
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-mono font-bold uppercase text-slate-200">
                    Primary Judicial Warrant Details
                  </h3>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    ACTIVE & ENFORCEABLE
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
                  <div>
                    <span className="text-slate-500">WARRANT NUMBER:</span>
                    <div className="text-slate-200 font-bold">{caseItem.warrantNumber}</div>
                  </div>
                  <div>
                    <span className="text-slate-500">DATE ISSUED:</span>
                    <div className="text-slate-200">{caseItem.dateWarrantIssued}</div>
                  </div>
                  <div>
                    <span className="text-slate-500">ISSUING COURT:</span>
                    <div className="text-slate-200">{caseItem.warrantIssuingCourt}</div>
                  </div>
                  <div>
                    <span className="text-slate-500">ISSUING JUDICIAL OFFICER:</span>
                    <div className="text-slate-200">{caseItem.issuingJudge}</div>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800">
                  <span className="text-slate-500 text-xs font-mono">STATUTORY BASIS:</span>
                  <div className="text-xs text-amber-300 font-mono mt-0.5">
                    {caseItem.statutoryReference}
                  </div>
                </div>
              </div>

              {/* Verified Documents Checklist */}
              <div>
                <h3 className="text-xs font-mono font-bold uppercase text-slate-400 mb-2">
                  Official Indictments & Certified Attachments
                </h3>
                <div className="space-y-2">
                  {caseItem.officialDocuments.map((doc) => (
                    <div
                      key={doc.id}
                      className="bg-slate-950 border border-slate-800 p-3 rounded-lg flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2.5">
                        <FileText className="w-4 h-4 text-amber-400 shrink-0" />
                        <div>
                          <div className="text-xs font-bold text-slate-200">{doc.title}</div>
                          <div className="text-[11px] font-mono text-slate-400">
                            Ref: {doc.documentRef} • Issued: {doc.issuedDate}
                          </div>
                        </div>
                      </div>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-900 text-emerald-400 border border-slate-700">
                        {doc.verified ? 'VERIFIED' : 'PENDING'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Tab 3: Tactical Intelligence */}
          {activeTab === 'intelligence' && (
            <div className="space-y-4">
              <div className="bg-red-950/40 border border-red-900/60 p-4 rounded-xl">
                <div className="flex items-center gap-2 text-red-400 font-bold text-xs uppercase font-mono">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Caution Advisory & Threat Profile</span>
                </div>
                <p className="text-xs text-red-200 mt-2 font-medium">
                  {caseItem.cautionAdvisory}
                </p>
                <div className="mt-3 flex items-center gap-3 text-xs font-mono text-slate-300">
                  <span>Flight Risk: <strong className="text-red-400">{caseItem.flightRiskAssessment}</strong></span>
                  <span>•</span>
                  <span>Weapons Caution: <strong className="text-red-400">{caseItem.weaponsCaution ? 'YES - ARMED' : 'NO KNOWN FIREARMS'}</strong></span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                  <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider block mb-2">
                    Last Verified Location:
                  </span>
                  <p className="text-xs text-slate-200">
                    {caseItem.lastKnownLocation}
                  </p>
                </div>

                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                  <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider block mb-2">
                    Known Associated Vehicles:
                  </span>
                  <ul className="text-xs text-slate-300 space-y-1 list-disc list-inside">
                    {caseItem.associatedVehicles?.map((v, i) => (
                      <li key={i}>{v}</li>
                    )) || <li>None registered</li>}
                  </ul>
                </div>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider block mb-2">
                  Known Associates & Cooperating Persons:
                </span>
                <div className="flex flex-wrap gap-2">
                  {caseItem.knownAssociates?.map((a, i) => (
                    <span key={i} className="px-2.5 py-1 rounded-md bg-slate-900 border border-slate-700 text-xs text-slate-200 font-mono">
                      {a}
                    </span>
                  )) || <span className="text-xs text-slate-500">None logged</span>}
                </div>
              </div>
            </div>
          )}

          {/* Tab 4: Official Source Verification */}
          {activeTab === 'verification' && (
            <div className="space-y-4">
              <div className="bg-emerald-950/30 border border-emerald-800/60 p-4 rounded-xl">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase font-mono">
                  <UserCheck className="w-4 h-4" />
                  <span>Authorized Law Enforcement Provenance</span>
                </div>
                <div className="mt-3 space-y-2 text-xs font-mono text-slate-300">
                  <div>
                    <span className="text-slate-500">VERIFYING OFFICER:</span>{' '}
                    <span className="text-emerald-300 font-bold">{caseItem.verifiedByOfficer}</span>
                  </div>
                  <div>
                    <span className="text-slate-500">VERIFICATION PROVENANCE:</span>{' '}
                    <span className="text-slate-200">{caseItem.verificationSource}</span>
                  </div>
                  <div>
                    <span className="text-slate-500">LAST INDEPENDENT AUDIT:</span>{' '}
                    <span className="text-slate-200">{caseItem.lastVerifiedDate}</span>
                  </div>
                </div>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs text-slate-300 leading-relaxed">
                <h4 className="font-bold text-slate-200 mb-1 font-mono uppercase">
                  Statutory Non-Vigilantism Protocol:
                </h4>
                All data contained herein is published strictly under authorized judicial warrants and official law enforcement notices. Unauthorized tracking, harassment, or private civilian apprehension is illegal and subject to criminal prosecution.
              </div>
            </div>
          )}

        </div>

        {/* Modal Action Footer */}
        <div className="px-5 py-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between gap-3 shrink-0 flex-wrap">
          <div className="flex items-center gap-2">
            <button
              onClick={() => onAnalyzeAi(caseItem)}
              className="bg-indigo-900/60 hover:bg-indigo-800 text-indigo-200 border border-indigo-700/60 px-3 py-2 rounded-lg text-xs font-bold transition flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>AI Discrepancy & Gap Analysis</span>
            </button>
            <button
              onClick={() => onSubmitTip(caseItem)}
              className="bg-slate-800 hover:bg-slate-700 text-emerald-300 border border-slate-700 px-3 py-2 rounded-lg text-xs font-semibold transition flex items-center gap-1.5"
            >
              <MessageSquarePlus className="w-3.5 h-3.5 text-emerald-400" />
              <span>Submit Secure Tip</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3.5 py-2 rounded-lg text-xs text-slate-400 hover:text-slate-200 transition"
            >
              Close
            </button>
            <button
              onClick={() => onPlanMission(caseItem)}
              className="bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold px-4 py-2 rounded-lg text-xs transition flex items-center gap-1.5 shadow-md shadow-amber-950/40"
            >
              <Target className="w-4 h-4" />
              <span>Open Mission Workspace</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
