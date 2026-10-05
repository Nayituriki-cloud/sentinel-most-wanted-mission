import React, { useState } from 'react';
import {
  PackageSearch,
  CheckCircle2,
  Truck,
  MapPin,
  Building2,
  Clock,
  Sparkles,
  ArrowRight,
  ShieldAlert,
  Droplets,
  HeartPulse,
  Zap,
  Home
} from 'lucide-react';
import { ResourceUnit, Incident } from '../types';

interface ResourceMatchingProps {
  resources: ResourceUnit[];
  incidents: Incident[];
  onDispatchResource: (resourceId: string, incidentId: string) => void;
  preselectedIncident?: Incident | null;
}

export const ResourceMatching: React.FC<ResourceMatchingProps> = ({
  resources,
  incidents,
  onDispatchResource,
  preselectedIncident,
}) => {
  const [selectedIncident, setSelectedIncident] = useState<Incident>(
    preselectedIncident || incidents[0]
  );
  const [matchedResource, setMatchedResource] = useState<ResourceUnit | null>(null);
  const [dispatchSuccess, setDispatchSuccess] = useState<string | null>(null);

  // Filter or score resources based on selected incident category
  const findMatchesForIncident = (inc: Incident) => {
    return resources.filter((res) => {
      if (inc.type === 'Water shortages' || inc.type === 'Floods') {
        return res.category === 'Water & Sanitation' || res.category === 'Logistics & Transport';
      }
      if (inc.type === 'Food shortages') {
        return res.category === 'Food & Nutrition' || res.category === 'Logistics & Transport';
      }
      if (inc.type === 'Disease outbreaks') {
        return res.category === 'Medical & Health';
      }
      if (inc.type === 'Displacement') {
        return res.category === 'Shelter' || res.category === 'Water & Sanitation';
      }
      return true;
    });
  };

  const matchedList = findMatchesForIncident(selectedIncident);

  const handleDispatch = (res: ResourceUnit) => {
    onDispatchResource(res.id, selectedIncident.id);
    setDispatchSuccess(`Dispatched ${res.name} to ${selectedIncident.title}`);
    setTimeout(() => setDispatchSuccess(null), 3500);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 lg:p-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
              <span>Intelligent Supply Chain Engine</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono text-emerald-400">NEED ↔ RESOURCE ↔ ORG ↔ LOCATION</span>
            </div>
            <h1 className="text-xl lg:text-2xl font-bold tracking-tight text-white">
              Continental Resource Matching Matrix
            </h1>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>8 Regional Depots Active</span>
          </div>
        </div>
      </div>

      {dispatchSuccess && (
        <div className="p-3 bg-emerald-950/80 border border-emerald-500/60 rounded-xl text-xs font-semibold text-emerald-300 flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{dispatchSuccess}</span>
        </div>
      )}

      {/* 4-Node Matching Canvas */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Incident Need Selector */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-3">
              Step 1: Select Active Crisis / Need
            </h3>

            <div className="space-y-2 max-h-[480px] overflow-y-auto pr-1">
              {incidents.map((inc) => {
                const isSelected = inc.id === selectedIncident.id;
                return (
                  <button
                    key={inc.id}
                    onClick={() => {
                      setSelectedIncident(inc);
                      setMatchedResource(null);
                    }}
                    className={`w-full text-left p-3 rounded-lg border text-xs transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-emerald-950/50 border-emerald-500 text-white'
                        : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white">{inc.title}</span>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                        {inc.country}
                      </span>
                    </div>

                    <p className="text-slate-400 text-[11px] mt-1">{inc.locationDetails}</p>

                    <div className="mt-2 pt-2 border-t border-slate-800/80 flex items-center justify-between font-mono text-[11px]">
                      <span className="text-rose-400 font-bold">{inc.severity}</span>
                      <span className="text-slate-300">
                        {inc.peopleAffected.toLocaleString()} affected
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right: Matched Resources & Staging Breakdown */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-400">Step 2: Optimal Resource Pipeline for</span>
                <h3 className="text-base font-bold text-white mt-0.5">{selectedIncident.title}</h3>
              </div>
              <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/20">
                {matchedList.length} Units Ready
              </span>
            </div>

            {/* Matching Algorithm Visual Diagram */}
            <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-lg text-xs space-y-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block">
                Algorithmic Match Pathway:
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center font-mono text-[11px]">
                <div className="bg-slate-900 p-2 rounded border border-slate-800">
                  <span className="text-slate-500 block text-[9px] uppercase">1. Need</span>
                  <span className="font-semibold text-rose-400 truncate block">
                    {selectedIncident.type}
                  </span>
                </div>
                <div className="bg-slate-900 p-2 rounded border border-slate-800">
                  <span className="text-slate-500 block text-[9px] uppercase">2. Location</span>
                  <span className="font-semibold text-sky-400 truncate block">
                    {selectedIncident.country}
                  </span>
                </div>
                <div className="bg-slate-900 p-2 rounded border border-slate-800">
                  <span className="text-slate-500 block text-[9px] uppercase">3. Velocity</span>
                  <span className="font-semibold text-amber-400 block">&lt; 45 mins</span>
                </div>
                <div className="bg-slate-900 p-2 rounded border border-slate-800">
                  <span className="text-slate-500 block text-[9px] uppercase">4. Outcome</span>
                  <span className="font-semibold text-emerald-400 block">Sustained WASH</span>
                </div>
              </div>
            </div>

            {/* Matched Available Resources List */}
            <div className="space-y-3">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wide block">
                Available Matched Equipment & Depots
              </span>

              {matchedList.map((res) => (
                <div
                  key={res.id}
                  className="p-4 bg-slate-950/70 border border-slate-800 rounded-xl space-y-3 hover:border-emerald-500/50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
                        <span className="text-emerald-400">{res.id}</span>
                        <span aria-hidden="true">·</span>
                        <span>{res.category}</span>
                      </div>
                      <h4 className="text-sm font-bold text-white mt-0.5">{res.name}</h4>
                    </div>

                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                      {res.readiness}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                    <div className="bg-slate-900/60 p-2 rounded">
                      <span className="text-[10px] text-slate-400 block">Staging Depot</span>
                      <span className="text-slate-200 font-medium truncate block">
                        {res.location}
                      </span>
                    </div>

                    <div className="bg-slate-900/60 p-2 rounded">
                      <span className="text-[10px] text-slate-400 block">Available Units</span>
                      <span className="text-slate-200 font-mono font-bold block">
                        {res.quantityAvailable} {res.unit}
                      </span>
                    </div>

                    <div className="bg-slate-900/60 p-2 rounded sm:col-span-1 col-span-2">
                      <span className="text-[10px] text-slate-400 block">Owning Organization</span>
                      <span className="text-slate-200 truncate block">{res.owningOrganization}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[11px] text-slate-400 font-mono">
                      Duty Officer: {res.contactPerson}
                    </span>

                    <button
                      onClick={() => handleDispatch(res)}
                      className="px-3.5 py-1.5 bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold text-xs rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
                    >
                      <Truck className="w-3.5 h-3.5" />
                      <span>Authorize Immediate Dispatch</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
