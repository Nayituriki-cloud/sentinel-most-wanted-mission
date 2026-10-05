export type PriorityLevel = 'Tier 1 - Critical' | 'Tier 2 - High' | 'Tier 3 - Medium';

export type MissionStatus = 
  | 'CASE_RECEIVED'
  | 'SOURCE_VERIFIED'
  | 'RISK_ASSESSED'
  | 'MISSION_CREATED'
  | 'TEAM_ASSIGNED'
  | 'TIPS_COLLECTED'
  | 'HUMAN_REVIEW'
  | 'LAWFUL_ACTION'
  | 'CASE_RESOLVED'
  | 'FINAL_REPORT_FILED';

export interface WantedCase {
  id: string;
  caseNumber: string;
  warrantNumber: string;
  fullName: string;
  aliases: string[];
  photoUrl: string;
  additionalPhotos?: string[];
  priorityLevel: PriorityLevel;
  primaryCharge: string;
  statutoryReference: string;
  jurisdiction: string;
  leadAgency: string;
  cooperatingAgencies: string[];
  warrantIssuingCourt: string;
  issuingJudge: string;
  dateWarrantIssued: string;
  lastVerifiedDate: string;
  verifiedByOfficer: string;
  verificationSource: string;
  rewardAmount: string;
  status: 'ACTIVE_HUNT' | 'LOCATED_SURVEILLANCE' | 'APPREHENDED' | 'EXTRADITION_PENDING';
  
  // Physical Descriptors
  descriptors: {
    sex: string;
    race: string;
    dob: string;
    age: number;
    height: string;
    weight: string;
    hair: string;
    eyes: string;
    scarsAndMarks: string[];
    languages: string[];
    nationality: string;
  };

  // Case background & intelligence
  summary: string;
  cautionAdvisory: string;
  lastKnownLocation: string;
  associatedVehicles?: string[];
  knownAssociates?: string[];
  flightRiskAssessment: 'EXTREME' | 'HIGH' | 'MODERATE';
  weaponsCaution: boolean;
  officialDocuments: {
    id: string;
    title: string;
    type: 'INDICTMENT' | 'WARRANT' | 'RED_NOTICE' | 'BALLISTICS' | 'FINANCIAL_SUBPOENA';
    issuedDate: string;
    documentRef: string;
    verified: boolean;
  }[];
}

export interface LawfulTaskItem {
  id: string;
  task: string;
  priority: 'Critical' | 'High' | 'Medium' | 'Routine';
  verified: boolean;
  assignee: string;
  dueStage: string;
  completedAt?: string;
  humanSignOffBy?: string;
  notes?: string;
}

export interface MissionPlan {
  id: string;
  caseId: string;
  missionCode: string;
  missionName: string;
  currentWorkflowStage: MissionStatus;
  objective: string;
  priorityLevel: PriorityLevel;
  legalAuthority: string;
  responsibleAgency: string;
  assignedTeam: {
    teamName: string;
    leadCommander: string;
    activeAgentsCount: number;
    contactChannel: string;
  };
  requiredResources: string[];
  riskAssessment: {
    flightRisk: 'EXTREME' | 'HIGH' | 'MODERATE';
    violencePotential: 'HIGH' | 'ELEVATED' | 'LOW';
    publicThreatScore: number; // 0-100
    cautionAdvisories: string[];
  };
  communicationPlan: {
    pio: string;
    publicReleaseAuthorized: boolean;
    mediaBlackout: boolean;
    encryptedFreq: string;
    antiVigilantismProtocol: string;
  };
  tasks: LawfulTaskItem[];
  progressPercent: number;
  lastUpdated: string;
  humanSupervisorApproval: {
    approved: boolean;
    officerName?: string;
    badgeNumber?: string;
    approvedAt?: string;
  };
}

export interface PublicTip {
  id: string;
  referenceNumber: string; // e.g. TIP-2026-8942-X
  caseId?: string;
  targetSubjectName?: string;
  submittedAt: string;
  isAnonymous: boolean;
  tipsterContact?: string;
  locationReported: {
    city: string;
    stateOrRegion: string;
    landmarkDescription: string;
  };
  sightingDateTime: string;
  detailedDescription: string;
  attachments: {
    id: string;
    name: string;
    type: 'PHOTO' | 'DOCUMENT' | 'VEHICLE_LOG';
    size: string;
  }[];
  credibilityScore: number; // 0 to 100
  credibilityTier: 'CONFIRMED_ACTIONABLE' | 'HIGH_CORROBORATION_POTENTIAL' | 'MODERATE_CREDIBILITY' | 'LOW_CREDIBILITY' | 'UNVERIFIABLE';
  status: 'PENDING_REVIEW' | 'CORROBORATED' | 'INVESTIGATING' | 'CLOSED' | 'DISCREDITED';
  assignedInvestigator?: string;
  investigatorNotes?: string;
  aiAssessment?: {
    summary: string;
    corroboratingFactors: string[];
    redFlags: string[];
    recommendedActions: string[];
  };
  conversation: {
    sender: 'INVESTIGATOR' | 'TIPSTER';
    message: string;
    timestamp: string;
  }[];
}

export interface IntelligenceAnalysisResult {
  duplicatesDetected: string[];
  contradictions: string[];
  missingInformation: string[];
  criticalDates: { date: string; event: string }[];
  crossCaseConnections: string[];
  humanVerificationRequired: string[];
  aiConfidenceScore: number;
  humanReviewStatus: 'PENDING_HUMAN_SIGN_OFF' | 'APPROVED' | 'REJECTED';
  generatedAt: string;
  reviewerNotes?: string;
}

export interface MissionReport {
  id: string;
  reportNumber: string;
  caseId: string;
  missionId: string;
  title: string;
  classification: string;
  generatedDate: string;
  authorOfficer: string;
  authorBadge: string;
  outcome: 'APPREHENDED_SAFELY' | 'LOCATED_SURVEILLANCE' | 'ONGOING_INVESTIGATION' | 'EXTRADITION_PROCEEDINGS';
  executiveSummary: string;
  chainOfCustodySummary: string;
  publicSafetyImpact: string;
  tipsReceivedCount: number;
  tasksCompletedCount: number;
  supervisorSignature: {
    officer: string;
    badge: string;
    timestamp: string;
    verifiedLawful: boolean;
  };
}

export interface AgencyPartner {
  id: string;
  name: string;
  shortCode: string;
  jurisdictionType: 'FEDERAL' | 'INTERPOL' | 'STATE' | 'MUNICIPAL' | 'REGIONAL_TASK_FORCE';
  headquarters: string;
  activeLiaison: string;
  liaisonPhone: string;
  secureCommsProtocol: string;
  activeSharedCasesCount: number;
  badgeEmblem: string;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  officerBadge: string;
  officerName: string;
  userRole: string;
  action: 'LOGIN' | 'CASE_VIEW' | 'CASE_MODIFIED' | 'TIP_ACCESSED' | 'AI_QUERY' | 'REPORT_GENERATED' | 'TASK_COMPLETED' | 'DATA_EXPORT';
  resourceTarget: string;
  details: string;
  ipAddress: string;
  cryptographicChecksum: string;
}

export type UserRole = 
  | 'SUPERVISORY_AGENT' 
  | 'TASK_FORCE_DETECTIVE' 
  | 'INTEL_ANALYST' 
  | 'AGENCY_DIRECTOR' 
  | 'PUBLIC_VIEW';

export interface UserSession {
  name: string;
  badgeNumber: string;
  role: UserRole;
  agency: string;
  clearanceLevel: 'TOP SECRET // LES' | 'SECRET' | 'LAW ENFORCEMENT SENSITIVE' | 'PUBLIC';
  mfaVerified: boolean;
  sessionExpiry: string;
}
