import React, { useState } from 'react';
import {
  X,
  Download,
  FileText,
  Shield,
  Smartphone,
  CheckCircle2,
  ScrollText,
  Target,
  FileCheck,
  FolderDown,
} from 'lucide-react';
import { WantedCase, MissionPlan, MissionReport, AuditLogEntry } from '../../types';
import {
  downloadWantedPosterHtml,
  downloadCasePackageJson,
  downloadMissionBlueprintText,
  downloadAdministrativeReportHtml,
} from '../../utils/downloadHelpers';
import { PWAInstallButton } from '../common/PWAInstallButton';

interface DownloadCenterModalProps {
  isOpen: boolean;
  onClose: () => void;
  cases: WantedCase[];
  missions: MissionPlan[];
  reports: MissionReport[];
  auditLogs: AuditLogEntry[];
}

export const DownloadCenterModal: React.FC<DownloadCenterModalProps> = ({
  isOpen,
  onClose,
  cases,
  missions,
  reports,
  auditLogs,
}) => {
  if (!isOpen) return null;

  const [selectedCaseId, setSelectedCaseId] = useState(cases[0]?.id || '');
  const [downloadSuccessMessage, setDownloadSuccessMessage] = useState<string | null>(null);

  const selectedCase = cases.find((c) => c.id === selectedCaseId) || cases[0];
  const selectedMission = missions.find((m) => m.caseId === selectedCaseId) || missions[0];
  const selectedReport = reports[0];

  const showNotification = (msg: string) => {
    setDownloadSuccessMessage(msg);
    setTimeout(() => setDownloadSuccessMessage(null), 3500);
  };

  const handleDownloadPoster = () => {
    if (!selectedCase) return;
    downloadWantedPosterHtml(selectedCase);
    showNotification(`Downloaded Official Wanted Poster for ${selectedCase.fullName}`);
  };

  const handleDownloadCasePackage = () => {
    if (!selectedCase) return;
    downloadCasePackageJson(selectedCase);
    showNotification(`Downloaded Case Intelligence Package for ${selectedCase.fullName}`);
  };

  const handleDownloadMission = () => {
    if (!selectedMission) return;
    downloadMissionBlueprintText(selectedMission, selectedCase);
    showNotification(`Downloaded Mission Blueprint ${selectedMission.missionCode}`);
  };

  const handleDownloadReport = () => {
    if (!selectedReport) return;
    downloadAdministrativeReportHtml(selectedReport, selectedCase);
    showNotification(`Downloaded Administrative Report ${selectedReport.reportNumber}`);
  };

  const handleDownloadAudit = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(auditLogs, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `SENTINEL_AUDIT_TRAIL_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showNotification(`Downloaded Cryptographic Audit Trail (${auditLogs.length} events)`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-sm overflow-y-auto">
      <div className="relative bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden my-auto">
        
        {/* Header */}
        <div className="px-5 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FolderDown className="w-5 h-5 text-amber-400" />
            <div>
              <h2 className="text-sm font-bold text-slate-100 font-mono uppercase tracking-wider">
                SENTINEL DOWNLOAD & EXPORT CENTER
              </h2>
              <p className="text-[11px] text-slate-400">
                Official Law Enforcement Dossiers, Printable Wanted Notices & Standalone App Installation
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        {downloadSuccessMessage && (
          <div className="bg-emerald-950 border-y border-emerald-700/80 px-4 py-2 text-xs font-mono text-emerald-200 flex items-center gap-2 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{downloadSuccessMessage}</span>
          </div>
        )}

        <div className="p-5 sm:p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          
          {/* Target Case Selector */}
          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1.5">
            <label className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider block">
              Select Wanted Case to Download:
            </label>
            <select
              value={selectedCaseId}
              onChange={(e) => setSelectedCaseId(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-xs text-slate-200 font-mono focus:outline-none focus:border-amber-500 font-bold"
            >
              {cases.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.fullName} ({c.priorityLevel.split(' - ')[0]} • Warrant: {c.warrantNumber})
                </option>
              ))}
            </select>
          </div>

          {/* Download Options Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            
            {/* Option 1: Official Printable Wanted Poster */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col justify-between space-y-3">
              <div>
                <div className="flex items-center gap-2 text-red-400 font-bold text-xs uppercase font-mono">
                  <FileText className="w-4 h-4" />
                  <span>Official Wanted Poster</span>
                </div>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  High-contrast FBI/USMS-style public notice with photo, aliases, physical markers, reward banner, and statutory anti-vigilantism mandate.
                </p>
              </div>

              <button
                onClick={handleDownloadPoster}
                className="w-full flex items-center justify-center gap-1.5 bg-red-950 hover:bg-red-900 text-red-200 border border-red-800 py-2 rounded-lg text-xs font-bold font-mono transition"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Poster (.HTML/Print)</span>
              </button>
            </div>

            {/* Option 2: Certified Case Intelligence Package */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col justify-between space-y-3">
              <div>
                <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase font-mono">
                  <Shield className="w-4 h-4" />
                  <span>Case Intelligence Package</span>
                </div>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  Machine-readable JSON data bundle including warrant dockets, provenance verification, descriptors, and SHA-256 integrity checksum.
                </p>
              </div>

              <button
                onClick={handleDownloadCasePackage}
                className="w-full flex items-center justify-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-amber-300 border border-slate-700 py-2 rounded-lg text-xs font-bold font-mono transition"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Case Data (.JSON)</span>
              </button>
            </div>

            {/* Option 3: Operational Mission Blueprint */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col justify-between space-y-3">
              <div>
                <div className="flex items-center gap-2 text-cyan-400 font-bold text-xs uppercase font-mono">
                  <Target className="w-4 h-4" />
                  <span>Tactical Mission Blueprint</span>
                </div>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  Operational plan with assigned teams, required tactical resources, verified checklist items, risk scores, and communication directives.
                </p>
              </div>

              <button
                onClick={handleDownloadMission}
                className="w-full flex items-center justify-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-cyan-300 border border-slate-700 py-2 rounded-lg text-xs font-bold font-mono transition"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Mission Plan (.TXT)</span>
              </button>
            </div>

            {/* Option 4: Final Administrative Report */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col justify-between space-y-3">
              <div>
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase font-mono">
                  <FileCheck className="w-4 h-4" />
                  <span>Administrative Final Report</span>
                </div>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  Formal case resolution docket with chain of custody summary, threat mitigation narrative, and supervisory sign-off seal.
                </p>
              </div>

              <button
                onClick={handleDownloadReport}
                className="w-full flex items-center justify-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-emerald-300 border border-slate-700 py-2 rounded-lg text-xs font-bold font-mono transition"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Report (.HTML/Print)</span>
              </button>
            </div>

          </div>

          {/* Option 5: Audit Trail Logs */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 text-slate-300 font-bold text-xs uppercase font-mono">
                <ScrollText className="w-4 h-4 text-amber-400" />
                <span>Cryptographic Audit Trail Log</span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Full chronological activity log ({auditLogs.length} events) with timestamps, IP addresses, and digital hashes.
              </p>
            </div>

            <button
              onClick={handleDownloadAudit}
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-4 py-2 rounded-lg text-xs font-mono font-bold transition shrink-0 flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Audit (.JSON)</span>
            </button>
          </div>

          {/* Option 6: Install Standalone PWA App */}
          <div className="bg-gradient-to-r from-indigo-950/60 via-slate-950 to-slate-950 p-4 rounded-xl border border-indigo-800/50 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-indigo-300 font-bold text-xs uppercase font-mono">
                <Smartphone className="w-4 h-4 text-indigo-400" />
                <span>Install Standalone PWA for Desktop & Mobile</span>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                OFFLINE READY
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Install the complete Sentinel software directly onto your laptop, workstation, iPad, or mobile phone. Runs independently of browser tabs with cached offline database.
            </p>
            <div className="pt-1">
              <PWAInstallButton variant="card" />
            </div>
          </div>

        </div>

        <div className="px-5 py-3.5 bg-slate-950 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-5 py-2 rounded-lg text-xs font-semibold transition"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
