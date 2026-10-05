import React, { useState } from 'react';
import {
  Binary,
  AlertTriangle,
  GitCompare,
  Calendar,
  CheckCircle2,
  FileQuestion,
  Sparkles,
  UserCheck,
  ShieldAlert,
  ArrowRight,
  RefreshCw,
  Search,
  ExternalLink,
} from 'lucide-react';
import { WantedCase, IntelligenceAnalysisResult } from '../../types';
import { analyzeIntelligenceWithAi } from '../../services/aiService';

interface IntelligenceViewProps {
  cases: WantedCase[];
  selectedCaseId?: string;
  onSelectCase: (caseItem: WantedCase) => void;
}

export const IntelligenceView: React.FC<IntelligenceViewProps> = ({
  cases,
  selectedCaseId,
  onSelectCase,
}) => {
  const [activeCaseId, setActiveCaseId] = useState<string>(
    selectedCaseId || cases[0]?.id || ''
  );
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<IntelligenceAnalysisResult | null>(null);
  const [activeTab, setActiveTab] = useState<'contradictions' | 'duplicates' | 'gaps' | 'timeline' | 'connections' | 'verification'>('contradictions');
  const [humanApprovedList, setHumanApprovedList] = useState<Record<string, boolean>>({});

  const activeCase = cases.find((c) => c.id === activeCaseId) || cases[0];

  const handleRunAiAnalysis = async () => {
    if (!activeCase) return;
    setIsAnalyzing(true);
    try {
      const otherCases = cases.filter((c) => c.id !== activeCase.id);
      const res = await analyzeIntelligenceWithAi(activeCase, otherCases);
      setAnalysisResult(res);
    } catch (e) {
      console.error(e);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Pre-load default analysis if none run yet
  React.useEffect(() => {
    if (!analysisResult && activeCase) {
      handleRunAiAnalysis();
    }
  }, [activeCaseId]);

  const toggleHumanApproval = (itemKey: string) => {
    setHumanApprovedList((prev) => ({
      ...prev,
      [itemKey]: !prev[itemKey],
    }));
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-5 rounded-xl shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <Binary className="w-5 h-5 text-cyan-400" />
            <h1 className="text-xl sm:text-2xl font-black text-slate-100 tracking-tight">
              Case Intelligence & Discrepancy Engine
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            Automated cross-examination of multi-agency warrants, DMV registries, Interpol notices, and forensic reports to detect contradictions and intelligence gaps.
          </p>
        </div>

        {/* Case Selector */}
        <div className="flex items-center gap-2">
          <select
            aria-label="Select case for intelligence analysis"
            value={activeCaseId}
            onChange={(e) => {
              setActiveCaseId(e.target.value);
              setAnalysisResult(null);
            }}
            className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs font-mono text-cyan-300 font-bold focus:outline-none focus:border-cyan-500"
          >
            {cases.map((c) => (
              <option key={c.id} value={c.id}>
                {c.fullName} ({c.caseNumber})
              </option>
            ))}
          </select>

          <button
            onClick={handleRunAiAnalysis}
            disabled={isAnalyzing}
            className="flex items-center gap-1.5 bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold px-3 py-2 rounded-lg text-xs transition disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isAnalyzing ? 'animate-spin' : ''}`} />
            <span>{isAnalyzing ? 'Analyzing...' : 'Re-Run Analysis'}</span>
          </button>
        </div>
      </div>

      {/* Target Case Context Card */}
      {activeCase && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
          <div className="flex items-center gap-3.5">
            <img
              src={activeCase.photoUrl}
              alt={activeCase.fullName}
              className="w-12 h-12 rounded-lg object-cover border border-slate-700 shrink-0"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-100">{activeCase.fullName}</span>
                <span className="text-xs font-mono text-slate-400">({activeCase.warrantNumber})</span>
                <span className="px-1.5 py-0.2 rounded text-[10px] font-mono bg-red-500/20 text-red-400 border border-red-500/30">
                  {activeCase.priorityLevel}
                </span>
              </div>
              <div className="text-xs text-slate-300 line-clamp-1 mt-0.5">
                Lead: {activeCase.leadAgency} • Last Verified: {activeCase.lastVerifiedDate} by {activeCase.verifiedByOfficer}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded bg-slate-950 border border-slate-800 text-[11px] font-mono text-emerald-400 font-bold flex items-center gap-1">
              <UserCheck className="w-3.5 h-3.5" />
              HUMAN REVIEW ENFORCED
            </span>
          </div>
        </div>
      )}

      {/* Analysis Nav Tabs */}
      <div className="flex items-center space-x-1 border-b border-slate-800 bg-slate-950/80 p-1.5 rounded-xl overflow-x-auto text-xs font-mono">
        {[
          { id: 'contradictions', label: '1. Contradictions', count: analysisResult?.contradictions.length || 2, color: 'text-amber-400' },
          { id: 'duplicates', label: '2. Duplicate Records', count: analysisResult?.duplicatesDetected.length || 1, color: 'text-cyan-400' },
          { id: 'gaps', label: '3. Missing Information', count: analysisResult?.missingInformation.length || 3, color: 'text-rose-400' },
          { id: 'timeline', label: '4. Critical Dates', count: analysisResult?.criticalDates.length || 3, color: 'text-indigo-400' },
          { id: 'connections', label: '5. Cross-Case Syndicates', count: analysisResult?.crossCaseConnections.length || 2, color: 'text-emerald-400' },
          { id: 'verification', label: '6. Human Verification Queue', count: analysisResult?.humanVerificationRequired.length || 2, color: 'text-red-400' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-3 py-2 rounded-lg font-bold transition flex items-center gap-2 whitespace-nowrap shrink-0 ${
              activeTab === tab.id
                ? 'bg-slate-800 text-slate-100 border border-slate-700 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
            }`}
          >
            <span>{tab.label}</span>
            <span className={`px-1.5 py-0.2 rounded-full text-[10px] bg-slate-950 border border-slate-800 ${tab.color}`}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Tab Contents */}
      {analysisResult && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
          
          {/* TAB 1: CONTRADICTIONS */}
          {activeTab === 'contradictions' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-100 uppercase font-mono">
                    Direct Contradictions Identified Across Records
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Discrepancies discovered when comparing court indictments, state driver registries, and international law enforcement alerts.
                  </p>
                </div>
              </div>

              <div className="space-y-2.5">
                {analysisResult.contradictions.map((contra, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 bg-amber-950/20 border border-amber-800/40 rounded-xl flex items-start gap-3"
                  >
                    <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <div className="text-xs text-amber-200 font-semibold leading-relaxed">
                        {contra}
                      </div>
                      <div className="mt-2 flex items-center gap-2">
                        <button
                          onClick={() => toggleHumanApproval(`contra-${idx}`)}
                          className={`px-2 py-1 rounded text-[11px] font-mono font-bold transition ${
                            humanApprovedList[`contra-${idx}`]
                              ? 'bg-emerald-600 text-white'
                              : 'bg-slate-950 text-slate-300 border border-slate-700 hover:border-slate-500'
                          }`}
                        >
                          {humanApprovedList[`contra-${idx}`] ? '✓ Resolved by Investigator' : 'Mark for Sworn Review'}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: DUPLICATES */}
          {activeTab === 'duplicates' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-bold text-slate-100 uppercase font-mono">
                  Duplicate Records & Alternate Namespaces Detected
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Spelling variations, phonetic aliases, or duplicate state DMV/NCIC profiles that should be consolidated.
                </p>
              </div>

              <div className="space-y-2.5">
                {analysisResult.duplicatesDetected.map((dup, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 bg-cyan-950/20 border border-cyan-800/40 rounded-xl flex items-start gap-3"
                  >
                    <GitCompare className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <div className="text-xs text-cyan-200 font-semibold leading-relaxed">
                        {dup}
                      </div>
                      <div className="mt-2 text-[11px] font-mono text-slate-400">
                        Action: Coordinate with NCIC Control Agent to issue consolidation record.
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: MISSING INFORMATION */}
          {activeTab === 'gaps' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-bold text-slate-100 uppercase font-mono">
                  Critical Intelligence Gaps & Missing Information
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Missing biometric profiles, unverified border transit logs, or expired warrants needing administrative renewal.
                </p>
              </div>

              <div className="space-y-2.5">
                {analysisResult.missingInformation.map((gap, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 bg-rose-950/20 border border-rose-800/40 rounded-xl flex items-start gap-3"
                  >
                    <FileQuestion className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <div className="text-xs text-rose-200 font-semibold leading-relaxed">
                        {gap}
                      </div>
                      <div className="mt-2 text-[11px] font-mono text-slate-400">
                        Recommendation: Issue administrative subpoena or request state bureau update.
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: CRITICAL DATES TIMELINE */}
          {activeTab === 'timeline' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-bold text-slate-100 uppercase font-mono">
                  Chronological Intelligence & Judicial Milestones
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Verified statutory timelines, unsealed grand jury indictments, and corroborated physical sightings.
                </p>
              </div>

              <div className="relative pl-6 space-y-4 border-l-2 border-indigo-800/60 my-4">
                {analysisResult.criticalDates.map((item, idx) => (
                  <div key={idx} className="relative group">
                    <span className="absolute -left-[31px] top-1.5 w-3 h-3 rounded-full bg-indigo-500 border-2 border-slate-900"></span>
                    <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                      <span className="text-[11px] font-mono text-amber-400 font-bold block">
                        {item.date}
                      </span>
                      <div className="text-xs text-slate-200 font-medium mt-0.5">
                        {item.event}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: CROSS-CASE CONNECTIONS */}
          {activeTab === 'connections' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-bold text-slate-100 uppercase font-mono">
                  Connections Between Verified Law Enforcement Cases
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Shared corporate shell registrations, common burner telecom clusters, and cooperating defense attorneys.
                </p>
              </div>

              <div className="space-y-2.5">
                {analysisResult.crossCaseConnections.map((conn, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 bg-emerald-950/20 border border-emerald-800/40 rounded-xl flex items-start gap-3"
                  >
                    <Binary className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <div className="text-xs text-emerald-200 font-semibold leading-relaxed">
                        {conn}
                      </div>
                      <div className="mt-1.5 text-[11px] font-mono text-slate-400">
                        Link verified under Multi-Agency Deconfliction Protocol (HIDTA / EPIC).
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: HUMAN VERIFICATION QUEUE */}
          {activeTab === 'verification' && (
            <div className="space-y-4">
              <div className="bg-red-950/30 border border-red-800/60 p-4 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <ShieldAlert className="w-5 h-5 text-red-400 shrink-0" />
                  <div>
                    <h4 className="text-xs font-bold font-mono uppercase text-red-200">
                      Mandatory Human Investigator Review Queue
                    </h4>
                    <p className="text-xs text-slate-300">
                      Per constitutional standard, no automated AI finding may trigger surveillance or warrant action without sworn human investigator sign-off.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                {analysisResult.humanVerificationRequired.map((item, idx) => {
                  const isSigned = !!humanApprovedList[`sign-${idx}`];

                  return (
                    <div
                      key={idx}
                      className="p-4 bg-slate-950 border border-slate-800 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="flex-1">
                        <div className="text-xs font-bold text-slate-200 leading-snug">
                          {item}
                        </div>
                        <div className="text-[11px] font-mono text-slate-400 mt-1">
                          Status: {isSigned ? '✓ Sworn Sign-Off Recorded' : 'Action Required: Verify physical provenance'}
                        </div>
                      </div>

                      <button
                        onClick={() => toggleHumanApproval(`sign-${idx}`)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition shrink-0 flex items-center gap-1.5 ${
                          isSigned
                            ? 'bg-emerald-600 text-white'
                            : 'bg-amber-600 hover:bg-amber-500 text-slate-950'
                        }`}
                      >
                        <UserCheck className="w-3.5 h-3.5" />
                        <span>{isSigned ? 'Approved & Signed' : 'Sign Off as Human Lead'}</span>
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

        </div>
      )}

    </div>
  );
};
