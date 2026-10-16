export interface ComponentHash {
  hash: string;
  executionTimeMs: number;
  data: any;
}

export type DiagnosticStatus = 'detected' | 'not_detected' | 'unknown' | 'not_supported';
export type ConfidenceLevel = 'low' | 'medium' | 'high';

export type DiagnosticCategory =
  | 'automation'
  | 'headless'
  | 'consistency'
  | 'rendering'
  | 'user_agent'
  | 'hardware_os'
  | 'webrtc_network'
  | 'privacy_resistance'
  | 'missing_apis'
  | 'session_changes';

export interface DiagnosticResult {
  testId: string;
  testName: string;
  category: DiagnosticCategory;
  status: DiagnosticStatus;
  observedResult: any;
  expectedResult?: any;
  explanation: string;
  evidence: Record<string, any>;
  confidence: ConfidenceLevel;
  executionTimeMs: number;
  isLie?: boolean;
  isWarning?: boolean;
}

export type RiskTier = 'Low risk (Real user)' | 'Needs further review' | 'High risk (Suspicious / Bot)';

export interface RiskAssessment {
  tier: RiskTier;
  score: number; // 0 to 100
  automationDetected: boolean;
  isPrivacyMode: boolean;
  reasons: string[];
  liesCount: number;
  warningsCount: number;
}

export interface SessionReport {
  id: string;
  timestamp: number;
  fpId: string;
  fuzzyFp: string;
  executionTimeMs: number;
  risk: RiskAssessment;
  components: Record<string, ComponentHash>;
  diagnostics: DiagnosticResult[];
  rawSignals: Record<string, any>;
}
