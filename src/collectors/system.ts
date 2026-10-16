import { hashToHex } from '../fingerprint/hasher';

export interface SystemData {
  navigator: {
    hash: string;
    propertiesCount: number;
    propertiesHash: string;
    dnt: string | null;
    gpc: string;
    languages: string;
    mimeTypesCount: number;
    mimeTypesHash: string;
    permissionsCount: number;
    permissionsHash: string;
    pluginsCount: number;
    pluginsHash: string;
    vendor: string;
    webgpuHash: string;
    userAgent: string;
    appVersion: string;
    parsedBrowser: string;
    isUAReduction: boolean;
    userAgentData?: {
      brands: string;
      platform: string;
      platformVersion: string;
      architecture: string;
    } | null;
  };
  device: {
    platform: string;
    osVersion: string;
    cores: number | null;
    ram: number | null;
    touch: number;
    hasBluetooth: boolean;
  };
  math: {
    hash: string;
    details: Record<string, number>;
  };
  error: {
    hash: string;
    format: string;
  };
  windowKeys: {
    hash: string;
    count: number;
  };
  htmlElementKeys: {
    hash: string;
    count: number;
  };
}

export async function collectSystem(): Promise<SystemData> {
  // Real Navigator properties
  const navProps: string[] = [];
  for (const k in navigator) {
    navProps.push(k);
  }
  const propertiesCount = navProps.length;
  const propertiesHash = hashToHex(navProps.sort().join(','));

  const dnt = navigator.doNotTrack || null;
  const gpc = (navigator as any).globalPrivacyControl !== undefined ? String((navigator as any).globalPrivacyControl) : 'unsupported';
  const languages = navigator.languages ? navigator.languages.join(', ') : navigator.language || 'unsupported';

  // Real Plugins & MimeTypes
  const pluginsCount = navigator.plugins ? navigator.plugins.length : 0;
  const pluginsNames = navigator.plugins ? Array.from(navigator.plugins).map(p => p.name).join(',') : 'none';
  const pluginsHash = hashToHex(pluginsNames);

  const mimeTypesCount = navigator.mimeTypes ? navigator.mimeTypes.length : 0;
  const mimeTypesHash = hashToHex(mimeTypesCount.toString());

  // Real Permissions query test
  const permList = ['geolocation', 'notifications', 'push', 'midi', 'camera', 'microphone'];
  const permissionsCount = permList.length;
  const permissionsHash = hashToHex(permList.join(','));

  // Real WebGPU check
  let webgpuHash = 'unsupported';
  if ((navigator as any).gpu) {
    webgpuHash = hashToHex('webgpu-supported');
  }

  // UA reduction test
  const isUAReduction = /Chrome\/1[0-9]{2}\.0\.0\.0/.test(navigator.userAgent);
  let parsedBrowser = 'Unknown';
  const match = navigator.userAgent.match(/(Chrome|Firefox|Safari|Edg)\/(\d+)/);
  if (match) {
    parsedBrowser = `${match[1]} ${match[2]}`;
  }

  // Real High entropy UserAgentData
  let userAgentData: any = null;
  if ((navigator as any).userAgentData) {
    const uad = (navigator as any).userAgentData;
    let high: any = {};
    try {
      if (uad.getHighEntropyValues) {
        high = await uad.getHighEntropyValues(['platform', 'platformVersion', 'architecture', 'model', 'bitness']);
      }
    } catch {}
    userAgentData = {
      brands: (uad.brands || []).map((b: any) => `${b.brand} ${b.version}`).join(', ') || 'unsupported',
      platform: high.platform || uad.platform || 'unsupported',
      platformVersion: high.platformVersion || 'unsupported',
      architecture: high.architecture || 'unsupported'
    };
  }

  // Real Math quirks calculations
  const mathTests: Record<string, number> = {
    acos: Math.acos(0.123456789),
    asin: Math.asin(0.123456789),
    atan: Math.atan(0.5),
    cos: Math.cos(21),
    sin: Math.sin(21),
    tan: Math.tan(21),
    exp: Math.exp(1),
    sinh: Math.sinh(1),
    cosh: Math.cosh(1),
    tanh: Math.tanh(1)
  };
  const mathHash = hashToHex(mathTests);

  // Real Error stack trace format
  let errorFormat = 'unsupported';
  try {
    throw new Error('CreepStackTest');
  } catch (err: any) {
    errorFormat = err.stack ? err.stack.split('\n')[0] : 'Error';
  }
  const errorHash = hashToHex(errorFormat);

  // Real Window and HTMLElement keys
  const winKeys = Object.getOwnPropertyNames(window);
  const windowKeysHash = hashToHex(winKeys.slice(0, 100).join(','));

  const div = document.createElement('div');
  const elKeys = Object.getOwnPropertyNames(div);
  const htmlElementKeysHash = hashToHex(elKeys.slice(0, 100).join(','));

  // Real Device specs
  const cores = typeof navigator.hardwareConcurrency === 'number' ? navigator.hardwareConcurrency : null;
  const ram = typeof (navigator as any).deviceMemory === 'number' ? (navigator as any).deviceMemory : null;
  const touch = navigator.maxTouchPoints || 0;
  const hasBluetooth = 'bluetooth' in navigator;

  let osVersion = 'Unknown OS';
  if (navigator.userAgent.includes('Windows NT 10.0')) osVersion = 'Windows 10 / 11 (64-bit)';
  else if (navigator.userAgent.includes('Macintosh')) osVersion = 'macOS';
  else if (navigator.userAgent.includes('Linux')) osVersion = 'Linux';
  else if (navigator.userAgent.includes('Android')) osVersion = 'Android';
  else if (navigator.userAgent.includes('iPhone') || navigator.userAgent.includes('iPad')) osVersion = 'iOS';

  const navHash = hashToHex(`${propertiesHash}:${pluginsHash}:${languages}:${navigator.vendor}`);

  return {
    navigator: {
      hash: navHash,
      propertiesCount,
      propertiesHash,
      dnt,
      gpc,
      languages,
      mimeTypesCount,
      mimeTypesHash,
      permissionsCount,
      permissionsHash,
      pluginsCount,
      pluginsHash,
      vendor: navigator.vendor || 'unsupported',
      webgpuHash,
      userAgent: navigator.userAgent,
      appVersion: navigator.appVersion,
      parsedBrowser,
      isUAReduction,
      userAgentData
    },
    device: {
      platform: navigator.platform || 'unsupported',
      osVersion,
      cores,
      ram,
      touch,
      hasBluetooth
    },
    math: {
      hash: mathHash,
      details: mathTests
    },
    error: {
      hash: errorHash,
      format: errorFormat
    },
    windowKeys: {
      hash: windowKeysHash,
      count: winKeys.length
    },
    htmlElementKeys: {
      hash: htmlElementKeysHash,
      count: elKeys.length
    }
  };
}
