import React, { useState } from 'react';
import { X, FolderLock, Plus, ShieldCheck, AlertTriangle } from 'lucide-react';
import { WantedCase, PriorityLevel } from '../../types';

interface AddCaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveCase: (newCase: WantedCase) => void;
}

export const AddCaseModal: React.FC<AddCaseModalProps> = ({
  isOpen,
  onClose,
  onSaveCase,
}) => {
  if (!isOpen) return null;

  const [fullName, setFullName] = useState('');
  const [aliases, setAliases] = useState('');
  const [warrantNumber, setWarrantNumber] = useState(
    `W-FED-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`
  );
  const [priorityLevel, setPriorityLevel] = useState<PriorityLevel>('Tier 1 - Critical');
  const [primaryCharge, setPrimaryCharge] = useState('');
  const [statutoryReference, setStatutoryReference] = useState('');
  const [jurisdiction, setJurisdiction] = useState('U.S. District Court');
  const [leadAgency, setLeadAgency] = useState('Federal Bureau of Investigation');
  const [rewardAmount, setRewardAmount] = useState('$500,000 USD');
  const [photoUrl, setPhotoUrl] = useState(
    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=600&q=80'
  );
  const [age, setAge] = useState(38);
  const [height, setHeight] = useState('5 ft 10 in (178 cm)');
  const [weight, setWeight] = useState('175 lbs (79 kg)');
  const [summary, setSummary] = useState('');
  const [cautionAdvisory, setCautionAdvisory] = useState(
    'ARMED & DANGEROUS. DO NOT ENGAGE. DEPLOY AUTHORIZED UNITS.'
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !primaryCharge.trim()) return;

    const newCase: WantedCase = {
      id: `case-${Date.now()}`,
      caseNumber: `CW-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      warrantNumber: warrantNumber.trim(),
      fullName: fullName.trim(),
      aliases: aliases.split(',').map((a) => a.trim()).filter(Boolean),
      photoUrl: photoUrl.trim(),
      priorityLevel,
      primaryCharge: primaryCharge.trim(),
      statutoryReference: statutoryReference.trim() || '18 U.S.C. § 1073',
      jurisdiction: jurisdiction.trim(),
      leadAgency: leadAgency.trim(),
      cooperatingAgencies: ['United States Marshals Service', 'Regional Fugitive Task Force'],
      warrantIssuingCourt: jurisdiction.trim(),
      issuingJudge: 'Chief Magistrate Judge',
      dateWarrantIssued: new Date().toISOString().slice(0, 10),
      lastVerifiedDate: new Date().toISOString().slice(0, 10),
      verifiedByOfficer: 'Supervisory Special Agent J. Miller',
      verificationSource: 'Federal Grand Jury Indictment True Bill',
      rewardAmount: rewardAmount.trim(),
      status: 'ACTIVE_HUNT',
      descriptors: {
        sex: 'Male',
        race: 'Unknown / Logged in warrant',
        dob: '1988-01-01',
        age: Number(age) || 38,
        height: height.trim(),
        weight: weight.trim(),
        hair: 'Dark Brown',
        eyes: 'Brown',
        scarsAndMarks: ['Verified by official court order'],
        languages: ['English'],
        nationality: 'United States',
      },
      summary: summary.trim() || 'Suspect is actively sought under valid felony arrest warrant.',
      cautionAdvisory: cautionAdvisory.trim(),
      lastKnownLocation: 'Regional metropolitan area under surveillance.',
      flightRiskAssessment: 'HIGH',
      weaponsCaution: true,
      officialDocuments: [
        {
          id: `doc-${Date.now()}`,
          title: `Certified Judicial Arrest Warrant #${warrantNumber}`,
          type: 'WARRANT',
          issuedDate: new Date().toISOString().slice(0, 10),
          documentRef: warrantNumber,
          verified: true,
        },
      ],
    };

    onSaveCase(newCase);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-sm overflow-y-auto">
      <div className="relative bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden my-auto">
        
        {/* Header */}
        <div className="px-5 py-3.5 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FolderLock className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-200">
              REGISTER NEW AUTHORIZED WANTED CASE FILE
            </span>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4 max-h-[78vh] overflow-y-auto">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-mono font-bold text-slate-300 block mb-1">
                Full Legal Name: *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Johnathan Vance"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-500 font-sans"
              />
            </div>

            <div>
              <label className="text-xs font-mono font-bold text-slate-300 block mb-1">
                Known Aliases (comma-separated):
              </label>
              <input
                type="text"
                placeholder="e.g. Johnny V, Jack Smith"
                value={aliases}
                onChange={(e) => setAliases(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-500 font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-mono font-bold text-slate-300 block mb-1">
                Warrant Number: *
              </label>
              <input
                type="text"
                required
                value={warrantNumber}
                onChange={(e) => setWarrantNumber(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-500 font-mono"
              />
            </div>

            <div>
              <label className="text-xs font-mono font-bold text-slate-300 block mb-1">
                Priority Tier:
              </label>
              <select
                value={priorityLevel}
                onChange={(e) => setPriorityLevel(e.target.value as PriorityLevel)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-500 font-mono"
              >
                <option value="Tier 1 - Critical">Tier 1 - Critical</option>
                <option value="Tier 2 - High">Tier 2 - High</option>
                <option value="Tier 3 - Medium">Tier 3 - Medium</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-mono font-bold text-slate-300 block mb-1">
                Reward Amount:
              </label>
              <input
                type="text"
                value={rewardAmount}
                onChange={(e) => setRewardAmount(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-500 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-mono font-bold text-slate-300 block mb-1">
              Primary Formal Charges: *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Unlawful Flight to Avoid Prosecution, Armed Robbery (18 U.S.C. § 2113)"
              value={primaryCharge}
              onChange={(e) => setPrimaryCharge(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-mono font-bold text-slate-300 block mb-1">
                Lead Law Enforcement Agency:
              </label>
              <input
                type="text"
                value={leadAgency}
                onChange={(e) => setLeadAgency(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="text-xs font-mono font-bold text-slate-300 block mb-1">
                Court Jurisdiction:
              </label>
              <input
                type="text"
                value={jurisdiction}
                onChange={(e) => setJurisdiction(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-mono font-bold text-slate-300 block mb-1">
                Approximate Age:
              </label>
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none font-mono"
              />
            </div>
            <div>
              <label className="text-xs font-mono font-bold text-slate-300 block mb-1">
                Height:
              </label>
              <input
                type="text"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none font-mono"
              />
            </div>
            <div>
              <label className="text-xs font-mono font-bold text-slate-300 block mb-1">
                Weight:
              </label>
              <input
                type="text"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none font-mono"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-mono font-bold text-slate-300 block mb-1">
              Investigative Summary:
            </label>
            <textarea
              rows={3}
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="Case summary and verified factual background..."
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="text-xs font-mono font-bold text-slate-300 block mb-1">
              Caution Advisory:
            </label>
            <input
              type="text"
              value={cautionAdvisory}
              onChange={(e) => setCautionAdvisory(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-red-300 focus:outline-none font-mono"
            />
          </div>

          {/* Modal Actions */}
          <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-xs text-slate-400 hover:text-slate-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold px-5 py-2.5 rounded-lg text-xs transition shadow-sm"
            >
              Register & Publish Case
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
