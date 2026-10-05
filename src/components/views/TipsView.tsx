import React, { useState } from 'react';
import {
  MessageSquareWarning,
  Plus,
  ShieldAlert,
  Search,
  CheckCircle2,
  Clock,
  Sparkles,
  Paperclip,
  Send,
  AlertTriangle,
  Lock,
  User,
  Shield,
  FileText,
  UserCheck,
  PhoneCall,
  Eye,
} from 'lucide-react';
import { PublicTip, WantedCase } from '../../types';
import { evaluateTipWithAi } from '../../services/aiService';

interface TipsViewProps {
  tips: PublicTip[];
  cases: WantedCase[];
  onAddTip: (newTip: PublicTip) => void;
  onUpdateTip: (updatedTip: PublicTip) => void;
  onOpenPublicTipModal: () => void;
}

export const TipsView: React.FC<TipsViewProps> = ({
  tips,
  cases,
  onAddTip,
  onUpdateTip,
  onOpenPublicTipModal,
}) => {
  const [selectedTipId, setSelectedTipId] = useState<string>(tips[0]?.id || '');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [isEvaluatingAi, setIsEvaluatingAi] = useState(false);
  const [replyMessage, setReplyMessage] = useState('');

  const selectedTip = tips.find((t) => t.id === selectedTipId) || tips[0];
  const associatedCase = cases.find((c) => c.id === selectedTip?.caseId);

  const filteredTips = tips.filter((t) => {
    const matchesSearch =
      t.referenceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (t.targetSubjectName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.locationReported.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.detailedDescription.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'ALL' || t.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleRunAiEvaluation = async () => {
    if (!selectedTip) return;
    setIsEvaluatingAi(true);
    try {
      const evaluation = await evaluateTipWithAi(selectedTip, associatedCase);
      const updatedTip: PublicTip = {
        ...selectedTip,
        credibilityScore: evaluation.credibilityScore || selectedTip.credibilityScore,
        credibilityTier: evaluation.credibilityTier || selectedTip.credibilityTier,
        aiAssessment: {
          summary: evaluation.analysisSummary || 'AI assessment completed.',
          corroboratingFactors: evaluation.corroboratingFactors || [],
          redFlags: evaluation.redFlagsOrDiscrepancies || [],
          recommendedActions: evaluation.recommendedActions || [],
        },
      };
      onUpdateTip(updatedTip);
    } catch (e) {
      console.error(e);
    } finally {
      setIsEvaluatingAi(false);
    }
  };

  const handleUpdateStatus = (newStatus: PublicTip['status']) => {
    if (!selectedTip) return;
    onUpdateTip({
      ...selectedTip,
      status: newStatus,
    });
  };

  const handleSendInvestigatorMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyMessage.trim() || !selectedTip) return;

    const updatedConversation = [
      ...selectedTip.conversation,
      {
        sender: 'INVESTIGATOR' as const,
        message: replyMessage.trim(),
        timestamp: new Date().toISOString(),
      },
    ];

    onUpdateTip({
      ...selectedTip,
      conversation: updatedConversation,
    });

    setReplyMessage('');
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-5 rounded-xl shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <MessageSquareWarning className="w-5 h-5 text-emerald-400" />
            <h1 className="text-xl sm:text-2xl font-black text-slate-100 tracking-tight">
              Public Safety Tip & Sighting Intake Center
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            Encrypted citizen intake queue, automated tracking references, credibility scoring, and secure non-identifying investigator correspondence.
          </p>
        </div>

        <button
          onClick={onOpenPublicTipModal}
          className="flex items-center gap-1.5 bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold px-3.5 py-2 rounded-lg text-xs transition shadow-sm self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Submit New Citizen Tip</span>
        </button>
      </div>

      {/* Prominent Mandatory Anti-Vigilantism Banner */}
      <div className="bg-red-950/90 border border-red-700/80 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-red-800/50 text-red-200 shrink-0">
            <ShieldAlert className="w-5 h-5 text-red-400 animate-pulse" />
          </div>
          <div>
            <div className="text-xs uppercase font-mono font-black text-red-400">
              OFFICIAL PUBLIC SAFETY PROTOCOL
            </div>
            <div className="text-sm font-black text-slate-100 mt-0.5">
              “DO NOT APPROACH OR CONFRONT A WANTED PERSON. Contact the appropriate authorities.”
            </div>
            <p className="text-xs text-red-200 mt-0.5">
              Never attempt to detain, follow, surveil, or photograph a wanted person in a confrontational manner.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="inline-flex items-center gap-1 bg-red-900 text-white font-mono text-xs px-3 py-1.5 rounded-lg font-bold border border-red-700">
            <PhoneCall className="w-3.5 h-3.5" /> DIAL 911 FOR ACTIVE CRIMES
          </span>
        </div>
      </div>

      {/* Main Grid: Tip List on Left, Active Tip Details & Secure Chat on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Tips Intake List */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between gap-2">
            <div className="relative flex-1">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search reference #, location, text..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-8 pr-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500 font-mono"
              />
            </div>
            <select
              aria-label="Filter tips by status"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-2 text-xs text-slate-300 font-mono focus:outline-none"
            >
              <option value="ALL">All Statuses</option>
              <option value="PENDING_REVIEW">Pending Review</option>
              <option value="INVESTIGATING">Investigating</option>
              <option value="CORROBORATED">Corroborated</option>
              <option value="CLOSED">Closed</option>
            </select>
          </div>

          <div className="space-y-2.5 max-h-[750px] overflow-y-auto pr-1">
            {filteredTips.map((tip) => {
              const isSelected = tip.id === selectedTip?.id;

              return (
                <div
                  key={tip.id}
                  onClick={() => setSelectedTipId(tip.id)}
                  className={`p-3.5 rounded-xl border transition cursor-pointer ${
                    isSelected
                      ? 'bg-slate-900 border-amber-500 shadow-md shadow-amber-950/20'
                      : 'bg-slate-900/70 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-mono font-bold text-amber-400">
                      {tip.referenceNumber}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                      tip.status === 'CORROBORATED'
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : tip.status === 'INVESTIGATING'
                        ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        : 'bg-slate-800 text-slate-300'
                    }`}>
                      {tip.status}
                    </span>
                  </div>

                  <div className="mt-1 text-xs font-semibold text-slate-100">
                    Subject: {tip.targetSubjectName || 'Unknown / General'}
                  </div>

                  <p className="text-xs text-slate-400 line-clamp-2 mt-1">
                    "{tip.detailedDescription}"
                  </p>

                  <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-400">
                    <span>
                      {tip.locationReported.city}, {tip.locationReported.stateOrRegion}
                    </span>
                    <span className="text-emerald-400 font-bold">
                      Score: {tip.credibilityScore}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Selected Tip Detailed Assessment & Secure Investigator Channel */}
        <div className="lg:col-span-7 space-y-4">
          {selectedTip ? (
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-5">
              
              {/* Tip Header Details */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-base font-black text-slate-100 font-mono">
                      {selectedTip.referenceNumber}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">
                      • {new Date(selectedTip.submittedAt).toLocaleString()}
                    </span>
                  </div>
                  <div className="text-xs text-slate-300 mt-0.5">
                    Target: <strong className="text-amber-400">{selectedTip.targetSubjectName || 'Unspecified'}</strong>
                    {selectedTip.isAnonymous ? (
                      <span className="ml-2 text-slate-400 font-mono">[Submitted Anonymously]</span>
                    ) : (
                      <span className="ml-2 text-slate-400 font-mono">[Contact: {selectedTip.tipsterContact}]</span>
                    )}
                  </div>
                </div>

                {/* Workflow Status Controls */}
                <div className="flex items-center gap-1.5 flex-wrap">
                  {(['PENDING_REVIEW', 'INVESTIGATING', 'CORROBORATED', 'CLOSED'] as PublicTip['status'][]).map((st) => (
                    <button
                      key={st}
                      onClick={() => handleUpdateStatus(st)}
                      className={`px-2 py-1 rounded text-[10px] font-mono font-bold transition ${
                        selectedTip.status === st
                          ? 'bg-amber-500 text-slate-950 font-black'
                          : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
                      }`}
                    >
                      {st.replace('_', ' ')}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sighting Description */}
              <div className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
                  <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                    <span className="text-slate-500 text-[10px] block">LOCATION REPORTED:</span>
                    <span className="text-slate-200 font-semibold">
                      {selectedTip.locationReported.city}, {selectedTip.locationReported.stateOrRegion}
                    </span>
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      {selectedTip.locationReported.landmarkDescription}
                    </div>
                  </div>

                  <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                    <span className="text-slate-500 text-[10px] block">REPORTED SIGHTING TIME:</span>
                    <span className="text-slate-200 font-semibold">
                      {new Date(selectedTip.sightingDateTime).toLocaleString()}
                    </span>
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      Assigned Investigator: {selectedTip.assignedInvestigator || 'Unassigned'}
                    </div>
                  </div>
                </div>

                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                  <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    Citizen Narrative Statement:
                  </span>
                  <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-sans">
                    "{selectedTip.detailedDescription}"
                  </p>
                </div>

                {/* Attachments */}
                {selectedTip.attachments.length > 0 && (
                  <div>
                    <span className="text-xs font-mono text-slate-400 font-bold uppercase block mb-1.5">
                      Submitted Photographic / Document Media:
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {selectedTip.attachments.map((att) => (
                        <div
                          key={att.id}
                          className="flex items-center gap-2 bg-slate-950 border border-slate-800 px-3 py-1.5 rounded-lg text-xs font-mono text-slate-200"
                        >
                          <Paperclip className="w-3.5 h-3.5 text-amber-400" />
                          <span>{att.name}</span>
                          <span className="text-slate-500 text-[10px]">({att.size})</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* AI Credibility Assessment Module */}
              <div className="bg-indigo-950/30 border border-indigo-900/50 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-indigo-300 font-bold text-xs uppercase font-mono">
                    <Sparkles className="w-4 h-4 text-indigo-400" />
                    <span>AI Credibility Assessment & Discrepancy Cross-Check</span>
                  </div>

                  <button
                    onClick={handleRunAiEvaluation}
                    disabled={isEvaluatingAi}
                    className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold px-3 py-1 rounded-md transition disabled:opacity-50"
                  >
                    <span>{isEvaluatingAi ? 'Evaluating...' : 'Re-Evaluate Tip'}</span>
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                  <div className="bg-slate-950/80 p-2.5 rounded border border-indigo-900/40">
                    <span className="text-slate-400 text-[10px] block">CREDIBILITY SCORE:</span>
                    <span className="text-emerald-400 font-bold text-base">
                      {selectedTip.credibilityScore} / 100
                    </span>
                  </div>
                  <div className="bg-slate-950/80 p-2.5 rounded border border-indigo-900/40">
                    <span className="text-slate-400 text-[10px] block">CREDIBILITY TIER:</span>
                    <span className="text-indigo-300 font-bold">
                      {selectedTip.credibilityTier.replace(/_/g, ' ')}
                    </span>
                  </div>
                </div>

                {selectedTip.aiAssessment && (
                  <div className="space-y-2 text-xs">
                    <p className="text-indigo-100 font-medium">
                      {selectedTip.aiAssessment.summary}
                    </p>

                    {selectedTip.aiAssessment.corroboratingFactors.length > 0 && (
                      <div>
                        <span className="text-emerald-400 font-mono font-bold text-[11px] block">
                          Corroborating Case Markers:
                        </span>
                        <ul className="list-disc list-inside text-slate-300 space-y-0.5">
                          {selectedTip.aiAssessment.corroboratingFactors.map((f, i) => (
                            <li key={i}>{f}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {selectedTip.aiAssessment.recommendedActions.length > 0 && (
                      <div>
                        <span className="text-amber-400 font-mono font-bold text-[11px] block">
                          Lawful Verification Directives:
                        </span>
                        <ul className="list-disc list-inside text-slate-300 space-y-0.5">
                          {selectedTip.aiAssessment.recommendedActions.map((a, i) => (
                            <li key={i}>{a}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Secure 2-Way Anonymous Communication Channel */}
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Lock className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-xs font-mono font-bold text-slate-200 uppercase">
                      Secure Non-Identifying Tipster Bulletin Channel
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono">
                    AES-256 Encrypted • Zero IP Exposure
                  </span>
                </div>

                <div className="space-y-2.5 max-h-48 overflow-y-auto pr-1">
                  {selectedTip.conversation.length === 0 ? (
                    <div className="text-xs text-slate-500 italic p-3 text-center">
                      No follow-up questions sent yet. Investigators can send non-confrontational clarification requests.
                    </div>
                  ) : (
                    selectedTip.conversation.map((msg, i) => (
                      <div
                        key={i}
                        className={`p-2.5 rounded-lg text-xs ${
                          msg.sender === 'INVESTIGATOR'
                            ? 'bg-slate-900 border border-amber-600/30 ml-6 text-amber-100'
                            : 'bg-slate-900/80 border border-slate-800 mr-6 text-slate-200'
                        }`}
                      >
                        <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 mb-1">
                          <span className="font-bold">
                            {msg.sender === 'INVESTIGATOR' ? '🛡️ AUTHORIZED INVESTIGATOR' : '👤 SECURE CITIZEN / TIPSTER'}
                          </span>
                          <span>{new Date(msg.timestamp).toLocaleTimeString()}</span>
                        </div>
                        <p>{msg.message}</p>
                      </div>
                    ))
                  )}
                </div>

                <form onSubmit={handleSendInvestigatorMessage} className="flex gap-2 pt-2 border-t border-slate-800">
                  <input
                    type="text"
                    placeholder="Send clarification query to tipster (e.g. Can you confirm the vessel flag?)..."
                    value={replyMessage}
                    onChange={(e) => setReplyMessage(e.target.value)}
                    className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500 font-sans"
                  />
                  <button
                    type="submit"
                    className="bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold px-3 py-2 rounded-lg text-xs transition flex items-center gap-1 shrink-0"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send</span>
                  </button>
                </form>
              </div>

            </div>
          ) : (
            <div className="p-8 text-center text-slate-500 bg-slate-900 border border-slate-800 rounded-xl">
              No tip selected.
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
