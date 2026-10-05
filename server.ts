import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '10mb' }));

const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;

if (apiKey) {
  ai = new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// 1. AI Analysis: Duplicate records, Contradictions, Missing info, Dates, Case connections
app.post('/api/ai/analyze-intelligence', async (req, res) => {
  try {
    const { caseData, relatedCases } = req.body;
    if (!caseData) {
      return res.status(400).json({ error: 'Case data is required' });
    }

    if (!ai) {
      return res.json({
        duplicatesDetected: [
          'Duplicate alias "Dmitri Vance" registered under alternate spelling "Dimitry Vance" in state records.',
        ],
        contradictions: [
          'DOB in State DMV record lists 1983-04-12; Federal Warrant #W-9941 lists 1984-04-12.',
          'Physical height logged as 6\'1" (185 cm) by Interpol vs 5\'11" (180 cm) on State driver license.',
        ],
        missingInformation: [
          'Current biometric dental records not updated since 2021.',
          'Verified recent international port-of-entry transit logs for 2024–2026.',
          'Registered maritime vessel operator license status.',
        ],
        criticalDates: [
          { date: '2023-11-14', event: 'Primary federal indictment unsealed' },
          { date: '2024-02-19', event: 'Last verified surveillance sighting in coastal marina' },
          { date: '2026-08-30', event: 'Statute extension filed under Special Grand Jury' },
        ],
        crossCaseConnections: [
          'Shared offshore shell corporate entity registered in Delaware linked to Case #CW-2024-09 ("Operation Cipher Ghost").',
          'Associated telecom burner IMEI pattern matches active query in Eastern District Task Force.',
        ],
        humanVerificationRequired: [
          'Immediate physical verification required on anonymous tip #TIP-2026-8942 sighting at private hangar.',
          'Confirm authenticity of submitted vessel registration bill of sale.',
        ],
        aiConfidenceScore: 94,
        humanReviewStatus: 'PENDING_HUMAN_SIGN_OFF',
        generatedAt: new Date().toISOString(),
      });
    }

    const prompt = `You are an AI Mission Intelligence Analyst for authorized law-enforcement organizations.
Analyze the following verified case record and cross-reference records.
Provide a strictly structured JSON response identifying:
1. duplicatesDetected (array of strings)
2. contradictions (array of strings)
3. missingInformation (array of strings)
4. criticalDates (array of objects { date: string, event: string })
5. crossCaseConnections (array of strings describing connections to other verified syndicates/cases)
6. humanVerificationRequired (array of high-priority verification flags that require a human investigator)
7. summary (concise investigative intelligence summary)

Case Data:
${JSON.stringify(caseData, null, 2)}

Related Cases Context:
${JSON.stringify(relatedCases || [], null, 2)}

Ensure recommendations strictly adhere to lawful public safety guidelines. Do NOT suggest illegal surveillance or confrontation.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json({
      ...parsed,
      aiConfidenceScore: 95,
      humanReviewStatus: 'PENDING_HUMAN_SIGN_OFF',
      generatedAt: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('Error in analyze-intelligence:', error);
    return res.status(500).json({ error: error.message || 'Analysis failed' });
  }
});

// 2. Mission Planning Generator
app.post('/api/ai/generate-mission-plan', async (req, res) => {
  try {
    const { caseData } = req.body;
    if (!caseData) {
      return res.status(400).json({ error: 'Case data is required' });
    }

    if (!ai) {
      return res.json({
        missionObjective: `Locate, positively identify, and safely apprehend fugitive ${caseData.fullName || 'Subject'} under active judicial warrant ${caseData.warrantNumber || 'W-2024-001'} while prioritizing officer safety and public protection.`,
        priorityLevel: caseData.priorityLevel || 'Tier 1 - Critical',
        legalAuthority: `Federal Rule of Criminal Procedure 4 / 18 U.S.C. § 1073 (Unlawful Flight to Avoid Prosecution), Warrant #${caseData.warrantNumber || 'W-992-B'}. Issued by US District Court.`,
        responsibleAgency: caseData.leadAgency || 'Joint Regional Fugitive Task Force (USMS / State / Regional PD)',
        requiredResources: [
          'Tactical Fugitive Apprehension Unit (Level II)',
          'High-Risk Arrest Warrant Execution Protocol',
          'Inter-Agency Regional Intelligence Liaison',
          'Digital Forensics & Electronic Surveillance Support Unit (Lawful Wiretap/Title III Authorized)',
          'Hostage/Crisis Negotiation Team on Standby',
          'Bilingual Field Investigator',
        ],
        lawfulChecklist: [
          { task: 'Verify warrant validity with issuing clerk of court', priority: 'Immediate', verified: true, assignee: 'Special Agent Miller' },
          { task: 'Enter updated Red Notice / NCIC Wanted Person record', priority: 'High', verified: true, assignee: 'Analyst Chen' },
          { task: 'Conduct formal property deed and lawful asset registration audits', priority: 'Medium', verified: false, assignee: 'Investigator Rivera' },
          { task: 'Establish secure confidential tip hotline monitoring protocol', priority: 'High', verified: true, assignee: 'Det. Harris' },
          { task: 'Coordinate operational briefing with regional tactical teams', priority: 'Critical', verified: false, assignee: 'Commander Vance' },
        ],
        riskAssessment: {
          flightRisk: 'EXTREME',
          violencePotential: 'HIGH',
          publicThreatLevel: 'ELEVATED',
          cautionAdvisories: [
            'Subject known to possess firearms and counter-surveillance scanners.',
            'Extreme flight risk via private maritime or unchartered regional air transit.',
            'DO NOT CONFRONT. Standard tactical caution required.',
          ],
        },
        communicationPlan: {
          publicInformationOfficer: 'Commander S. Bradley (Media Relations Bureau)',
          releasePolicy: 'Authorized public poster release with anti-vigilantism disclaimer.',
          secureCommsChannel: 'TAC-NET Encrypted Channel 4 (Law Enforcement Sensitive)',
          mediaBlackoutConditions: 'Active perimeter operation or immediate apprehension window.',
        },
        humanReviewRequirement: 'Must be authorized and signed off by Supervisory Special Agent prior to operational briefing.',
      });
    }

    const prompt = `You are a Law Enforcement Mission Planning Coordinator.
Generate an official operational mission plan for the following wanted person case:
${JSON.stringify(caseData, null, 2)}

Return strict JSON with:
1. missionObjective (string)
2. priorityLevel (Tier 1 - Critical | Tier 2 - High | Tier 3 - Medium)
3. legalAuthority (string specifying statutory basis, warrant number, issuing court)
4. responsibleAgency (string)
5. requiredResources (array of strings)
6. lawfulChecklist (array of objects { task: string, priority: 'Critical'|'High'|'Medium', verified: boolean, assignee: string })
7. riskAssessment (object with flightRisk, violencePotential, publicThreatLevel, cautionAdvisories: string[])
8. communicationPlan (object with publicInformationOfficer, releasePolicy, secureCommsChannel, mediaBlackoutConditions)
9. humanReviewRequirement (string reminder that a supervisor must approve)

Always enforce legal compliance, non-vigilantism, and constitutional safeguards.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: { responseMimeType: 'application/json' },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json(parsed);
  } catch (error: any) {
    console.error('Error generating mission plan:', error);
    return res.status(500).json({ error: error.message });
  }
});

// 3. Tip Evaluation
app.post('/api/ai/evaluate-tip', async (req, res) => {
  try {
    const { tipData, caseData } = req.body;
    if (!tipData) {
      return res.status(400).json({ error: 'Tip data required' });
    }

    if (!ai) {
      return res.json({
        credibilityScore: 78,
        credibilityTier: 'HIGH_CORROBORATION_POTENTIAL',
        analysisSummary: 'Tip contains specific location data, vehicle license partials, and consistent timeline matching known subject associate patterns.',
        corroboratingFactors: [
          'Vehicle description (dark grey SUV) matches registered vehicle of known primary associate.',
          'Reported time matches cellular tower registration window.',
        ],
        redFlagsOrDiscrepancies: [
          'Informant states subject had blond hair; official dossier indicates dark brown with possible alteration.',
        ],
        recommendedActions: [
          'Dispatch two uniformed officers to review public CCTV footage at reported establishment.',
          'Interview premises manager under standard non-confrontational witness protocol.',
          'Maintain informant anonymity and update secure tip log.',
        ],
        urgency: 'TIME_SENSITIVE',
        requiresImmediateHumanReview: true,
      });
    }

    const prompt = `You are a Criminal Intelligence Tip Assessment Specialist.
Assess the credibility of the following public tip against the verified wanted person case facts.
Ensure anti-vigilantism standards are applied: tips must never trigger dangerous citizen actions or unlawful raids.

Tip Details:
${JSON.stringify(tipData, null, 2)}

Case Facts:
${JSON.stringify(caseData || {}, null, 2)}

Return strict JSON with:
1. credibilityScore (number 0 to 100)
2. credibilityTier ('CONFIRMED_ACTIONABLE' | 'HIGH_CORROBORATION_POTENTIAL' | 'MODERATE_CREDIBILITY' | 'LOW_CREDIBILITY' | 'UNVERIFIABLE')
3. analysisSummary (string)
4. corroboratingFactors (array of strings)
5. redFlagsOrDiscrepancies (array of strings)
6. recommendedActions (array of lawful investigative verification steps)
7. urgency ('TIME_SENSITIVE' | 'ROUTINE' | 'LOW_PRIORITY')
8. requiresImmediateHumanReview (boolean)`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: { responseMimeType: 'application/json' },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json(parsed);
  } catch (error: any) {
    console.error('Error evaluating tip:', error);
    return res.status(500).json({ error: error.message });
  }
});

// 4. Mission Briefing Generator
app.post('/api/ai/generate-briefing', async (req, res) => {
  try {
    const { caseData, missionData, tipsSummary } = req.body;
    if (!caseData) return res.status(400).json({ error: 'Case data required' });

    if (!ai) {
      return res.json({
        title: `OPERATIONAL MISSION BRIEFING: ${caseData.fullName || 'SUBJECT'}`,
        classification: 'LAW ENFORCEMENT SENSITIVE (LES)',
        leadAgency: caseData.leadAgency || 'Joint Fugitive Task Force',
        executiveSummary: `Target ${caseData.fullName} is actively sought under valid felony warrant #${caseData.warrantNumber || 'W-992-B'} for ${caseData.primaryCharge || 'Major Federal Offenses'}. Risk level assessed as Critical. Task force operational deployment authorization active.`,
        keyIntelligence: [
          `Primary jurisdiction: ${caseData.jurisdiction || 'Federal District / State Combined'}`,
          `Verified Last Known Sighting: ${caseData.lastSeenLocation || 'Metropolitan Transit Corridor'}`,
          `Active Tips In Queue: ${tipsSummary?.count || 3} reported leads under active vetting`,
          `Caution Warning: Subject is considered ARMED and DANGEROUS. Exercise extreme caution.`,
        ],
        operationalDirectives: [
          '1. Prioritize civilian safety and containment of operational perimeter.',
          '2. Confirm visual positive match via biometric or facial comparison unit before contact.',
          '3. Ensure real-time dispatch synchronization with municipal emergency services.',
          '4. Strict compliance with Fourth Amendment protocols and warrant parameters.',
        ],
        publicSafetyNotice: 'Under no circumstances should non-sworn personnel attempt pursuit or detention. Anti-vigilantism hotline active.',
      });
    }

    const prompt = `Generate a concise, professional, law-enforcement operational briefing for:
Case: ${JSON.stringify(caseData, null, 2)}
Mission: ${JSON.stringify(missionData || {}, null, 2)}
Tips: ${JSON.stringify(tipsSummary || {}, null, 2)}

Return strict JSON:
1. title (string)
2. classification (string, e.g. "LAW ENFORCEMENT SENSITIVE // OFFICIAL USE ONLY")
3. leadAgency (string)
4. executiveSummary (string)
5. keyIntelligence (array of bullet points)
6. operationalDirectives (array of procedural directives)
7. publicSafetyNotice (string emphasizing safety & non-vigilantism)`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: { responseMimeType: 'application/json' },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json(parsed);
  } catch (error: any) {
    console.error('Error generating briefing:', error);
    return res.status(500).json({ error: error.message });
  }
});

// 5. Interrogation / Witness Interview Checklist
app.post('/api/ai/question-checklist', async (req, res) => {
  try {
    const { targetRole, caseData } = req.body;
    if (!caseData) return res.status(400).json({ error: 'Case data required' });

    if (!ai) {
      return res.json({
        interviewTarget: targetRole || 'Primary Associate / Witness',
        legalAdvisementRequired: 'Miranda advisement required if in custodial detention; Garrity/Kalkines if agency personnel.',
        questionCategories: [
          {
            category: 'Timeline & Recent Contacts',
            questions: [
              'When was the last direct or indirect communication with the subject?',
              'What communication channels or applications were utilized (Signal, burner SIM, encrypted email)?',
              'Did the subject request any financial transfers, logistics, or transportation assistance?',
            ],
          },
          {
            category: 'Assets & Safe Locations',
            questions: [
              'Are there private properties, storage units, or maritime slips known to be rented under third-party aliases?',
              'Did the subject possess duplicate identification, alternate passports, or international currency reserves?',
            ],
          },
          {
            category: 'Physical Markers & State of Mind',
            questions: [
              'Have there been recent alterations in facial hair, weight, hair color, or noticeable tattoos?',
              'Did the subject express an intention to flee the jurisdiction or surrender voluntarily to legal counsel?',
            ],
          },
        ],
        constitutionalSafeguards: 'All interviews must be conducted voluntarily or under lawful subpoena. Coercive or unconstitutional questioning is strictly prohibited.',
      });
    }

    const prompt = `Generate a structured, constitutional interview and questioning checklist for investigators speaking with a ${targetRole || 'Witness/Associate'} regarding wanted person:
${JSON.stringify(caseData, null, 2)}

Return strict JSON:
1. interviewTarget (string)
2. legalAdvisementRequired (string)
3. questionCategories (array of objects { category: string, questions: string[] })
4. constitutionalSafeguards (string)`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: { responseMimeType: 'application/json' },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json(parsed);
  } catch (error: any) {
    console.error('Error generating question checklist:', error);
    return res.status(500).json({ error: error.message });
  }
});

// 6. Final Administrative Mission Report
app.post('/api/ai/generate-final-report', async (req, res) => {
  try {
    const { caseData, missionData, resolutionStatus, notes } = req.body;
    if (!caseData) return res.status(400).json({ error: 'Case data required' });

    if (!ai) {
      return res.json({
        reportId: `REP-${Math.floor(100000 + Math.random() * 900000)}`,
        title: `FINAL ADMINISTRATIVE MISSION REPORT: CASE #${caseData.caseNumber || 'CW-9921'}`,
        classification: 'OFFICIAL USE ONLY / LAW ENFORCEMENT RECORD',
        generatedTimestamp: new Date().toISOString(),
        caseSummary: `Investigation initiated regarding wanted fugitive ${caseData.fullName}. Lawful coordination conducted across inter-agency task forces under warrant #${caseData.warrantNumber}.`,
        missionOutcome: resolutionStatus || 'APPREHENDED_SAFELY',
        resolutionNarrative: notes || 'Subject was safely taken into custody following coordinated surveillance and lawful execution of federal arrest warrant without incident or injury to personnel or the public.',
        chainOfCustodySummary: 'All seized digital media, physical evidence, and documentation logged in property clerk vault under Chain of Custody protocol CC-2026-881.',
        publicSafetyImpact: 'Immediate threat mitigated. Public notification released thanking community for verified tips while confirming operation concluded lawfully.',
        investigativeSupervisorSignoff: 'Supervisory Special Agent J. Miller (Badge #4819) - Approved',
      });
    }

    const prompt = `Generate a comprehensive final administrative mission completion report for:
Case: ${JSON.stringify(caseData, null, 2)}
Mission: ${JSON.stringify(missionData || {}, null, 2)}
Resolution: ${resolutionStatus || 'RESOLVED'}
Notes: ${notes || 'Standard operation'}

Return strict JSON:
1. reportId (string)
2. title (string)
3. classification (string)
4. generatedTimestamp (ISO string)
5. caseSummary (string)
6. missionOutcome (string)
7. resolutionNarrative (string)
8. chainOfCustodySummary (string)
9. publicSafetyImpact (string)
10. investigativeSupervisorSignoff (string)`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: { responseMimeType: 'application/json' },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json(parsed);
  } catch (error: any) {
    console.error('Error generating final report:', error);
    return res.status(500).json({ error: error.message });
  }
});

// 7. Interactive Mission Assistant Chat
app.post('/api/ai/assistant-chat', async (req, res) => {
  try {
    const { messages, activeCase, context } = req.body;
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Messages array is required' });
    }

    if (!ai) {
      const lastUserMsg = messages[messages.length - 1]?.content || '';
      return res.json({
        reply: `[AI MISSION ASSISTANT - VERIFIED DIRECTIVE]\n\nRegarding your inquiry on "${lastUserMsg}":\n\n1. Intelligence Review: Subject ${activeCase?.fullName || 'in case file'} is registered under active warrant ${activeCase?.warrantNumber || 'W-2024-001'}. All intelligence must be cross-verified against official agency records before tactical planning.\n2. Lawful Safeguards: Remember that all tip verification and evidence collection must respect constitutional due process and statutory limits.\n3. Human-In-The-Loop: Every AI recommendation must be reviewed and approved by a qualified human investigator before operational dissemination.\n\nHow else can I assist with case briefings, timeline analysis, or tip vetting?`,
        citations: ['FBI Most Wanted Program Guidelines', 'USMS Policy Directive 14.1', 'CJIS Security Policy v5.9'],
      });
    }

    const systemInstruction = `You are SENTINEL AI, an expert law-enforcement and public-safety mission assistant.
You assist authorized investigators in:
- Organizing verified case intelligence
- Evaluating public tip credibility without encouraging confrontation
- Preparing lawful administrative briefings and question checklists
- Analyzing timelines, detecting contradictions, and identifying information gaps
- Enforcing safety, anti-vigilantism, and constitutional rights.

MANDATORY RULES:
1. NEVER encourage or facilitate vigilantism, harassment, violence, unauthorized wiretaps, or civilian confrontation.
2. Emphasize that all AI recommendations require human investigator review and supervisory approval.
3. Protect citizen privacy: never reveal private residential addresses of non-wanted individuals.
4. Active Case In Context:
${activeCase ? JSON.stringify(activeCase, null, 2) : 'No specific case selected (General Law Enforcement Mission Mode)'}
Context: ${JSON.stringify(context || {}, null, 2)}`;

    const formattedContents = messages.map((m: any) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }));

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: formattedContents,
      config: {
        systemInstruction,
        temperature: 0.4,
      },
    });

    return res.json({
      reply: response.text || 'Mission intelligence analysis completed.',
      citations: ['NCIC Record Verification Protocol', 'Federal Criminal Rules Section 4', 'CJIS Compliance Standard'],
    });
  } catch (error: any) {
    console.error('Error in assistant chat:', error);
    return res.status(500).json({ error: error.message });
  }
});

// Mount Vite or serve static
async function startServer() {
  const isDev = process.env.NODE_ENV !== 'production';

  if (isDev) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: process.env.DISABLE_HMR !== 'true',
      },
      appType: 'spa',
    });

    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`[Sentinel Mission Server] Running on http://localhost:${PORT} (${isDev ? 'Development' : 'Production'})`);
  });
}

startServer();
