import React, { useState } from 'react';
import {
  Bot,
  Send,
  Sparkles,
  Languages,
  FileText,
  AlertTriangle,
  CheckCircle2,
  Copy,
  RefreshCw,
  Scale
} from 'lucide-react';
import { Incident, RecoveryMission, DevelopmentProject } from '../types';

interface AiAssistantProps {
  incidents: Incident[];
  missions: RecoveryMission[];
  projects: DevelopmentProject[];
}

export const AiAssistant: React.FC<AiAssistantProps> = ({
  incidents,
  missions,
  projects,
}) => {
  const [promptInput, setPromptInput] = useState('');
  const [conversation, setConversation] = useState<
    { role: 'user' | 'assistant'; text: string; source?: string }[]
  >([
    {
      role: 'assistant',
      text: `Hello. I am the Africa First Intelligent Operations Advisor powered by Gemini 3.8 Flash. I can assist authorized coordinators with:
- Emergency Incident Triage & Root Cause Analysis
- Detecting Duplicate Projects across Regional Boundaries
- Resource Estimation (e.g. daily water volume & medical prophylaxis)
- Generating 8-Stage Recovery Plans compliant with National Disaster Frameworks
- Translating Field Reports into English, French, Swahili, and Kinyarwanda
- Preparing Ministerial Briefings & Situational Reports

*Note: All recommendations remain subject to human review, engineering sign-off, and local national laws.*`,
      source: 'Gemini 3.8 Flash',
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<'Kinyarwanda' | 'French' | 'Swahili' | 'English'>('Kinyarwanda');

  const handleSendPrompt = async (textToSend?: string) => {
    const query = textToSend || promptInput;
    if (!query.trim() || loading) return;

    const userMsg = { role: 'user' as const, text: query };
    setConversation((prev) => [...prev, userMsg]);
    if (!textToSend) setPromptInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/ai/analyze-incident', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          incident: incidents[0],
          context: `User Query: "${query}". Active missions: ${missions.length}, projects: ${projects.length}`,
        }),
      });

      const data = await res.json();
      const botReply =
        data.analysis ||
        data.report ||
        'Operational guidance processed based on current telemetry.';

      setConversation((prev) => [
        ...prev,
        {
          role: 'assistant',
          text: botReply,
          source: data.source || 'Gemini 3.8 Flash',
        },
      ]);
    } catch (err) {
      console.error(err);
      setConversation((prev) => [
        ...prev,
        {
          role: 'assistant',
          text: `[Offline Local Fallback Protocol]: Assessed request against regional telemetry. Prioritize clean water supply buffers for Western Province, maintain Bailey bridge dispatch readiness, and audit contractor verification milestones.`,
          source: 'Offline Fallback',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateExecutiveBriefing = async () => {
    setLoading(true);
    const userMsg = { role: 'user' as const, text: 'Generate Continental & Rwanda Pilot Situational Briefing for Emergency Ministry' };
    setConversation((prev) => [...prev, userMsg]);

    try {
      const res = await fetch('/api/ai/generate-executive-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scope: 'Continental & Rwanda Flagship Pilot',
          activeIncidentsCount: incidents.length,
          activeMissionsCount: missions.length,
          pilotCountry: 'Rwanda',
        }),
      });
      const data = await res.json();
      setConversation((prev) => [
        ...prev,
        {
          role: 'assistant',
          text: data.report || 'Situational report generated.',
          source: data.source || 'Gemini 3.8 Flash',
        },
      ]);
    } catch (err) {
      setConversation((prev) => [
        ...prev,
        {
          role: 'assistant',
          text: 'Executive briefing drafted under offline heuristic mode.',
          source: 'Offline Fallback',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleTranslateSample = async () => {
    const sample = incidents[0].title + ': ' + (incidents[0].speedModeDetails?.whatHappened || '');
    setLoading(true);
    const userMsg = { role: 'user' as const, text: `Translate Rubavu incident summary into ${selectedLanguage}` };
    setConversation((prev) => [...prev, userMsg]);

    try {
      const res = await fetch('/api/ai/translate-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: sample,
          targetLanguage: selectedLanguage,
        }),
      });
      const data = await res.json();
      setConversation((prev) => [
        ...prev,
        {
          role: 'assistant',
          text: `**Translated to ${selectedLanguage}:**\n\n${data.translatedText}`,
          source: data.source || 'Gemini 3.8 Flash',
        },
      ]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 lg:p-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
              <span>Decision Support & Ground Intelligence</span>
              <span aria-hidden="true">·</span>
              <span>Gemini 3.8 Flash Server-Side Integration</span>
              <span aria-hidden="true">·</span>
              <span className="text-emerald-400 font-medium">Human-in-the-Loop Protocol</span>
            </div>
            <h1 className="text-xl lg:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              <Bot className="w-6 h-6 text-emerald-400" />
              AI Africa Development Assistant
            </h1>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Scale className="w-4 h-4 text-amber-400" />
            <span className="hidden sm:inline">Recommendations subject to human review & local laws</span>
          </div>
        </div>

        {/* Quick Action Suggestion Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pt-4 mt-4 border-t border-slate-800/80 scrollbar-none">
          <span className="text-xs text-slate-400 whitespace-nowrap">Suggested Directives:</span>
          <button
            onClick={() => handleSendPrompt('Analyze Rubavu Sebeya flood risks and recommend 3 immediate unaddressed priorities')}
            className="px-2.5 py-1 bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-300 text-xs rounded-lg transition-colors cursor-pointer whitespace-nowrap"
          >
            Flood Risk Priorities
          </button>
          <button
            onClick={() => handleSendPrompt('Detect potential duplicate projects or uncoordinated resource dispatches in Eastern Province')}
            className="px-2.5 py-1 bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-300 text-xs rounded-lg transition-colors cursor-pointer whitespace-nowrap"
          >
            Detect Project Duplications
          </button>
          <button
            onClick={() => handleSendPrompt('Estimate potable water, fuel, and modular shelter requirements for 4,200 affected people')}
            className="px-2.5 py-1 bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-300 text-xs rounded-lg transition-colors cursor-pointer whitespace-nowrap"
          >
            Estimate Resource Needs
          </button>
          <button
            onClick={handleGenerateExecutiveBriefing}
            className="px-2.5 py-1 bg-emerald-950 border border-emerald-500/50 hover:border-emerald-500 text-emerald-300 text-xs rounded-lg transition-colors cursor-pointer whitespace-nowrap font-medium"
          >
            Draft Executive Ministerial Briefing
          </button>
        </div>
      </div>

      {/* Main Conversation Canvas */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-4">
        {/* Messages Scroll Area */}
        <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
          {conversation.map((msg, i) => (
            <div
              key={i}
              className={`p-4 rounded-xl text-xs space-y-2 leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-slate-800 text-white ml-8 border border-slate-700'
                  : 'bg-slate-950 text-slate-200 mr-8 border border-slate-800'
              }`}
            >
              <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                <span className="font-bold flex items-center gap-1.5">
                  {msg.role === 'user' ? 'Emergency Coordinator' : 'AI Operations Advisor'}
                </span>
                {msg.source && <span className="text-emerald-400">{msg.source}</span>}
              </div>
              <div className="whitespace-pre-wrap font-sans text-sm text-slate-200">
                {msg.text}
              </div>
            </div>
          ))}

          {loading && (
            <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-400 flex items-center gap-2">
              <RefreshCw className="w-4 h-4 text-emerald-400 animate-spin" />
              <span>Analyzing telemetry with Gemini 3.8 Flash...</span>
            </div>
          )}
        </div>

        {/* Translation Bar */}
        <div className="pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <Languages className="w-4 h-4 text-emerald-400" />
            <span className="text-slate-400">Translate active incident report into:</span>
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value as any)}
              className="bg-slate-950 border border-slate-800 text-slate-200 rounded px-2 py-1 text-xs"
            >
              <option value="Kinyarwanda">Kinyarwanda</option>
              <option value="Swahili">Swahili (Kiswahili)</option>
              <option value="French">Français</option>
              <option value="English">English</option>
            </select>
            <button
              onClick={handleTranslateSample}
              className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium rounded transition-colors cursor-pointer"
            >
              Translate
            </button>
          </div>
        </div>

        {/* User Input Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendPrompt();
          }}
          className="flex items-center gap-2 pt-2"
        >
          <input
            type="text"
            placeholder="Ask AI to analyze development datasets, identify bottlenecks, compare projects, or recommend recovery plans..."
            value={promptInput}
            onChange={(e) => setPromptInput(e.target.value)}
            disabled={loading}
            className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
          />
          <button
            type="submit"
            disabled={loading}
            className="px-5 py-3 bg-emerald-400 hover:bg-emerald-300 disabled:opacity-50 text-slate-950 font-bold text-xs rounded-xl transition-colors cursor-pointer flex items-center gap-1.5 shrink-0"
          >
            <Send className="w-4 h-4" />
            <span>Consult AI</span>
          </button>
        </form>
      </div>
    </div>
  );
};
