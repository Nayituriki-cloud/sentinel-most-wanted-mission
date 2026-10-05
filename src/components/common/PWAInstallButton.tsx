import React, { useState } from 'react';
import { Download, Smartphone, Check, X, Shield, ArrowDownToLine } from 'lucide-react';
import { usePWAInstall } from '../../hooks/usePWAInstall';

interface Props {
  variant?: 'header' | 'button' | 'compact' | 'card';
}

export const PWAInstallButton: React.FC<Props> = ({ variant = 'header' }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showGuide, setShowGuide] = useState(false);
  const [justInstalled, setJustInstalled] = useState(false);

  const handleInstallClick = async () => {
    if (isInstallable) {
      const ok = await install();
      if (ok) {
        setJustInstalled(true);
        setTimeout(() => setJustInstalled(false), 4000);
      }
    } else {
      setShowGuide(true);
    }
  };

  if (isInstalled || justInstalled) {
    return (
      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-950/60 border border-emerald-700/60 text-emerald-300 text-xs font-mono">
        <Check className="w-3.5 h-3.5 text-emerald-400" />
        <span className="hidden sm:inline">App Installed</span>
      </div>
    );
  }

  return (
    <>
      <button
        onClick={handleInstallClick}
        className={`inline-flex items-center gap-1.5 font-bold transition rounded-md shadow-sm ${
          variant === 'header'
            ? 'bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-slate-950 px-2.5 sm:px-3 py-1.5 text-xs'
            : variant === 'card'
            ? 'w-full justify-center bg-amber-600 hover:bg-amber-500 text-slate-950 px-4 py-2.5 text-xs'
            : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-3 py-1.5 text-xs'
        }`}
        title="Download / Install Sentinel App for Offline Law Enforcement Operation"
      >
        <ArrowDownToLine className="w-3.5 h-3.5 shrink-0" />
        <span className="whitespace-nowrap">
          {isInstallable ? 'Install App' : 'Download App'}
        </span>
      </button>

      {/* Installation & Offline Guide Modal for all browsers (iOS, Desktop, Android, Preview) */}
      {showGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-2xl bg-slate-900 border border-slate-700 p-6 shadow-2xl text-slate-100 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  <Download className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-100">
                    Download Sentinel Mission OS
                  </h3>
                  <span className="text-[11px] font-mono text-emerald-400">
                    OFFLINE STANDALONE PWA READY
                  </span>
                </div>
              </div>
              <button
                onClick={() => setShowGuide(false)}
                className="text-slate-400 hover:text-white p-1 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Install the Sentinel platform as a native desktop or mobile application on your device. Works offline in tactical field operations with encrypted cached records.
            </p>

            <div className="space-y-2.5 text-xs font-mono">
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-amber-400 font-bold block mb-1">
                  💻 Desktop Chrome / Edge / Windows / Mac:
                </span>
                <p className="text-slate-300 font-sans text-xs">
                  Click the <strong>Install icon (⊕ or ⬇)</strong> in your browser's address bar, or open the browser menu (⋮) and select <strong>"Install Sentinel"</strong>.
                </p>
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-amber-400 font-bold block mb-1">
                  📱 iOS Safari (iPhone / iPad):
                </span>
                <p className="text-slate-300 font-sans text-xs">
                  1. Tap the <strong>Share</strong> button in Safari toolbar.<br />
                  2. Scroll down and tap <strong>"Add to Home Screen"</strong>.
                </p>
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-amber-400 font-bold block mb-1">
                  🤖 Android (Chrome / Firefox):
                </span>
                <p className="text-slate-300 font-sans text-xs">
                  Tap the top right menu (⋮) and select <strong>"Install app"</strong> or <strong>"Add to Home Screen"</strong>.
                </p>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setShowGuide(false)}
                className="bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold px-5 py-2 rounded-lg text-xs transition"
              >
                Understood
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
