export type PageId =
  | 'overview'
  | 'analyze'
  | 'result'
  | 'investigations'
  | 'claims'
  | 'evidence'
  | 'sources'
  | 'social'
  | 'propagation'
  | 'forensics'
  | 'watchlist'
  | 'alerts'
  | 'reports'
  | 'history'
  | 'datasets'
  | 'models'
  | 'experiments'
  | 'api'
  | 'admin'
  | 'settings';

export type ClaimStatus =
  | 'Supported'
  | 'False'
  | 'Misleading'
  | 'Unverified'
  | 'Opinion'
  | 'Satire'
  | 'Insufficient Evidence';

export type RiskLevel = 'Low' | 'Medium' | 'High' | 'Critical';

export type SourceType = 'News' | 'Academic' | 'Gov/Org' | 'Social' | 'Blog' | 'Unknown';

export type ReliabilityTier = 'High' | 'Medium' | 'Low' | 'Questionable' | 'Unknown';

export interface Claim {
  id: string;
  originalText: string;
  normalizedClaim: string;
  status: ClaimStatus;
  confidence: number; // 0 - 100
  evidenceCount: number;
  source: string;
  sourceType: SourceType;
  firstSeen: string;
  lastUpdated: string;
  topic: string;
  risk: RiskLevel;
  entities: string[];
  locations: string[];
  dates: string[];
  contradictions: string[];
  relatedClaimIds: string[];
  socialActivityVelocity: 'Rapid' | 'Moderate' | 'Slow' | 'Spike';
  notes?: string;
  isReviewed?: boolean;
}

export interface EvidenceItem {
  id: string;
  claimId: string;
  claimSnippet: string;
  source: string;
  sourceUrl: string;
  sourceType: SourceType;
  relationship: 'Supporting' | 'Contradicting' | 'Context' | 'Unverified';
  publicationDate: string;
  reliabilityScore: number; // 0 - 100
  analystNote: string;
  excerpt: string;
  highlightedText?: string;
}

export interface SourceInfo {
  id: string;
  name: string;
  domain: string;
  type: SourceType;
  reliability: ReliabilityTier;
  reliabilityScore: number;
  articlesAnalyzed: number;
  lastAnalyzed: string;
  status: 'Active' | 'Flagged' | 'Monitored' | 'Whitelisted';
  domainAgeYears: number;
  hasHttps: boolean;
  authorTransparency: 'High' | 'Moderate' | 'Low' | 'None';
  citationBehavior: 'Transparent' | 'Moderate' | 'Poor' | 'Circular';
  publisher: string;
  ownership: string;
  signals: { label: string; positive: boolean }[];
  relatedClaimsCount: number;
}

export interface LanguageSignals {
  clickbait: number; // 0 - 100
  sensationalism: number; // 0 - 100
  emotionalAppeal: number; // 0 - 100
  urgency: number; // 0 - 100
  epistemicCertainty: number; // 0 - 100
}

export interface AnalysisAssessment {
  classification: ClaimStatus;
  confidence: number;
  evidenceStatus: 'Sufficient' | 'Partial' | 'Insufficient' | 'Contradictory';
  sourceReliability: ReliabilityTier;
  claimRisk: RiskLevel;
  propagationRisk: RiskLevel;
}

export interface AnalysisResult {
  id: string;
  title: string;
  content: string;
  inputType: 'Article' | 'URL' | 'Text' | 'Image' | 'Video' | 'Social' | 'Document';
  sourceUrl?: string;
  createdAt: string;
  assessment: AnalysisAssessment;
  whyThisResult: string[];
  claims: Claim[];
  evidenceList: EvidenceItem[];
  languageSignals: LanguageSignals;
  modelExplanation: {
    modelName: string;
    version: string;
    confidence: number;
    keyFeatures: string[];
    shapExplanation?: string;
  };
  isInWatchlist?: boolean;
  saved?: boolean;
}

export interface Investigation {
  id: string;
  name: string;
  topic: string;
  claimsCount: number;
  risk: RiskLevel;
  status: 'Open' | 'In Progress' | 'In Review' | 'Closed';
  updated: string;
  created: string;
  leadAnalyst: string;
  progressPercent: number;
  summary: string;
  timelineEvents: {
    id: string;
    timestamp: string;
    title: string;
    description: string;
    type: 'claim' | 'evidence' | 'social_spike' | 'flag';
  }[];
  claims: Claim[];
  notes: string[];
}

export interface SocialStat {
  postsAnalyzed: number;
  totalEngagement: number;
  uniqueAccounts: number;
  activeHashtags: number;
}

export interface TrendingClaim {
  id: string;
  text: string;
  velocity: '+42%' | '+88%' | '+15%' | '+130%';
  postsCount: number;
  risk: RiskLevel;
  platform: 'X' | 'Reddit' | 'YouTube' | 'Facebook' | 'Instagram' | 'Web';
}

export interface PropagationNode {
  id: string;
  label: string;
  type: 'post' | 'account' | 'url' | 'hashtag';
  cluster: number;
  size: number;
  x?: number;
  y?: number;
  coordinationScore?: number;
}

export interface PropagationEdge {
  id: string;
  source: string;
  target: string;
  type: 'repost' | 'mention' | 'reply' | 'shared_url' | 'similar_content';
  weight: number;
}

export interface MediaForensicsItem {
  id: string;
  fileName: string;
  fileType: 'image' | 'video' | 'audio' | 'screenshot';
  ocrText: string;
  metadata: {
    dimensions?: string;
    format: string;
    colorSpace?: string;
    software?: string;
    dateTime?: string;
    gps?: string;
  };
  imageHash: {
    pHash: string;
    dHash: string;
    md5: string;
  };
  reuseSignals: {
    source: string;
    firstSeen: string;
    similarity: number;
  }[];
  extractedClaims: string[];
  manipulationSignals: {
    signal: string;
    confidence: number;
    description: string;
    severity: 'low' | 'medium' | 'high';
  }[];
}

export interface WatchItem {
  id: string;
  name: string;
  type: 'Topic' | 'Claim' | 'Source' | 'Domain' | 'Keyword' | 'Hashtag';
  mentions: number;
  riskChange: string;
  riskIsPositive: boolean;
  lastActivity: string;
  status: 'Active' | 'Paused';
}

export interface AlertItem {
  id: string;
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  category: 'High Priority' | 'Evidence' | 'Watchlist' | 'Social' | 'System';
  title: string;
  description: string;
  timestamp: string;
  actionLabel: string;
  targetId?: string;
  targetPage?: PageId;
  read: boolean;
}

export interface ReportItem {
  id: string;
  title: string;
  type: 'Investigation' | 'Social' | 'Analysis' | 'Forensic' | 'Brief';
  created: string;
  status: 'Completed' | 'Draft' | 'Exported';
  analyst: string;
  summary: string;
  sections: string[];
}

export interface DatasetItem {
  id: string;
  name: string;
  version: string;
  rows: number;
  labelsCount: number;
  labelsList: string[];
  languages: string[];
  created: string;
  status: 'Ready' | 'Validating' | 'Processing';
  missingValuesPercent: number;
  duplicatesCount: number;
  splitTrainTest: string; // e.g. "80 / 20"
}

export interface MLModelItem {
  id: string;
  name: string;
  version: string;
  dataset: string;
  status: 'Trained' | 'Deployed' | 'Training' | 'Deprecated';
  trainingDate: string;
  precision: number | null;
  recall: number | null;
  f1: number | null;
  rocAuc: number | null;
  confusionMatrix?: number[][];
}

export interface ExperimentItem {
  id: string;
  name: string;
  dataset: string;
  model: string;
  parameters: Record<string, string | number>;
  metrics: {
    f1: number;
    precision: number;
    recall: number;
    loss: number;
  };
  created: string;
  status: 'Completed' | 'Running' | 'Failed';
}

export interface AuditLogItem {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  resource: string;
  ip: string;
  status: 'SUCCESS' | 'WARN' | 'FAIL';
}

// Backwards-compatible aliases
export type ClaimRisk = RiskLevel;
export type MLModel = MLModelItem;
export type Report = ReportItem;
export type WatchlistItem = WatchItem;
export type SourceProfile = SourceInfo;
