export interface WorkerData {
  supported: boolean;
  userAgent: string;
  uaReduction: boolean;
  platform: string;
  cores: number | null;
  memory: number | null;
  language: string;
  currencyString: string;
  timezone: string;
  timezoneOffset: number | null;
  gpuVendor: string;
  gpuRenderer: string;
  confidence: string;
  userAgentData?: {
    brands: string;
    platform: string;
    platformVersion: string;
    architecture: string;
  } | null;
  mismatchesWithWindow: string[];
}

export async function collectWorker(): Promise<WorkerData> {
  const result: WorkerData = {
    supported: false,
    userAgent: 'unsupported',
    uaReduction: false,
    platform: 'unsupported',
    cores: null,
    memory: null,
    language: 'unsupported',
    currencyString: 'unsupported',
    timezone: 'unsupported',
    timezoneOffset: null,
    gpuVendor: 'unsupported',
    gpuRenderer: 'unsupported',
    confidence: 'moderate',
    userAgentData: null,
    mismatchesWithWindow: []
  };

  if (typeof Worker === 'undefined') {
    return result;
  }

  const runWorkerInstance = (workerUrl: string): Promise<any> => {
    return new Promise((resolve, reject) => {
      let worker: Worker;
      try {
        worker = new Worker(workerUrl);
      } catch (e) {
        return reject(e);
      }

      const timer = setTimeout(() => {
        try { worker.terminate(); } catch {}
        reject(new Error('Worker timeout'));
      }, 2000);

      worker.onmessage = (e) => {
        clearTimeout(timer);
        try { worker.terminate(); } catch {}
        resolve(e.data);
      };

      worker.onerror = (err) => {
        clearTimeout(timer);
        try { worker.terminate(); } catch {}
        reject(err);
      };

      worker.postMessage('start');
    });
  };

  let workerResponse: any = null;

  // 1. Try real same-origin worker file (/worker.js) first
  try {
    workerResponse = await runWorkerInstance('/worker.js');
  } catch (err) {
    // 2. Fallback to blob URL if static worker is not accessible
    try {
      const inlineCode = `
        self.onmessage = function() {
          let gpuVendor = 'unsupported';
          let gpuRenderer = 'unsupported';
          try {
            if (typeof OffscreenCanvas !== 'undefined') {
              const oc = new OffscreenCanvas(16, 16);
              const gl = oc.getContext('webgl') || oc.getContext('experimental-webgl');
              if (gl) {
                const dbg = gl.getExtension('WEBGL_debug_renderer_info');
                if (dbg) {
                  gpuVendor = gl.getParameter(dbg.UNMASKED_VENDOR_WEBGL) || 'unsupported';
                  gpuRenderer = gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL) || 'unsupported';
                }
              }
            }
          } catch(e) {}

          let uad = null;
          try {
            if (self.navigator && self.navigator.userAgentData) {
              const u = self.navigator.userAgentData;
              uad = {
                brands: Array.isArray(u.brands) ? u.brands.map(function(b){ return b.brand + ' ' + b.version; }).join(', ') : '',
                platform: u.platform || 'unsupported',
                platformVersion: 'unsupported',
                architecture: 'unsupported'
              };
            }
          } catch(e) {}

          let tz = 'unsupported';
          let tzOffset = null;
          try {
            tz = Intl.DateTimeFormat().resolvedOptions().timeZone || 'unsupported';
            tzOffset = new Date().getTimezoneOffset();
          } catch(e) {}

          let ua = 'unsupported';
          let plat = 'unsupported';
          let cores = null;
          let mem = null;
          let lang = 'unsupported';
          try {
            if (self.navigator) {
              ua = self.navigator.userAgent || 'unsupported';
              plat = self.navigator.platform || 'unsupported';
              cores = typeof self.navigator.hardwareConcurrency === 'number' ? self.navigator.hardwareConcurrency : null;
              mem = typeof self.navigator.deviceMemory === 'number' ? self.navigator.deviceMemory : null;
              lang = self.navigator.language || 'unsupported';
            }
          } catch(e) {}

          self.postMessage({
            userAgent: ua,
            platform: plat,
            cores: cores,
            memory: mem,
            language: lang,
            currencyString: '1 US dollar',
            timezone: tz,
            timezoneOffset: tzOffset,
            gpuVendor: gpuVendor,
            gpuRenderer: gpuRenderer,
            userAgentData: uad
          });
        };
      `;
      const blob = new Blob([inlineCode], { type: 'application/javascript' });
      const blobUrl = URL.createObjectURL(blob);
      workerResponse = await runWorkerInstance(blobUrl);
      URL.revokeObjectURL(blobUrl);
    } catch (e) {
      result.supported = false;
      return result;
    }
  }

  if (workerResponse) {
    result.supported = true;
    result.userAgent = workerResponse.userAgent;
    result.platform = workerResponse.platform;
    result.cores = workerResponse.cores;
    result.memory = workerResponse.memory;
    result.language = workerResponse.language;
    result.currencyString = workerResponse.currencyString;
    result.timezone = workerResponse.timezone;
    result.timezoneOffset = workerResponse.timezoneOffset;
    result.gpuVendor = workerResponse.gpuVendor;
    result.gpuRenderer = workerResponse.gpuRenderer;
    result.userAgentData = workerResponse.userAgentData;
    result.uaReduction = /Chrome\/1[0-9]{2}\.0\.0\.0/.test(workerResponse.userAgent);

    // Cross-check with window context
    const mismatches: string[] = [];
    if (workerResponse.userAgent !== 'unsupported' && workerResponse.userAgent !== navigator.userAgent) {
      mismatches.push(`userAgent (Window: "${navigator.userAgent}" vs Worker: "${workerResponse.userAgent}")`);
    }
    if (workerResponse.platform !== 'unsupported' && workerResponse.platform !== navigator.platform) {
      mismatches.push(`platform (Window: "${navigator.platform}" vs Worker: "${workerResponse.platform}")`);
    }
    if (workerResponse.cores !== null && workerResponse.cores !== navigator.hardwareConcurrency) {
      mismatches.push(`cores (Window: ${navigator.hardwareConcurrency} vs Worker: ${workerResponse.cores})`);
    }
    if (workerResponse.timezone !== 'unsupported' && workerResponse.timezone !== Intl.DateTimeFormat().resolvedOptions().timeZone) {
      mismatches.push(`timezone (Window: ${Intl.DateTimeFormat().resolvedOptions().timeZone} vs Worker: ${workerResponse.timezone})`);
    }
    result.mismatchesWithWindow = mismatches;
  }

  return result;
}
