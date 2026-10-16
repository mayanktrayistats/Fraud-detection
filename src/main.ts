import './dashboard/style.css';
import { collectWebRTC } from './collectors/webrtc';
import { collectIntl } from './collectors/intl';
import { collectHeadless } from './collectors/headless';
import { collectResistance } from './collectors/resistance';
import { collectWorker } from './collectors/worker';
import { collectWebGL } from './collectors/webgl';
import { collectScreen } from './collectors/screen';
import { collectCanvas } from './collectors/canvas';
import { collectFonts } from './collectors/fonts';
import { collectGeometry } from './collectors/geometry';
import { collectAudio } from './collectors/audio';
import { collectSpeech } from './collectors/speech';
import { collectMedia } from './collectors/media';
import { collectEngine } from './collectors/engine';
import { collectSystem } from './collectors/system';
import { collectStatus } from './collectors/status';
import { generateFingerprint } from './fingerprint/generator';
import { evaluateConsistency, saveSessionToHistory } from './fingerprint/consistency';
import { runDiagnostics } from './diagnostics/evaluator';
import { classifyRisk } from './risk/classifier';
import { renderDashboard } from './dashboard/render';
import { SessionReport, ComponentHash } from './types';

async function runPrototype() {
  const container = document.getElementById('app');
  if (!container) return;

  container.innerHTML = `
    <div style="padding: 40px; text-align: center; font-family: monospace; color: #abb2bf;">
      <h2>CreepJS Prototype: Probing Browser Signals...</h2>
      <p style="margin-top: 10px; color: #636d83;">Evaluating hardware invariants, prototypes, and cross-thread consistency...</p>
    </div>
  `;

  const totalStart = performance.now();

  // Measure and collect signals
  const timeCall = async <T>(fn: () => Promise<T> | T): Promise<{ data: T; duration: number }> => {
    const t0 = performance.now();
    const data = await fn();
    const duration = Math.round((performance.now() - t0) * 100) / 100;
    return { data, duration };
  };

  const [
    webrtcRes,
    intlRes,
    headlessRes,
    resistanceRes,
    workerRes,
    webglRes,
    screenRes,
    canvasRes,
    fontsRes,
    geometryRes,
    audioRes,
    speechRes,
    mediaRes,
    engineRes,
    systemRes,
    statusRes
  ] = await Promise.all([
    timeCall(collectWebRTC),
    timeCall(collectIntl),
    timeCall(collectHeadless),
    timeCall(collectResistance),
    timeCall(collectWorker),
    timeCall(collectWebGL),
    timeCall(collectScreen),
    timeCall(collectCanvas),
    timeCall(collectFonts),
    timeCall(collectGeometry),
    timeCall(collectAudio),
    timeCall(collectSpeech),
    timeCall(collectMedia),
    timeCall(collectEngine),
    timeCall(collectSystem),
    timeCall(collectStatus)
  ]);

  const rawSignals = {
    webrtc: webrtcRes.data,
    intl: intlRes.data,
    headless: headlessRes.data,
    resistance: resistanceRes.data,
    worker: workerRes.data,
    webgl: webglRes.data,
    screen: screenRes.data,
    canvas: canvasRes.data,
    fonts: fontsRes.data,
    geometry: geometryRes.data,
    audio: audioRes.data,
    speech: speechRes.data,
    media: mediaRes.data,
    engine: engineRes.data,
    system: systemRes.data,
    status: statusRes.data,
    consistency: null as any
  };

  // Generate Fingerprints
  const fpResult = await generateFingerprint(rawSignals);

  // Evaluate Consistency against previous local history
  const consistency = evaluateConsistency({
    fpId: fpResult.fpId,
    userAgent: rawSignals.system.navigator.userAgent,
    gpuRenderer: rawSignals.webgl.unmaskedRenderer || rawSignals.webgl.renderer,
    screen: `${rawSignals.screen.width}x${rawSignals.screen.height}`,
    timezone: rawSignals.intl.timezone.name,
    canvasHash: fpResult.componentHashes.canvas,
    audioHash: fpResult.componentHashes.audio
  });
  rawSignals.consistency = consistency;

  // Run Diagnostics across 10 categories
  const diagnostics = runDiagnostics(rawSignals);

  // Classify Real User vs Fraud/Suspicious Risk
  const risk = classifyRisk(diagnostics);

  // Save current session to history for repeated session diffing
  saveSessionToHistory({
    fpId: fpResult.fpId,
    userAgent: rawSignals.system.navigator.userAgent,
    gpuRenderer: rawSignals.webgl.unmaskedRenderer || rawSignals.webgl.renderer,
    screen: `${rawSignals.screen.width}x${rawSignals.screen.height}`,
    timezone: rawSignals.intl.timezone.name,
    canvasHash: fpResult.componentHashes.canvas,
    audioHash: fpResult.componentHashes.audio
  });

  const totalTime = Math.round((performance.now() - totalStart) * 100) / 100;

  const components: Record<string, ComponentHash> = {
    webrtc: { hash: fpResult.componentHashes.webrtc || '8d5b3baa', executionTimeMs: webrtcRes.duration, data: webrtcRes.data },
    timezone: { hash: fpResult.componentHashes.timezone || '3582e316', executionTimeMs: intlRes.duration, data: intlRes.data },
    intl: { hash: fpResult.componentHashes.intl || '0beea116', executionTimeMs: intlRes.duration, data: intlRes.data },
    headless: { hash: 'ce2546a9', executionTimeMs: headlessRes.duration, data: headlessRes.data },
    worker: { hash: fpResult.componentHashes.worker || 'db519337', executionTimeMs: workerRes.duration, data: workerRes.data },
    webgl: { hash: fpResult.componentHashes.webgl || '426a1047', executionTimeMs: webglRes.duration, data: webglRes.data },
    screen: { hash: fpResult.componentHashes.screen || '9d83f24a', executionTimeMs: screenRes.duration, data: screenRes.data },
    canvas: { hash: fpResult.componentHashes.canvas || 'f7968695', executionTimeMs: canvasRes.duration, data: canvasRes.data },
    fonts: { hash: fpResult.componentHashes.fonts || 'bd49bd8d', executionTimeMs: fontsRes.duration, data: fontsRes.data },
    domRect: { hash: fpResult.componentHashes.domRect || '1d4eb14a', executionTimeMs: geometryRes.duration, data: geometryRes.data.domRect },
    svgRect: { hash: fpResult.componentHashes.svgRect || '43f113b0', executionTimeMs: geometryRes.duration, data: geometryRes.data.svgRect },
    audio: { hash: fpResult.componentHashes.audio || 'd0c60a78', executionTimeMs: audioRes.duration, data: audioRes.data }
  };

  const report: SessionReport = {
    id: `session_${Date.now()}`,
    timestamp: Date.now(),
    fpId: fpResult.fpId,
    fuzzyFp: fpResult.fuzzyFp,
    executionTimeMs: totalTime,
    risk,
    components,
    diagnostics,
    rawSignals
  };

  renderDashboard(container, report);
}

window.addEventListener('DOMContentLoaded', runPrototype);
