export interface HeadlessData {
  isChromium: boolean;
  webdriver: boolean;
  likeHeadlessPercentage: number;
  headlessPercentage: number;
  stealthPercentage: number;
  platformHints: {
    fonts: string;
    scores: string;
  };
  details: {
    hasChromeObject: boolean;
    permissionsMismatch: boolean;
    zeroDimensions: boolean;
    pluginsLength: number;
    cdpArtifacts: boolean;
    tamperedPrototypes: boolean;
  };
}

export async function collectHeadless(): Promise<HeadlessData> {
  const isChromium = !!(window as any).chrome || navigator.userAgent.includes('Chrome');

  // Real webdriver check
  const webdriver = !!navigator.webdriver;

  // Real CDP & Automation artifacts check
  const cdpProps = [
    '__webdriver_script_function',
    '__webdriver_evaluate',
    '__selenium_evaluate',
    '__fxdriver_evaluate',
    '__driver_evaluate',
    '__webdriver_unwrapped',
    '__selenium_unwrapped',
    '__fxdriver_unwrapped',
    '__driver_unwrapped',
    '_Selenium_IDE_Recorder',
    '_selenium',
    'calledSelenium',
    '$cdc_asdjflasutopfhvcZLmcfl_',
    'cdc_adoQpoasnfa76pfcZLmcfl_Array',
    'cdc_adoQpoasnfa76pfcZLmcfl_Promise',
    'cdc_adoQpoasnfa76pfcZLmcfl_Symbol'
  ];
  let cdpArtifacts = false;
  for (const prop of cdpProps) {
    if (prop in window || prop in document) {
      cdpArtifacts = true;
      break;
    }
  }

  // Real outer dimensions check
  const zeroDimensions = window.outerWidth === 0 && window.outerHeight === 0;

  // Real notification permissions check
  let permissionsMismatch = false;
  try {
    if (navigator.permissions && navigator.permissions.query) {
      const p = await navigator.permissions.query({ name: 'notifications' as PermissionName });
      if (Notification.permission === 'denied' && p.state === 'prompt') {
        permissionsMismatch = true;
      }
    }
  } catch {}

  const pluginsLength = navigator.plugins ? navigator.plugins.length : 0;

  // Real prototype tampering check
  let tamperedPrototypes = false;
  try {
    const desc = Object.getOwnPropertyDescriptor(navigator, 'webdriver');
    if (desc && (desc.value === false || desc.get?.toString() !== 'function get webdriver() { [native code] }')) {
      tamperedPrototypes = true;
    }
    const toStringStr = Function.prototype.toString.call(navigator.constructor);
    if (!toStringStr.includes('[native code]')) {
      tamperedPrototypes = true;
    }
  } catch {
    tamperedPrototypes = true;
  }

  const hasChromeObject = !!(window as any).chrome;

  // Dynamic calculation based strictly on detected signals
  let headlessSignals = 0;
  if (webdriver) headlessSignals += 3;
  if (cdpArtifacts) headlessSignals += 3;
  if (permissionsMismatch) headlessSignals += 2;
  if (zeroDimensions) headlessSignals += 2;
  if (isChromium && !hasChromeObject) headlessSignals += 2;

  const headlessPercentage = Math.min(100, Math.round((headlessSignals / 6) * 100));
  const stealthPercentage = tamperedPrototypes ? 85 : 0;
  const likeHeadlessPercentage = headlessSignals > 0 ? headlessPercentage : 0;

  // Dynamic platform font hints test
  const testCanvas = document.createElement('canvas');
  const testCtx = testCanvas.getContext('2d');
  let platformFonts = 'not found';
  if (testCtx) {
    testCtx.font = '72px monospace';
    const baseW = testCtx.measureText('mmmmlli').width;
    testCtx.font = '72px "Segoe UI", monospace';
    const winW = testCtx.measureText('mmmmlli').width;
    testCtx.font = '72px "Arial", monospace';
    const arialW = testCtx.measureText('mmmmlli').width;
    const fontsFound: string[] = [];
    if (winW !== baseW) fontsFound.push('Segoe UI');
    if (arialW !== baseW) fontsFound.push('Arial');
    platformFonts = fontsFound.length > 0 ? fontsFound.join(', ') : 'Default Fallback';
  }

  return {
    isChromium,
    webdriver,
    likeHeadlessPercentage,
    headlessPercentage,
    stealthPercentage,
    platformHints: {
      fonts: platformFonts,
      scores: `${headlessPercentage}% headless`
    },
    details: {
      hasChromeObject,
      permissionsMismatch,
      zeroDimensions,
      pluginsLength,
      cdpArtifacts,
      tamperedPrototypes
    }
  };
}
