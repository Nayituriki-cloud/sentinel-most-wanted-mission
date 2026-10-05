import React, { useState, useEffect } from 'react';
import {
  Zap,
  X,
  Clock,
  AlertCircle,
  CheckCircle2,
  Users,
  MapPin,
  Shield,
  PhoneCall,
  Send,
  FileText
} from 'lucide-react';
import { Incident } from '../types';

interface SpeedModeModalProps {
  isOpen: boolean;
  onClose: () => void;
  incidents: Incident[];
  activeIncident: Incident;
  onSelectIncident: (inc: Incident) => void;
  onDispatchImmediateAction: (incidentId: string, actionText: string) => void;
}

export const SpeedModeModal: React.FC<SpeedModeModalProps> = ({
  isOpen,
  onClose,
  incidents,
  activeIncident,
  onSelectIncident,
  onDispatchImmediateAction,
}) => {
  if (!isOpen) return null;

  const [newActionInput, setNewActionInput] = useState('');
  const [copiedFlash, setCopiedFlash] = useState(false);

  // Live timer tick
  const [secondsElapsed, setSecondsElapsed] = useState(activeIncident.dispatchElapsedMinutes * 60);

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsElapsed((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTimer = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const targetSecs = activeIncident.targetResponseMinutes * 60;
  const isDelayed = secondsElapsed > targetSecs;

  const handleAddAction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newActionInput.trim()) return;
    onDispatchImmediateAction(activeIncident.id, newActionInput.trim());
    setNewActionInput('');
  };

  const copyFlashSitrep = () => {
    const text = `[AFRICA FIRST FLASH SITREP]
INCIDENT: ${activeIncident.title} (${activeIncident.severity})
LOCATION: ${activeIncident.locationDetails}, ${activeIncident.country}
AFFECTED: ${activeIncident.peopleAffected.toLocaleString()} people
LEAD: ${activeIncident.leadOrganization} | TEAM: ${activeIncident.responseTeam}
URGENT NEEDS: ${activeIncident.resourcesNeeded.join(', ')}
UNRESOLVED: ${activeIncident.speedModeDetails?.unresolvedBlockers.join(', ') || 'None reported'}`;
    navigator.clipboard.writeText(text);
    setCopiedFlash(true);
    setTimeout(() => setCopiedFlash(false), 2500);
  };

  const details = activeIncident.speedModeDetails;

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div className="bg-slate-950 border-2 border-rose-600/80 rounded-2xl max-w-5xl w-full p-5 lg:p-7 space-y-6 shadow-2xl relative">
        {/* Top Control Bar with Countdown and Incident Switcher */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-rose-950 pb-4">
          <div className="flex items-center gap-3">
            <span className="p-2 bg-rose-600/20 border border-rose-500 rounded-lg text-rose-400">
              <Zap className="w-5 h-5 animate-pulse" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-rose-600 text-white">
                  SPEED MODE
                </span>
                <span className="text-xs text-rose-400 font-semibold tracking-wide uppercase">
                  Rapid Action Protocol
                </span>
              </div>
              <h2 className="text-xl font-black text-white mt-1">
                Immediate Incident Triage Cockpit
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Live Response Timer */}
            <div
              className={`px-4 py-2 rounded-xl border flex items-center gap-3 ${
                isDelayed
                  ? 'bg-rose-950/80 border-rose-500 text-rose-300'
                  : 'bg-slate-900 border-slate-700 text-emerald-400'
              }`}
            >
              <Clock className="w-5 h-5" />
              <div>
                <span className="text-[10px] text-slate-400 block uppercase font-mono">
                  {isDelayed ? 'SLA Delay Alert' : 'Response Timer'}
                </span>
                <span className="text-lg font-mono font-bold">
                  {formatTimer(secondsElapsed)} / {activeIncident.targetResponseMinutes}:00
                </span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white cursor-pointer transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Rapid Incident Switcher Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-xs text-slate-400 whitespace-nowrap">Active Emergencies:</span>
          {incidents.map((inc) => (
            <button
              key={inc.id}
              onClick={() => onSelectIncident(inc)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1.5 ${
                inc.id === activeIncident.id
                  ? 'bg-rose-600 text-white font-bold'
                  : 'bg-slate-900 border border-slate-800 text-slate-300 hover:text-white'
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  inc.severity === 'CRITICAL' ? 'bg-rose-400 animate-ping' : 'bg-amber-400'
                }`}
              />
              <span>{inc.title}</span>
            </button>
          ))}
        </div>

        {/* 8-QUESTION RAPID ACTION MATRIX */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Question 1: What happened? */}
          <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-xl space-y-1">
            <span className="text-xs font-mono font-bold text-rose-400 flex items-center gap-1.5">
              <span>01.</span> WHAT HAPPENED?
            </span>
            <p className="text-sm font-semibold text-white">
              {details?.whatHappened || activeIncident.title}
            </p>
          </div>

          {/* Question 2: Where? */}
          <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-xl space-y-1">
            <span className="text-xs font-mono font-bold text-rose-400 flex items-center gap-1.5">
              <span>02.</span> WHERE EXACTLY?
            </span>
            <p className="text-sm font-semibold text-white flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{details?.whereExact || activeIncident.locationDetails}</span>
            </p>
          </div>

          {/* Question 3: Who is affected? */}
          <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-xl space-y-1">
            <span className="text-xs font-mono font-bold text-rose-400 flex items-center gap-1.5">
              <span>03.</span> WHO IS AFFECTED?
            </span>
            <p className="text-sm font-semibold text-white flex items-center gap-1.5">
              <Users className="w-4 h-4 text-sky-400 shrink-0" />
              <span>
                {details?.whoAffected || `${activeIncident.peopleAffected.toLocaleString()} residents in surrounding zone`}
              </span>
            </p>
          </div>

          {/* Question 4: What is needed? */}
          <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-xl space-y-1">
            <span className="text-xs font-mono font-bold text-rose-400 flex items-center gap-1.5">
              <span>04.</span> WHAT IS NEEDED IMMEDIATELY?
            </span>
            <ul className="text-xs text-slate-200 space-y-1 mt-1 font-medium">
              {(details?.whatNeededImmediately || activeIncident.resourcesNeeded).map((req, i) => (
                <li key={i} className="flex items-start gap-1.5">
                  <span className="text-rose-500 font-bold">•</span> {req}
                </li>
              ))}
            </ul>
          </div>

          {/* Question 5: Who is responsible? */}
          <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-xl space-y-1">
            <span className="text-xs font-mono font-bold text-rose-400 flex items-center gap-1.5">
              <span>05.</span> WHO IS RESPONSIBLE?
            </span>
            <p className="text-sm font-semibold text-white flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-amber-400 shrink-0" />
              <span>{details?.whoIsResponsible || `${activeIncident.leadOrganization} · ${activeIncident.responseTeam}`}</span>
            </p>
          </div>

          {/* Question 6: What can be done immediately? */}
          <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-xl space-y-1">
            <span className="text-xs font-mono font-bold text-emerald-400 flex items-center gap-1.5">
              <span>06.</span> WHAT CAN BE DONE IMMEDIATELY?
            </span>
            <ul className="text-xs text-slate-200 space-y-1 mt-1 font-medium">
              {(details?.immediateActionsTaken || ['Sounded evacuation protocol', 'Isolated water reservoirs']).map((act, i) => (
                <li key={i} className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{act}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Question 7: What resources are available? */}
          <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-xl space-y-1">
            <span className="text-xs font-mono font-bold text-teal-400 flex items-center gap-1.5">
              <span>07.</span> WHAT RESOURCES ARE AVAILABLE ON SITE?
            </span>
            <ul className="text-xs text-slate-200 space-y-1 mt-1 font-medium">
              {(details?.availableResourcesOnSite || ['Standby water bowsers', 'Red Cross responders']).map((res, i) => (
                <li key={i} className="flex items-start gap-1.5">
                  <span className="text-teal-400 font-bold">✓</span> {res}
                </li>
              ))}
            </ul>
          </div>

          {/* Question 8: What remains unresolved? */}
          <div className="bg-slate-900/90 border border-rose-900/80 p-4 rounded-xl space-y-1 bg-rose-950/20">
            <span className="text-xs font-mono font-bold text-rose-400 flex items-center gap-1.5">
              <span>08.</span> WHAT REMAINS UNRESOLVED?
            </span>
            <ul className="text-xs text-rose-200 space-y-1 mt-1 font-medium">
              {(details?.unresolvedBlockers || ['Road passage partially obstructed', 'Secondary fuel supply needed']).map((blk, i) => (
                <li key={i} className="flex items-start gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
                  <span>{blk}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Immediate Tactical Directives Input */}
        <form onSubmit={handleAddAction} className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Log immediate tactical action directive (e.g. Authorize emergency water tanker convoy)..."
            value={newActionInput}
            onChange={(e) => setNewActionInput(e.target.value)}
            className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-3.5 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-rose-500"
          />
          <button
            type="submit"
            className="px-4 py-2.5 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 shrink-0"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Dispatch Directive</span>
          </button>
        </form>

        {/* Footer Actions */}
        <div className="pt-3 border-t border-slate-900 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={copyFlashSitrep}
              className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-medium rounded-lg border border-slate-800 transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <FileText className="w-3.5 h-3.5 text-slate-400" />
              <span>{copiedFlash ? 'Copied SITREP!' : 'Copy Flash SITREP'}</span>
            </button>

            <span className="text-[11px] text-slate-500 font-mono hidden sm:inline">
              Command Center Encrypted · ISO-31030 Civil Response Standard
            </span>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
          >
            Return to Command Center
          </button>
        </div>
      </div>
    </div>
  );
};
