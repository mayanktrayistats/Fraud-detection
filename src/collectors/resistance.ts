export interface ResistanceData {
  privacy: string;
  security: string;
  mode: string;
  extension: string;
  hasBraveShields: boolean;
  hasFirefoxRFP: boolean;
  canvasNoiseDetected: boolean;
  isTorBrowser: boolean;
}

export async function collectResistance(): Promise<ResistanceData> {
  let hasBrave = false;
  try {
    if ((navigator as any).brave && typeof (navigator as any).brave.isBrave === 'function') {
      hasBrave = await (navigator as any).brave.isBrave();
    }
  } catch {}

  // Check Firefox RFP (resistFingerprinting)
  let hasFirefoxRFP = false;
  if (navigator.userAgent.includes('Firefox')) {
    if (new Date().getTimezoneOffset() === 0 && screen.width % 100 === 0 && screen.height % 100 === 0) {
      hasFirefoxRFP = true;
    }
  }

  // Check Canvas noise injection (anti-fingerprinting extension)
  let canvasNoiseDetected = false;
  try {
    const c1 = document.createElement('canvas');
    c1.width = 16;
    c1.height = 16;
    const ctx1 = c1.getContext('2d');
    if (ctx1) {
      ctx1.fillStyle = '#ff0055';
      ctx1.fillRect(0, 0, 16, 16);
      const data1 = ctx1.getImageData(0, 0, 16, 16).data;

      const c2 = document.createElement('canvas');
      c2.width = 16;
      c2.height = 16;
      const ctx2 = c2.getContext('2d');
      if (ctx2) {
        ctx2.fillStyle = '#ff0055';
        ctx2.fillRect(0, 0, 16, 16);
        const data2 = ctx2.getImageData(0, 0, 16, 16).data;

        for (let i = 0; i < data1.length; i++) {
          if (data1[i] !== data2[i]) {
            canvasNoiseDetected = true;
            break;
          }
        }
      }
    }
  } catch {}

  const isTor = hasFirefoxRFP && navigator.userAgent.includes('Firefox') && screen.width === 1000;

  return {
    privacy: hasBrave ? 'Brave Shields' : hasFirefoxRFP ? 'Firefox RFP' : canvasNoiseDetected ? 'Canvas Poisoning' : 'unknown',
    security: isTor ? 'Tor Security' : 'unknown',
    mode: isTor ? 'Tor' : hasBrave ? 'Brave' : 'unknown',
    extension: canvasNoiseDetected ? 'Fingerprint Defender / Canvas Blocker' : 'unknown',
    hasBraveShields: hasBrave,
    hasFirefoxRFP,
    canvasNoiseDetected,
    isTorBrowser: isTor
  };
}
