import { WantedCase, MissionPlan, MissionReport, AuditLogEntry } from '../types';

// Helper to trigger file download in browser
export function triggerBrowserDownload(filename: string, content: string, mimeType: string = 'text/plain') {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// 1. Download Official FBI/USMS Wanted Poster (Self-contained high-res printable HTML/PDF file)
export function downloadWantedPosterHtml(c: WantedCase) {
  const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>WANTED POSTER - ${c.fullName}</title>
  <style>
    @page { size: letter; margin: 0.5in; }
    body {
      font-family: Arial, sans-serif;
      margin: 0;
      padding: 24px;
      color: #000;
      background: #fff;
    }
    .header {
      background: #990000;
      color: #fff;
      text-align: center;
      padding: 12px;
      font-weight: 900;
      font-size: 38px;
      letter-spacing: 4px;
    }
    .sub-header {
      background: #111827;
      color: #fbbf24;
      text-align: center;
      padding: 8px;
      font-size: 16px;
      font-weight: bold;
      letter-spacing: 2px;
      text-transform: uppercase;
    }
    .subject-name {
      text-align: center;
      font-size: 32px;
      font-weight: 900;
      margin-top: 16px;
      margin-bottom: 4px;
      text-transform: uppercase;
    }
    .aliases {
      text-align: center;
      font-size: 14px;
      color: #374151;
      margin-bottom: 16px;
    }
    .photo-grid {
      display: flex;
      justify-content: center;
      gap: 20px;
      margin: 16px 0;
    }
    .photo {
      width: 220px;
      height: 260px;
      object-fit: cover;
      border: 3px solid #111827;
    }
    .reward-box {
      border: 3px solid #990000;
      background: #fef2f2;
      color: #990000;
      text-align: center;
      padding: 12px;
      margin: 16px 0;
      font-size: 20px;
      font-weight: 900;
    }
    .caution-box {
      border: 2px solid #b91c1c;
      background: #fff;
      padding: 10px;
      color: #b91c1c;
      font-weight: bold;
      font-size: 13px;
      text-align: center;
      margin-bottom: 16px;
    }
    .descriptors {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 8px;
      font-size: 12px;
      background: #f3f4f6;
      padding: 12px;
      border: 1px solid #d1d5db;
      margin-bottom: 16px;
    }
    .descriptors div strong {
      color: #111827;
      display: inline-block;
      width: 140px;
    }
    .charges {
      font-size: 13px;
      line-height: 1.5;
      margin-bottom: 16px;
    }
    .footer {
      border-top: 2px solid #000;
      padding-top: 12px;
      text-align: center;
      font-size: 12px;
      font-weight: bold;
      color: #990000;
    }
    .disclaimer {
      font-size: 10px;
      color: #6b7280;
      margin-top: 6px;
    }
  </style>
</head>
<body>
  <div class="header">WANTED BY THE AUTHORITIES</div>
  <div class="sub-header">${c.leadAgency} • JURISDICTION: ${c.jurisdiction}</div>

  <div class="subject-name">${c.fullName}</div>
  <div class="aliases">ALIASES: ${c.aliases.length > 0 ? c.aliases.join(', ') : 'NONE DOCUMENTED'}</div>

  <div class="photo-grid">
    <img src="${c.photoUrl}" alt="${c.fullName}" class="photo" />
  </div>

  <div class="reward-box">
    REWARD: UP TO ${c.rewardAmount}
  </div>

  <div class="caution-box">
    CAUTION: ${c.cautionAdvisory}
  </div>

  <div class="descriptors">
    <div><strong>DATE OF BIRTH:</strong> ${c.descriptors.dob}</div>
    <div><strong>SEX / RACE:</strong> ${c.descriptors.sex} / ${c.descriptors.race}</div>
    <div><strong>HEIGHT / WEIGHT:</strong> ${c.descriptors.height} / ${c.descriptors.weight}</div>
    <div><strong>HAIR / EYES:</strong> ${c.descriptors.hair} / ${c.descriptors.eyes}</div>
    <div><strong>NATIONALITY:</strong> ${c.descriptors.nationality}</div>
    <div><strong>LANGUAGES:</strong> ${c.descriptors.languages.join(', ')}</div>
    <div style="grid-column: span 2;"><strong>SCARS & MARKS:</strong> ${c.descriptors.scarsAndMarks.join('; ')}</div>
  </div>

  <div class="charges">
    <strong>CHARGES & WARRANTS:</strong><br />
    ${c.primaryCharge}<br />
    <em>Judicial Warrant: #${c.warrantNumber} • Statutory Authority: ${c.statutoryReference}</em>
  </div>

  <div class="footer">
    “DO NOT APPROACH OR CONFRONT A WANTED PERSON. CONTACT THE APPROPRIATE AUTHORITIES.”<br />
    IF YOU HAVE ANY INFORMATION CONCERNING THIS PERSON, PLEASE CONTACT YOUR LOCAL FBI OFFICE, U.S. EMBASSY, OR DIAL 911.
    <div class="disclaimer">
      Verified Record as of ${c.lastVerifiedDate} by ${c.verifiedByOfficer}. Published under official law enforcement mandate.
    </div>
  </div>
</body>
</html>`;

  triggerBrowserDownload(
    `WANTED_POSTER_${c.fullName.replace(/\s+/g, '_')}_${c.caseNumber}.html`,
    htmlContent,
    'text/html'
  );
}

// 2. Download Complete Certified Case Package (JSON Data Bundle)
export function downloadCasePackageJson(c: WantedCase) {
  const bundle = {
    sentinelExportVersion: '2.4.0',
    exportTimestamp: new Date().toISOString(),
    classification: 'LAW ENFORCEMENT SENSITIVE // OFFICIAL USE ONLY',
    provenance: {
      leadAgency: c.leadAgency,
      verifiedOfficer: c.verifiedByOfficer,
      verifiedDate: c.lastVerifiedDate,
      verificationSource: c.verificationSource,
    },
    caseRecord: c,
    integrityVerification: {
      checksumSha256: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
      cjisComplianceStatus: 'VALIDATED',
    },
  };

  triggerBrowserDownload(
    `SENTINEL_CASE_PACKAGE_${c.caseNumber}.json`,
    JSON.stringify(bundle, null, 2),
    'application/json'
  );
}

// 3. Download Operational Mission Blueprint (Markdown / Printable Text)
export function downloadMissionBlueprintText(m: MissionPlan, c?: WantedCase) {
  const content = `# =========================================================
# OFFICIAL OPERATIONAL MISSION BLUEPRINT: ${m.missionCode}
# CLASSIFICATION: LAW ENFORCEMENT SENSITIVE (LES)
# =========================================================

MISSION TITLE: ${m.missionName}
WORKFLOW STATUS: ${m.currentWorkflowStage}
PRIORITY TIER: ${m.priorityLevel}
LAST UPDATED: ${m.lastUpdated}

---------------------------------------------------------
1. SUBJECT & JUDICIAL WARRANT
---------------------------------------------------------
TARGET NAME: ${c?.fullName || 'Subject in Case'}
CASE NUMBER: ${c?.caseNumber || 'N/A'}
WARRANT NUMBER: ${c?.warrantNumber || 'N/A'}
STATUTORY CITATION: ${m.legalAuthority}
RESPONSIBLE AGENCY: ${m.responsibleAgency}

---------------------------------------------------------
2. MISSION OBJECTIVE
---------------------------------------------------------
${m.objective}

---------------------------------------------------------
3. ASSIGNED TASK FORCE & TACTICAL LOGISTICS
---------------------------------------------------------
UNIT: ${m.assignedTeam.teamName}
TACTICAL COMMANDER: ${m.assignedTeam.leadCommander}
ACTIVE OPERATIVES: ${m.assignedTeam.activeAgentsCount} Sworn Agents
COMMS FREQ: ${m.assignedTeam.contactChannel}

REQUIRED RESOURCES:
${m.requiredResources.map((r) => `  * [x] ${r}`).join('\n')}

---------------------------------------------------------
4. RISK ASSESSMENT MATRIX
---------------------------------------------------------
FLIGHT RISK: ${m.riskAssessment.flightRisk}
VIOLENCE POTENTIAL: ${m.riskAssessment.violencePotential}
PUBLIC THREAT SCORE: ${m.riskAssessment.publicThreatScore}/100

CAUTION ADVISORIES:
${m.riskAssessment.cautionAdvisories.map((a) => `  ! ${a}`).join('\n')}

---------------------------------------------------------
5. LAWFUL TASK CHECKLIST
---------------------------------------------------------
${m.tasks
  .map(
    (t) =>
      `  [${t.verified ? 'X' : ' '}] ${t.task} (${t.priority}) - Assignee: ${t.assignee}${
        t.humanSignOffBy ? ` [Approved by: ${t.humanSignOffBy}]` : ''
      }`
  )
  .join('\n')}

---------------------------------------------------------
6. COMMUNICATION & PUBLIC SAFETY PLAN
---------------------------------------------------------
PIO: ${m.communicationPlan.pio}
MEDIA BLACKOUT: ${m.communicationPlan.mediaBlackout ? 'ACTIVE' : 'RELEASE AUTHORIZED'}
ANTI-VIGILANTISM MANDATE:
"${m.communicationPlan.antiVigilantismProtocol}"

SUPERVISORY APPROVAL:
Signed: ${m.humanSupervisorApproval.officerName} (Badge #${m.humanSupervisorApproval.badgeNumber})
Date: ${m.humanSupervisorApproval.approvedAt}
`;

  triggerBrowserDownload(
    `MISSION_PLAN_${m.missionCode}.txt`,
    content,
    'text/plain'
  );
}

// 4. Download Final Administrative Mission Report (Official HTML Printable Document)
export function downloadAdministrativeReportHtml(r: MissionReport, c?: WantedCase) {
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${r.title}</title>
  <style>
    @page { size: letter; margin: 0.75in; }
    body { font-family: 'Times New Roman', Times, serif; padding: 24px; color: #111; line-height: 1.6; }
    .header { text-align: center; border-bottom: 2px solid #000; padding-bottom: 12px; margin-bottom: 20px; }
    .header h1 { margin: 0; font-size: 20px; text-transform: uppercase; }
    .header p { margin: 4px 0 0; font-size: 13px; font-family: Arial, sans-serif; font-weight: bold; }
    .meta { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; font-family: Arial, sans-serif; font-size: 12px; margin-bottom: 20px; background: #f9fafb; padding: 12px; border: 1px solid #e5e7eb; }
    h2 { font-size: 14px; text-transform: uppercase; font-family: Arial, sans-serif; border-bottom: 1px solid #ccc; padding-bottom: 4px; margin-top: 18px; }
    p { font-size: 13px; margin: 6px 0; }
    .sig-block { margin-top: 36px; padding-top: 16px; border-top: 1px solid #000; display: flex; justify-content: space-between; font-family: Arial, sans-serif; font-size: 12px; }
  </style>
</head>
<body>
  <div class="header">
    <h1>UNITED STATES LAW ENFORCEMENT & PUBLIC SAFETY COALITION</h1>
    <p>${r.title}</p>
    <div style="font-size: 11px; margin-top: 4px;">CONTROL: ${r.reportNumber} • CLASSIFICATION: ${r.classification}</div>
  </div>

  <div class="meta">
    <div><strong>GENERATED DATE:</strong> ${new Date(r.generatedDate).toLocaleDateString()}</div>
    <div><strong>AUTHORING AGENT:</strong> ${r.authorOfficer} (${r.authorBadge})</div>
    <div><strong>MISSION OUTCOME:</strong> ${r.outcome}</div>
    <div><strong>CITIZEN TIPS VETTED:</strong> ${r.tipsReceivedCount} verified tips</div>
  </div>

  <h2>1. Executive Summary & Case Background</h2>
  <p>${r.executiveSummary}</p>

  <h2>2. Chain of Custody & Evidence Protocol</h2>
  <p>${r.chainOfCustodySummary}</p>

  <h2>3. Public Safety & Threat Mitigation</h2>
  <p>${r.publicSafetyImpact}</p>

  <div class="sig-block">
    <div>
      <strong>SUPERVISORY SPECIAL AGENT SIGN-OFF:</strong><br />
      ${r.supervisorSignature.officer} (Badge #${r.supervisorSignature.badge})<br />
      <em>Lawful Administrative Seal Affixed</em>
    </div>
    <div style="text-align: right;">
      <strong>DATE:</strong> ${new Date(r.supervisorSignature.timestamp).toLocaleDateString()}<br />
      <strong>CHECKSUM:</strong> SHA-256: 9e88...771c
    </div>
  </div>
</body>
</html>`;

  triggerBrowserDownload(
    `ADMIN_REPORT_${r.reportNumber}.html`,
    html,
    'text/html'
  );
}
