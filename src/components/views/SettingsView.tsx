import React, { useState } from 'react';
import {
  Settings as SettingsIcon,
  Shield,
  Lock,
  UserCheck,
  KeyRound,
  FileCheck,
  AlertTriangle,
  Database,
  Trash2,
  CheckCircle2,
} from 'lucide-react';
import { UserSession, UserRole } from '../../types';

interface SettingsViewProps {
  userSession: UserSession;
  onChangeRole: (role: UserRole) => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  userSession,
  onChangeRole,
}) => {
  const [retentionPeriodYears, setRetentionPeriodYears] = useState('7');
  const [autoPurgeUnverifiedTipsDays, setAutoPurgeUnverifiedTipsDays] = useState('90');
  const [encryptionStandard, setEncryptionStandard] = useState('AES-256-GCM / TLS 1.3');
  const [mfaStatus, setMfaStatus] = useState(true);
  const [savedNotice, setSavedNotice] = useState(false);

  const handleSave = () => {
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 3000);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl shadow-sm">
        <div className="flex items-center gap-2">
          <SettingsIcon className="w-5 h-5 text-amber-500" />
          <h1 className="text-xl sm:text-2xl font-black text-slate-100 tracking-tight">
            Security, Privacy & Data Governance Policies
          </h1>
        </div>
        <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-3xl">
          Configure statutory data retention (28 CFR § 23), role-based access controls (RBAC), multi-factor authentication, cryptographic key storage, and privacy boundaries.
        </p>
      </div>

      {savedNotice && (
        <div className="bg-emerald-950/80 border border-emerald-700/60 p-3 rounded-xl flex items-center gap-2 text-emerald-200 text-xs font-mono font-bold animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Security policy configuration successfully updated and cryptographically signed.</span>
        </div>
      )}

      {/* Grid of Settings Modules */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Module 1: Role-Based Access Control (RBAC) */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase font-mono">
            <UserCheck className="w-4 h-4" />
            <span>Role-Based Access Control (RBAC)</span>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="text-slate-400 font-mono block mb-1">Active Sworn Role:</label>
              <select
                value={userSession.role}
                onChange={(e) => onChangeRole(e.target.value as UserRole)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 font-mono focus:outline-none focus:border-amber-500 font-bold"
              >
                <option value="SUPERVISORY_AGENT">Supervisory Special Agent (Lead Approval Clearance)</option>
                <option value="TASK_FORCE_DETECTIVE">Task Force Detective (Operational Apprehension)</option>
                <option value="INTEL_ANALYST">Criminal Intelligence Analyst (Record Verification)</option>
                <option value="AGENCY_DIRECTOR">Agency Director (Executive Policy Oversight)</option>
                <option value="PUBLIC_VIEW">Public Citizen / Anonymous Tipster View</option>
              </select>
            </div>

            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-1 font-mono text-[11px] text-slate-400">
              <div>Assigned Officer: <strong className="text-slate-200">{userSession.name}</strong></div>
              <div>Badge / Credential ID: <strong className="text-slate-200">{userSession.badgeNumber}</strong></div>
              <div>Clearance Level: <strong className="text-amber-400">{userSession.clearanceLevel}</strong></div>
            </div>
          </div>
        </div>

        {/* Module 2: Multi-Factor Authentication & Cryptography */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase font-mono">
            <Lock className="w-4 h-4" />
            <span>Authentication & Cryptography</span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between p-3 bg-slate-950 rounded-lg border border-slate-800">
              <div>
                <span className="font-bold text-slate-200 block">FIPS 140-3 Hardware Key MFA:</span>
                <span className="text-[11px] text-slate-400 font-mono">YubiKey / PIV Smartcard mandatory</span>
              </div>
              <input
                type="checkbox"
                checked={mfaStatus}
                onChange={(e) => setMfaStatus(e.target.checked)}
                className="w-4 h-4 rounded text-emerald-500 bg-slate-900 border-slate-700 cursor-pointer"
              />
            </div>

            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 font-mono text-[11px] space-y-1">
              <span className="text-slate-500 block">ENCRYPTION PROTOCOL:</span>
              <span className="text-cyan-300 font-bold">{encryptionStandard}</span>
              <span className="text-slate-500 block text-[10px] mt-1">
                Zero plaintext caching of non-published intelligence assets.
              </span>
            </div>
          </div>
        </div>

        {/* Module 3: Statutory Data Retention (28 CFR Part 23) */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-cyan-400 font-bold text-xs uppercase font-mono">
            <Database className="w-4 h-4" />
            <span>Statutory Data Retention & Expungement (28 CFR § 23)</span>
          </div>

          <div className="space-y-3 text-xs font-mono">
            <div>
              <label className="text-slate-400 block mb-1">
                Active Criminal Intelligence Retention Horizon:
              </label>
              <select
                value={retentionPeriodYears}
                onChange={(e) => setRetentionPeriodYears(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200 focus:outline-none"
              >
                <option value="5">5 Years post-validation (Standard Federal)</option>
                <option value="7">7 Years post-adjudication (Felony Fugitive)</option>
                <option value="10">10 Years (Tier 1 Transnational Extradition)</option>
              </select>
            </div>

            <div>
              <label className="text-slate-400 block mb-1">
                Auto-Purge Uncorroborated Citizen Tips Horizon:
              </label>
              <select
                value={autoPurgeUnverifiedTipsDays}
                onChange={(e) => setAutoPurgeUnverifiedTipsDays(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200 focus:outline-none"
              >
                <option value="30">30 Days without corroboration</option>
                <option value="60">60 Days without corroboration</option>
                <option value="90">90 Days without corroboration (Recommended)</option>
              </select>
            </div>

            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-[11px] text-slate-400 font-sans">
              <strong>Expungement Protocol:</strong> When a judicial bench warrant is vacated or dismissed by court order, all corresponding surveillance flags and public posters must be purged within 24 hours.
            </div>
          </div>
        </div>

        {/* Module 4: Strict Public Privacy Safeguards */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-red-400 font-bold text-xs uppercase font-mono">
            <Shield className="w-4 h-4" />
            <span>Constitutional Privacy & Non-Vigilantism Guardrails</span>
          </div>

          <div className="space-y-2.5 text-xs text-slate-300 leading-relaxed">
            <div className="p-3 bg-red-950/30 border border-red-900/60 rounded-lg space-y-1">
              <span className="font-bold text-red-300 font-mono text-[11px] block">
                STRICT PRIVACY SAFEGUARD:
              </span>
              <p>
                The system strictly refuses to expose residential addresses, private civilian telecom records, or real-time geolocations of non-wanted individuals.
              </p>
            </div>

            <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg space-y-1">
              <span className="font-bold text-slate-200 font-mono text-[11px] block">
                CORRECTION & REMOVAL WORKFLOW:
              </span>
              <p>
                Individuals may petition for data verification or correction under Federal Privacy Act procedures by submitting verified court dockets.
              </p>
            </div>
          </div>
        </div>

      </div>

      <div className="flex justify-end">
        <button
          onClick={handleSave}
          className="bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold px-6 py-2.5 rounded-lg text-xs transition shadow-sm"
        >
          Save Security & Governance Configurations
        </button>
      </div>

    </div>
  );
};
