import { hashToHex } from './hasher';

export function generateFuzzyFingerprint(signals: {
  gpuRenderer: string;
  cores: number;
  memory: number;
  colorDepth: number;
  canvasHash: string;
  audioHash: string;
  platform: string;
}): string {
  // Coarse bucketing for fuzzy clustering
  const coarseGpu = (signals.gpuRenderer || 'unknown').toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 16);
  const coarseCores = signals.cores >= 8 ? 'high-cpu' : 'std-cpu';
  const coarseRam = signals.memory >= 8 ? 'high-mem' : 'std-mem';
  const coarsePlatform = signals.platform.slice(0, 5);

  const part1 = hashToHex(`${coarseGpu}:${coarsePlatform}`, 101);
  const part2 = hashToHex(`${signals.canvasHash.slice(0, 4)}:${coarseCores}`, 202);
  const part3 = hashToHex(`${signals.audioHash.slice(0, 4)}:${coarseRam}`, 303);
  const part4 = hashToHex(`${coarseGpu}:${signals.colorDepth}`, 404);
  const part5 = hashToHex(`${coarsePlatform}:${coarseCores}:${coarseRam}`, 505);

  const rawPrefix = `${part1}${part2}${part3}${part4}${part5}`.slice(0, 48);
  // Pad the rest with 16 zeros like in CreepJS Fuzzy hash format:
  // e.g. "22455dbcb12584c32c294bb04de11da8fff553b00a0efefe21b1000000000000"
  return `${rawPrefix}0000000000000000`.slice(0, 64);
}
