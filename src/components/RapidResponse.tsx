import React, { useState } from 'react';
import {
  AlertTriangle,
  Flame,
  Droplets,
  Wind,
  Truck,
  HeartPulse,
  Users,
  Clock,
  ShieldAlert,
  Zap,
  CheckCircle2,
  ChevronRight,
  Filter,
  PlusCircle,
  ExternalLink
} from 'lucide-react';
import { Incident, SeverityLevel, IncidentType, IncidentStatus } from '../types';

interface RapidResponseProps {
  incidents: Incident[];
  onSelectIncidentForSpeedMode: (incident: Incident) => void;
  onUpdateIncidentStatus: (incidentId: string, status: IncidentStatus) => void;
  onCreateRecoveryMissionFromIncident: (incident: Incident) => void;
  onOpenResourceMatcherForIncident: (incident: Incident) => void;
}

export const RapidResponse: React.FC<RapidResponseProps> = ({
  incidents,
  onSelectIncidentForSpeedMode,
  onUpdateIncidentStatus,
  onCreateRecoveryMissionFromIncident,
  onOpenResourceMatcherForIncident,
}) => {
  const [selectedIncident, setSelectedIncident] = useState<Incident>(incidents[0]);
  const [severityFilter, setSeverityFilter] = useState<SeverityLevel | 'ALL'>('ALL');
  const [typeFilter, setTypeFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredIncidents = incidents.filter((inc) => {
    if (severityFilter !== 'ALL' && inc.severity !== severityFilter) return false;
    if (typeFilter !== 'ALL' && inc.type !== typeFilter) return false;
    if (statusFilter !== 'ALL' && inc.status !== statusFilter) return false;
    if (
      searchQuery &&
      !inc.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !inc.country.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !inc.locationDetails.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  const getSeverityBadge = (severity: SeverityLevel) => {
    switch (severity) {
      case 'CRITICAL':
        return 'text-rose-300 bg-rose-950/80 border-rose-600/60';
      case 'HIGH':
        return 'text-amber-300 bg-amber-950/80 border-amber-600/60';
      case 'MEDIUM':
        return 'text-sky-300 bg-sky-950/80 border-sky-600/60';
      case 'LOW':
        return 'text-slate-300 bg-slate-900 border-slate-700';
    }
  };

  const getStatusBadge = (status: IncidentStatus) => {
    switch (status) {
      case 'DETECTED':
        return 'text-purple-300 bg-purple-950/60 border-purple-700/50';
      case 'DISPATCHED':
        return 'text-sky-300 bg-sky-950/60 border-sky-700/50';
      case 'ACTIVE_RESPONSE':
        return 'text-amber-300 bg-amber-950/60 border-amber-700/50';
      case 'CONTAINED':
        return 'text-emerald-300 bg-emerald-950/60 border-emerald-700/50';
      case 'TRANSITION_TO_RECOVERY':
        return 'text-teal-300 bg-teal-950/60 border-teal-700/50';
    }
  };

  const getTypeIcon = (type: IncidentType) => {
    switch (type) {
      case 'Floods':
        return Droplets;
      case 'Fires':
        return Flame;
      case 'Storms':
        return Wind;
      case 'Transport disruption':
      case 'Infrastructure damage':
        return Truck;
      case 'Disease outbreaks':
        return HeartPulse;
      default:
        return AlertTriangle;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Metric Banner */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 lg:p-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
              <span>Authorized Rapid Response Dashboard</span>
              <span aria-hidden="true">·</span>
              <span>MINEMA / Red Cross / AU CDC Interconnect</span>
              <span aria-hidden="true">·</span>
              <span className="text-rose-400 font-semibold flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                Live Incident Telemetry
              </span>
            </div>
            <h1 className="text-xl lg:text-2xl font-bold tracking-tight text-white">
              Continental Rapid Response Center
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onSelectIncidentForSpeedMode(selectedIncident)}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 rounded-lg transition-colors cursor-pointer shadow-md"
            >
              <Zap className="w-4 h-4" />
              Launch Speed Mode for Active Incident
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="mt-4 pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-slate-400 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" />
              <span>Severity:</span>
            </span>
            {(['ALL', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'] as const).map((sev) => (
              <button
                key={sev}
                onClick={() => setSeverityFilter(sev)}
                className={`px-2.5 py-1 text-xs rounded-md font-mono cursor-pointer transition-colors ${
                  severityFilter === sev
                    ? 'bg-slate-800 text-white font-bold border border-slate-600'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {sev}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <input
              type="text"
              placeholder="Search by incident, district, country..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 w-56 sm:w-64"
            />
          </div>
        </div>
      </div>

      {/* Main Grid: Incident List + Incident Cockpit Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Incident Cards Column */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-semibold text-slate-300">
              Verified Incidents ({filteredIncidents.length})
            </span>
            <span className="text-[11px] text-slate-500 font-mono">Real-Time Sync</span>
          </div>

          <div className="space-y-2.5 max-h-[650px] overflow-y-auto pr-1">
            {filteredIncidents.map((inc) => {
              const isSelected = selectedIncident.id === inc.id;
              const TypeIcon = getTypeIcon(inc.type);
              const isOverdue = inc.dispatchElapsedMinutes > inc.targetResponseMinutes;

              return (
                <div
                  key={inc.id}
                  onClick={() => setSelectedIncident(inc)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-slate-900 border-emerald-500/60 shadow-lg'
                      : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="p-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-300">
                        <TypeIcon className="w-4 h-4 text-emerald-400" />
                      </span>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`text-[10px] font-mono px-1.5 py-0.5 rounded border font-bold ${getSeverityBadge(
                              inc.severity
                            )}`}
                          >
                            {inc.severity}
                          </span>
                          <span className="text-xs text-slate-400">{inc.country}</span>
                        </div>
                        <h4 className="text-sm font-bold text-white mt-0.5 line-clamp-1">
                          {inc.title}
                        </h4>
                      </div>
                    </div>
                  </div>

                  {/* Summary Location and affected */}
                  <p className="text-xs text-slate-400 mt-2 line-clamp-1">{inc.locationDetails}</p>

                  <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono">
                    <span className="text-slate-300 flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-slate-400" />
                      {inc.peopleAffected.toLocaleString()} affected
                    </span>

                    <span
                      className={`flex items-center gap-1 ${
                        isOverdue ? 'text-rose-400 font-bold' : 'text-slate-400'
                      }`}
                    >
                      <Clock className="w-3.5 h-3.5" />
                      {inc.dispatchElapsedMinutes}m / {inc.targetResponseMinutes}m SLA
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Incident Command Cockpit */}
        <div className="lg:col-span-7 bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-5">
          {/* Cockpit Header */}
          <div className="flex items-start justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
                <span className="font-mono text-emerald-400">{selectedIncident.id}</span>
                <span aria-hidden="true">·</span>
                <span>{selectedIncident.country}</span>
                <span aria-hidden="true">·</span>
                <span className="text-slate-300">{selectedIncident.detectedAt}</span>
              </div>
              <h2 className="text-lg lg:text-xl font-bold text-white">
                {selectedIncident.title}
              </h2>
              <p className="text-xs text-slate-400 mt-1">{selectedIncident.locationDetails}</p>
            </div>

            <div className="text-right shrink-0">
              <span
                className={`text-xs font-mono px-2.5 py-1 rounded border font-bold block ${getSeverityBadge(
                  selectedIncident.severity
                )}`}
              >
                {selectedIncident.severity}
              </span>
              <span
                className={`text-[11px] font-mono px-2 py-0.5 rounded border mt-1.5 inline-block ${getStatusBadge(
                  selectedIncident.status
                )}`}
              >
                {selectedIncident.status.replace('_', ' ')}
              </span>
            </div>
          </div>

          {/* Location -> Severity -> People Affected -> Resources Needed -> Response Team -> Current Status breakdown */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-slate-950/70 p-3 rounded-lg border border-slate-800/80">
              <span className="text-[10px] text-slate-400 block uppercase tracking-wide">
                People Affected
              </span>
              <span className="text-base font-mono font-bold text-white mt-1 block">
                {selectedIncident.peopleAffected.toLocaleString()}
              </span>
            </div>

            <div className="bg-slate-950/70 p-3 rounded-lg border border-slate-800/80">
              <span className="text-[10px] text-slate-400 block uppercase tracking-wide">
                Lead Organization
              </span>
              <span className="text-xs font-semibold text-slate-200 mt-1 block truncate">
                {selectedIncident.leadOrganization}
              </span>
            </div>

            <div className="bg-slate-950/70 p-3 rounded-lg border border-slate-800/80">
              <span className="text-[10px] text-slate-400 block uppercase tracking-wide">
                Assigned Team
              </span>
              <span className="text-xs font-semibold text-emerald-400 mt-1 block truncate">
                {selectedIncident.responseTeam.split('+')[0]}
              </span>
            </div>

            <div className="bg-slate-950/70 p-3 rounded-lg border border-slate-800/80">
              <span className="text-[10px] text-slate-400 block uppercase tracking-wide">
                Response Velocity
              </span>
              <span className="text-xs font-mono font-bold text-slate-200 mt-1 block">
                {selectedIncident.dispatchElapsedMinutes}m elapsed
              </span>
            </div>
          </div>

          {/* Urgent Resources Needed */}
          <div>
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wide mb-2 flex items-center justify-between">
              <span>Urgent Resources Required</span>
              <button
                onClick={() => onOpenResourceMatcherForIncident(selectedIncident)}
                className="text-[11px] font-medium text-emerald-400 hover:text-emerald-300 cursor-pointer flex items-center gap-1 lowercase"
              >
                Match nearest warehouses <ExternalLink className="w-3 h-3" />
              </button>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {selectedIncident.resourcesNeeded.map((res, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 p-2.5 bg-slate-950/60 border border-slate-800/80 rounded-lg text-xs text-slate-200"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                  <span>{res}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Speed Mode Operational Snapshot */}
          {selectedIncident.speedModeDetails && (
            <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-lg space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-rose-400 flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5" />
                  Tactical Ground Summary
                </span>
                <span className="text-[11px] text-slate-400">
                  Commander: {selectedIncident.speedModeDetails.whoIsResponsible}
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {selectedIncident.speedModeDetails.whatHappened}
              </p>

              <div className="pt-2 border-t border-slate-900 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-[11px] font-semibold text-emerald-400 block mb-1">
                    Immediate Action Taken:
                  </span>
                  <ul className="space-y-1 text-slate-300 text-[11px]">
                    {selectedIncident.speedModeDetails.immediateActionsTaken.map((act, i) => (
                      <li key={i} className="flex items-start gap-1">
                        <span className="text-emerald-500">✓</span> {act}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <span className="text-[11px] font-semibold text-rose-400 block mb-1">
                    Unresolved Critical Blockers:
                  </span>
                  <ul className="space-y-1 text-slate-300 text-[11px]">
                    {selectedIncident.speedModeDetails.unresolvedBlockers.map((blk, i) => (
                      <li key={i} className="flex items-start gap-1">
                        <span className="text-rose-500">!</span> {blk}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Action Control Row */}
          <div className="pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
            {/* Status advancement buttons */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-xs text-slate-400 mr-1">Advance Status:</span>
              {(['DISPATCHED', 'ACTIVE_RESPONSE', 'CONTAINED', 'TRANSITION_TO_RECOVERY'] as const).map(
                (st) => (
                  <button
                    key={st}
                    onClick={() => onUpdateIncidentStatus(selectedIncident.id, st)}
                    className={`px-2.5 py-1 text-xs rounded transition-colors cursor-pointer ${
                      selectedIncident.status === st
                        ? 'bg-slate-800 text-emerald-400 font-bold border border-emerald-500/40'
                        : 'text-slate-400 hover:text-slate-200 bg-slate-950/60 border border-slate-800'
                    }`}
                  >
                    {st.replace('_', ' ')}
                  </button>
                )
              )}
            </div>

            {/* Launch Recovery Mission CTA */}
            <button
              onClick={() => onCreateRecoveryMissionFromIncident(selectedIncident)}
              className="px-3.5 py-1.5 text-xs font-semibold text-slate-950 bg-teal-400 hover:bg-teal-300 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Create Recovery Mission</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
