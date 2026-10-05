import React, { useState } from 'react';
import { Smartphone, Send, RotateCcw, Check, PhoneCall, Radio } from 'lucide-react';
import { CommunityReport } from '../types';

interface UssdSimulatorProps {
  onUssdReportSubmitted: (report: CommunityReport) => void;
}

export const UssdSimulator: React.FC<UssdSimulatorProps> = ({ onUssdReportSubmitted }) => {
  const [ussdDial, setUssdDial] = useState('*788#');
  const [inSession, setInSession] = useState(false);
  const [screenText, setScreenText] = useState('');
  const [userInput, setUserInput] = useState('');
  const [sessionStep, setSessionStep] = useState<number>(0);
  const [collectedReport, setCollectedReport] = useState<{
    category: CommunityReport['category'];
    district: string;
    details: string;
  }>({
    category: 'Water shortage',
    district: 'Nyagatare',
    details: '',
  });

  const startSession = () => {
    if (ussdDial.trim() !== '*788#') {
      setScreenText('Connection Error: Invalid MMI code. Use *788# for Africa First Response Gateway.');
      setInSession(true);
      setSessionStep(-1);
      return;
    }
    setInSession(true);
    setSessionStep(1);
    setScreenText(
      `AFRICA FIRST CRISIS GATEWAY\n(MINEMA / AU Network)\n\n1. Report Water Outage\n2. Report Damaged Road / Bridge\n3. Report Flood / Emergency\n4. Check Local Recovery Mission\n5. Umuganda Community Works\n\nReply with number:`
    );
  };

  const handleInputSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim()) return;
    const input = userInput.trim();
    setUserInput('');

    if (sessionStep === 1) {
      if (input === '1') {
        setCollectedReport((prev) => ({ ...prev, category: 'Water shortage' }));
        setSessionStep(2);
        setScreenText(`REPORT WATER CRISIS\n\nSelect District:\n1. Nyagatare\n2. Rubavu\n3. Musanze\n4. Bugesera\n5. Other\n\nReply with number:`);
      } else if (input === '2') {
        setCollectedReport((prev) => ({ ...prev, category: 'Damaged road' }));
        setSessionStep(2);
        setScreenText(`REPORT ROAD DAMAGE\n\nSelect District:\n1. Nyagatare\n2. Rubavu\n3. Musanze\n4. Gakenke\n5. Other\n\nReply with number:`);
      } else if (input === '3') {
        setCollectedReport((prev) => ({ ...prev, category: 'Emergency situation' }));
        setSessionStep(2);
        setScreenText(`REPORT CRITICAL EMERGENCY\n\nSelect District:\n1. Rubavu (Sebeya Basin)\n2. Kisumu (Lake Basin)\n3. Goma Border Corridor\n4. Other\n\nReply with number:`);
      } else if (input === '4') {
        setSessionStep(10);
        setScreenText(`MISSION STATUS CHECK\n\nREC-MSN-089 (Sebeya River):\nProgress: 68% - Culverts & gabions installed.\nDetour open to light traffic.\n\n0. Back\n00. Exit`);
      } else {
        setSessionStep(11);
        setScreenText(`COMMUNITY ACTION\n\nNext National Umuganda:\nSaturday, Oct 31, 2026\nFocus: Soil erosion drainage cleaning.\n\n00. Exit`);
      }
    } else if (sessionStep === 2) {
      const districts = ['Nyagatare', 'Rubavu', 'Musanze', 'Bugesera', 'Other District'];
      const chosen = districts[parseInt(input, 10) - 1] || 'Rwanda Rural Sector';
      setCollectedReport((prev) => ({ ...prev, district: chosen }));
      setSessionStep(3);
      setScreenText(`LOCATION: ${chosen}\n\nEnter brief description of crisis (e.g. Pump broken 400 households without water):\n\nReply with text:`);
    } else if (sessionStep === 3) {
      const report: CommunityReport = {
        id: `USSD-${Math.floor(1000 + Math.random() * 9000)}`,
        reportedBy: 'USSD Citizen (+250 788 *** 291)',
        reporterType: 'Citizen',
        phoneMasked: '+250 788 *** 291',
        category: collectedReport.category,
        country: 'Rwanda',
        district: collectedReport.district,
        description: `[Via USSD *788#] ${input}`,
        timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16) + ' UTC',
        verifiedStatus: 'Pending Verification',
      };

      onUssdReportSubmitted(report);
      setSessionStep(4);
      setScreenText(`THANK YOU.\n\nYour report ${report.id} was securely recorded by the District Emergency Cell.\n\nReference: ${report.id}\nEmergency SMS dispatched.\n\nPress OK to exit.`);
    } else if (sessionStep === 10 || sessionStep === 11 || sessionStep === 4) {
      resetSession();
    }
  };

  const resetSession = () => {
    setInSession(false);
    setSessionStep(0);
    setScreenText('');
    setUserInput('');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 lg:p-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
              <span>Low-Connectivity & 2G GSM Infrastructure</span>
              <span aria-hidden="true">·</span>
              <span>USSD / SMS Shortcode Gateway (*788#)</span>
              <span aria-hidden="true">·</span>
              <span className="text-emerald-400 font-medium">Zero-Data Accessible</span>
            </div>
            <h1 className="text-xl lg:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              <Smartphone className="w-6 h-6 text-emerald-400" />
              USSD & Offline Citizen Gateway Simulator
            </h1>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
            <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
            <span>Cellular Base Station Protocol: GSM / USSD 2G</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        {/* Left Side: Explanatory Context */}
        <div className="md:col-span-6 bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-4 text-xs text-slate-300">
          <h3 className="text-sm font-bold text-white">Why USSD / Offline Channels Matter in Africa</h3>
          <p className="leading-relaxed">
            While urban capitals like Kigali, Nairobi, and Accra have robust 4G and 5G networks, rural agricultural sectors and disaster-stricken areas frequently face power cuts, damaged fiber lines, or low smartphone penetration.
          </p>
          <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
            <span className="font-bold text-emerald-400 block text-xs">Architectural Advantages:</span>
            <ul className="space-y-1.5 text-slate-300 list-disc list-inside">
              <li>Works on any basic $10 feature phone without data plans or internet.</li>
              <li>Operates over cellular signaling channels even in congested network zones.</li>
              <li>Direct integration with national emergency databases (MINEMA / WASAC).</li>
              <li>Enables Umudugudu (village leaders) to immediately broadcast localized crisis telemetry.</li>
            </ul>
          </div>
          <div className="p-3 bg-emerald-950/40 border border-emerald-500/30 rounded-lg text-emerald-300">
            Try dialing <span className="font-mono font-bold text-white">*788#</span> in the simulator on the right to test reporting a community water outage or road blockage!
          </div>
        </div>

        {/* Right Side: Virtual Phone Simulator */}
        <div className="md:col-span-6 flex justify-center">
          <div className="w-[320px] bg-slate-950 border-4 border-slate-700 rounded-[36px] p-4 shadow-2xl space-y-4">
            {/* Top Phone Earpiece */}
            <div className="w-16 h-1.5 bg-slate-800 rounded-full mx-auto" />

            {/* LCD Screen Container */}
            <div className="w-full h-[260px] bg-emerald-950/80 border-2 border-emerald-900 rounded-xl p-3 font-mono text-emerald-200 text-xs flex flex-col justify-between shadow-inner">
              <div className="flex items-center justify-between text-[10px] text-emerald-400 border-b border-emerald-900/80 pb-1">
                <span>AFRICA GSM · 2G</span>
                <span>*788#</span>
              </div>

              <div className="flex-1 py-2 overflow-y-auto whitespace-pre-line leading-tight text-[11px]">
                {inSession ? screenText : 'Ready.\n\nDial *788# to enter Africa First Emergency Gateway.'}
              </div>

              {inSession && sessionStep !== 4 && sessionStep !== -1 && (
                <form onSubmit={handleInputSubmit} className="pt-1 border-t border-emerald-900/80 flex gap-1">
                  <input
                    type="text"
                    autoFocus
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    placeholder="Enter choice..."
                    className="flex-1 bg-emerald-950 border border-emerald-700 text-emerald-100 text-xs px-2 py-1 rounded focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="px-2 py-1 bg-emerald-500 text-slate-950 font-bold text-[10px] rounded cursor-pointer"
                  >
                    Send
                  </button>
                </form>
              )}
            </div>

            {/* Keypad */}
            <div className="space-y-2">
              {!inSession ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={ussdDial}
                      onChange={(e) => setUssdDial(e.target.value)}
                      className="flex-1 bg-slate-900 border border-slate-800 rounded-lg p-2 text-center text-sm font-mono text-emerald-400 font-bold focus:outline-none"
                    />
                  </div>
                  <button
                    onClick={startSession}
                    className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <PhoneCall className="w-4 h-4" />
                    <span>Dial USSD *788#</span>
                  </button>
                </div>
              ) : (
                <button
                  onClick={resetSession}
                  className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-xl text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>End USSD Session</span>
                </button>
              )}
            </div>

            {/* Home Bar */}
            <div className="w-20 h-1 bg-slate-800 rounded-full mx-auto" />
          </div>
        </div>
      </div>
    </div>
  );
};
