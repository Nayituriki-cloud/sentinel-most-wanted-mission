import React, { useState } from 'react';
import {
  FolderHeart,
  CheckCircle2,
  Clock,
  DollarSign,
  Users,
  HardHat,
  FileCheck2,
  ArrowRight,
  PlusCircle,
  FileText,
  BadgeCheck,
  AlertCircle
} from 'lucide-react';
import { RecoveryMission, RecoveryStage } from '../types';

interface RecoveryMissionSystemProps {
  missions: RecoveryMission[];
  onAdvanceStage: (missionId: string) => void;
  onAddVerificationRecord: (missionId: string, record: { verifiedBy: string; organization: string; note: string }) => void;
  onCreateNewMission: (newMission: Partial<RecoveryMission>) => void;
}

const STAGES: RecoveryStage[] = [
  'Assess damage',
  'Identify affected communities',
  'Determine urgent needs',
  'Assign responsible organizations',
  'Deliver resources',
  'Repair infrastructure',
  'Monitor recovery',
  'Verify completion',
];

export const RecoveryMissionSystem: React.FC<RecoveryMissionSystemProps> = ({
  missions,
  onAdvanceStage,
  onAddVerificationRecord,
  onCreateNewMission,
}) => {
  const [selectedMission, setSelectedMission] = useState<RecoveryMission>(missions[0]);
  const [verifierName, setVerifierName] = useState('');
  const [verifierOrg, setVerifierOrg] = useState('');
  const [verifierNote, setVerifierNote] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);

  // New Mission form state
  const [newTitle, setNewTitle] = useState('');
  const [newCountry, setNewCountry] = useState('Rwanda');
  const [newLocation, setNewLocation] = useState('');
  const [newLeadAgency, setNewLeadAgency] = useState('MINEMA & RTDA');
  const [newBudget, setNewBudget] = useState('850000');
  const [newBeneficiaries, setNewBeneficiaries] = useState('12000');

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newLocation.trim()) return;

    onCreateNewMission({
      title: newTitle,
      country: newCountry,
      location: newLocation,
      leadAgency: newLeadAgency,
      budgetUsd: parseFloat(newBudget) || 500000,
      beneficiariesCount: parseInt(newBeneficiaries, 10) || 5000,
      deadline: '2026-12-31',
    });

    setShowCreateModal(false);
    setNewTitle('');
    setNewLocation('');
  };

  const handleVerifySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!verifierName.trim() || !verifierNote.trim()) return;

    onAddVerificationRecord(selectedMission.id, {
      verifiedBy: verifierName,
      organization: verifierOrg || 'Independent Field Verifier',
      note: verifierNote,
    });

    setVerifierName('');
    setVerifierOrg('');
    setVerifierNote('');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 lg:p-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
              <span>Post-Disaster Reconstruction Pipeline</span>
              <span aria-hidden="true">·</span>
              <span>8 Structured Recovery Stages</span>
              <span aria-hidden="true">·</span>
              <span className="text-teal-400 font-medium">Accountable Rebuilding</span>
            </div>
            <h1 className="text-xl lg:text-2xl font-bold tracking-tight text-white">
              Recovery Mission System
            </h1>
          </div>

          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-950 bg-teal-400 hover:bg-teal-300 rounded-lg transition-colors cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Create Recovery Mission</span>
          </button>
        </div>

        {/* Mission Switcher Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pt-4 mt-4 border-t border-slate-800/80 scrollbar-none">
          <span className="text-xs text-slate-400 whitespace-nowrap">Active Missions:</span>
          {missions.map((m) => (
            <button
              key={m.id}
              onClick={() => setSelectedMission(m)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                m.id === selectedMission.id
                  ? 'bg-teal-950 text-teal-300 border border-teal-500/50 font-bold'
                  : 'bg-slate-950/60 border border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <span>{m.title}</span>
              <span className="ml-1.5 font-mono text-[11px] text-teal-400">{m.progressPercent}%</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Pipeline Visualizer + Mission Details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Side: 8-Stage Progression Card */}
        <div className="lg:col-span-7 bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-6">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span className="font-mono text-teal-400">{selectedMission.id}</span>
                <span aria-hidden="true">·</span>
                <span>{selectedMission.country}</span>
              </div>
              <h2 className="text-lg font-bold text-white mt-0.5">{selectedMission.title}</h2>
              <p className="text-xs text-slate-400 mt-1">{selectedMission.location}</p>
            </div>

            <div className="text-right">
              <span className="text-xs text-slate-400 block font-mono">Progress</span>
              <span className="text-2xl font-mono font-bold text-teal-400">
                {selectedMission.progressPercent}%
              </span>
            </div>
          </div>

          {/* 8-Stage Visual Pipeline */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wide flex items-center justify-between">
              <span>8-Stage Recovery Architecture</span>
              <span className="text-slate-500 font-mono text-[11px]">
                Stage {selectedMission.stageIndex + 1} of 8
              </span>
            </h3>

            <div className="space-y-2">
              {STAGES.map((stage, idx) => {
                const isPassed = idx < selectedMission.stageIndex;
                const isCurrent = idx === selectedMission.stageIndex;
                const isUpcoming = idx > selectedMission.stageIndex;

                return (
                  <div
                    key={stage}
                    className={`flex items-center justify-between p-3 rounded-lg border text-xs transition-colors ${
                      isCurrent
                        ? 'bg-teal-950/70 border-teal-500/80 text-white shadow-md'
                        : isPassed
                        ? 'bg-slate-950/60 border-slate-800 text-slate-300'
                        : 'bg-slate-950/20 border-slate-900 text-slate-500'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`w-6 h-6 rounded-full flex items-center justify-center font-mono text-[11px] font-bold ${
                          isPassed
                            ? 'bg-emerald-500 text-slate-950'
                            : isCurrent
                            ? 'bg-teal-400 text-slate-950 animate-pulse'
                            : 'bg-slate-800 text-slate-500'
                        }`}
                      >
                        {isPassed ? '✓' : idx + 1}
                      </span>
                      <div>
                        <span className={`font-semibold ${isCurrent ? 'text-teal-300' : ''}`}>
                          {stage}
                        </span>
                        {isCurrent && (
                          <span className="ml-2 text-[10px] font-mono px-1.5 py-0.5 rounded bg-teal-500/20 text-teal-300 uppercase">
                            Active Phase
                          </span>
                        )}
                      </div>
                    </div>

                    {isCurrent && (
                      <button
                        onClick={() => onAdvanceStage(selectedMission.id)}
                        className="px-3 py-1 bg-teal-400 hover:bg-teal-300 text-slate-950 font-bold rounded text-xs transition-colors cursor-pointer flex items-center gap-1"
                      >
                        <span>Advance Stage</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    )}

                    {isPassed && (
                      <span className="text-[11px] text-emerald-400 font-mono flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Complete
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Verification Records Log */}
          <div className="pt-4 border-t border-slate-800 space-y-3">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wide flex items-center gap-1.5">
              <FileCheck2 className="w-4 h-4 text-emerald-400" />
              <span>Independent Verification Records ({selectedMission.verificationRecords.length})</span>
            </h3>

            <div className="space-y-2">
              {selectedMission.verificationRecords.map((rec, i) => (
                <div key={i} className="p-3 bg-slate-950/70 border border-slate-800/80 rounded-lg text-xs space-y-1">
                  <div className="flex items-center justify-between text-slate-400 font-mono text-[11px]">
                    <span className="text-slate-200 font-semibold">{rec.verifiedBy} ({rec.organization})</span>
                    <span>{rec.timestamp}</span>
                  </div>
                  <p className="text-slate-300">{rec.note}</p>
                </div>
              ))}
            </div>

            {/* Verification Form */}
            <form onSubmit={handleVerifySubmit} className="pt-2 space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="Verifier Name & Title"
                  value={verifierName}
                  onChange={(e) => setVerifierName(e.target.value)}
                  className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-teal-500"
                />
                <input
                  type="text"
                  placeholder="Auditing Entity (e.g. Red Cross / RTDA)"
                  value={verifierOrg}
                  onChange={(e) => setVerifierOrg(e.target.value)}
                  className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-teal-500"
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Field observation note & verification audit sign-off..."
                  value={verifierNote}
                  onChange={(e) => setVerifierNote(e.target.value)}
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-teal-500"
                />
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold rounded-lg transition-colors cursor-pointer shrink-0"
                >
                  Sign Record
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Right Side: Mission Financials, Personnel, Resources */}
        <div className="lg:col-span-5 space-y-5">
          {/* Financials & Beneficiaries Card */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-4">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wide">
              Financials & Operations
            </h3>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-slate-950/70 p-3 rounded-lg border border-slate-800/80">
                <span className="text-[10px] text-slate-400 block">Total Budget</span>
                <span className="text-base font-mono font-bold text-white mt-1 block">
                  ${(selectedMission.budgetUsd / 1000000).toFixed(2)}M USD
                </span>
                <span className="text-[10px] text-slate-400 font-mono mt-0.5 block">
                  ({(selectedMission.budgetLocalCurrency.amount / 1000000000).toFixed(2)}B {selectedMission.budgetLocalCurrency.currency})
                </span>
              </div>

              <div className="bg-slate-950/70 p-3 rounded-lg border border-slate-800/80">
                <span className="text-[10px] text-slate-400 block">Budget Expended</span>
                <span className="text-base font-mono font-bold text-teal-400 mt-1 block">
                  ${(selectedMission.budgetSpent / 1000000).toFixed(2)}M USD
                </span>
                <span className="text-[10px] text-slate-400 font-mono mt-0.5 block">
                  {Math.round((selectedMission.budgetSpent / selectedMission.budgetUsd) * 100)}% utilization
                </span>
              </div>

              <div className="bg-slate-950/70 p-3 rounded-lg border border-slate-800/80">
                <span className="text-[10px] text-slate-400 block">Target Beneficiaries</span>
                <span className="text-sm font-mono font-bold text-white mt-1 block">
                  {selectedMission.beneficiariesCount.toLocaleString()}
                </span>
              </div>

              <div className="bg-slate-950/70 p-3 rounded-lg border border-slate-800/80">
                <span className="text-[10px] text-slate-400 block">Field Personnel</span>
                <span className="text-sm font-mono font-bold text-white mt-1 block">
                  {selectedMission.personnelCount} responders
                </span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800 text-xs">
              <span className="text-[10px] text-slate-400 block uppercase mb-1">
                Contractors & Engineering Corps:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {selectedMission.contractors.map((c, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-slate-300 font-mono text-[11px]"
                  >
                    {c}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Allocated Resources Inventory */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-3">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wide">
              Allocated Recovery Equipment
            </h3>

            <div className="space-y-2">
              {selectedMission.resourcesAllocated.map((res, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-2.5 bg-slate-950/60 border border-slate-800/80 rounded-lg text-xs"
                >
                  <div>
                    <span className="font-semibold text-slate-200 block">{res.name}</span>
                    <span className="text-[11px] text-slate-400 font-mono">{res.quantity}</span>
                  </div>
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                      res.status === 'Delivered'
                        ? 'bg-emerald-500/20 text-emerald-400'
                        : res.status === 'In Transit'
                        ? 'bg-amber-500/20 text-amber-400'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {res.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Supporting Documents & Engineering Certifications */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-3">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wide flex items-center justify-between">
              <span>Verified Documents & Hydrology Tests</span>
              <span className="text-slate-500 text-[11px]">Tamper-Proof Storage</span>
            </h3>

            <div className="space-y-2">
              {selectedMission.documents.map((doc, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2.5 bg-slate-950/60 border border-slate-800/80 rounded-lg text-xs hover:border-slate-700 transition-colors"
                >
                  <div className="flex items-center gap-2 truncate">
                    <FileText className="w-4 h-4 text-teal-400 shrink-0" />
                    <span className="text-slate-300 truncate">{doc.name}</span>
                  </div>
                  <span className="text-[11px] font-mono text-slate-500 shrink-0">{doc.date}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Create New Mission Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleCreateSubmit}
            className="bg-slate-900 border border-slate-800 rounded-2xl max-w-xl w-full p-6 space-y-4"
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-white">Create Structured Recovery Mission</h3>
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-white text-xs px-2 py-1 rounded bg-slate-800"
              >
                Cancel
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Mission Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Bugesera Flood Recovery & Aqueduct Restoration"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-teal-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Country</label>
                  <select
                    value={newCountry}
                    onChange={(e) => setNewCountry(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
                  >
                    <option value="Rwanda">Rwanda (Pilot)</option>
                    <option value="Kenya">Kenya</option>
                    <option value="DR Congo">DR Congo</option>
                    <option value="Ghana">Ghana</option>
                    <option value="Nigeria">Nigeria</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Location / District</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Bugesera, Eastern Province"
                    value={newLocation}
                    onChange={(e) => setNewLocation(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Budget ($ USD)</label>
                  <input
                    type="number"
                    value={newBudget}
                    onChange={(e) => setNewBudget(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Beneficiaries</label>
                  <input
                    type="number"
                    value={newBeneficiaries}
                    onChange={(e) => setNewBeneficiaries(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Lead Agency & Public Utility</label>
                <input
                  type="text"
                  value={newLeadAgency}
                  onChange={(e) => setNewLeadAgency(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 text-xs rounded-lg text-slate-400 hover:text-white"
              >
                Dismiss
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-xs font-bold rounded-lg bg-teal-400 hover:bg-teal-300 text-slate-950 transition-colors"
              >
                Initialize Mission
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
