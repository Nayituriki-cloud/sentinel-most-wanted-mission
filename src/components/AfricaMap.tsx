import React, { useState } from 'react';
import {
  Compass,
  ArrowUpRight,
  TrendingUp,
  MapPin,
  Clock,
  Sparkles,
  Layers,
  ChevronRight,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { CountryProfile, AfricanRegion, IndicatorCategory, DistrictProfile } from '../types';

interface AfricaMapProps {
  countries: CountryProfile[];
  selectedCountry: CountryProfile;
  onSelectCountry: (country: CountryProfile) => void;
  onSelectDistrict?: (district: DistrictProfile) => void;
  onTriggerRapidResponse: (countryName: string) => void;
}

export const AfricaMap: React.FC<AfricaMapProps> = ({
  countries,
  selectedCountry,
  onSelectCountry,
  onTriggerRapidResponse,
}) => {
  const [selectedRegion, setSelectedRegion] = useState<AfricanRegion | 'All Africa'>('All Africa');
  const [activeIndicator, setActiveIndicator] = useState<IndicatorCategory>('Water access');
  const [timelineYear, setTimelineYear] = useState<'2022' | '2024' | '2026'>('2026');
  const [selectedDistrict, setSelectedDistrict] = useState<DistrictProfile | null>(null);
  const [showCompareModal, setShowCompareModal] = useState(false);
  const [compareTargetCountry, setCompareTargetCountry] = useState<CountryProfile>(
    countries.find((c) => c.id === 'kenya') || countries[1]
  );

  const regions: (AfricanRegion | 'All Africa')[] = [
    'All Africa',
    'East Africa',
    'West Africa',
    'Central Africa',
    'Southern Africa',
    'North Africa',
  ];

  const indicatorOptions: IndicatorCategory[] = [
    'Water access',
    'Electricity',
    'Infrastructure',
    'Healthcare',
    'Digital connectivity',
    'Food security',
    'Disaster recovery',
    'Agriculture',
  ];

  const filteredCountries = countries.filter(
    (c) => selectedRegion === 'All Africa' || c.region === selectedRegion
  );

  // Helper function to get indicator score for a country
  const getCountryScore = (country: CountryProfile, category: IndicatorCategory) => {
    const ind = country.indicators.find((i) => i.category === category);
    if (!ind) return country.compositeIndex;
    if (timelineYear === '2022') {
      return Math.max(20, Math.round(ind.score - ind.change2Year * 1.8));
    }
    if (timelineYear === '2024') {
      return Math.max(25, Math.round(ind.score - ind.change2Year));
    }
    return ind.score;
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
    if (score >= 65) return 'text-teal-300 bg-teal-500/10 border-teal-500/30';
    if (score >= 50) return 'text-amber-400 bg-amber-500/10 border-amber-500/30';
    return 'text-rose-400 bg-rose-500/10 border-rose-500/30';
  };

  const getMapSvgFill = (country: CountryProfile) => {
    const score = getCountryScore(country, activeIndicator);
    const isSelected = country.id === selectedCountry.id;
    if (isSelected) return '#10b981'; // Emerald 500
    if (score >= 80) return '#059669'; // Emerald 600
    if (score >= 65) return '#0d9488'; // Teal 600
    if (score >= 50) return '#d97706'; // Amber 600
    return '#dc2626'; // Rose 600
  };

  return (
    <div className="space-y-6">
      {/* Top Banner / Filter Toolbar */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 lg:p-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
              <span>Continental Geospatial Command</span>
              <span aria-hidden="true">·</span>
              <span>14 Strategic Indicators</span>
              <span aria-hidden="true">·</span>
              <span className="text-emerald-400 font-medium">Rwanda National Pilot Active</span>
            </div>
            <h1 className="text-xl lg:text-2xl font-bold tracking-tight text-white">
              Africa Development & Resilience Map
            </h1>
          </div>

          {/* Timeline slider / Year selector */}
          <div className="flex items-center gap-3 bg-slate-950/80 border border-slate-800 px-3 py-2 rounded-lg">
            <span className="text-xs text-slate-400 flex items-center gap-1.5 whitespace-nowrap">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>Timeline:</span>
            </span>
            <div className="flex items-center gap-1">
              {(['2022', '2024', '2026'] as const).map((year) => (
                <button
                  key={year}
                  onClick={() => setTimelineYear(year)}
                  className={`px-2.5 py-1 text-xs font-mono font-medium rounded transition-colors cursor-pointer ${
                    timelineYear === year
                      ? 'bg-emerald-500 text-slate-950 font-bold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {year} {year === '2026' ? '(Live)' : ''}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Region & Indicator Filters */}
        <div className="mt-4 pt-4 border-t border-slate-800/80 flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Region Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto scrollbar-none pb-1">
            {regions.map((region) => (
              <button
                key={region}
                onClick={() => setSelectedRegion(region)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
                  selectedRegion === region
                    ? 'bg-slate-800 text-emerald-400 font-semibold border border-emerald-500/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                }`}
              >
                {region}
              </button>
            ))}
          </div>

          {/* Active Indicator Selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 whitespace-nowrap flex items-center gap-1">
              <Layers className="w-3.5 h-3.5 text-slate-400" />
              <span>Indicator:</span>
            </span>
            <select
              value={activeIndicator}
              onChange={(e) => setActiveIndicator(e.target.value as IndicatorCategory)}
              className="bg-slate-950 border border-slate-700 text-slate-200 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-emerald-500 cursor-pointer"
            >
              {indicatorOptions.map((ind) => (
                <option key={ind} value={ind}>
                  {ind}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Main Grid: Interactive Map + Country Profile Deep-Dive */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Side: Continental Map Visualizer */}
        <div className="lg:col-span-7 bg-slate-900/60 border border-slate-800 rounded-xl p-5 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Compass className="w-4 h-4 text-emerald-400" />
              <h2 className="text-sm font-semibold text-slate-200">
                Continental Overview · {activeIndicator} ({timelineYear})
              </h2>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5 text-slate-400">
                <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500" /> &gt;80%
              </span>
              <span className="flex items-center gap-1.5 text-slate-400">
                <span className="w-2.5 h-2.5 rounded-sm bg-teal-500" /> 65-79%
              </span>
              <span className="flex items-center gap-1.5 text-slate-400">
                <span className="w-2.5 h-2.5 rounded-sm bg-amber-500" /> 50-64%
              </span>
              <span className="flex items-center gap-1.5 text-slate-400">
                <span className="w-2.5 h-2.5 rounded-sm bg-rose-500" /> &lt;50%
              </span>
            </div>
          </div>

          {/* Interactive SVG Schematic of Africa */}
          <div className="relative w-full h-[380px] sm:h-[420px] bg-slate-950/70 border border-slate-800/80 rounded-lg p-4 flex items-center justify-center overflow-hidden">
            {/* Background Grid Lines */}
            <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px]" />

            <svg
              viewBox="0 0 800 800"
              className="w-full h-full max-h-[380px] drop-shadow-xl"
              style={{ filter: 'drop-shadow(0 10px 25px rgba(0,0,0,0.5))' }}
            >
              {/* African Continent Simplified Stylized Paths */}
              {/* North Africa block */}
              <path
                d="M 220 180 Q 380 140 540 180 Q 560 260 520 300 Q 420 310 320 290 Q 210 260 220 180 Z"
                fill="#1e293b"
                stroke="#334155"
                strokeWidth="1.5"
                className="opacity-70"
              />
              <text x="360" y="240" fill="#64748b" fontSize="14" fontWeight="600" letterSpacing="2">
                NORTH AFRICA
              </text>

              {/* West Africa block */}
              <g
                onClick={() => {
                  const gh = countries.find((c) => c.id === 'ghana');
                  if (gh) onSelectCountry(gh);
                }}
                className="cursor-pointer group"
              >
                <path
                  d="M 170 290 Q 280 290 320 320 Q 320 420 260 440 Q 150 400 140 320 Z"
                  fill={getMapSvgFill(countries.find((c) => c.id === 'ghana') || countries[2])}
                  stroke={selectedCountry.region === 'West Africa' ? '#34d399' : '#334155'}
                  strokeWidth={selectedCountry.region === 'West Africa' ? '2.5' : '1.5'}
                  className="transition-all hover:opacity-90"
                />
                <circle cx="240" cy="370" r="7" fill="#ffffff" />
                <text x="255" y="375" fill="#f8fafc" fontSize="13" fontWeight="bold">
                  West Africa (Ghana/Nigeria)
                </text>
              </g>

              {/* Central Africa block */}
              <g
                onClick={() => {
                  const drc = countries.find((c) => c.id === 'drc');
                  if (drc) onSelectCountry(drc);
                }}
                className="cursor-pointer group"
              >
                <path
                  d="M 330 330 Q 450 330 460 440 Q 450 540 360 550 Q 320 450 330 330 Z"
                  fill={getMapSvgFill(countries.find((c) => c.id === 'drc') || countries[6])}
                  stroke={selectedCountry.id === 'drc' ? '#34d399' : '#334155'}
                  strokeWidth={selectedCountry.id === 'drc' ? '2.5' : '1.5'}
                  className="transition-all hover:opacity-90"
                />
                <circle cx="390" cy="450" r="7" fill="#ffffff" />
                <text x="405" y="455" fill="#f8fafc" fontSize="13" fontWeight="bold">
                  Central Africa (DRC)
                </text>
              </g>

              {/* East Africa block with Pilot RWANDA Pulse Anchor */}
              <g
                onClick={() => {
                  const rwa = countries.find((c) => c.id === 'rwanda');
                  if (rwa) onSelectCountry(rwa);
                }}
                className="cursor-pointer group"
              >
                <path
                  d="M 470 320 Q 560 300 580 430 Q 570 540 480 560 Q 460 450 470 320 Z"
                  fill={getMapSvgFill(countries.find((c) => c.id === 'rwanda') || countries[0])}
                  stroke={selectedCountry.id === 'rwanda' ? '#10b981' : '#38bdf8'}
                  strokeWidth="2.5"
                  className="transition-all hover:opacity-90"
                />
                <circle cx="510" cy="445" r="9" fill="#10b981" className="animate-ping opacity-75" />
                <circle cx="510" cy="445" r="7" fill="#ffffff" stroke="#059669" strokeWidth="2" />
                <text x="525" y="440" fill="#10b981" fontSize="14" fontWeight="bold">
                  ★ RWANDA (Pilot)
                </text>
                <text x="525" y="458" fill="#94a3b8" fontSize="11">
                  East Africa Regional Hub
                </text>
              </g>

              {/* Southern Africa block */}
              <g
                onClick={() => {
                  const za = countries.find((c) => c.id === 'south-africa');
                  if (za) onSelectCountry(za);
                }}
                className="cursor-pointer group"
              >
                <path
                  d="M 370 560 Q 480 560 470 690 Q 410 740 370 690 Z"
                  fill={getMapSvgFill(countries.find((c) => c.id === 'south-africa') || countries[5])}
                  stroke={selectedCountry.id === 'south-africa' ? '#34d399' : '#334155'}
                  strokeWidth="1.5"
                  className="transition-all hover:opacity-90"
                />
                <circle cx="420" cy="650" r="6" fill="#ffffff" />
                <text x="435" y="655" fill="#f8fafc" fontSize="13" fontWeight="bold">
                  Southern Africa (RSA)
                </text>
              </g>
            </svg>

            {/* Float Badge for Pilot country */}
            <div className="absolute bottom-3 left-3 bg-slate-900/90 border border-emerald-500/40 px-3 py-2 rounded-lg text-xs backdrop-blur-md">
              <span className="font-semibold text-emerald-400 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Rwanda Operational Pilot
              </span>
              <p className="text-[11px] text-slate-300 mt-0.5">
                Composite Index: 78.4 · 10 Districts Mapped · MINEMA Linked
              </p>
            </div>
          </div>

          {/* Quick Country Switcher Tiles */}
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2">
            {filteredCountries.map((c) => {
              const score = getCountryScore(c, activeIndicator);
              const isSelected = c.id === selectedCountry.id;
              return (
                <button
                  key={c.id}
                  onClick={() => onSelectCountry(c)}
                  className={`text-left p-2.5 rounded-lg border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-emerald-950/40 border-emerald-500/60 shadow-sm'
                      : 'bg-slate-950/50 border-slate-800/80 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-200 truncate">{c.name}</span>
                    {c.pilotStatus && (
                      <span className="text-[9px] px-1 bg-emerald-500/20 text-emerald-400 rounded">
                        PILOT
                      </span>
                    )}
                  </div>
                  <div className="mt-1 flex items-baseline justify-between">
                    <span className="text-[11px] text-slate-400">{c.region.split(' ')[0]}</span>
                    <span className="text-xs font-mono font-bold text-emerald-400">
                      {score}%
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Side: Selected Country Details & Rwanda District Explorer */}
        <div className="lg:col-span-5 space-y-5">
          {/* Country Card */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <span>{selectedCountry.region}</span>
                  <span aria-hidden="true">·</span>
                  <span>Pop: {selectedCountry.population}</span>
                  {selectedCountry.pilotStatus && (
                    <>
                      <span aria-hidden="true">·</span>
                      <span className="text-emerald-400 font-semibold">Flagship Pilot</span>
                    </>
                  )}
                </div>
                <h3 className="text-xl font-bold text-white mt-1 flex items-center gap-2">
                  {selectedCountry.name}
                  <span className="text-xs font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                    {selectedCountry.isoCode}
                  </span>
                </h3>
              </div>

              <div className="text-right">
                <span className="text-[11px] text-slate-400 block">Composite Index</span>
                <span className="text-2xl font-mono font-bold text-emerald-400">
                  {selectedCountry.compositeIndex}
                </span>
                <span className="text-[11px] text-slate-400"> / 100</span>
              </div>
            </div>

            {/* Fast Stats Row */}
            <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-slate-800/80 text-center">
              <div className="bg-slate-950/60 p-2 rounded-lg">
                <span className="text-[10px] text-slate-400 block">Resilience</span>
                <span className="text-sm font-mono font-bold text-slate-200">
                  {selectedCountry.resilienceScore}%
                </span>
              </div>
              <div className="bg-slate-950/60 p-2 rounded-lg">
                <span className="text-[10px] text-slate-400 block">Active Crises</span>
                <span className="text-sm font-mono font-bold text-rose-400">
                  {selectedCountry.activeCrisesCount}
                </span>
              </div>
              <div className="bg-slate-950/60 p-2 rounded-lg">
                <span className="text-[10px] text-slate-400 block">Dev Projects</span>
                <span className="text-sm font-mono font-bold text-teal-400">
                  {selectedCountry.activeProjectsCount}
                </span>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-2 mt-4">
              <button
                onClick={() => onTriggerRapidResponse(selectedCountry.name)}
                className="flex-1 py-2 text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-colors cursor-pointer text-center"
              >
                Inspect Crises ({selectedCountry.activeCrisesCount})
              </button>
              <button
                onClick={() => setShowCompareModal(true)}
                className="px-3 py-2 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
              >
                Compare Partner
              </button>
            </div>
          </div>

          {/* Rwanda District Drill-down (If Rwanda is selected) */}
          {selectedCountry.id === 'rwanda' && selectedCountry.districts && (
            <div className="bg-slate-900/80 border border-emerald-500/30 rounded-xl p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-emerald-400" />
                  <h4 className="text-sm font-bold text-white">
                    Rwanda District Resiliency Grid
                  </h4>
                </div>
                <span className="text-[11px] text-slate-400 font-mono">10 Key Districts</span>
              </div>
              <p className="text-xs text-slate-400 mb-3">
                Select a district for immediate municipal water, power, and road status:
              </p>

              <div className="grid grid-cols-2 gap-2 max-h-[190px] overflow-y-auto pr-1">
                {selectedCountry.districts.map((d) => (
                  <button
                    key={d.id}
                    onClick={() => setSelectedDistrict(d)}
                    className={`text-left p-2 rounded-lg border text-xs transition-colors cursor-pointer ${
                      selectedDistrict?.id === d.id
                        ? 'bg-emerald-950/60 border-emerald-500 text-white'
                        : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold">{d.name}</span>
                      {d.activeIncidents > 0 ? (
                        <span className="text-[10px] text-rose-400 font-bold flex items-center gap-0.5">
                          <AlertTriangle className="w-2.5 h-2.5" /> {d.activeIncidents}
                        </span>
                      ) : (
                        <span className="text-[10px] text-emerald-400 font-medium">Nominal</span>
                      )}
                    </div>
                    <div className="mt-1 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                      <span>Water: {d.waterAccess}%</span>
                      <span>Grid: {d.electricityAccess}%</span>
                    </div>
                  </button>
                ))}
              </div>

              {/* District Detail Drawer if selected */}
              {selectedDistrict && (
                <div className="mt-3 p-3 bg-slate-950 border border-emerald-500/40 rounded-lg text-xs space-y-1.5 animate-fadeIn">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-emerald-300">
                      {selectedDistrict.name} District ({selectedDistrict.province})
                    </span>
                    <span className="text-slate-400">Pop: {selectedDistrict.population}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 pt-1 text-center font-mono">
                    <div className="bg-slate-900 p-1.5 rounded">
                      <span className="text-[10px] text-slate-400 block">Clean Water</span>
                      <span className="font-bold text-teal-400">{selectedDistrict.waterAccess}%</span>
                    </div>
                    <div className="bg-slate-900 p-1.5 rounded">
                      <span className="text-[10px] text-slate-400 block">Electricity</span>
                      <span className="font-bold text-amber-400">{selectedDistrict.electricityAccess}%</span>
                    </div>
                    <div className="bg-slate-900 p-1.5 rounded">
                      <span className="text-[10px] text-slate-400 block">Road Reach</span>
                      <span className="font-bold text-blue-400">{selectedDistrict.roadConnectivity}%</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 14 Indicators Score List */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5">
            <h4 className="text-sm font-semibold text-slate-200 mb-3 flex items-center justify-between">
              <span>National Indicator Scorecard</span>
              <span className="text-xs text-slate-400">2-Year Trend</span>
            </h4>
            <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
              {selectedCountry.indicators.map((ind) => (
                <div
                  key={ind.category}
                  className="flex items-center justify-between p-2 bg-slate-950/60 rounded-lg text-xs"
                >
                  <div className="truncate max-w-[200px]">
                    <span className="font-medium text-slate-200">{ind.category}</span>
                    <p className="text-[10px] text-slate-400 truncate">{ind.description}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="font-mono font-bold text-slate-200">{ind.score}%</span>
                    <span
                      className={`text-[10px] font-mono ${
                        ind.change2Year >= 0 ? 'text-emerald-400' : 'text-rose-400'
                      }`}
                    >
                      {ind.change2Year >= 0 ? `+${ind.change2Year}%` : `${ind.change2Year}%`}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Comparison Modal */}
      {showCompareModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-3xl w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-lg font-bold text-white">Cross-Country Progress Comparison</h3>
                <p className="text-xs text-slate-400">
                  Benchmarking {selectedCountry.name} vs. partner African states
                </p>
              </div>
              <button
                onClick={() => setShowCompareModal(false)}
                className="text-slate-400 hover:text-white text-xs px-2 py-1 rounded bg-slate-800 cursor-pointer"
              >
                Close
              </button>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-xs text-slate-400">Compare with:</span>
              <select
                value={compareTargetCountry.id}
                onChange={(e) => {
                  const target = countries.find((c) => c.id === e.target.value);
                  if (target) setCompareTargetCountry(target);
                }}
                className="bg-slate-950 border border-slate-700 text-slate-200 text-xs rounded-lg px-3 py-1.5"
              >
                {countries
                  .filter((c) => c.id !== selectedCountry.id)
                  .map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.region})
                    </option>
                  ))}
              </select>
            </div>

            {/* Comparison Table */}
            <div className="overflow-x-auto max-h-[350px]">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400">
                    <th className="py-2">Indicator Category</th>
                    <th className="py-2 text-right">{selectedCountry.name}</th>
                    <th className="py-2 text-right">{compareTargetCountry.name}</th>
                    <th className="py-2 text-right">Differential</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-mono">
                  {selectedCountry.indicators.map((ind) => {
                    const targetInd = compareTargetCountry.indicators.find(
                      (i) => i.category === ind.category
                    );
                    const targetScore = targetInd ? targetInd.score : 50;
                    const diff = ind.score - targetScore;
                    return (
                      <tr key={ind.category} className="hover:bg-slate-950/40">
                        <td className="py-2 font-sans text-slate-300">{ind.category}</td>
                        <td className="py-2 text-right font-bold text-emerald-400">{ind.score}%</td>
                        <td className="py-2 text-right text-slate-300">{targetScore}%</td>
                        <td
                          className={`py-2 text-right ${
                            diff > 0 ? 'text-emerald-400' : diff < 0 ? 'text-rose-400' : 'text-slate-400'
                          }`}
                        >
                          {diff > 0 ? `+${diff}%` : `${diff}%`}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
