import { hashToHex } from '../fingerprint/hasher';

export interface AudioData {
  hash: string;
  sum: string | null;
  gain: string | null;
  freq: string | null;
  time: string | null;
  trap: string | null;
  unique: number;
  dataHash: string;
  copyHash: string;
  valuesHash: string;
}

export async function collectAudio(): Promise<AudioData> {
  const result: AudioData = {
    hash: 'unsupported',
    sum: null,
    gain: null,
    freq: null,
    time: null,
    trap: null,
    unique: 0,
    dataHash: 'unsupported',
    copyHash: 'unsupported',
    valuesHash: 'unsupported'
  };

  const AudioCtx = window.OfflineAudioContext || (window as any).webkitOfflineAudioContext;
  if (!AudioCtx) {
    return result;
  }

  try {
    const sampleRate = 44100;
    const length = 44100;
    const context = new AudioCtx(1, length, sampleRate);

    const oscillator = context.createOscillator();
    oscillator.type = 'triangle';
    oscillator.frequency.value = 10000;

    const compressor = context.createDynamicsCompressor();
    compressor.threshold.value = -50;
    compressor.knee.value = 40;
    compressor.ratio.value = 12;
    compressor.attack.value = 0;
    compressor.release.value = 0.25;

    oscillator.connect(compressor);
    compressor.connect(context.destination);
    oscillator.start(0);

    const startTime = performance.now();
    const renderedBuffer = await context.startRendering();
    const renderDuration = performance.now() - startTime;
    const channelData = renderedBuffer.getChannelData(0);

    let sum = 0;
    let minNonZero = Infinity;
    let spectralEnergy = 0;
    const uniqueVals = new Set<number>();

    for (let i = 0; i < channelData.length; i++) {
      const val = channelData[i];
      const absVal = Math.abs(val);
      if (absVal > 0) {
        sum += absVal;
        spectralEnergy += absVal * (i % 1000);
        if (absVal < minNonZero) {
          minNonZero = absVal;
        }
      }
      if (i % 4 === 0) {
        uniqueVals.add(val);
      }
    }

    result.sum = sum.toFixed(14);
    result.unique = uniqueVals.size;

    const reductionVal = typeof compressor.reduction === 'number' ? compressor.reduction : -20.0;
    result.gain = reductionVal.toFixed(15);

    result.freq = spectralEnergy.toFixed(11);
    result.time = renderDuration.toFixed(11);
    result.trap = minNonZero !== Infinity ? minNonZero.toFixed(16) : '0';

    const sampleSlice = channelData.slice(4000, 5000);
    result.dataHash = hashToHex(sampleSlice.join(','));
    result.copyHash = result.dataHash;
    result.valuesHash = hashToHex(Array.from(uniqueVals).slice(0, 1000).join(','));
    result.hash = hashToHex(`${result.sum}:${result.dataHash}:${result.valuesHash}`);
  } catch {
    result.hash = 'blocked';
  }

  return result;
}
