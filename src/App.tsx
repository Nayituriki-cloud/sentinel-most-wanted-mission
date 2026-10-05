import React, { useState } from 'react';
import {
  INITIAL_CASES,
  INITIAL_MISSIONS,
  INITIAL_TIPS,
  INITIAL_AGENCIES,
  INITIAL_AUDIT_LOGS,
} from './data/mockData';
import {
  WantedCase,
  MissionPlan,
  PublicTip,
  AgencyPartner,
  AuditLogEntry,
  UserSession,
  UserRole,
  MissionReport,
} from './types';
import { Header } from './components/layout/Header';
import { Navigation, MainNavTab } from './components/layout/Navigation';
import { AntiVigilantismBanner } from './components/common/AntiVigilantismBanner';
import { DashboardView } from './components/views/DashboardView';
import { MostWantedView } from './components/views/MostWantedView';
import { CasesView } from './components/views/CasesView';
import { MissionsView } from './components/views/MissionsView';
import { IntelligenceView } from './components/views/IntelligenceView';
import { TipsView } from './components/views/TipsView';
import { ReportsView } from './components/views/ReportsView';
import { AgenciesView } from './components/views/AgenciesView';
import { AiAssistantView } from './components/views/AiAssistantView';
import { AuditLogsView } from './components/views/AuditLogsView';
import { SettingsView } from './components/views/SettingsView';
import { CaseDetailModal } from './components/views/CaseDetailModal';
import { PublicTipModal } from './components/modals/PublicTipModal';
import { AddCaseModal } from './components/modals/AddCaseModal';
import { DownloadCenterModal } from './components/modals/DownloadCenterModal';
import { OfflineIndicator } from './components/common/OfflineIndicator';

export default function App() {
  // Primary Application State
  const [currentTab, setCurrentTab] = useState<MainNavTab>('Dashboard');
  const [cases, setCases] = useState<WantedCase[]>(INITIAL_CASES);
  const [missions, setMissions] = useState<MissionPlan[]>(INITIAL_MISSIONS);
  const [tips, setTips] = useState<PublicTip[]>(INITIAL_TIPS);
  const [agencies] = useState<AgencyPartner[]>(INITIAL_AGENCIES);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(INITIAL_AUDIT_LOGS);

  // Initial Reports
  const [reports, setReports] = useState<MissionReport[]>([
    {
      id: 'rep-001',
      reportNumber: 'REP-2026-9041-A',
      caseId: 'case-001',
      missionId: 'mis-001',
      title: 'INTERIM ADMINISTRATIVE INVESTIGATIVE SUMMARY: ELENA ROSTOVA-VANCE',
      classification: 'OFFICIAL USE ONLY / LAW ENFORCEMENT RECORD',
      generatedDate: '2026-10-01T15:00:00Z',
      authorOfficer: 'Supervisory Special Agent J. Miller',
      authorBadge: 'SSA-4819',
      outcome: 'LOCATED_SURVEILLANCE',
      executiveSummary: 'Subject located in international maritime transit via corroborated tip #TIP-2026-8942-X. Extradition package filed with foreign ministry under treaty authority.',
      chainOfCustodySummary: 'Digital forensics images preserved in secure evidence vault with hash sha256:d891...',
      publicSafetyImpact: 'Critical cyber threat mitigated with zero incident to regional utility operations.',
      tipsReceivedCount: 3,
      tasksCompletedCount: 4,
      supervisorSignature: {
        officer: 'Supervisory Special Agent J. Miller',
        badge: 'SSA-4819',
        timestamp: '2026-10-01T16:00:00Z',
        verifiedLawful: true,
      },
    },
  ]);

  // Active Session & User Roles
  const [userSession, setUserSession] = useState<UserSession>({
    name: 'Special Agent James Miller',
    badgeNumber: 'SSA-4819',
    role: 'SUPERVISORY_AGENT',
    agency: 'Federal Bureau of Investigation / Fugitive Task Force',
    clearanceLevel: 'TOP SECRET // LES',
    mfaVerified: true,
    sessionExpiry: '2026-10-04T23:59:59Z',
  });

  // Modal States
  const [selectedCaseForModal, setSelectedCaseForModal] = useState<WantedCase | null>(null);
  const [isTipModalOpen, setIsTipModalOpen] = useState(false);
  const [tipModalPreselectedCase, setTipModalPreselectedCase] = useState<WantedCase | null>(null);
  const [isAddCaseModalOpen, setIsAddCaseModalOpen] = useState(false);
  const [isDownloadCenterOpen, setIsDownloadCenterOpen] = useState(false);
  const [selectedCaseForAi, setSelectedCaseForAi] = useState<string | undefined>(undefined);

  // Helper to append audit entry
  const logAudit = (
    action: AuditLogEntry['action'],
    resourceTarget: string,
    details: string
  ) => {
    const newLog: AuditLogEntry = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
      officerBadge: userSession.badgeNumber,
      officerName: userSession.name,
      userRole: userSession.role,
      action,
      resourceTarget,
      details,
      ipAddress: '10.144.20.88 (CJIS FedNet VPN)',
      cryptographicChecksum: Math.random().toString(36).substring(2, 15),
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  // Role Switcher Handler
  const handleChangeRole = (newRole: UserRole) => {
    let name = 'Special Agent James Miller';
    let badge = 'SSA-4819';
    let clearance: UserSession['clearanceLevel'] = 'TOP SECRET // LES';

    if (newRole === 'TASK_FORCE_DETECTIVE') {
      name = 'Inspector David Gallagher';
      badge = 'USMS-9021';
      clearance = 'LAW ENFORCEMENT SENSITIVE';
    } else if (newRole === 'INTEL_ANALYST') {
      name = 'Analyst Kevin Cooper';
      badge = 'INTEL-7419';
      clearance = 'SECRET';
    } else if (newRole === 'AGENCY_DIRECTOR') {
      name = 'Director Arthur Sterling';
      badge = 'DIR-0001';
      clearance = 'TOP SECRET // LES';
    } else if (newRole === 'PUBLIC_VIEW') {
      name = 'Public Anonymous Viewer';
      badge = 'CITIZEN-PORTAL';
      clearance = 'PUBLIC';
    }

    setUserSession({
      name,
      badgeNumber: badge,
      role: newRole,
      agency: 'Joint Law Enforcement Task Force',
      clearanceLevel: clearance,
      mfaVerified: true,
      sessionExpiry: '2026-10-04T23:59:59Z',
    });

    logAudit('LOGIN', `Role changed to ${newRole}`, `Authenticated context updated`);
  };

  // Handlers
  const handleOpenCaseDetail = (caseItem: WantedCase) => {
    setSelectedCaseForModal(caseItem);
    logAudit('CASE_VIEW', `Case ${caseItem.caseNumber}`, `Inspected full profile of ${caseItem.fullName}`);
  };

  const handlePlanMissionForCase = (caseItem: WantedCase) => {
    setSelectedCaseForModal(null);
    setCurrentTab('Missions');
    logAudit('CASE_VIEW', `Mission Workspace`, `Opened mission operations for ${caseItem.fullName}`);
  };

  const handleSubmitTipForCase = (caseItem: WantedCase) => {
    setTipModalPreselectedCase(caseItem);
    setIsTipModalOpen(true);
  };

  const handleOpenAiForCase = (caseItem: WantedCase) => {
    setSelectedCaseForAi(caseItem.id);
    setSelectedCaseForModal(null);
    setCurrentTab('AI Assistant');
    logAudit('AI_QUERY', `AI Assistant`, `Dispatched query context for ${caseItem.fullName}`);
  };

  const handleAddNewTip = (newTip: PublicTip) => {
    setTips((prev) => [newTip, ...prev]);
    logAudit('TIP_ACCESSED', `New Tip Intake`, `Registered citizen tip ${newTip.referenceNumber}`);
  };

  const handleUpdateTip = (updatedTip: PublicTip) => {
    setTips((prev) => prev.map((t) => (t.id === updatedTip.id ? updatedTip : t)));
    logAudit('TIP_ACCESSED', `Tip Status Updated`, `Updated tip ${updatedTip.referenceNumber} to ${updatedTip.status}`);
  };

  const handleUpdateMission = (updatedMission: MissionPlan) => {
    setMissions((prev) =>
      prev.map((m) => (m.id === updatedMission.id ? updatedMission : m))
    );
    logAudit('TASK_COMPLETED', `Mission Update`, `Updated mission plan ${updatedMission.missionCode}`);
  };

  const handleAddNewCase = (newCase: WantedCase) => {
    setCases((prev) => [newCase, ...prev]);
    logAudit('CASE_MODIFIED', `New Case Registered`, `Created case record ${newCase.caseNumber}`);
  };

  const handleAddNewReport = (newReport: MissionReport) => {
    setReports((prev) => [newReport, ...prev]);
    logAudit('REPORT_GENERATED', `Final Report Created`, `Authored administrative report ${newReport.reportNumber}`);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-amber-500/30 selection:text-amber-200">
      
      {/* Prominent Mandatory Anti-Vigilantism Banner (always on top) */}
      <AntiVigilantismBanner />

      {/* Main Law Enforcement Header */}
      <Header
        userSession={userSession}
        onChangeRole={handleChangeRole}
        onOpenTipModal={() => {
          setTipModalPreselectedCase(null);
          setIsTipModalOpen(true);
        }}
        onQuickAiBriefing={() => setCurrentTab('AI Assistant')}
        onOpenDownloadCenter={() => setIsDownloadCenterOpen(true)}
        activeTipsCount={tips.filter((t) => t.status === 'PENDING_REVIEW').length}
      />

      {/* Main Menu Navigation Tabs */}
      <Navigation
        currentTab={currentTab}
        onSelectTab={(tab) => {
          setCurrentTab(tab);
          logAudit('CASE_VIEW', `Navigation`, `Navigated to ${tab} tab`);
        }}
        badgeCounts={{
          mostWanted: cases.filter((c) => c.priorityLevel === 'Tier 1 - Critical').length,
          activeMissions: missions.length,
          pendingTips: tips.filter((t) => t.status === 'PENDING_REVIEW').length,
          unverifiedIntel: 2,
        }}
      />

      {/* Main Application Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {currentTab === 'Dashboard' && (
          <DashboardView
            cases={cases}
            missions={missions}
            tips={tips}
            auditLogs={auditLogs}
            onNavigate={(tab) => setCurrentTab(tab)}
            onSelectCase={handleOpenCaseDetail}
            onSelectMission={(m) => {
              setCurrentTab('Missions');
            }}
            onSelectTip={(t) => {
              setCurrentTab('Tips');
            }}
            onOpenQuickAi={() => setCurrentTab('AI Assistant')}
          />
        )}

        {currentTab === 'Most Wanted' && (
          <MostWantedView
            cases={cases}
            onSelectCase={handleOpenCaseDetail}
            onPlanMission={handlePlanMissionForCase}
            onSubmitTipForCase={handleSubmitTipForCase}
            onOpenAiForCase={handleOpenAiForCase}
          />
        )}

        {currentTab === 'Missions' && (
          <MissionsView
            missions={missions}
            cases={cases}
            onUpdateMission={handleUpdateMission}
            onGenerateReport={(m, c) => {
              setCurrentTab('Reports');
            }}
          />
        )}

        {currentTab === 'Cases' && (
          <CasesView
            cases={cases}
            onSelectCase={handleOpenCaseDetail}
            onPlanMission={handlePlanMissionForCase}
            onAddCase={() => setIsAddCaseModalOpen(true)}
            onAnalyzeAi={handleOpenAiForCase}
          />
        )}

        {currentTab === 'Intelligence' && (
          <IntelligenceView
            cases={cases}
            selectedCaseId={selectedCaseForAi}
            onSelectCase={handleOpenCaseDetail}
          />
        )}

        {currentTab === 'Tips' && (
          <TipsView
            tips={tips}
            cases={cases}
            onAddTip={handleAddNewTip}
            onUpdateTip={handleUpdateTip}
            onOpenPublicTipModal={() => {
              setTipModalPreselectedCase(null);
              setIsTipModalOpen(true);
            }}
          />
        )}

        {currentTab === 'Reports' && (
          <ReportsView
            cases={cases}
            missions={missions}
            reports={reports}
            onAddReport={handleAddNewReport}
          />
        )}

        {currentTab === 'Agencies' && (
          <AgenciesView agencies={agencies} />
        )}

        {currentTab === 'AI Assistant' && (
          <AiAssistantView
            cases={cases}
            missions={missions}
            initialCaseId={selectedCaseForAi}
          />
        )}

        {currentTab === 'Audit Logs' && (
          <AuditLogsView logs={auditLogs} />
        )}

        {currentTab === 'Settings' && (
          <SettingsView
            userSession={userSession}
            onChangeRole={handleChangeRole}
          />
        )}
      </main>

      {/* Case Details Modal */}
      <CaseDetailModal
        caseItem={selectedCaseForModal}
        onClose={() => setSelectedCaseForModal(null)}
        onPlanMission={handlePlanMissionForCase}
        onAnalyzeAi={handleOpenAiForCase}
        onSubmitTip={handleSubmitTipForCase}
      />

      {/* Citizen Public Tip Submission Modal */}
      <PublicTipModal
        isOpen={isTipModalOpen}
        onClose={() => setIsTipModalOpen(false)}
        cases={cases}
        preselectedCase={tipModalPreselectedCase}
        onSubmitTip={handleAddNewTip}
      />

      {/* Add New Case Registration Modal */}
      <AddCaseModal
        isOpen={isAddCaseModalOpen}
        onClose={() => setIsAddCaseModalOpen(false)}
        onSaveCase={handleAddNewCase}
      />

      {/* Download Center & Export Modal */}
      <DownloadCenterModal
        isOpen={isDownloadCenterOpen}
        onClose={() => setIsDownloadCenterOpen(false)}
        cases={cases}
        missions={missions}
        reports={reports}
        auditLogs={auditLogs}
      />

      {/* Field Operations Offline Connectivity Banner */}
      <OfflineIndicator />

      {/* Lawful Public Safety Footer */}
      <footer className="bg-slate-950 border-t border-slate-900 py-6 text-xs text-slate-500 font-mono text-center no-print">
        <div className="max-w-7xl mx-auto px-4 space-y-1">
          <p className="font-semibold text-slate-400">
            SENTINEL LAW ENFORCEMENT MISSION MANAGEMENT PLATFORM • AUTHORIZED USE ONLY
          </p>
          <p>
            Operating under CJIS Security Policy v5.9 & 28 CFR Part 23 Guidelines. All AI outputs require sworn human verification.
          </p>
          <p className="text-red-400 font-bold">
            DO NOT ATTEMPT CONFRONTATION OR PRIVATE CITIZEN APPREHENSION. CONTACT LAW ENFORCEMENT.
          </p>
        </div>
      </footer>

    </div>
  );
}
