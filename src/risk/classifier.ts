import { DiagnosticResult, RiskAssessment, RiskTier } from '../types';

export interface RiskConfig {
  hardLieWeight: number;
  automationWeight: number;
  warningWeight: number;
  highRiskThreshold: number;
  reviewThreshold: number;
}

export const DEFAULT_RISK_CONFIG: RiskConfig = {
  hardLieWeight: 35,
  automationWeight: 30,
  warningWeight: 10,
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

    // Categorize
    if (diag.isLie) {
      liesCount++;
      score += config.hardLieWeight;
      reasons.push(`[Hard Discrepancy] ${diag.testName}: ${diag.explanation}`);
    }

    if (diag.category === 'automation' || diag.category === 'headless') {
      automationDetected = true;
      score += config.automationWeight;
      reasons.push(`[Automation/Headless] ${diag.testName} detected.`);
    }

    if (diag.category === 'privacy_resistance' || diag.testId === 'rendering_canvas_noise') {
      isPrivacyMode = true;
      // Note: privacy protections alone do NOT cause high risk; they cause 'review' with moderate weight
      score += config.warningWeight;
      reasons.push(`[Privacy/Resistance] ${diag.testName}: User may be using privacy extensions or anti-tracking features.`);
    }

    if (diag.isWarning && !diag.isLie && diag.category !== 'privacy_resistance') {
      warningsCount++;
      score += config.warningWeight;
      reasons.push(`[Anomaly Warning] ${diag.testName}: ${diag.observedResult}`);
    }
  }

  score = Math.min(100, score);

  let tier: RiskTier = 'Low risk (Real user)';
  if (score >= config.highRiskThreshold || liesCount >= 2) {
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
