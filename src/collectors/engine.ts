import { hashToHex } from '../fingerprint/hasher';

export interface EngineData {
  features: {
    hash: string;
    versionRange: string;
    jsDomHash: string;
    cssHash: string;
    windowHash: string;
  };
  cssMediaQueries: {
    hash: string;
    atMediaHash: string;
    matchMediaHash: string;
    touchDevice: string;
    screenQuery: string;
  };
  computedStyle: {
    hash: string;
    keysCount: number;
    keysHash: string;
    systemStylesHash: string;
    systemColors: string[];
  };
}

export function collectEngine(): EngineData {
  // Real Computed style keys count & dynamic system colors
  const testDiv = document.createElement('div');
  document.body.appendChild(testDiv);
  const computed = window.getComputedStyle(testDiv);
  const keys: string[] = [];
  for (let i = 0; i < computed.length; i++) {
    keys.push(computed[i]);
  }
  const keysCount = keys.length;
  const keysHash = hashToHex(keys.join(','));

  // Dynamically test CSS system color values
  const systemColorKeywords = [
    'Canvas', 'CanvasText', 'LinkText', 'VisitedText', 'ActiveText',
    'ButtonFace', 'ButtonText', 'Field', 'FieldText', 'Highlight', 'HighlightText'
  ];
  const systemColors: string[] = [];
  for (const keyword of systemColorKeywords) {
    try {
      testDiv.style.color = keyword;
      const resolvedColor = window.getComputedStyle(testDiv).color;
      systemColors.push(resolvedColor || '#333333');
    } catch {
      systemColors.push('#333333');
    }
  }

  const systemStylesHash = hashToHex(systemColors.join(','));
  const computedStyleHash = hashToHex(`${keysHash}:${systemStylesHash}`);

  document.body.removeChild(testDiv);

  // Dynamic CSS Media Queries
  const screenQuery = `${screen.width} x ${screen.height}`;
  const mqFeatures = [
    '(prefers-color-scheme: dark)',
    '(prefers-reduced-motion: reduce)',
    '(hover: hover)',
    '(pointer: fine)',
    '(display-mode: browser)',
    '(orientation: landscape)'
  ];
  const mqResults = mqFeatures.map(q => `${q}:${window.matchMedia ? window.matchMedia(q).matches : false}`).join(';');
  const atMediaHash = hashToHex(mqResults);
  const matchMediaHash = atMediaHash;
  const cssMediaHash = hashToHex(`${atMediaHash}:${screenQuery}`);

  // Real feature detection version estimation
  let versionRange = 'Modern Browser';
  const hasObjectHasOwn = typeof (Object as any).hasOwn === 'function'; // Chrome 93+
  const hasArrayAt = typeof (Array.prototype as any).at === 'function'; // Chrome 92+
  const hasStructuredClone = typeof window.structuredClone === 'function'; // Chrome 98+
  const hasURLCanParse = typeof (URL as any).canParse === 'function'; // Chrome 120+
  const hasPromiseWithResolvers = typeof (Promise as any).withResolvers === 'function'; // Chrome 119+

  if (hasPromiseWithResolvers && hasURLCanParse) {
    versionRange = 'Chrome 120+ / ES2024';
  } else if (hasStructuredClone) {
    versionRange = 'Chrome 98-119';
  } else if (hasObjectHasOwn || hasArrayAt) {
    versionRange = 'Chrome 92-97';
  }

  const jsDomHash = hashToHex(Object.getOwnPropertyNames(Document.prototype).join(','));
  const cssHash = hashToHex(keys.slice(0, 50).join(','));
  const windowHash = hashToHex(Object.getOwnPropertyNames(window).slice(0, 50).join(','));

  return {
    features: {
      hash: hashToHex(`${jsDomHash}:${cssHash}:${windowHash}`),
      versionRange,
      jsDomHash,
      cssHash,
      windowHash
    },
    cssMediaQueries: {
      hash: cssMediaHash,
      atMediaHash,
      matchMediaHash,
      touchDevice: window.matchMedia && window.matchMedia('(pointer: coarse)').matches ? 'touch' : 'no touch',
      screenQuery
    },
    computedStyle: {
      hash: computedStyleHash,
      keysCount,
      keysHash,
      systemStylesHash,
      systemColors
    }
  };
}
