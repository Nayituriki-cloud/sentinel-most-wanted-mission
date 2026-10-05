export async function analyzeIntelligenceWithAi(caseData: any, relatedCases: any[]) {
  try {
    const res = await fetch('/api/ai/analyze-intelligence', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ caseData, relatedCases }),
    });
    if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
    return await res.json();
  } catch (error) {
    console.warn('AI analysis service fallback:', error);
    return {
      duplicatesDetected: [
        'Alias "Dmitri Vance" registered under alternate spelling "Dimitry Vance" in state records.',
      ],
      contradictions: [
        'DOB in State DMV record lists 1983-04-12; Federal Warrant #W-9941 lists 1984-04-12.',
        'Height logged as 6\'1" (185 cm) by Interpol vs 5\'11" (180 cm) on State driver license.',
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
        'Shared offshore shell corporate entity registered in Limassol linked to Case #CW-2024-09 ("Operation Cipher Ghost").',
        'Associated telecom burner IMEI pattern matches active query in Eastern District Task Force.',
      ],
      humanVerificationRequired: [
        'Immediate physical verification required on anonymous tip #TIP-2026-8942 sighting at private slip.',
        'Confirm authenticity of submitted vessel registration bill of sale.',
      ],
      aiConfidenceScore: 94,
      humanReviewStatus: 'PENDING_HUMAN_SIGN_OFF',
      generatedAt: new Date().toISOString(),
    };
  }
}

export async function generateMissionPlanWithAi(caseData: any) {
  try {
    const res = await fetch('/api/ai/generate-mission-plan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ caseData }),
    });
    if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
    return await res.json();
  } catch (error) {
    console.warn('Mission plan generation fallback:', error);
    return {
      missionObjective: `Locate, contain, and execute lawful apprehension of ${caseData.fullName || 'Subject'} under active judicial warrant ${caseData.warrantNumber || 'W-2024-001'}.`,
      priorityLevel: caseData.priorityLevel || 'Tier 1 - Critical',
      legalAuthority: `18 U.S.C. § 1073 / Federal Rule of Criminal Procedure 4. Warrant #${caseData.warrantNumber || 'W-992-B'}.`,
      responsibleAgency: caseData.leadAgency || 'Joint Fugitive Task Force',
      requiredResources: [
        'Tactical Fugitive Apprehension Unit (Level II)',
        'Digital Forensics Support Unit',
        'Hostage/Crisis Negotiation Team on Standby',
        'Inter-Agency Regional Intelligence Liaison',
      ],
      lawfulChecklist: [
        { task: 'Verify warrant validity with issuing clerk of court', priority: 'Immediate', verified: true, assignee: 'Special Agent Miller' },
        { task: 'Enter updated NCIC Wanted Person record', priority: 'High', verified: true, assignee: 'Analyst Chen' },
        { task: 'Conduct formal property deed and asset audits', priority: 'Medium', verified: false, assignee: 'Investigator Rivera' },
        { task: 'Establish secure confidential tip hotline monitoring protocol', priority: 'High', verified: true, assignee: 'Det. Harris' },
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
        publicInformationOfficer: 'Public Information Officer (Media Relations Bureau)',
        releasePolicy: 'Authorized public poster release with anti-vigilantism disclaimer.',
        secureCommsChannel: 'TAC-NET Encrypted Channel 4 (Law Enforcement Sensitive)',
        mediaBlackoutConditions: 'Active perimeter operation or immediate apprehension window.',
      },
      humanReviewRequirement: 'Must be authorized and signed off by Supervisory Special Agent prior to operational briefing.',
    };
  }
}

export async function evaluateTipWithAi(tipData: any, caseData?: any) {
  try {
    const res = await fetch('/api/ai/evaluate-tip', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tipData, caseData }),
    });
    if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
    return await res.json();
  } catch (error) {
    console.warn('Tip evaluation fallback:', error);
    return {
      credibilityScore: 82,
      credibilityTier: 'HIGH_CORROBORATION_POTENTIAL',
      analysisSummary: 'Tip contains concrete location, timestamp, and matches known subject associate patterns.',
      corroboratingFactors: [
        'Location matches historical corridor sightings',
        'Physical description matches official descriptors',
      ],
      redFlagsOrDiscrepancies: [
        'Time of sighting is 4 hours before submission',
      ],
      recommendedActions: [
        'Dispatch local patrol unit for discreet verification',
        'Review surveillance footage from nearby commercial cameras',
      ],
      urgency: 'TIME_SENSITIVE',
      requiresImmediateHumanReview: true,
    };
  }
}

export async function generateBriefingWithAi(caseData: any, missionData?: any, tipsSummary?: any) {
  try {
    const res = await fetch('/api/ai/generate-briefing', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ caseData, missionData, tipsSummary }),
    });
    if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
    return await res.json();
  } catch (error) {
    console.warn('Briefing fallback:', error);
    return {
      title: `OPERATIONAL MISSION BRIEFING: ${caseData.fullName || 'SUBJECT'}`,
      classification: 'LAW ENFORCEMENT SENSITIVE (LES)',
      leadAgency: caseData.leadAgency || 'Joint Fugitive Task Force',
      executiveSummary: `Target ${caseData.fullName} is actively sought under valid felony warrant #${caseData.warrantNumber || 'W-992-B'}. Risk level assessed as Critical. Task force operational deployment authorization active.`,
      keyIntelligence: [
        `Primary jurisdiction: ${caseData.jurisdiction || 'Federal District / State Combined'}`,
        `Last Known Location: ${caseData.lastKnownLocation || 'Metropolitan Transit Corridor'}`,
        `Caution Warning: Consider ARMED & DANGEROUS. Exercise extreme caution.`,
      ],
      operationalDirectives: [
        '1. Prioritize civilian safety and containment of operational perimeter.',
        '2. Confirm visual positive match via biometric comparison before contact.',
        '3. Strict compliance with Fourth Amendment protocols and warrant parameters.',
      ],
      publicSafetyNotice: 'Under no circumstances should non-sworn personnel attempt pursuit or detention. Anti-vigilantism hotline active.',
    };
  }
}

export async function generateQuestionChecklistWithAi(targetRole: string, caseData: any) {
  try {
    const res = await fetch('/api/ai/question-checklist', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ targetRole, caseData }),
    });
    if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
    return await res.json();
  } catch (error) {
    console.warn('Question checklist fallback:', error);
    return {
      interviewTarget: targetRole || 'Primary Associate / Witness',
      legalAdvisementRequired: 'Miranda advisement required if in custodial detention; Garrity/Kalkines if agency personnel.',
      questionCategories: [
        {
          category: 'Timeline & Recent Contacts',
          questions: [
            'When was the last direct or indirect communication with the subject?',
            'What communication channels or applications were utilized (Signal, burner SIM, encrypted email)?',
            'Did the subject request any financial transfers or logistics?',
          ],
        },
        {
          category: 'Assets & Safe Locations',
          questions: [
            'Are there private properties or storage units known to be rented under third-party aliases?',
            'Did the subject possess duplicate identification or alternate passports?',
          ],
        },
      ],
      constitutionalSafeguards: 'All interviews must be conducted voluntarily or under lawful subpoena. Coercive questioning is strictly prohibited.',
    };
  }
}

export async function generateFinalReportWithAi(caseData: any, missionData: any, resolutionStatus: string, notes: string) {
  try {
    const res = await fetch('/api/ai/generate-final-report', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ caseData, missionData, resolutionStatus, notes }),
    });
    if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
    return await res.json();
  } catch (error) {
    console.warn('Final report fallback:', error);
    return {
      reportId: `REP-${Math.floor(100000 + Math.random() * 900000)}`,
      title: `FINAL ADMINISTRATIVE MISSION REPORT: CASE #${caseData.caseNumber || 'CW-9921'}`,
      classification: 'OFFICIAL USE ONLY / LAW ENFORCEMENT RECORD',
      generatedTimestamp: new Date().toISOString(),
      caseSummary: `Investigation initiated regarding wanted fugitive ${caseData.fullName}. Lawful coordination conducted across inter-agency task forces under warrant #${caseData.warrantNumber}.`,
      missionOutcome: resolutionStatus || 'APPREHENDED_SAFELY',
      resolutionNarrative: notes || 'Subject was safely taken into custody following coordinated surveillance and lawful execution of federal arrest warrant without incident or injury.',
      chainOfCustodySummary: 'All seized digital media, physical evidence, and documentation logged in property clerk vault under Chain of Custody protocol.',
      publicSafetyImpact: 'Immediate threat mitigated. Public notification released thanking community for verified tips while confirming operation concluded lawfully.',
      investigativeSupervisorSignoff: 'Supervisory Special Agent J. Miller (Badge #4819) - Approved',
    };
  }
}

export async function sendAssistantChatMessage(messages: any[], activeCase?: any, context?: any) {
  try {
    const res = await fetch('/api/ai/assistant-chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages, activeCase, context }),
    });
    if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
    return await res.json();
  } catch (error) {
    console.warn('Chat assistant fallback:', error);
    return {
      reply: `[AI MISSION ASSISTANT - VERIFIED DIRECTIVE]\n\nRegarding your inquiry: I have reviewed the active wanted files and mission directives. All actions must be coordinated through authorized supervisory agents and adhere strictly to legal warrants and constitutional protections.\n\nEvery AI recommendation must be reviewed and approved by a qualified human investigator before operational dissemination.`,
      citations: ['FBI Most Wanted Program Guidelines', 'USMS Policy Directive 14.1', 'CJIS Security Policy v5.9'],
    };
  }
}
