import React from 'react';
import { ShieldCheck, Lock, Hash, Clock, UserCheck, AlertCircle } from 'lucide-react';
import { AuditLogEntry } from '../types';

interface AuditLogModalProps {
  logs: AuditLogEntry[];
}

export const AuditLogModal: React.FC<AuditLogModalProps> = ({ logs }) => {
  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 lg:p-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
              <span>Governance & Data Integrity Protection</span>
              <span aria-hidden="true">·</span>
              <span>SHA-256 Ledger State</span>
              <span aria-hidden="true">·</span>
              <span className="text-emerald-400 font-medium">Zero-Tampering Security</span>
            </div>
            <h1 className="text-xl lg:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              <ShieldCheck className="w-6 h-6 text-emerald-400" />
              Operational Security & Audit Log
            </h1>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/20">
            <Lock className="w-3.5 h-3.5" />
            <span>End-to-End Encrypted Telemetry</span>
          </div>
        </div>
      </div>

      {/* Security Architecture Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
        <div className="bg-slate-900/70 border border-slate-800 p-4 rounded-xl space-y-1">
          <span className="text-slate-400 font-medium block">Access Control</span>
          <span className="font-bold text-white text-sm block">Role-Based Access Control (RBAC)</span>
          <p className="text-slate-400 text-[11px] mt-1">
            Enforces strict division between field scouts, emergency coordinators, and public utility engineers.
          </p>
        </div>

        <div className="bg-slate-900/70 border border-slate-800 p-4 rounded-xl space-y-1">
          <span className="text-slate-400 font-medium block">Verification Guarantee</span>
          <span className="font-bold text-white text-sm block">Dual-Party Sign-Off</span>
          <p className="text-slate-400 text-[11px] mt-1">
            Resource dispatches over $50,000 USD require dual authorization from MINEMA and executing agency.
          </p>
        </div>

        <div className="bg-slate-900/70 border border-slate-800 p-4 rounded-xl space-y-1">
          <span className="text-slate-400 font-medium block">Data Minimization</span>
          <span className="font-bold text-white text-sm block">Citizen Privacy Masking</span>
          <p className="text-slate-400 text-[11px] mt-1">
            Citizen phone numbers and biometric data are masked to prevent unauthorized surveillance.
          </p>
        </div>
      </div>

      {/* Immutable Audit Log Table */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white">Immutable Operational Ledger</h3>
          <span className="text-xs text-slate-400 font-mono">Last 10 Actions Recorded</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-mono">
                <th className="py-2.5">Audit ID</th>
                <th className="py-2.5">Timestamp (UTC)</th>
                <th className="py-2.5">Authorized Actor</th>
                <th className="py-2.5">Role</th>
                <th className="py-2.5">Action Executed</th>
                <th className="py-2.5">Target Record</th>
                <th className="py-2.5 text-right">Cryptographic Hash</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono text-[11px]">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-950/40">
                  <td className="py-3 font-bold text-emerald-400">{log.id}</td>
                  <td className="py-3 text-slate-400">{log.timestamp}</td>
                  <td className="py-3 text-white font-sans font-semibold">{log.actor}</td>
                  <td className="py-3 text-slate-300 font-sans">{log.role}</td>
                  <td className="py-3 text-teal-300 font-bold">{log.action}</td>
                  <td className="py-3 text-slate-400">{log.targetId}</td>
                  <td className="py-3 text-right text-slate-500 font-mono">{log.hash}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
