import { hashToHex } from '../fingerprint/hasher';

export interface StatusData {
  hash: string;
  network: {
    rtt: number | null;
    downlink: number | null;
    effectiveType: string;
    saveData: boolean | null;
  };
  battery: {
    level: string | 'unsupported';
    charging: boolean | null;
    chargeTime: string | null;
    dischargeTime: string | null;
  };
  available: {
    storageQuota: string | 'unsupported';
    storageBytes: number | null;
    memoryQuota: string | 'unsupported';
    memoryBytes: number | null;
    timingResolutionA: string | 'unsupported';
    timingResolutionB: string | 'unsupported';
    stackDepth: number;
  };
}

export async function collectStatus(): Promise<StatusData> {
  // Real Network Information API
  let rtt: number | null = null;
  let downlink: number | null = null;
  let effectiveType = 'unsupported';
  let saveData: boolean | null = null;

  const conn = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
  if (conn) {
    rtt = typeof conn.rtt === 'number' ? conn.rtt : null;
    downlink = typeof conn.downlink === 'number' ? conn.downlink : null;
    effectiveType = conn.effectiveType || 'unsupported';
    saveData = typeof conn.saveData === 'boolean' ? conn.saveData : null;
  }

  // Real Battery API
  let batteryLevel: string | 'unsupported' = 'unsupported';
  let charging: boolean | null = null;
  let chargeTime: string | null = null;
  let dischargeTime: string | null = null;

  try {
    if ((navigator as any).getBattery) {
      const b = await (navigator as any).getBattery();
      batteryLevel = `${Math.round(b.level * 100)}%`;
      charging = b.charging;
      chargeTime = b.chargingTime === 0 || b.chargingTime === Infinity ? 'fully charged' : `${b.chargingTime}s`;
      dischargeTime = b.dischargingTime === Infinity ? 'charging' : `${b.dischargingTime}s`;
    }
  } catch {}

  // Real Storage Quota
  let storageBytes: number | null = null;
  let storageQuota: string | 'unsupported' = 'unsupported';
  try {
    if (navigator.storage && navigator.storage.estimate) {
      const est = await navigator.storage.estimate();
      if (typeof est.quota === 'number') {
        storageBytes = est.quota;
        storageQuota = `${(est.quota / (1024 * 1024 * 1024)).toFixed(0)}GB`;
      }
    }
  } catch {}

  // Real Performance Memory
  let memoryBytes: number | null = null;
  let memoryQuota: string | 'unsupported' = 'unsupported';
  try {
    const perfMem = (performance as any).memory;
    if (perfMem && typeof perfMem.jsHeapSizeLimit === 'number') {
      memoryBytes = perfMem.jsHeapSizeLimit;
      memoryQuota = `${(perfMem.jsHeapSizeLimit / (1024 * 1024 * 1024)).toFixed(2)}GB`;
    }
  } catch {}

  // Dynamic timing resolution measurement
  let timingResolutionA: string | 'unsupported' = 'unsupported';
  let timingResolutionB: string | 'unsupported' = 'unsupported';
  try {
    const t0 = performance.now();
    let t1 = performance.now();
    let loops = 0;
    while (t1 === t0 && loops < 50000) {
      t1 = performance.now();
      loops++;
    }
    const diff = t1 - t0;
    timingResolutionA = diff.toFixed(17);
    timingResolutionB = (diff + 0.0000000949011612).toFixed(17);
  } catch {}

  // Dynamic call stack recursion depth
  let stackDepth = 0;
  try {
    const measureStack = (depth: number): number => {
      try {
        return measureStack(depth + 1);
      } catch {
        return depth;
      }
    };
    stackDepth = measureStack(0);
  } catch {
    stackDepth = 0;
  }

  const hash = hashToHex(`${effectiveType}:${storageBytes}:${memoryBytes}:${stackDepth}`);

  return {
    hash,
    network: {
      rtt,
      downlink,
      effectiveType,
      saveData
    },
    battery: {
      level: batteryLevel,
      charging,
      chargeTime,
      dischargeTime
    },
    available: {
      storageQuota,
      storageBytes,
      memoryQuota,
      memoryBytes,
      timingResolutionA,
      timingResolutionB,
      stackDepth
    }
  };
}
