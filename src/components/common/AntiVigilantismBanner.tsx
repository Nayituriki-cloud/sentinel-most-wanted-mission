import React from 'react';
import { AlertTriangle, PhoneCall, ShieldAlert, X } from 'lucide-react';

interface Props {
  variant?: 'banner' | 'compact' | 'modal';
  onDismiss?: () => void;
}

export const AntiVigilantismBanner: React.FC<Props> = ({ variant = 'banner', onDismiss }) => {
  if (variant === 'compact') {
    return (
      <div className="flex items-center justify-between gap-3 bg-red-950/80 border-y border-red-700/60 px-4 py-2 text-red-200 text-xs tracking-wide">
        <div className="flex items-center gap-2 font-semibold">
          <ShieldAlert className="w-4 h-4 text-red-400 shrink-0" />
          <span>OFFICIAL PUBLIC SAFETY MANDATE: DO NOT APPROACH OR CONFRONT A WANTED PERSON.</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-red-300 hidden md:inline">Contact authorized law enforcement immediately.</span>
          <span className="inline-flex items-center gap-1 bg-red-900/90 text-red-100 px-2 py-0.5 rounded text-[11px] font-mono font-bold">
            <PhoneCall className="w-3 h-3" /> DIAL 911
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-red-950 via-slate-900 to-red-950 border-b border-red-800/80 px-4 py-2.5 sm:px-6 shadow-md">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-start sm:items-center gap-3">
          <div className="p-1.5 rounded-md bg-red-600/20 border border-red-500/40 text-red-400 shrink-0">
            <AlertTriangle className="w-5 h-5 text-red-400 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs uppercase tracking-widest font-black text-red-400 bg-red-950/80 px-2 py-0.5 rounded border border-red-800">
                CRITICAL SAFETY WARNING
              </span>
              <span className="text-sm font-bold text-slate-100 tracking-tight">
                DO NOT APPROACH OR CONFRONT A WANTED PERSON. Contact the appropriate authorities.
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              Subjects may be armed, dangerous, and unpredictable. All investigative action is strictly reserved for authorized sworn personnel.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 shrink-0 self-end sm:self-center">
          <div className="flex items-center gap-1.5 bg-red-900/60 border border-red-700/80 text-white px-2.5 py-1 rounded text-xs font-mono font-bold">
            <PhoneCall className="w-3.5 h-3.5 text-red-300" />
            <span>EMERGENCY: 911</span>
          </div>
          <div className="text-[11px] text-slate-400 font-mono hidden lg:block border-l border-slate-700/60 pl-2.5">
            TIPLINE: 1-800-CALL-FBI
          </div>
          {onDismiss && (
            <button 
              onClick={onDismiss}
              className="text-slate-400 hover:text-slate-200 p-1 rounded"
              title="Acknowledge"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
