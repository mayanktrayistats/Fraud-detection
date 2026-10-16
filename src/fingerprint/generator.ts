import { generate64CharHash, hashToHex } from './hasher';
import { generateFuzzyFingerprint } from './fuzzy';

export interface FingerprintResult {
  fpId: string;
  fuzzyFp: string;
  componentHashes: Record<string, string>;
  compositeInputSummary: string[];
}

export async function generateFingerprint(signals: {
  webgl: any;
  canvas: any;
  audio: any;
  fonts: any;
  geometry: any;
  screen: any;
  intl: any;
  system: any;
  worker: any;
}): Promise<FingerprintResult> {
  const componentHashes: Record<string, string> = {
    webgl: signals.webgl.parametersHash ? hashToHex(`${signals.webgl.unmaskedRenderer}:${signals.webgl.parametersHash}`) : '426a1047',
    canvas: signals.canvas.dataHash || 'f7968695',
    audio: signals.audio.hash || 'd0c60a78',
    fonts: signals.fonts.fontsHash || 'bd49bd8d',
    domRect: signals.geometry.domRect.hash || '1d4eb14a',
    svgRect: signals.geometry.svgRect.hash || '43f113b0',
    screen: hashToHex(`${signals.screen.colorDepth}:${signals.screen.pixelDepth}:${signals.screen.devicePixelRatio}`),
    timezone: hashToHex(`${signals.intl.timezone.name}:${signals.intl.timezone.offsetMinutes}`),
    intl: hashToHex(`${signals.intl.intl.locale}:${signals.intl.intl.languageName}`),
    system: signals.system.navigator.hash || '2ed67156',
    worker: signals.worker.supported ? hashToHex(`${signals.worker.platform}:${signals.worker.cores}:${signals.worker.memory}`) : 'db519337'
  };

  // Hardware invariants for stable composite FP ID
  const invariantList = [
    `gpu:${signals.webgl.unmaskedRenderer || signals.webgl.renderer}`,
    `audio_sum:${signals.audio.sum}`,
    `audio_data:${signals.audio.dataHash}`,
    `canvas_text:${signals.canvas.textMetricFloat}`,
    `fonts_metric:${signals.fonts.metricsFloat}`,
    `dom_rect:${signals.geometry.domRect.elemsA}`,
    `svg_rect:${signals.geometry.svgRect.bBox}`,
    `color_depth:${signals.screen.colorDepth}`,
    `cores:${signals.system.device.cores}`,
    `platform:${signals.system.device.platform}`
  ];

  const compositeInput = invariantList.join('|');
  const fpId = await generate64CharHash(compositeInput);

  const fuzzyFp = generateFuzzyFingerprint({
    gpuRenderer: signals.webgl.unmaskedRenderer || signals.webgl.renderer || 'Intel',
    cores: signals.system.device.cores || 8,
    memory: signals.system.device.ram || 8,
    colorDepth: signals.screen.colorDepth || 24,
    canvasHash: componentHashes.canvas,
    audioHash: componentHashes.audio,
    platform: signals.system.device.platform || 'Win32'
  });

  return {
    fpId,
    fuzzyFp,
    componentHashes,
    compositeInputSummary: invariantList
  };
}
