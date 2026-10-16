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
  speech: any;
  consistency: any;
}): DiagnosticResult[] {
  const tests: DiagnosticResult[] = [];
  const start = performance.now();

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

  const ua = navigator.userAgent;
  const platform = navigator.platform;
  const gpu = signals.webgl.unmaskedRenderer || signals.webgl.renderer || '';

  // ==========================================
  // 1. PROTOTYPE TAMPERING & HOOKING CHECKS
  // ==========================================

  // Check 1A: Direct property ownership (anti-detect tools & extensions do Object.defineProperty on navigator)
  const navOwnProperties: string[] = [];
  const propsToCheck = ['userAgent', 'platform', 'hardwareConcurrency', 'deviceMemory', 'languages', 'webdriver', 'plugins', 'mimeTypes'];
  for (const prop of propsToCheck) {
    if (Object.prototype.hasOwnProperty.call(navigator, prop)) {
      navOwnProperties.push(prop);
    }
  }
  const hasOwnNavProps = navOwnProperties.length > 0;
  add(
    'proto_nav_ownership',
    'Navigator Property Ownership (Hook Detection)',
    'automation',
    hasOwnNavProps ? 'detected' : 'not_detected',
    hasOwnNavProps ? `Overridden directly on navigator: ${navOwnProperties.join(', ')}` : 'Inherited natively from Navigator.prototype',
    'Navigator properties must strictly exist on Navigator.prototype, not as own properties',
    'Extensions and anti-detect tools hook navigator by defining own properties directly on the instance.',
    { ownProperties: navOwnProperties },
    'high',
    hasOwnNavProps,
    false
  );

  // Check 1B: Illegal Invocation check on native getter
  let getterTampered = false;
  let getterErrorMsg = '';
  try {
    const desc = Object.getOwnPropertyDescriptor(Navigator.prototype, 'userAgent');
    if (desc && desc.get) {
      try {
        // Calling native getter with non-Navigator object MUST throw TypeError
        Reflect.get(Navigator.prototype, 'userAgent', {});
        getterTampered = true; // Did not throw -> fake JS getter!
        getterErrorMsg = 'Getter returned value without checking receiver';
      } catch (err: any) {
        if (!err.message?.includes('Illegal invocation') && !err.message?.includes('does not implement')) {
          getterTampered = true;
          getterErrorMsg = `Unexpected error: ${err.message}`;
        }
      }
    }
  } catch {}
  add(
    'proto_getter_invocation',
    'Native Prototype Method Trapping',
    'automation',
    getterTampered ? 'detected' : 'not_detected',
    getterTampered ? `Trapped/Hooked getter: ${getterErrorMsg}` : 'Native C++ binding verified',
    'Native getters throw TypeError: Illegal invocation on invalid receiver',
    'Spoofed getters implemented via custom JavaScript or Proxies fail native receiver validation.',
    { getterTampered, getterErrorMsg },
    'high',
    getterTampered,
    false
  );

  // ==========================================
  // 2. BROWSER BRAND & ARCHITECTURE INVARIANTS
  // ==========================================

  // Check 2A: Fake Safari (Safari NEVER has window.chrome or navigator.userAgentData)
  const claimsSafari = ua.includes('Safari') && !ua.includes('Chrome') && !ua.includes('Edg') && !ua.includes('Android');
  const hasChromeObject = !!(window as any).chrome;
  const hasUserAgentData = !!(navigator as any).userAgentData;
  const fakeSafari = claimsSafari && (hasChromeObject || hasUserAgentData);
  add(
    'brand_fake_safari',
    'Safari Architecture Authenticity',
    'user_agent',
    fakeSafari ? 'detected' : 'not_detected',
    fakeSafari ? `Claims Safari but contains ${hasChromeObject ? 'window.chrome ' : ''}${hasUserAgentData ? 'navigator.userAgentData' : ''}` : 'Consistent',
    'Genuine Safari does not support Chromium window.chrome or Client Hints API',
    'Fake Safari User-Agent running inside a Chromium-based fake browser or spoofer.',
    { claimsSafari, hasChromeObject, hasUserAgentData },
    'high',
    fakeSafari,
    false
  );

  // Check 2B: Fake Firefox (Firefox NEVER has window.chrome or navigator.userAgentData)
  const claimsFirefox = ua.includes('Firefox');
  const fakeFirefox = claimsFirefox && (hasChromeObject || hasUserAgentData);
  add(
    'brand_fake_firefox',
    'Firefox Architecture Authenticity',
    'user_agent',
    fakeFirefox ? 'detected' : 'not_detected',
    fakeFirefox ? `Claims Firefox but contains ${hasChromeObject ? 'window.chrome ' : ''}${hasUserAgentData ? 'navigator.userAgentData' : ''}` : 'Consistent',
    'Genuine Firefox does not implement window.chrome or Chromium Client Hints',
    'Fake Firefox User-Agent running inside a Chromium-based fake browser or spoofer.',
    { claimsFirefox, hasChromeObject, hasUserAgentData },
    'high',
    fakeFirefox,
    false
  );

  // Check 2C: Fake Mobile (claims iPhone or Android, but zero touch or desktop platform)
  const claimsPhone = ua.includes('iPhone') || ua.includes('Android');
  const touchPoints = navigator.maxTouchPoints || 0;
  const desktopPlatformOnPhone = claimsPhone && (platform.includes('Win') || platform.includes('MacIntel') || platform.includes('Linux x86'));
  const noTouchOnPhone = claimsPhone && touchPoints === 0;
  const fakeMobile = desktopPlatformOnPhone || noTouchOnPhone;
  add(
    'brand_fake_mobile',
    'Mobile Device Emulation Contradiction',
    'hardware_os',
    fakeMobile ? 'detected' : 'not_detected',
    fakeMobile ? `Claims phone but platform is "${platform}" with ${touchPoints} touch points` : 'Consistent mobile profile',
    'Mobile devices must have touch support and native mobile OS platforms',
    'Chrome DevTools mobile emulation or fake browser faking mobile User-Agent on desktop.',
    { claimsPhone, platform, touchPoints },
    'high',
    fakeMobile,
    false
  );

  // ==========================================
  // 3. HARDWARE & GPU VS OS CONTRADICTIONS
  // ==========================================

  // Check 3A: GPU vs OS Mismatch
  let gpuOsContradiction = false;
  let gpuOsReason = 'GPU renderer compatible with reported OS';
  const claimsMacOrIOS = ua.includes('Macintosh') || ua.includes('iPhone') || ua.includes('iPad');
  const claimsWindows = ua.includes('Windows');

  if (claimsMacOrIOS && (gpu.includes('Direct3D') || gpu.includes('NVIDIA') || gpu.includes('AMD Radeon') || gpu.includes('Intel(R)'))) {
    // Note: modern Macs use Apple M1/M2/M3 GPUs or Metal, never Direct3D (DirectX is Windows only)
    if (gpu.includes('Direct3D')) {
      gpuOsContradiction = true;
      gpuOsReason = 'User-Agent claims Apple macOS/iOS, but WebGL graphics is Direct3D (Windows DirectX)';
    }
  } else if (claimsWindows && (gpu.includes('Apple M') || gpu.includes('Metal') || gpu.includes('Apple GPU'))) {
    gpuOsContradiction = true;
    gpuOsReason = 'User-Agent claims Windows, but WebGL graphics is Apple Silicon Metal GPU';
  } else if (gpu.includes('SwiftShader') || gpu.includes('llvmpipe')) {
    gpuOsContradiction = true;
    gpuOsReason = 'Software emulation GPU (SwiftShader / llvmpipe) detected: running in headless server or cloud VM';
  }

  add(
    'hardware_os_gpu_match',
    'OS & WebGL Graphics Subsystem Compatibility',
    'hardware_os',
    gpuOsContradiction ? 'detected' : 'not_detected',
    gpu || 'unsupported',
    'Native GPU vendor matching OS graphics framework',
    gpuOsReason,
    { userAgent: ua, gpuRenderer: gpu },
    'high',
    gpuOsContradiction,
    false
  );

  // Check 3B: Speech voices leaking underlying host OS
  let voiceOsMismatch = false;
  let voiceMismatchReason = '';
  const voices = signals.speech.voicesList || [];
  const defaultVoice = signals.speech.defaultVoice || '';
  if (claimsMacOrIOS || ua.includes('Linux') || ua.includes('Android')) {
    if (defaultVoice.includes('Microsoft') || voices.some((v: string) => v.includes('Microsoft David') || v.includes('Microsoft Zira'))) {
      voiceOsMismatch = true;
      voiceMismatchReason = `Browser claims ${claimsMacOrIOS ? 'macOS/iOS' : 'Linux'}, but installed speech voices are Windows SAPI (Microsoft David/Zira)`;
    }
  } else if (claimsWindows) {
    if (defaultVoice.includes('Samantha') || defaultVoice.includes('Alex') || voices.some((v: string) => v.includes('Samantha (en-US)'))) {
      voiceOsMismatch = true;
      voiceMismatchReason = 'Browser claims Windows, but installed speech voices are Apple macOS voice packs (Samantha/Alex)';
    }
  }
  add(
    'hardware_voice_os_match',
    'Speech Voice Pack & Host OS Correlation',
    'hardware_os',
    voiceOsMismatch ? 'detected' : 'not_detected',
    voiceOsMismatch ? voiceMismatchReason : 'Voices match reported OS',
    'Installed speech synthesis voices must match host OS voice engines',
    'Fake browser modified User-Agent but could not fake the underlying OS system voices.',
    { defaultVoice, voiceOsMismatch },
    'high',
    voiceOsMismatch,
    false
  );

  // ==========================================
  // 4. SCOPE PARITY & TIMEZONE CONSISTENCY
  // ==========================================

  // Check 4A: Worker vs Window Scope Parity
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

  // Check 4B: Timezone vs Date Offset Contradiction
  let tzMismatch = false;
  let tzReason = '';
  try {
    const tzName = signals.intl.timezone.name;
    const reportedOffset = new Date().getTimezoneOffset();
    // Verify Intl timezone vs actual offset
    const dtf = new Intl.DateTimeFormat('en-US', { timeZone: tzName, timeZoneName: 'shortOffset' });
    const parts = dtf.formatToParts(new Date());
    const offsetPart = parts.find(p => p.type === 'timeZoneName');
    if (offsetPart && offsetPart.value.startsWith('GMT')) {
      const match = offsetPart.value.match(/GMT([+-])(\d+)(?::(\d+))?/);
      if (match) {
        const sign = match[1] === '+' ? -1 : 1;
        const hours = parseInt(match[2], 10);
        const mins = match[3] ? parseInt(match[3], 10) : 0;
        const expectedOffset = sign * (hours * 60 + mins);
        if (Math.abs(expectedOffset - reportedOffset) > 60) {
          tzMismatch = true;
          tzReason = `Intl timezone "${tzName}" implies offset ${expectedOffset}m, but Date offset is ${reportedOffset}m`;
        }
      }
    }
  } catch {}
  add(
    'timezone_offset_parity',
    'Timezone & Date Offset Mathematical Integrity',
    'consistency',
    tzMismatch ? 'detected' : 'not_detected',
    tzMismatch ? tzReason : 'Timezone mathematically consistent with Date offset',
    'Reported Intl timezone must strictly equal the native Date().getTimezoneOffset()',
    'Proxy or anti-detect tool changed timezone string but failed to alter underlying epoch offset calculation.',
    { timezone: signals.intl.timezone.name, reportedOffset: new Date().getTimezoneOffset() },
    'high',
    tzMismatch,
    false
  );

  // ==========================================
  // 5. SCREEN & GEOMETRY BOUNDS
  // ==========================================

  const sW = screen.width;
  const sH = screen.height;
  const aW = screen.availWidth;
  const aH = screen.availHeight;
  const invalidScreen = aW > sW || aH > sH || sW === 0 || sH === 0;
  add(
    'screen_geometry_bounds',
    'Screen & Viewport Physical Geometry Invariants',
    'hardware_os',
    invalidScreen ? 'detected' : 'not_detected',
    invalidScreen ? `avail (${aW}x${aH}) exceeds screen (${sW}x${sH})` : 'Valid physical dimensions',
    'Available screen size cannot exceed physical monitor resolution',
    'Anti-detect browsers often spoof screen properties with impossible physical dimensions.',
    { screen: `${sW}x${sH}`, avail: `${aW}x${aH}` },
    'high',
    invalidScreen,
    false
  );

  // ==========================================
  // 6. AUTOMATION & HEADLESS CHECKS
  // ==========================================

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

  // 7. Dynamic Canvas Noise
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
    noise
  );

  return tests;
}
