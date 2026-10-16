import { DiagnosticResult, RiskAssessment, RiskTier } from '../types';

export interface RiskConfig {
  hardLieWeight: number;
  automationWeight: number;
  warningWeight: number;
  highRiskThreshold: number;
  reviewThreshold: number;
}

export const DEFAULT_RISK_CONFIG: RiskConfig = {
  hardLieWeight: 60, // A single hard lie immediately crosses threshold 50!
  automationWeight: 60, // Automation immediately crosses threshold 50!
  warningWeight: 15,
  highRiskThreshold: 50,
  reviewThreshold: 20
};

export function classifyRisk(
  diagnostics: DiagnosticResult[],
  config: RiskConfig = DEFAULT_RISK_CONFIG
): RiskAssessment {
  let score = 0;
  const reasons: string[] = [];
  let automationDetected = false;
  let isPrivacyMode = false;
  let liesCount = 0;
  let warningsCount = 0;

  for (const diag of diagnostics) {
    if (diag.status !== 'detected') continue;

    // Hard technical lie (spoofing contradiction)
    if (diag.isLie) {
      liesCount++;
      score += config.hardLieWeight;
      reasons.push(`[HARD LIE DETECTED] ${diag.testName}: ${diag.explanation}`);
    }

    // Automation / Headless
    if (diag.category === 'automation' || diag.category === 'headless') {
      automationDetected = true;
      score += config.automationWeight;
      reasons.push(`[AUTOMATION/HEADLESS] ${diag.testName}: ${diag.explanation}`);
    }

    // Privacy / Extension
    if (diag.category === 'privacy_resistance' || diag.testId === 'rendering_canvas_noise') {
      isPrivacyMode = true;
      score += config.warningWeight;
      reasons.push(`[PRIVACY/SHIELD] ${diag.testName}: ${diag.explanation}`);
    }

    // Warning
    if (diag.isWarning && !diag.isLie && diag.category !== 'privacy_resistance') {
      warningsCount++;
      score += config.warningWeight;
      reasons.push(`[ANOMALY WARNING] ${diag.testName}: ${diag.observedResult}`);
    }
  }

  score = Math.min(100, score);

  // Strict Risk Tier Assignment
  let tier: RiskTier = 'Low risk (Real user)';
  if (liesCount >= 1 || automationDetected || score >= config.highRiskThreshold) {
    tier = 'High risk (Suspicious / Bot)';
  } else if (score >= config.reviewThreshold || isPrivacyMode || warningsCount >= 1) {
    tier = 'Needs further review';
  }

  if (reasons.length === 0) {
    reasons.push('All diagnostic invariants passed. Environment exhibits genuine browser hardware characteristics with zero prototype tampering.');
  }

  return {
    tier,
    score,
    automationDetected,
    isPrivacyMode,
    reasons,
    liesCount,
    warningsCount
  };
}
