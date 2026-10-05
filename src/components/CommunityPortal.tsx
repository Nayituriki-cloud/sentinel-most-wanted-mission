import React, { useState } from 'react';
import {
  Users2,
  Send,
  CheckCircle2,
  AlertTriangle,
  WifiOff,
  RefreshCw,
  MapPin,
  Phone,
  FileCheck,
  ShieldCheck,
  Plus
} from 'lucide-react';
import { CommunityReport } from '../types';

interface CommunityPortalProps {
  reports: CommunityReport[];
  onSubmitReport: (report: CommunityReport) => void;
  onVerifyReport: (reportId: string, actionNote: string) => void;
  onPromoteToIncident: (report: CommunityReport) => void;
}

export const CommunityPortal: React.FC<CommunityPortalProps> = ({
  reports,
  onSubmitReport,
  onVerifyReport,
  onPromoteToIncident,
}) => {
  const [activeTab, setActiveTab] = useState<'submit' | 'feed' | 'triage'>('feed');
  const [offlineSimulate, setOfflineSimulate] = useState(false);

  // Form State
  const [reporterName, setReporterName] = useState('');
  const [reporterType, setReporterType] = useState<CommunityReport['reporterType']>('Community Scout');
  const [phone, setPhone] = useState('+250 788 ');
  const [category, setCategory] = useState<CommunityReport['category']>('Infrastructure problem');
  const [country, setCountry] = useState('Rwanda');
  const [district, setDistrict] = useState('Musanze');
  const [description, setDescription] = useState('');
  const [submissionNotice, setSubmissionNotice] = useState<string | null>(null);

  // Triage state
  const [triageNote, setTriageNote] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reporterName.trim() || !description.trim()) return;

    const newReport: CommunityReport = {
      id: `REP-2026-${String(reports.length + 101).padStart(3, '0')}`,
      reportedBy: reporterName,
      reporterType,
      phoneMasked: phone.length > 7 ? `${phone.slice(0, 8)}***${phone.slice(-3)}` : phone,
      category,
      country,
      district,
      description,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16) + ' UTC',
      verifiedStatus: 'Pending Verification',
      offlineQueued: offlineSimulate,
    };

    onSubmitReport(newReport);
    setSubmissionNotice(
      offlineSimulate
        ? 'Report saved to Local Offline Queue. Will sync once cellular connection restores.'
        : 'Report submitted successfully. Dispatched to local district verification cell.'
    );

    setReporterName('');
    setDescription('');
    setTimeout(() => setSubmissionNotice(null), 4000);
  };

  const offlineQueuedCount = reports.filter((r) => r.offlineQueued).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 lg:p-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
              <span>Citizen & Verified Field Scout Network</span>
              <span aria-hidden="true">·</span>
              <span>Low-Bandwidth Resilient</span>
              <span aria-hidden="true">·</span>
              <span className="text-emerald-400 font-medium">Community Ground Intelligence</span>
            </div>
            <h1 className="text-xl lg:text-2xl font-bold tracking-tight text-white">
              Community Participation & Field Reporting
            </h1>
          </div>

          <div className="flex items-center gap-2">
            {/* Toggle offline simulator */}
            <button
              onClick={() => setOfflineSimulate(!offlineSimulate)}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg border cursor-pointer transition-colors ${
                offlineSimulate
                  ? 'bg-amber-950/80 border-amber-600 text-amber-300'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <WifiOff className="w-3.5 h-3.5" />
              <span>Simulate Remote Offline Mode ({offlineSimulate ? 'ON' : 'OFF'})</span>
            </button>
          </div>
        </div>

        {/* Sub-Tabs */}
        <div className="flex items-center justify-between pt-4 mt-4 border-t border-slate-800/80">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('feed')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                activeTab === 'feed'
                  ? 'bg-slate-800 text-emerald-400 border border-emerald-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Verified Reports Feed ({reports.length})
            </button>
            <button
              onClick={() => setActiveTab('submit')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                activeTab === 'submit'
                  ? 'bg-slate-800 text-emerald-400 border border-emerald-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              + Submit Field Report
            </button>
            <button
              onClick={() => setActiveTab('triage')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                activeTab === 'triage'
                  ? 'bg-slate-800 text-emerald-400 border border-emerald-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Field Verification Cell
            </button>
          </div>

          {offlineQueuedCount > 0 && (
            <span className="text-xs font-mono text-amber-400 flex items-center gap-1 bg-amber-950/40 px-2.5 py-1 rounded-md border border-amber-800/40">
              <RefreshCw className="w-3 h-3 animate-spin" />
              {offlineQueuedCount} queued locally
            </span>
          )}
        </div>
      </div>

      {submissionNotice && (
        <div className="p-3 bg-emerald-950/80 border border-emerald-500/60 rounded-xl text-xs font-semibold text-emerald-300 flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{submissionNotice}</span>
        </div>
      )}

      {/* View: Feed of verified reports */}
      {activeTab === 'feed' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reports.map((rep) => (
            <div
              key={rep.id}
              className="p-4 bg-slate-900/80 border border-slate-800 rounded-xl space-y-3"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
                    <span className="text-emerald-400">{rep.id}</span>
                    <span aria-hidden="true">·</span>
                    <span>{rep.district}, {rep.country}</span>
                  </div>
                  <h4 className="text-sm font-bold text-white mt-0.5">{rep.category}</h4>
                </div>

                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                    rep.verifiedStatus === 'Verified Operational'
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                  }`}
                >
                  {rep.verifiedStatus}
                </span>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">{rep.description}</p>

              {rep.actionTaken && (
                <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800 text-[11px] text-emerald-300 flex items-start gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Action: {rep.actionTaken}</span>
                </div>
              )}

              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400 font-mono">
                <span>
                  By: {rep.reportedBy} ({rep.reporterType})
                </span>
                <span>{rep.timestamp}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* View: Submit Form */}
      {activeTab === 'submit' && (
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-6 max-w-2xl mx-auto space-y-4">
          <div>
            <h3 className="text-lg font-bold text-white">Report Community Incident or Need</h3>
            <p className="text-xs text-slate-400">
              Verified information triggers field triage by local district emergency cells.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-400 mb-1">Your Name / Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Kwizera Emmanuel"
                  value={reporterName}
                  onChange={(e) => setReporterName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Role / Designation</label>
                <select
                  value={reporterType}
                  onChange={(e) => setReporterType(e.target.value as CommunityReport['reporterType'])}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
                >
                  <option value="Community Scout">Community Scout</option>
                  <option value="Village Leader">Village Leader (Umudugudu)</option>
                  <option value="Citizen">Citizen Resident</option>
                  <option value="Local NGO">Local Cooperative / NGO</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-slate-400 mb-1">Phone Number</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white font-mono"
                />
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
                  <option value="DR Congo">DR Congo</option>
                  <option value="Ghana">Ghana</option>
                  <option value="Nigeria">Nigeria</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">District / County</label>
                <input
                  type="text"
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Category of Observation</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as CommunityReport['category'])}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
              >
                <option value="Infrastructure problem">Infrastructure problem (Bridges, Culverts)</option>
                <option value="Water shortage">Water shortage (Borehole Breakdown, Contamination)</option>
                <option value="Damaged road">Damaged road (Fissures, Landslides, Impassable)</option>
                <option value="Community need">Community need (Health Center, Solar, Grain Storage)</option>
                <option value="Emergency situation">Emergency situation (Flash Flooding, Outbreak)</option>
                <option value="Development opportunity">Development opportunity (Irrigation, School Expansion)</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Detailed Description & Urgent Risks</label>
              <textarea
                rows={4}
                required
                placeholder="Specify exact landmark, affected households, road names, and immediate safety concerns..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>
                {offlineSimulate ? 'Save to Offline Local Queue' : 'Transmit to Field Verification Cell'}
              </span>
            </button>
          </form>
        </div>
      )}

      {/* View: Field Verification Triage */}
      {activeTab === 'triage' && (
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Field Officer Verification Queue</span>
            </h3>
            <span className="text-xs text-slate-400 font-mono">
              Role: Field Responder / MINEMA Coordinator
            </span>
          </div>

          <div className="space-y-3">
            {reports
              .filter((r) => r.verifiedStatus === 'Pending Verification')
              .map((rep) => (
                <div
                  key={rep.id}
                  className="p-4 bg-slate-950 border border-amber-500/40 rounded-xl space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-xs font-mono text-amber-400 block">{rep.id}</span>
                      <h4 className="text-sm font-bold text-white">{rep.category} · {rep.district}, {rep.country}</h4>
                    </div>
                    <span className="text-xs text-slate-400">{rep.timestamp}</span>
                  </div>

                  <p className="text-xs text-slate-300">{rep.description}</p>
                  <span className="text-[11px] text-slate-400 block">
                    Source: {rep.reportedBy} ({rep.reporterType}) · Phone: {rep.phoneMasked}
                  </span>

                  <div className="pt-2 border-t border-slate-900 flex items-center gap-2">
                    <button
                      onClick={() =>
                        onVerifyReport(
                          rep.id,
                          'Field inspected by District Engineer. Assigned to maintenance queue.'
                        )
                      }
                      className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold rounded-lg cursor-pointer"
                    >
                      Verify as Operational
                    </button>
                    <button
                      onClick={() => onPromoteToIncident(rep)}
                      className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-lg cursor-pointer"
                    >
                      Escalate to Rapid Response
                    </button>
                  </div>
                </div>
              ))}

            {reports.filter((r) => r.verifiedStatus === 'Pending Verification').length === 0 && (
              <div className="p-8 text-center text-xs text-slate-400">
                All field community reports have been verified and processed.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
