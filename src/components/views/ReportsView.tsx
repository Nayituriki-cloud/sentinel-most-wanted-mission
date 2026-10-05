import React, { useState } from 'react';
import {
  FileText,
  Printer,
  Download,
  CheckCircle2,
  ShieldCheck,
  Building,
  UserCheck,
  Calendar,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { MissionReport, WantedCase, MissionPlan } from '../../types';
import { generateFinalReportWithAi } from '../../services/aiService';
import { downloadAdministrativeReportHtml } from '../../utils/downloadHelpers';

interface ReportsViewProps {
  cases: WantedCase[];
  missions: MissionPlan[];
  reports: MissionReport[];
  onAddReport: (newReport: MissionReport) => void;
}

export const ReportsView: React.FC<ReportsViewProps> = ({
  cases,
  missions,
  reports,
  onAddReport,
}) => {
  const [selectedReportId, setSelectedReportId] = useState<string>(
    reports[0]?.id || ''
  );
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedCaseForNewReport, setSelectedCaseForNewReport] = useState<string>(
    cases[0]?.id || ''
  );

  const selectedReport = reports.find((r) => r.id === selectedReportId) || reports[0];

  const handleGenerateNewReport = async () => {
    const targetCase = cases.find((c) => c.id === selectedCaseForNewReport);
    const targetMission = missions.find((m) => m.caseId === selectedCaseForNewReport) || missions[0];
    if (!targetCase || !targetMission) return;

    setIsGenerating(true);
    try {
      const generated = await generateFinalReportWithAi(
        targetCase,
        targetMission,
        'APPREHENDED_SAFELY',
        'Subject located through corroborated citizen tip intelligence and safely taken into custody by tactical apprehension task force.'
      );

      const newReport: MissionReport = {
        id: `rep-${Date.now()}`,
        reportNumber: generated.reportId || `REP-${Math.floor(100000 + Math.random() * 900000)}`,
        caseId: targetCase.id,
        missionId: targetMission.id,
        title: generated.title || `FINAL ADMINISTRATIVE MISSION REPORT: ${targetCase.fullName}`,
        classification: 'OFFICIAL USE ONLY / LAW ENFORCEMENT RECORD',
        generatedDate: new Date().toISOString(),
        authorOfficer: 'Supervisory Special Agent J. Miller',
        authorBadge: 'SSA-4819',
        outcome: 'APPREHENDED_SAFELY',
        executiveSummary: generated.caseSummary || 'Mission completed under active judicial warrant.',
        chainOfCustodySummary: generated.chainOfCustodySummary || 'Evidence secured in property vault CC-2026-881.',
        publicSafetyImpact: generated.publicSafetyImpact || 'Immediate community danger mitigated lawfully.',
        tipsReceivedCount: 4,
        tasksCompletedCount: targetMission.tasks.length,
        supervisorSignature: {
          officer: 'Supervisory Special Agent J. Miller',
          badge: 'SSA-4819',
          timestamp: new Date().toISOString(),
          verifiedLawful: true,
        },
      };

      onAddReport(newReport);
      setSelectedReportId(newReport.id);
    } catch (e) {
      console.error(e);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-5 rounded-xl shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-amber-500" />
            <h1 className="text-xl sm:text-2xl font-black text-slate-100 tracking-tight">
              Official Administrative Mission Reports
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            Lawful case resolution summaries, chain of custody logs, public safety impact assessments, and certified supervisory signatures.
          </p>
        </div>

        {/* Generate New Report Trigger */}
        <div className="flex items-center gap-2 flex-wrap">
          <select
            aria-label="Select case for generating administrative report"
            value={selectedCaseForNewReport}
            onChange={(e) => setSelectedCaseForNewReport(e.target.value)}
            className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs font-mono text-slate-200 focus:outline-none"
          >
            {cases.map((c) => (
              <option key={c.id} value={c.id}>
                Case: {c.fullName}
              </option>
            ))}
          </select>

          <button
            onClick={handleGenerateNewReport}
            disabled={isGenerating}
            className="flex items-center gap-1.5 bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold px-3.5 py-2 rounded-lg text-xs transition shadow-sm disabled:opacity-50"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isGenerating ? 'Compiling...' : 'Generate Lawful Report'}</span>
          </button>
        </div>
      </div>

      {/* Grid: Report Selector & Printable Official Sheet */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Reports Archive List */}
        <div className="lg:col-span-4 space-y-3">
          <h2 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
            Filed Administrative Records ({reports.length})
          </h2>

          <div className="space-y-2.5">
            {reports.map((rep) => {
              const isSelected = rep.id === selectedReport?.id;
              const repCase = cases.find((c) => c.id === rep.caseId);

              return (
                <div
                  key={rep.id}
                  onClick={() => setSelectedReportId(rep.id)}
                  className={`p-3.5 rounded-xl border transition cursor-pointer ${
                    isSelected
                      ? 'bg-slate-900 border-amber-500 shadow-sm'
                      : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs font-mono text-amber-400 font-bold">
                    <span>{rep.reportNumber}</span>
                    <span className="text-slate-400 text-[10px]">
                      {new Date(rep.generatedDate).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="text-xs font-bold text-slate-100 mt-1 line-clamp-1">
                    {rep.title}
                  </div>

                  <div className="mt-2 flex items-center justify-between text-[11px] font-mono text-slate-400">
                    <span>Outcome: {rep.outcome}</span>
                    <span className="text-emerald-400">✓ Signed</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Printable Official Report Document */}
        <div className="lg:col-span-8">
          {selectedReport ? (
            <div className="space-y-3">
              <div className="flex items-center justify-end gap-2 no-print">
                <button
                  onClick={() => downloadAdministrativeReportHtml(selectedReport)}
                  className="flex items-center gap-1.5 bg-emerald-950 hover:bg-emerald-900 text-emerald-200 border border-emerald-700/60 px-3.5 py-1.5 rounded-lg text-xs font-mono font-semibold transition"
                  title="Download Official Report as Printable Document"
                >
                  <Download className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Download Report (.HTML)</span>
                </button>
                <button
                  onClick={() => window.print()}
                  className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 px-3.5 py-1.5 rounded-lg text-xs font-mono font-semibold transition"
                >
                  <Printer className="w-3.5 h-3.5 text-slate-400" />
                  <span>Print Formal Report</span>
                </button>
              </div>

              {/* Physical Official Sheet Mockup */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 sm:p-8 space-y-6 shadow-xl report-sheet">
                
                {/* Formal Seal & Header */}
                <div className="text-center border-b border-slate-800 pb-5 space-y-1">
                  <div className="text-[11px] font-mono font-bold tracking-widest text-slate-400 uppercase">
                    UNITED STATES LAW ENFORCEMENT & PUBLIC SAFETY COALITION
                  </div>
                  <h2 className="text-lg sm:text-xl font-black text-slate-100 tracking-tight font-serif uppercase">
                    {selectedReport.title}
                  </h2>
                  <div className="text-xs font-mono text-amber-400">
                    CONTROL NO: {selectedReport.reportNumber} • CLASSIFICATION: {selectedReport.classification}
                  </div>
                </div>

                {/* Metadata Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono bg-slate-950 p-4 rounded-lg border border-slate-800">
                  <div>
                    <span className="text-slate-500 block text-[10px]">RECORD DATE:</span>
                    <span className="text-slate-200">{new Date(selectedReport.generatedDate).toLocaleDateString()}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">REPORTING AGENT:</span>
                    <span className="text-slate-200">{selectedReport.authorOfficer}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">BADGE ID:</span>
                    <span className="text-slate-200">{selectedReport.authorBadge}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">RESOLUTION:</span>
                    <span className="text-emerald-400 font-bold">{selectedReport.outcome}</span>
                  </div>
                </div>

                {/* Executive Summary */}
                <div className="space-y-1.5">
                  <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
                    1. Investigative Narrative & Outcome Summary
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed bg-slate-950/60 p-4 rounded-lg border border-slate-800">
                    {selectedReport.executiveSummary}
                  </p>
                </div>

                {/* Chain of Custody */}
                <div className="space-y-1.5">
                  <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
                    2. Physical & Digital Evidence Chain of Custody
                  </h3>
                  <div className="text-xs sm:text-sm text-slate-300 leading-relaxed bg-slate-950/60 p-4 rounded-lg border border-slate-800">
                    {selectedReport.chainOfCustodySummary}
                  </div>
                </div>

                {/* Public Safety Impact */}
                <div className="space-y-1.5">
                  <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
                    3. Public Safety & Community Threat Mitigation
                  </h3>
                  <div className="text-xs sm:text-sm text-slate-300 leading-relaxed bg-slate-950/60 p-4 rounded-lg border border-slate-800">
                    {selectedReport.publicSafetyImpact}
                  </div>
                </div>

                {/* Quantitative Operations Summary */}
                <div className="grid grid-cols-2 gap-4 text-xs font-mono">
                  <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                    <span className="text-slate-500">Citizen Tips Vetted:</span>
                    <div className="text-amber-400 font-bold text-base mt-0.5">
                      {selectedReport.tipsReceivedCount} Reports Analyzed
                    </div>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                    <span className="text-slate-500">Lawful Tasks Executed:</span>
                    <div className="text-emerald-400 font-bold text-base mt-0.5">
                      {selectedReport.tasksCompletedCount} Checklist Directives Verified
                    </div>
                  </div>
                </div>

                {/* Official Sign-off Seal */}
                <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-mono text-xs">
                  <div className="flex items-center gap-2 text-emerald-400">
                    <ShieldCheck className="w-5 h-5 shrink-0" />
                    <div>
                      <span className="font-bold block">VERIFIED CONSTITUTIONAL & LAWFUL RECORD</span>
                      <span className="text-[10px] text-slate-400">
                        Signed by: {selectedReport.supervisorSignature.officer} ({selectedReport.supervisorSignature.badge})
                      </span>
                    </div>
                  </div>

                  <div className="text-right text-[11px] text-slate-500">
                    DIGITAL SIGNATURE HASH: SHA-256: 9e88b...771c
                  </div>
                </div>

              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-slate-500 bg-slate-900 border border-slate-800 rounded-xl">
              No report selected.
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
