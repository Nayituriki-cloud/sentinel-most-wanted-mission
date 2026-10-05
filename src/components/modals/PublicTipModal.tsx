import React, { useState } from 'react';
import {
  X,
  ShieldAlert,
  Lock,
  Paperclip,
  CheckCircle2,
  Copy,
  AlertTriangle,
  PhoneCall,
  Send,
} from 'lucide-react';
import { PublicTip, WantedCase } from '../../types';

interface PublicTipModalProps {
  isOpen: boolean;
  onClose: () => void;
  cases: WantedCase[];
  preselectedCase?: WantedCase | null;
  onSubmitTip: (tip: PublicTip) => void;
}

export const PublicTipModal: React.FC<PublicTipModalProps> = ({
  isOpen,
  onClose,
  cases,
  preselectedCase,
  onSubmitTip,
}) => {
  if (!isOpen) return null;

  const [targetCaseId, setTargetCaseId] = useState<string>(
    preselectedCase?.id || ''
  );
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [tipsterContact, setTipsterContact] = useState('');
  const [city, setCity] = useState('');
  const [stateOrRegion, setStateOrRegion] = useState('');
  const [landmark, setLandmark] = useState('');
  const [sightingDateTime, setSightingDateTime] = useState(
    new Date().toISOString().slice(0, 16)
  );
  const [description, setDescription] = useState('');
  const [hasPhotoAttachment, setHasPhotoAttachment] = useState(false);
  const [submittedTipCode, setSubmittedTipCode] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim() || !city.trim()) return;

    const targetCase = cases.find((c) => c.id === targetCaseId);
    const refCode = `TIP-2026-${Math.floor(1000 + Math.random() * 9000)}-${String.fromCharCode(65 + Math.floor(Math.random() * 26))}`;

    const newTip: PublicTip = {
      id: `tip-${Date.now()}`,
      referenceNumber: refCode,
      caseId: targetCaseId || undefined,
      targetSubjectName: targetCase?.fullName || 'General Report',
      submittedAt: new Date().toISOString(),
      isAnonymous,
      tipsterContact: isAnonymous ? undefined : tipsterContact.trim(),
      locationReported: {
        city: city.trim(),
        stateOrRegion: stateOrRegion.trim(),
        landmarkDescription: landmark.trim(),
      },
      sightingDateTime: sightingDateTime || new Date().toISOString(),
      detailedDescription: description.trim(),
      attachments: hasPhotoAttachment
        ? [
            {
              id: `att-${Date.now()}`,
              name: `citizen_evidence_photo_${city.toLowerCase().replace(/\s+/g, '_')}.jpg`,
              type: 'PHOTO',
              size: '3.1 MB',
            },
          ]
        : [],
      credibilityScore: 75,
      credibilityTier: 'HIGH_CORROBORATION_POTENTIAL',
      status: 'PENDING_REVIEW',
      conversation: [],
    };

    onSubmitTip(newTip);
    setSubmittedTipCode(refCode);
  };

  const handleClose = () => {
    setSubmittedTipCode(null);
    setDescription('');
    setCity('');
    setStateOrRegion('');
    setLandmark('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-sm overflow-y-auto">
      <div className="relative bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden my-auto">
        
        {/* Modal Header */}
        <div className="px-5 py-3.5 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-200">
              SECURE PUBLIC TIP TRANSMISSION PORTAL
            </span>
          </div>
          <button
            onClick={handleClose}
            className="text-slate-400 hover:text-white p-1 rounded"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Prominent Safety Warning */}
        <div className="bg-red-950/90 border-b border-red-800 p-4">
          <div className="flex items-start gap-2.5">
            <ShieldAlert className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
            <div>
              <div className="text-xs uppercase font-mono font-bold text-red-400">
                CRITICAL WARNING FOR ALL CITIZENS
              </div>
              <div className="text-sm font-bold text-slate-100">
                “DO NOT APPROACH OR CONFRONT A WANTED PERSON. Contact the appropriate authorities.”
              </div>
              <p className="text-xs text-red-200 mt-0.5">
                If an immediate violent crime is occurring or you are in physical danger, please dial 911 immediately.
              </p>
            </div>
          </div>
        </div>

        {/* Success Confirmation View */}
        {submittedTipCode ? (
          <div className="p-6 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center border border-emerald-500/40">
              <CheckCircle2 className="w-7 h-7" />
            </div>

            <div>
              <h3 className="text-lg font-bold text-slate-100">
                Tip Encrypted & Securely Transmitted
              </h3>
              <p className="text-xs text-slate-300 mt-1 max-w-md mx-auto">
                Authorized law enforcement investigators have received your report in the priority review queue.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 max-w-xs mx-auto">
              <span className="text-[10px] font-mono text-slate-400 uppercase block">
                YOUR ANONYMOUS TRACKING CODE:
              </span>
              <div className="text-lg font-mono font-black text-amber-400 mt-1 select-all">
                {submittedTipCode}
              </div>
              <span className="text-[10px] text-slate-500 mt-1 block">
                Save this code to check status or send follow-up details securely.
              </span>
            </div>

            <button
              onClick={handleClose}
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-6 py-2 rounded-lg text-xs font-semibold transition"
            >
              Close Window
            </button>
          </div>
        ) : (
          /* Submission Form */
          <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4 max-h-[75vh] overflow-y-auto">
            
            {/* Target Wanted Person */}
            <div>
              <label className="text-xs font-mono font-bold text-slate-300 block mb-1">
                Target Wanted Subject:
              </label>
              <select
                value={targetCaseId}
                onChange={(e) => setTargetCaseId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-500 font-mono"
              >
                <option value="">General Tip / Unsure of Specific Dossier</option>
                {cases.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.fullName} ({c.priorityLevel.split(' - ')[0]} • Warrant: {c.warrantNumber})
                  </option>
                ))}
              </select>
            </div>

            {/* Anonymous Toggle */}
            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-200 block">
                  Submit 100% Anonymously
                </span>
                <span className="text-[11px] text-slate-400">
                  Zero IP logging, zero metadata stored.
                </span>
              </div>
              <input
                type="checkbox"
                checked={isAnonymous}
                onChange={(e) => setIsAnonymous(e.target.checked)}
                className="w-4 h-4 rounded text-amber-500 bg-slate-900 border-slate-700 focus:ring-0 cursor-pointer"
              />
            </div>

            {/* Optional Contact If Not Anonymous */}
            {!isAnonymous && (
              <div>
                <label className="text-xs font-mono font-bold text-slate-300 block mb-1">
                  Secure Contact Info (Email or Phone):
                </label>
                <input
                  type="text"
                  placeholder="e.g. secure-contact@email.com"
                  value={tipsterContact}
                  onChange={(e) => setTipsterContact(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
                />
              </div>
            )}

            {/* Location & Time */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-mono font-bold text-slate-300 block mb-1">
                  City / Locality: *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Split, Chicago, Miami"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-xs font-mono font-bold text-slate-300 block mb-1">
                  State / Province / Country:
                </label>
                <input
                  type="text"
                  placeholder="e.g. Illinois, Croatia, Florida"
                  value={stateOrRegion}
                  onChange={(e) => setStateOrRegion(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-mono font-bold text-slate-300 block mb-1">
                  Approximate Date & Time of Sighting:
                </label>
                <input
                  type="datetime-local"
                  value={sightingDateTime}
                  onChange={(e) => setSightingDateTime(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-500 font-mono"
                />
              </div>

              <div>
                <label className="text-xs font-mono font-bold text-slate-300 block mb-1">
                  Landmark / Specific Facility:
                </label>
                <input
                  type="text"
                  placeholder="e.g. Harbor pier B, Fuel stop near I-80"
                  value={landmark}
                  onChange={(e) => setLandmark(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="text-xs font-mono font-bold text-slate-300 block mb-1">
                Detailed Observation Statement: *
              </label>
              <textarea
                required
                rows={4}
                placeholder="Describe what you observed: physical appearance, clothing, accompanying persons, vehicles (make, model, color, license plate partials), direction of travel..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs text-slate-200 focus:outline-none focus:border-amber-500 leading-relaxed"
              ></textarea>
            </div>

            {/* Simulated Attachment */}
            <div className="flex items-center justify-between p-3 rounded-lg bg-slate-950 border border-slate-800">
              <div className="flex items-center gap-2">
                <Paperclip className="w-4 h-4 text-amber-400" />
                <span className="text-xs text-slate-300">
                  Attach Photo / Dashcam Sighting Image
                </span>
              </div>
              <input
                type="checkbox"
                checked={hasPhotoAttachment}
                onChange={(e) => setHasPhotoAttachment(e.target.checked)}
                className="w-4 h-4 rounded text-amber-500 bg-slate-900 border-slate-700 cursor-pointer"
              />
            </div>

            {/* Modal Actions */}
            <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2 rounded-lg text-xs text-slate-400 hover:text-slate-200 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold px-5 py-2.5 rounded-lg text-xs transition flex items-center gap-1.5 shadow-md shadow-amber-950/40"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Submit Confidential Tip</span>
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
};
