import React, { useState } from 'react';
import {
  Bot,
  Sparkles,
  Send,
  ShieldAlert,
  UserCheck,
  FileText,
  ListChecks,
  Clock,
  HelpCircle,
  RefreshCw,
  Copy,
  CheckCircle2,
  ChevronRight,
} from 'lucide-react';
import { WantedCase, MissionPlan } from '../../types';
import {
  sendAssistantChatMessage,
  generateBriefingWithAi,
  generateQuestionChecklistWithAi,
} from '../../services/aiService';

interface AiAssistantViewProps {
  cases: WantedCase[];
  missions: MissionPlan[];
  initialCaseId?: string;
}

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  citations?: string[];
  timestamp: string;
}

export const AiAssistantView: React.FC<AiAssistantViewProps> = ({
  cases,
  missions,
  initialCaseId,
}) => {
  const [selectedCaseId, setSelectedCaseId] = useState<string>(
    initialCaseId || cases[0]?.id || ''
  );
  const [inputQuery, setInputQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content:
        'Greetings, Investigator. I am SENTINEL AI, your lawful mission assistant. I can synthesize authorized case intelligence, structure tactical briefings, compile witness questioning checklists, analyze chronological movements, and highlight intelligence discrepancies.\n\nEvery recommendation generated requires sworn human review prior to operational implementation.',
      citations: ['DOJ Guidelines for Electronic Case Management', 'NCIC Verification Protocol'],
      timestamp: new Date().toLocaleTimeString(),
    },
  ]);

  const activeCase = cases.find((c) => c.id === selectedCaseId) || cases[0];
  const activeMission = missions.find((m) => m.caseId === selectedCaseId);

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || inputQuery;
    if (!query.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      role: 'user',
      content: query.trim(),
      timestamp: new Date().toLocaleTimeString(),
    };

    const nextMessages = [...messages, userMsg];
    setMessages(nextMessages);
    if (!textToSend) setInputQuery('');
    setIsLoading(true);

    try {
      const response = await sendAssistantChatMessage(
        nextMessages.map((m) => ({ role: m.role, content: m.content })),
        activeCase,
        { mission: activeMission }
      );

      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: response.reply || 'Mission analysis completed.',
          citations: response.citations || ['Official Law Enforcement Intelligence Archive'],
          timestamp: new Date().toLocaleTimeString(),
        },
      ]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'An error occurred connecting to the intelligence server. Please review case files manually.',
          timestamp: new Date().toLocaleTimeString(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickPrompt = (promptType: string) => {
    if (!activeCase) return;

    if (promptType === 'BRIEFING') {
      handleSendMessage(`Prepare an official executive mission briefing for wanted subject ${activeCase.fullName} under warrant #${activeCase.warrantNumber}. Summarize active risks, jurisdiction, and priority directives.`);
    } else if (promptType === 'CHECKLIST') {
      handleSendMessage(`Generate a structured, constitutional interview and interrogation checklist for questioning a primary associate or witness regarding ${activeCase.fullName}.`);
    } else if (promptType === 'TIMELINE') {
      handleSendMessage(`Analyze the chronological timeline of events, last known sightings, and movements for ${activeCase.fullName}. Highlight critical gaps.`);
    } else if (promptType === 'GAPS') {
      handleSendMessage(`Identify missing evidence, outdated biometrics, or unverified documents requiring immediate human investigator action for case #${activeCase.caseNumber}.`);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-5 rounded-xl shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <Bot className="w-5 h-5 text-indigo-400" />
            <h1 className="text-xl sm:text-2xl font-black text-slate-100 tracking-tight">
              AI Mission Intelligence & Briefing Assistant
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            Gemini-powered investigative reasoning: summarize verified records, prepare tactical briefings, organize evidence references, and draft interview checklists.
          </p>
        </div>

        {/* Case Scope Selector */}
        <div className="flex items-center gap-2">
          <label className="text-xs font-mono text-slate-400 font-bold shrink-0">Case Context:</label>
          <select
            aria-label="Active case file context"
            value={selectedCaseId}
            onChange={(e) => setSelectedCaseId(e.target.value)}
            className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs font-mono text-indigo-300 font-bold focus:outline-none"
          >
            {cases.map((c) => (
              <option key={c.id} value={c.id}>
                {c.fullName} ({c.warrantNumber})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Mandatory Human Review Disclaimer Box */}
      <div className="bg-amber-950/40 border border-amber-700/60 rounded-xl p-4 flex items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3 text-amber-200">
          <UserCheck className="w-5 h-5 text-amber-400 shrink-0" />
          <div>
            <span className="font-mono font-bold uppercase block text-amber-400">
              MANDATORY HUMAN-IN-THE-LOOP REQUIREMENT:
            </span>
            <span>
              Every AI recommendation must be reviewed and approved by a qualified human investigator before operational dissemination or action.
            </span>
          </div>
        </div>
      </div>

      {/* Preset Action Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        <span className="text-slate-400 font-mono text-[11px] shrink-0">Quick Directives:</span>
        <button
          onClick={() => handleQuickPrompt('BRIEFING')}
          className="bg-slate-900 hover:bg-slate-800 text-indigo-200 border border-indigo-700/50 px-3 py-1.5 rounded-lg shrink-0 flex items-center gap-1.5 transition font-semibold"
        >
          <FileText className="w-3.5 h-3.5 text-indigo-400" />
          <span>Prepare Tactical Briefing</span>
        </button>

        <button
          onClick={() => handleQuickPrompt('CHECKLIST')}
          className="bg-slate-900 hover:bg-slate-800 text-emerald-200 border border-emerald-700/50 px-3 py-1.5 rounded-lg shrink-0 flex items-center gap-1.5 transition font-semibold"
        >
          <ListChecks className="w-3.5 h-3.5 text-emerald-400" />
          <span>Witness Interview Checklist</span>
        </button>

        <button
          onClick={() => handleQuickPrompt('TIMELINE')}
          className="bg-slate-900 hover:bg-slate-800 text-cyan-200 border border-cyan-700/50 px-3 py-1.5 rounded-lg shrink-0 flex items-center gap-1.5 transition font-semibold"
        >
          <Clock className="w-3.5 h-3.5 text-cyan-400" />
          <span>Analyze Timeline & Sightings</span>
        </button>

        <button
          onClick={() => handleQuickPrompt('GAPS')}
          className="bg-slate-900 hover:bg-slate-800 text-rose-200 border border-rose-700/50 px-3 py-1.5 rounded-lg shrink-0 flex items-center gap-1.5 transition font-semibold"
        >
          <HelpCircle className="w-3.5 h-3.5 text-rose-400" />
          <span>Audit Information Gaps</span>
        </button>
      </div>

      {/* Chat Display Interface */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg flex flex-col h-[580px]">
        
        {/* Messages Stream */}
        <div className="flex-1 p-5 overflow-y-auto space-y-4">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex flex-col ${
                msg.role === 'user' ? 'items-end' : 'items-start'
              }`}
            >
              <div
                className={`max-w-3xl rounded-xl p-4 text-xs sm:text-sm leading-relaxed shadow-sm ${
                  msg.role === 'user'
                    ? 'bg-amber-600 text-slate-950 font-medium ml-8'
                    : 'bg-slate-950 border border-slate-800 text-slate-200 mr-8'
                }`}
              >
                <div className="flex items-center justify-between text-[10px] font-mono mb-1.5 opacity-70">
                  <span className="font-bold uppercase tracking-wider">
                    {msg.role === 'user' ? 'Investigator Query' : 'SENTINEL AI Engine'}
                  </span>
                  <span>{msg.timestamp}</span>
                </div>

                <div className="whitespace-pre-wrap font-sans">
                  {msg.content}
                </div>

                {msg.citations && msg.citations.length > 0 && (
                  <div className="mt-3 pt-2 border-t border-slate-800/80 text-[10px] font-mono text-slate-400">
                    <span className="text-slate-500 font-bold block mb-0.5">AUTHORITY CITATIONS:</span>
                    <ul className="list-disc list-inside space-y-0.5">
                      {msg.citations.map((c, i) => (
                        <li key={i}>{c}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center gap-2 text-xs font-mono text-indigo-400 bg-slate-950 p-3 rounded-lg border border-slate-800 max-w-sm">
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              <span>Analyzing case intelligence records with Gemini...</span>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="p-3.5 bg-slate-950 border-t border-slate-800">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex gap-2"
          >
            <input
              type="text"
              placeholder={`Ask AI Mission Assistant about ${activeCase?.fullName || 'the active case'} (e.g. "Prepare interview checklist", "Compare warrants")...`}
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-3.5 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500 font-sans"
            />
            <button
              type="submit"
              disabled={isLoading || !inputQuery.trim()}
              className="bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold px-4 py-2.5 rounded-lg text-xs transition disabled:opacity-50 flex items-center gap-1.5 shrink-0"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Analyze</span>
            </button>
          </form>
        </div>

      </div>

    </div>
  );
};
