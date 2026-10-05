import React, { useState } from 'react';
import {
  Target,
  ShieldAlert,
  Sparkles,
  CheckCircle2,
  Clock,
  UserCheck,
  AlertTriangle,
  Radio,
  FileCheck2,
  Users,
  Briefcase,
  ChevronRight,
  Plus,
  Printer,
  FileText,
  Activity,
  Download,
} from 'lucide-react';
import { MissionPlan, WantedCase, MissionStatus, LawfulTaskItem } from '../../types';
import { generateMissionPlanWithAi } from '../../services/aiService';
import { downloadMissionBlueprintText } from '../../utils/downloadHelpers';

interface MissionsViewProps {
  missions: MissionPlan[];
  cases: WantedCase[];
  onUpdateMission: (updated: MissionPlan) => void;
  onGenerateReport: (mission: MissionPlan, caseItem: WantedCase) => void;
}

const WORKFLOW_STEPS: { stage: MissionStatus; title: string }[] = [
  { stage: 'CASE_RECEIVED', title: 'Case Received' },
  { stage: 'SOURCE_VERIFIED', title: 'Source Verified' },
  { stage: 'RISK_ASSESSED', title: 'Risk Assessed' },
  { stage: 'MISSION_CREATED', title: 'Mission Created' },
  { stage: 'TEAM_ASSIGNED', title: 'Team Assigned' },
  { stage: 'TIPS_COLLECTED', title: 'Tips Collected' },
  { stage: 'HUMAN_REVIEW', title: 'Human Review' },
  { stage: 'LAWFUL_ACTION', title: 'Lawful Action' },
  { stage: 'CASE_RESOLVED', title: 'Case Resolved' },
  { stage: 'FINAL_REPORT_FILED', title: 'Final Report' },
];

export const MissionsView: React.FC<MissionsViewProps> = ({
  missions,
  cases,
  onUpdateMission,
  onGenerateReport,
}) => {
  const [selectedMissionId, setSelectedMissionId] = useState<string>(
    missions[0]?.id || ''
  );
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [newTaskInput, setNewTaskInput] = useState('');
  const [newTaskAssignee, setNewTaskAssignee] = useState('');

  const currentMission = missions.find((m) => m.id === selectedMissionId) || missions[0];
  const associatedCase = cases.find((c) => c.id === currentMission?.caseId);

  const handleToggleTask = (taskId: string) => {
    if (!currentMission) return;
    const updatedTasks = currentMission.tasks.map((t) => {
      if (t.id === taskId) {
        const nextVerified = !t.verified;
        return {
          ...t,
          verified: nextVerified,
          completedAt: nextVerified ? new Date().toISOString() : undefined,
          humanSignOffBy: nextVerified ? 'Supervisory Special Agent' : undefined,
        };
      }
      return t;
    });

    const completedCount = updatedTasks.filter((t) => t.verified).length;
    const progressPercent = Math.round((completedCount / (updatedTasks.length || 1)) * 100);

    onUpdateMission({
      ...currentMission,
      tasks: updatedTasks,
      progressPercent,
      lastUpdated: new Date().toISOString(),
    });
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskInput.trim() || !currentMission) return;

    const newTask: LawfulTaskItem = {
      id: `task-${Date.now()}`,
      task: newTaskInput.trim(),
      priority: 'High',
      verified: false,
      assignee: newTaskAssignee.trim() || 'Unassigned Investigator',
      dueStage: currentMission.currentWorkflowStage,
    };

    const updatedTasks = [...currentMission.tasks, newTask];
    const completedCount = updatedTasks.filter((t) => t.verified).length;
    const progressPercent = Math.round((completedCount / updatedTasks.length) * 100);

    onUpdateMission({
      ...currentMission,
      tasks: updatedTasks,
      progressPercent,
      lastUpdated: new Date().toISOString(),
    });

    setNewTaskInput('');
    setNewTaskAssignee('');
  };

  const handleSetWorkflowStage = (stage: MissionStatus) => {
    if (!currentMission) return;
    onUpdateMission({
      ...currentMission,
      currentWorkflowStage: stage,
      lastUpdated: new Date().toISOString(),
    });
  };

  const handleAiRegeneratePlan = async () => {
    if (!associatedCase || !currentMission) return;
    setIsGeneratingAi(true);
    try {
      const generated = await generateMissionPlanWithAi(associatedCase);
      
      const newTasks: LawfulTaskItem[] = (generated.lawfulChecklist || []).map((t: any, idx: number) => ({
        id: `gen-task-${Date.now()}-${idx}`,
        task: t.task || 'Investigative verification task',
        priority: t.priority || 'High',
        verified: !!t.verified,
        assignee: t.assignee || 'Investigator Assigned',
        dueStage: currentMission.currentWorkflowStage,
        humanSignOffBy: t.verified ? 'AI Assisted // SSA Verified' : undefined,
      }));

      onUpdateMission({
        ...currentMission,
        objective: generated.missionObjective || currentMission.objective,
        legalAuthority: generated.legalAuthority || currentMission.legalAuthority,
        responsibleAgency: generated.responsibleAgency || currentMission.responsibleAgency,
        requiredResources: generated.requiredResources || currentMission.requiredResources,
        tasks: newTasks.length > 0 ? newTasks : currentMission.tasks,
        riskAssessment: {
          flightRisk: generated.riskAssessment?.flightRisk || currentMission.riskAssessment.flightRisk,
          violencePotential: generated.riskAssessment?.violencePotential || currentMission.riskAssessment.violencePotential,
          publicThreatScore: currentMission.riskAssessment.publicThreatScore,
          cautionAdvisories: generated.riskAssessment?.cautionAdvisories || currentMission.riskAssessment.cautionAdvisories,
        },
        communicationPlan: {
          pio: generated.communicationPlan?.publicInformationOfficer || currentMission.communicationPlan.pio,
          publicReleaseAuthorized: currentMission.communicationPlan.publicReleaseAuthorized,
          mediaBlackout: currentMission.communicationPlan.mediaBlackout,
          encryptedFreq: generated.communicationPlan?.secureCommsChannel || currentMission.communicationPlan.encryptedFreq,
          antiVigilantismProtocol: currentMission.communicationPlan.antiVigilantismProtocol,
        },
        lastUpdated: new Date().toISOString(),
      });
    } catch (err) {
      console.error(err);
    } finally {
      setIsGeneratingAi(false);
    }
  };

  const currentStageIndex = WORKFLOW_STEPS.findIndex(
    (s) => s.stage === currentMission?.currentWorkflowStage
  );

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-5 rounded-xl shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-amber-500" />
            <h1 className="text-xl sm:text-2xl font-black text-slate-100 tracking-tight">
              Mission Planning & Lawful Task Operations
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            Structured operational blueprints: statutory references, tactical checklists, inter-agency resource allocations, and stage tracking.
          </p>
        </div>

        {/* Mission Selector */}
        <div className="flex items-center gap-2">
          <select
            aria-label="Select active mission"
            value={selectedMissionId}
            onChange={(e) => setSelectedMissionId(e.target.value)}
            className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs font-mono text-amber-400 focus:outline-none focus:border-amber-500 font-bold"
          >
            {missions.map((m) => (
              <option key={m.id} value={m.id}>
                {m.missionCode}: {m.missionName}
              </option>
            ))}
          </select>
        </div>
      </div>

      {currentMission && (
        <div className="space-y-6">
          
          {/* Active Mission Header Summary */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                    {currentMission.missionCode}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-red-500/20 text-red-400 border border-red-500/30">
                    {currentMission.priorityLevel}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">
                    Last Updated: {new Date(currentMission.lastUpdated).toLocaleDateString()}
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-100 mt-1">
                  {currentMission.missionName}
                </h2>
                <div className="text-xs text-slate-300 mt-1 max-w-3xl">
                  <strong>Objective:</strong> {currentMission.objective}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 shrink-0 flex-wrap">
                <button
                  onClick={() => downloadMissionBlueprintText(currentMission, associatedCase)}
                  className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 px-3 py-2 rounded-lg text-xs font-bold transition font-mono"
                  title="Download Complete Operational Mission Blueprint"
                >
                  <Download className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Download Blueprint</span>
                </button>
                <button
                  onClick={handleAiRegeneratePlan}
                  disabled={isGeneratingAi}
                  className="flex items-center gap-1.5 bg-indigo-900/70 hover:bg-indigo-800 text-indigo-200 border border-indigo-700/60 px-3 py-2 rounded-lg text-xs font-bold transition disabled:opacity-50"
                >
                  <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                  <span>{isGeneratingAi ? 'Synthesizing...' : 'AI Refine Plan'}</span>
                </button>
                {associatedCase && (
                  <button
                    onClick={() => onGenerateReport(currentMission, associatedCase)}
                    className="flex items-center gap-1.5 bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold px-3 py-2 rounded-lg text-xs transition"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Generate Final Report</span>
                  </button>
                )}
              </div>
            </div>

            {/* Target Fugitive Quick Dossier Link */}
            {associatedCase && (
              <div className="flex items-center justify-between p-3 rounded-lg bg-slate-950 border border-slate-800 text-xs">
                <div className="flex items-center gap-3">
                  <img
                    src={associatedCase.photoUrl}
                    alt={associatedCase.fullName}
                    className="w-9 h-9 rounded-md object-cover border border-slate-700"
                  />
                  <div>
                    <div className="font-bold text-slate-200">
                      Target Subject: {associatedCase.fullName}
                    </div>
                    <div className="text-[11px] text-slate-400 font-mono">
                      Warrant: {associatedCase.warrantNumber} • Charge: {associatedCase.primaryCharge.substring(0, 70)}...
                    </div>
                  </div>
                </div>
                <div className="text-amber-400 font-mono text-xs font-bold hidden sm:block">
                  Reward: {associatedCase.rewardAmount}
                </div>
              </div>
            )}
          </div>

          {/* 10-Step Interactive Workflow Pipeline */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-amber-400" />
                <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-200">
                  Mission Lifecycle Workflow (Current: {WORKFLOW_STEPS[currentStageIndex]?.title || 'Active'})
                </h3>
              </div>
              <span className="text-xs font-mono text-slate-400">
                Progress: <strong className="text-amber-400">{currentMission.progressPercent}%</strong>
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
              <div
                className="bg-gradient-to-r from-amber-500 to-emerald-500 h-full transition-all duration-300"
                style={{ width: `${currentMission.progressPercent}%` }}
              ></div>
            </div>

            {/* Step Selector Buttons */}
            <div className="grid grid-cols-2 sm:grid-cols-5 lg:grid-cols-10 gap-1.5 pt-2">
              {WORKFLOW_STEPS.map((step, idx) => {
                const isCurrent = step.stage === currentMission.currentWorkflowStage;
                const isPassed = idx < currentStageIndex;

                return (
                  <button
                    key={step.stage}
                    onClick={() => handleSetWorkflowStage(step.stage)}
                    className={`p-2 rounded-lg text-center transition flex flex-col items-center justify-between gap-1 border ${
                      isCurrent
                        ? 'bg-amber-500/20 border-amber-500 text-amber-300 font-bold shadow-sm'
                        : isPassed
                        ? 'bg-slate-950 border-emerald-500/40 text-emerald-400'
                        : 'bg-slate-950/50 border-slate-800 text-slate-500 hover:text-slate-300'
                    }`}
                  >
                    <span className="text-[9px] font-mono block">STAGE {idx + 1}</span>
                    <span className="text-[10px] leading-tight block truncate w-full">
                      {step.title}
                    </span>
                    {isPassed ? (
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    ) : isCurrent ? (
                      <Clock className="w-3 h-3 text-amber-400 animate-spin" />
                    ) : (
                      <span className="w-2 h-2 rounded-full bg-slate-700"></span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Grid Layout: Tasks on Left, Authority & Risk on Right */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left Column: Lawful Task Checklist */}
            <div className="lg:col-span-7 space-y-4">
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileCheck2 className="w-4 h-4 text-emerald-400" />
                    <h3 className="text-sm font-bold text-slate-100 uppercase font-mono">
                      Lawful Investigative & Tactical Checklist
                    </h3>
                  </div>
                  <span className="text-xs font-mono text-slate-400">
                    {currentMission.tasks.filter((t) => t.verified).length} / {currentMission.tasks.length} Verified
                  </span>
                </div>

                {/* Task Items */}
                <div className="space-y-2.5">
                  {currentMission.tasks.map((task) => (
                    <div
                      key={task.id}
                      onClick={() => handleToggleTask(task.id)}
                      className={`p-3 rounded-lg border transition cursor-pointer flex items-start gap-3 ${
                        task.verified
                          ? 'bg-slate-950/60 border-emerald-900/40 text-slate-300'
                          : 'bg-slate-950 border-slate-800 hover:border-slate-700 text-slate-200'
                      }`}
                    >
                      <div className="mt-0.5 shrink-0">
                        {task.verified ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        ) : (
                          <div className="w-4 h-4 rounded border border-slate-600 hover:border-amber-400" />
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className={`text-xs font-medium leading-snug ${task.verified ? 'line-through text-slate-400' : 'text-slate-100'}`}>
                          {task.task}
                        </div>
                        <div className="flex items-center gap-3 text-[11px] font-mono text-slate-400 mt-1 flex-wrap">
                          <span>Assignee: <strong className="text-slate-300">{task.assignee}</strong></span>
                          <span>•</span>
                          <span className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                            task.priority === 'Critical'
                              ? 'bg-red-950 text-red-400 border border-red-800'
                              : 'bg-slate-800 text-slate-300'
                          }`}>
                            {task.priority}
                          </span>
                          {task.humanSignOffBy && (
                            <span className="text-emerald-400 flex items-center gap-1">
                              <UserCheck className="w-3 h-3" /> Signed off by {task.humanSignOffBy}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Add Custom Task Form */}
                <form onSubmit={handleAddTask} className="pt-3 border-t border-slate-800 flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    placeholder="Add lawful investigative checklist item..."
                    value={newTaskInput}
                    onChange={(e) => setNewTaskInput(e.target.value)}
                    className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500"
                  />
                  <input
                    type="text"
                    placeholder="Assignee (e.g. Det. Miller)"
                    value={newTaskAssignee}
                    onChange={(e) => setNewTaskAssignee(e.target.value)}
                    className="w-full sm:w-44 bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500"
                  />
                  <button
                    type="submit"
                    className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-2 rounded-lg text-xs font-semibold shrink-0"
                  >
                    Add Task
                  </button>
                </form>
              </div>

              {/* Responsible Team & Required Resources */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-amber-400" />
                  <h3 className="text-sm font-bold text-slate-100 uppercase font-mono">
                    Responsible Agency Team & Logistics
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
                  <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                    <span className="text-slate-500 text-[10px] block">TEAM DESIGNATION:</span>
                    <span className="text-slate-200 font-bold">{currentMission.assignedTeam.teamName}</span>
                  </div>
                  <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                    <span className="text-slate-500 text-[10px] block">TACTICAL COMMANDER:</span>
                    <span className="text-slate-200 font-bold">{currentMission.assignedTeam.leadCommander}</span>
                  </div>
                  <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                    <span className="text-slate-500 text-[10px] block">SWORN OPERATIVES:</span>
                    <span className="text-amber-400 font-bold">{currentMission.assignedTeam.activeAgentsCount} Active Personnel</span>
                  </div>
                  <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                    <span className="text-slate-500 text-[10px] block">SECURE COMMS CHANNEL:</span>
                    <span className="text-slate-200">{currentMission.assignedTeam.contactChannel}</span>
                  </div>
                </div>

                <div>
                  <span className="text-xs font-mono uppercase text-slate-400 font-bold block mb-2">
                    Required Tactical & Intelligence Resources:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {currentMission.requiredResources.map((res, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 rounded bg-slate-950 border border-slate-800 text-xs text-slate-300 font-mono"
                      >
                        ✓ {res}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Legal Authority, Risk & Communication Plan */}
            <div className="lg:col-span-5 space-y-4">
              
              {/* Legal Authority Box */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-2.5">
                <div className="flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-cyan-400" />
                  <h3 className="text-xs font-mono font-bold uppercase text-slate-200">
                    Legal Authority & Statutory Mandate
                  </h3>
                </div>
                <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg text-xs font-mono text-cyan-200">
                  {currentMission.legalAuthority}
                </div>
                <div className="text-[11px] text-slate-400 font-mono">
                  Issuing Authority: <strong className="text-slate-300">{currentMission.responsibleAgency}</strong>
                </div>
              </div>

              {/* Risk Assessment Box */}
              <div className="bg-red-950/30 border border-red-900/60 rounded-xl p-5 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-red-400 font-bold text-xs uppercase font-mono">
                    <AlertTriangle className="w-4 h-4" />
                    <span>Risk Assessment Matrix</span>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-red-900 text-red-100">
                    THREAT SCORE: {currentMission.riskAssessment.publicThreatScore}/100
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                  <div className="bg-slate-950/80 p-2.5 rounded border border-red-900/40">
                    <span className="text-slate-500 text-[10px] block">FLIGHT RISK:</span>
                    <span className="text-red-300 font-bold">{currentMission.riskAssessment.flightRisk}</span>
                  </div>
                  <div className="bg-slate-950/80 p-2.5 rounded border border-red-900/40">
                    <span className="text-slate-500 text-[10px] block">VIOLENCE POTENTIAL:</span>
                    <span className="text-red-300 font-bold">{currentMission.riskAssessment.violencePotential}</span>
                  </div>
                </div>

                <div>
                  <span className="text-[11px] font-mono uppercase font-bold text-red-300 block mb-1.5">
                    Caution Advisories:
                  </span>
                  <ul className="space-y-1 text-xs text-red-200/90 list-disc list-inside">
                    {currentMission.riskAssessment.cautionAdvisories.map((adv, i) => (
                      <li key={i}>{adv}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Communication Plan Box */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-3">
                <div className="flex items-center gap-2">
                  <Radio className="w-4 h-4 text-emerald-400" />
                  <h3 className="text-xs font-mono font-bold uppercase text-slate-200">
                    Communication & Media Blackout Plan
                  </h3>
                </div>

                <div className="space-y-2 text-xs font-mono text-slate-300">
                  <div className="bg-slate-950 p-2.5 rounded border border-slate-800">
                    <span className="text-slate-500 text-[10px] block">PUBLIC INFORMATION OFFICER (PIO):</span>
                    <span className="text-slate-200 font-semibold">{currentMission.communicationPlan.pio}</span>
                  </div>
                  <div className="bg-slate-950 p-2.5 rounded border border-slate-800 flex items-center justify-between">
                    <span className="text-slate-400">MEDIA BLACKOUT STATUS:</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      currentMission.communicationPlan.mediaBlackout
                        ? 'bg-red-900/80 text-red-200 border border-red-700'
                        : 'bg-slate-800 text-slate-300'
                    }`}>
                      {currentMission.communicationPlan.mediaBlackout ? 'ACTIVE BLACKOUT' : 'PUBLIC RELEASE AUTHORIZED'}
                    </span>
                  </div>
                </div>

                <div className="p-2.5 rounded bg-slate-950 border border-slate-800 text-[11px] text-amber-300/90 font-mono">
                  {currentMission.communicationPlan.antiVigilantismProtocol}
                </div>
              </div>

              {/* Supervisor Sign-Off Status */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm text-xs font-mono text-slate-300">
                <div className="flex items-center gap-2 text-emerald-400 font-bold mb-1">
                  <UserCheck className="w-4 h-4" />
                  <span>Supervisory Special Agent Approval</span>
                </div>
                <div>
                  Officer: <strong className="text-slate-100">{currentMission.humanSupervisorApproval.officerName}</strong>
                </div>
                <div>
                  Badge: <span className="text-slate-400">{currentMission.humanSupervisorApproval.badgeNumber}</span>
                </div>
                <div className="text-[10px] text-slate-500 mt-1">
                  All mission recommendations independently reviewed by sworn human supervisor.
                </div>
              </div>

            </div>

          </div>

        </div>
      )}

    </div>
  );
};
