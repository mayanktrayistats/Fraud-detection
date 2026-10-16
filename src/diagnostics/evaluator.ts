import { DiagnosticResult, DiagnosticStatus } from '../types';

export function runDiagnostics(signals: {
  headless: any;
  worker: any;
  webgl: any;
  canvas: any;
  audio: any;
  screen: any;
  intl: any;
  system: any;
  resistance: any;
  webrtc: any;
  consistency: any;
}): DiagnosticResult[] {
  const tests: DiagnosticResult[] = [];
  const start = performance.now();

  // Helper
  const add = (
    testId: string,
    testName: string,
    category: any,
    status: DiagnosticStatus,
    observedResult: any,
    expectedResult: any,
    explanation: string,
    evidence: Record<string, any>,
    confidence: 'low' | 'medium' | 'high',
    isLie = false,
    isWarning = false
  ) => {
    tests.push({
      testId,
      testName,
      category,
      status,
      observedResult,
      expectedResult,
      explanation,
      evidence,
      confidence,
      executionTimeMs: Math.round((performance.now() - start) * 100) / 100,
      isLie,
      isWarning
    });
  };

  // 1. Automation Indicators
  const wd = signals.headless.webdriver;
  add(
    'auto_webdriver',
    'Navigator Webdriver Flag',
    'automation',
    wd ? 'detected' : 'not_detected',
    wd,
    false,
    'Checks if navigator.webdriver is enabled by automated drivers (Selenium, Puppeteer, Playwright).',
    { webdriver: wd },
    'high',
    wd,
    false
  );

  const cdp = signals.headless.details.cdpArtifacts;
  add(
    'auto_cdp_artifacts',
    'CDP Runtime Artifacts',
    'automation',
    cdp ? 'detected' : 'not_detected',
    cdp,
    false,
    'Checks for Chrome DevTools Protocol execution variables and Selenium driver objects.',
    { cdpArtifacts: cdp },
    'high',
    cdp,
    false
  );

  // 2. Headless-Browser Indicators
  const zeroDim = signals.headless.details.zeroDimensions;
  add(
    'headless_dimensions',
    'Window Dimension Bounds',
    'headless',
    zeroDim ? 'detected' : 'not_detected',
    `outerWidth: ${signals.screen.outerWidth}, outerHeight: ${signals.screen.outerHeight}`,
    'Non-zero screen outer dimensions',
    'Headless browsers often initialize with outerWidth and outerHeight equal to 0.',
    { outerWidth: signals.screen.outerWidth, outerHeight: signals.screen.outerHeight },
    'high',
    zeroDim,
    false
  );

  const permMismatch = signals.headless.details.permissionsMismatch;
  add(
    'headless_permissions_mismatch',
    'Permissions API Mismatch',
    'headless',
    permMismatch ? 'detected' : 'not_detected',
    permMismatch ? 'Notification.permission denied while permissions.query is prompt' : 'Consistent',
    'Matching notification status',
    'Headless Chrome historically defaults Notification.permission to denied while query returns prompt.',
    { permissionsMismatch: permMismatch },
    'medium',
    permMismatch,
    false
  );

  // 3. Worker vs Window Inconsistency (Hard Lie)
  const workerMismatches = signals.worker.mismatchesWithWindow || [];
  const hasWorkerMismatch = workerMismatches.length > 0;
  add(
    'consistency_worker_window',
    'Worker vs Window Scope Parity',
    'consistency',
    hasWorkerMismatch ? 'detected' : 'not_detected',
    hasWorkerMismatch ? workerMismatches.join('; ') : 'All worker properties match window',
    'Identical navigator and hardware values across scopes',
    'Anti-detect scripts often inject overrides in window scope while neglecting Web Worker scopes.',
    { mismatches: workerMismatches },
    'high',
    hasWorkerMismatch,
    false
  );

  // 4. Rendering Anomalies (Canvas Noise & WebGL)
  const noise = signals.resistance.canvasNoiseDetected;
  add(
    'rendering_canvas_noise',
    'Dynamic Canvas Noise Injection',
    'rendering',
    noise ? 'detected' : 'not_detected',
    noise ? 'Pixel noise detected on duplicate draw' : 'Deterministic pixel readbacks',
    'Deterministic readbacks',
    'Privacy extensions often poison canvas pixels with random jitter on each readback.',
    { canvasNoiseDetected: noise },
    'high',
    false,
    noise // warning / privacy flag, not malicious lie
  );

  // 5. User-Agent vs Client Hints
  const ua = signals.system.navigator.userAgent;
  const uad = signals.system.navigator.userAgentData;
  let uaMismatch = false;
  let uaExplanation = 'User-Agent and Client Hints match reported platform';
  if (uad && uad.platform) {
    if (ua.includes('Windows') && !uad.platform.includes('Win')) {
      uaMismatch = true;
      uaExplanation = `User-Agent reports Windows but Client Hints platform reports "${uad.platform}"`;
    } else if (ua.includes('Macintosh') && !uad.platform.includes('macOS')) {
      uaMismatch = true;
      uaExplanation = `User-Agent reports macOS but Client Hints platform reports "${uad.platform}"`;
    }
  }
  add(
    'ua_client_hints_match',
    'User-Agent & Client Hints Alignment',
    'user_agent',
    uaMismatch ? 'detected' : 'not_detected',
    uaMismatch ? uaExplanation : 'Aligned',
    'Matching OS family across UA string and navigator.userAgentData',
    'Inconsistencies between modern UserAgentData and legacy User-Agent string indicate incomplete spoofing.',
    { userAgent: ua, userAgentData: uad },
    'high',
    uaMismatch,
    false
  );

  // 6. OS vs GPU Renderer Contradiction
  const gpu = signals.webgl.unmaskedRenderer || '';
  let gpuOsContradiction = false;
  let gpuOsReason = 'GPU renderer compatible with reported OS';
  if (ua.includes('Macintosh') && gpu.includes('Direct3D')) {
    gpuOsContradiction = true;
    gpuOsReason = 'Browser reports macOS User-Agent but WebGL renderer reports DirectX / Direct3D (Windows-only)';
  } else if ((ua.includes('iPhone') || ua.includes('iPad')) && (gpu.includes('Direct3D') || gpu.includes('Intel'))) {
    gpuOsContradiction = true;
    gpuOsReason = 'Browser reports iOS device but WebGL renderer reports desktop Intel / Direct3D graphics';
  } else if (gpu.includes('SwiftShader') || gpu.includes('llvmpipe')) {
    gpuOsReason = 'Software emulation GPU (SwiftShader / llvmpipe) detected, typical of cloud VMs or headless servers';
  }
  add(
    'hardware_os_gpu_match',
    'OS & WebGL Graphics Subsystem Compatibility',
    'hardware_os',
    gpuOsContradiction ? 'detected' : gpu.includes('SwiftShader') ? 'detected' : 'not_detected',
    gpu || 'unknown',
    'Native GPU vendor matching OS graphics framework',
    gpuOsReason,
    { userAgent: ua, gpuRenderer: gpu },
    'high',
    gpuOsContradiction,
    gpu.includes('SwiftShader')
  );

  // 7. WebRTC Network Candidate Observations
  const webrtcSupported = signals.webrtc.supported;
  const isMDNS = signals.webrtc.hostCandidate.includes('.local');
  add(
    'webrtc_mdns_masking',
    'WebRTC Host Candidate Protection',
    'webrtc_network',
    webrtcSupported ? 'detected' : 'not_supported',
    isMDNS ? 'mDNS obfuscated (.local)' : signals.webrtc.hostCandidate || 'No host candidate',
    'mDNS obfuscation on modern Chromium',
    'Checks whether WebRTC hides local IP addresses using mDNS candidates as mandated by modern privacy standards.',
    { hostCandidate: signals.webrtc.hostCandidate, publicIp: signals.webrtc.publicIp },
    'medium',
    false,
    false
  );

  // 8. Privacy & Resistance Protections
  const hasBrave = signals.resistance.hasBraveShields;
  const hasRFP = signals.resistance.hasFirefoxRFP;
  add(
    'privacy_resistance_engine',
    'Browser Privacy Resistance Mechanism',
    'privacy_resistance',
    hasBrave || hasRFP ? 'detected' : 'not_detected',
    hasBrave ? 'Brave Shields active' : hasRFP ? 'Firefox resistFingerprinting active' : 'None detected',
    'Standard consumer browser configuration',
    'Recognizes standardized privacy features that intentionally round metrics or restrict APIs.',
    { braveShields: hasBrave, firefoxRFP: hasRFP },
    'high',
    false,
    hasBrave || hasRFP
  );

  // 9. Missing or Restricted APIs
  const missingApis: string[] = [];
  if (!signals.webgl.supported) missingApis.push('WebGL');
  if (!signals.audio.dataHash) missingApis.push('OfflineAudioContext');
  if (!signals.webrtc.supported) missingApis.push('WebRTC');
  add(
    'missing_restricted_apis',
    'Essential Browser Hardware APIs',
    'missing_apis',
    missingApis.length > 0 ? 'detected' : 'not_detected',
    missingApis.length > 0 ? `Restricted: ${missingApis.join(', ')}` : 'All available',
    'WebGL, AudioContext, and WebRTC present in standard desktop browsers',
    'Evaluates whether core browser APIs are absent due to policy, security sandboxing, or restricted environments.',
    { missing: missingApis },
    'medium',
    false,
    missingApis.length > 0
  );

  // 10. Changes Across Repeated Sessions
  const sessionAnomalies = signals.consistency.anomaliesDetected || [];
  const hasSessionAnomalies = sessionAnomalies.length > 0;
  add(
    'session_changes_anomalies',
    'Inter-Session Consistency Verification',
    'session_changes',
    hasSessionAnomalies ? 'detected' : 'not_detected',
    hasSessionAnomalies ? sessionAnomalies.join('; ') : 'Consistent with previous sessions',
    'Stable hardware and identity across sequential sessions',
    'Detects session-hopping where User-Agents or profiles rotate while underlying hardware signatures remain static.',
    { sessionCount: signals.consistency.previousSessionCount, anomalies: sessionAnomalies },
    'high',
    hasSessionAnomalies,
    false
  );

  return tests;
}
