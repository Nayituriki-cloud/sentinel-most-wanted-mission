import React, { useState } from 'react';
import {
  TrendingUp,
  PlusCircle,
  Briefcase,
  Calendar,
  Building2,
  Droplets,
  Sun,
  School,
  HeartPulse,
  Route,
  Sprout,
  Wifi,
  Home,
  CheckCircle2,
  Filter
} from 'lucide-react';
import { DevelopmentProject, ProjectSector } from '../types';

interface DevelopmentAcceleratorProps {
  projects: DevelopmentProject[];
  onCreateProject: (proj: DevelopmentProject) => void;
}

export const DevelopmentAccelerator: React.FC<DevelopmentAcceleratorProps> = ({
  projects,
  onCreateProject,
}) => {
  const [sectorFilter, setSectorFilter] = useState<ProjectSector | 'ALL'>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [selectedProject, setSelectedProject] = useState<DevelopmentProject>(projects[0]);
  const [showModal, setShowModal] = useState(false);

  // New Project Form
  const [name, setName] = useState('');
  const [sector, setSector] = useState<ProjectSector>('Clean Water');
  const [country, setCountry] = useState('Rwanda');
  const [district, setDistrict] = useState('Nyagatare');
  const [budgetUsd, setBudgetUsd] = useState('3200000');
  const [timelineMonths, setTimelineMonths] = useState('18');
  const [organization, setOrganization] = useState('WASAC Rural Projects');
  const [goals, setGoals] = useState('');

  const sectors: (ProjectSector | 'ALL')[] = [
    'ALL',
    'Clean Water',
    'Renewable Energy',
    'Agriculture',
    'Roads',
    'Hospitals',
    'Schools',
    'Digital Infrastructure',
    'Affordable Housing',
  ];

  const filteredProjects = projects.filter((p) => {
    if (sectorFilter !== 'ALL' && p.sector !== sectorFilter) return false;
    if (statusFilter !== 'ALL' && p.status !== statusFilter) return false;
    return true;
  });

  const getSectorIcon = (sec: ProjectSector) => {
    switch (sec) {
      case 'Clean Water':
        return Droplets;
      case 'Renewable Energy':
        return Sun;
      case 'Schools':
        return School;
      case 'Hospitals':
        return HeartPulse;
      case 'Roads':
        return Route;
      case 'Agriculture':
        return Sprout;
      case 'Digital Infrastructure':
        return Wifi;
      case 'Affordable Housing':
        return Home;
      default:
        return Building2;
    }
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newProj: DevelopmentProject = {
      id: `PRJ-${country.slice(0, 3).toUpperCase()}-${String(projects.length + 1).padStart(2, '0')}`,
      name,
      sector,
      country,
      district,
      budgetUsd: parseFloat(budgetUsd) || 1000000,
      timelineMonths: parseInt(timelineMonths, 10) || 12,
      startDate: new Date().toISOString().split('T')[0],
      targetCompletionDate: '2027-06-30',
      organization,
      coSponsors: ['African Development Bank (AfDB)', 'Local Cooperative Union'],
      goals: goals || 'Accelerate sustainable infrastructure access and economic job creation.',
      progressPercent: 5,
      impactMetrics: [
        { label: 'Target Beneficiaries', value: '45,000', unit: 'People' },
        { label: 'Local Jobs Created', value: '620', unit: 'Jobs' },
        { label: 'Asset Lifespan', value: '25', unit: 'Years' },
      ],
      status: 'Active Implementation',
    };

    onCreateProject(newProj);
    setSelectedProject(newProj);
    setShowModal(false);
    setName('');
    setGoals('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 lg:p-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
              <span>National & Regional Transformation Engine</span>
              <span aria-hidden="true">·</span>
              <span>10 Key Growth Sectors</span>
              <span aria-hidden="true">·</span>
              <span className="text-emerald-400 font-medium">Measurable Impact</span>
            </div>
            <h1 className="text-xl lg:text-2xl font-bold tracking-tight text-white">
              Development Accelerator
            </h1>
          </div>

          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-colors cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Launch Development Project</span>
          </button>
        </div>

        {/* Sector Filter Bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-4 mt-4 border-t border-slate-800/80 scrollbar-none">
          <span className="text-xs text-slate-400 flex items-center gap-1 mr-2">
            <Filter className="w-3.5 h-3.5" /> Sector:
          </span>
          {sectors.map((sec) => (
            <button
              key={sec}
              onClick={() => setSectorFilter(sec)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                sectorFilter === sec
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold'
                  : 'bg-slate-950/60 border border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {sec}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Projects List + Selected Project Profile */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Project Cards List */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-semibold text-slate-300">
              Active Programs ({filteredProjects.length})
            </span>
            <span className="text-[11px] text-slate-500 font-mono">Real-Time Impact Audit</span>
          </div>

          <div className="space-y-2.5 max-h-[620px] overflow-y-auto pr-1">
            {filteredProjects.map((p) => {
              const isSelected = selectedProject.id === p.id;
              const SectorIcon = getSectorIcon(p.sector);

              return (
                <div
                  key={p.id}
                  onClick={() => setSelectedProject(p)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-slate-900 border-emerald-500/60 shadow-lg'
                      : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <span className="p-1.5 rounded-lg bg-slate-950 border border-slate-800 text-emerald-400">
                        <SectorIcon className="w-4 h-4" />
                      </span>
                      <div>
                        <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                          <span className="font-mono text-emerald-400">{p.id}</span>
                          <span aria-hidden="true">·</span>
                          <span>{p.country}</span>
                        </div>
                        <h4 className="text-sm font-bold text-white line-clamp-1">{p.name}</h4>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-slate-400 mt-2 line-clamp-1">{p.goals}</p>

                  <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono">
                    <span className="text-slate-300">
                      ${(p.budgetUsd / 1000000).toFixed(2)}M USD
                    </span>
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-emerald-500 rounded-full"
                          style={{ width: `${p.progressPercent}%` }}
                        />
                      </div>
                      <span className="text-emerald-400 font-bold">{p.progressPercent}%</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Project Full Profile */}
        <div className="lg:col-span-7 bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-5">
          <div className="flex items-start justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
                <span className="font-mono text-emerald-400">{selectedProject.id}</span>
                <span aria-hidden="true">·</span>
                <span>{selectedProject.sector}</span>
                <span aria-hidden="true">·</span>
                <span className="text-slate-200">
                  {selectedProject.district}, {selectedProject.country}
                </span>
              </div>
              <h2 className="text-lg lg:text-xl font-bold text-white">
                {selectedProject.name}
              </h2>
            </div>

            <div className="text-right shrink-0">
              <span className="text-xs font-mono font-bold text-emerald-400 block">
                {selectedProject.progressPercent}% Completed
              </span>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 mt-1 inline-block">
                {selectedProject.status}
              </span>
            </div>
          </div>

          {/* Project Goals */}
          <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wide block mb-1">
              Mission Objectives & Community Deliverables
            </span>
            <p className="text-xs text-slate-200 leading-relaxed">{selectedProject.goals}</p>
          </div>

          {/* Operational Details Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="bg-slate-950/70 p-3 rounded-lg border border-slate-800/80">
              <span className="text-[10px] text-slate-400 block uppercase">Total Investment</span>
              <span className="text-base font-mono font-bold text-white mt-1 block">
                ${(selectedProject.budgetUsd / 1000000).toFixed(2)}M
              </span>
            </div>

            <div className="bg-slate-950/70 p-3 rounded-lg border border-slate-800/80">
              <span className="text-[10px] text-slate-400 block uppercase">Timeline</span>
              <span className="text-base font-mono font-bold text-white mt-1 block">
                {selectedProject.timelineMonths} Months
              </span>
            </div>

            <div className="bg-slate-950/70 p-3 rounded-lg border border-slate-800/80">
              <span className="text-[10px] text-slate-400 block uppercase">Lead Agency</span>
              <span className="text-xs font-semibold text-emerald-400 mt-1 block truncate">
                {selectedProject.organization}
              </span>
            </div>

            <div className="bg-slate-950/70 p-3 rounded-lg border border-slate-800/80">
              <span className="text-[10px] text-slate-400 block uppercase">Target Date</span>
              <span className="text-xs font-mono font-bold text-slate-200 mt-1 block">
                {selectedProject.targetCompletionDate}
              </span>
            </div>
          </div>

          {/* Impact Metrics Section */}
          <div>
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wide mb-3 flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <span>Measurable Continental Impact Targets</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {selectedProject.impactMetrics.map((met, i) => (
                <div
                  key={i}
                  className="bg-slate-950/80 p-3.5 rounded-xl border border-emerald-500/30 text-center"
                >
                  <span className="text-[11px] text-slate-400 block">{met.label}</span>
                  <span className="text-xl font-mono font-extrabold text-emerald-400 mt-1 block">
                    {met.value}
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">{met.unit}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Co-Sponsors & Multilateral Partners */}
          <div className="pt-3 border-t border-slate-800 text-xs flex items-center justify-between text-slate-400">
            <span>Co-Sponsors:</span>
            <div className="flex items-center gap-1.5 font-mono text-[11px] text-slate-300">
              {selectedProject.coSponsors.join(' · ')}
            </div>
          </div>
        </div>
      </div>

      {/* New Project Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleCreate}
            className="bg-slate-900 border border-slate-800 rounded-2xl max-w-xl w-full p-6 space-y-4"
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-white">Create New Development Project</h3>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-white text-xs px-2 py-1 rounded bg-slate-800"
              >
                Cancel
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Project Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Eastern Province Solar Borehole Grid"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Sector</label>
                  <select
                    value={sector}
                    onChange={(e) => setSector(e.target.value as ProjectSector)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
                  >
                    {sectors
                      .filter((s) => s !== 'ALL')
                      .map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Country</label>
                  <select
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
                  >
                    <option value="Rwanda">Rwanda (Pilot)</option>
                    <option value="Kenya">Kenya</option>
                    <option value="Ghana">Ghana</option>
                    <option value="Nigeria">Nigeria</option>
                    <option value="Ethiopia">Ethiopia</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">District / Province</label>
                  <input
                    type="text"
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Budget ($ USD)</label>
                  <input
                    type="number"
                    value={budgetUsd}
                    onChange={(e) => setBudgetUsd(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Lead Organization</label>
                <input
                  type="text"
                  value={organization}
                  onChange={(e) => setOrganization(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Goals & Expected Impact</label>
                <textarea
                  rows={3}
                  value={goals}
                  onChange={(e) => setGoals(e.target.value)}
                  placeholder="Outline key targets, community reach, and infrastructure lifecycle..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-xs rounded-lg text-slate-400 hover:text-white"
              >
                Dismiss
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-xs font-bold rounded-lg bg-emerald-400 hover:bg-emerald-300 text-slate-950 transition-colors"
              >
                Create Project
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
