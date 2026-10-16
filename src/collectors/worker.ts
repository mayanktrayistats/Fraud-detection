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

  const workerCode = `
    self.onmessage = async function() {
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
      } catch (e) {}

      let currencyStr = 'unsupported';
      try {
        currencyStr = (1).toLocaleString('en-US', { style: 'currency', currency: 'USD', currencyDisplay: 'name' });
      } catch(e) {}

      let uad = null;
      try {
        if (self.navigator.userAgentData && self.navigator.userAgentData.getHighEntropyValues) {
          const high = await self.navigator.userAgentData.getHighEntropyValues([
            'platform', 'platformVersion', 'architecture', 'model', 'bitness'
          ]);
          uad = {
            brands: (self.navigator.userAgentData.brands || []).map(b => b.brand + ' ' + b.version).join(', '),
            platform: high.platform || self.navigator.userAgentData.platform || 'unsupported',
            platformVersion: high.platformVersion || 'unsupported',
            architecture: high.architecture || 'unsupported'
          };
        }
      } catch(e) {}

      let tz = 'unsupported';
      try {
        tz = Intl.DateTimeFormat().resolvedOptions().timeZone || 'unsupported';
      } catch(e) {}

      self.postMessage({
        userAgent: self.navigator.userAgent || 'unsupported',
        platform: self.navigator.platform || 'unsupported',
        cores: typeof self.navigator.hardwareConcurrency === 'number' ? self.navigator.hardwareConcurrency : null,
        memory: typeof (self.navigator as any).deviceMemory === 'number' ? (self.navigator as any).deviceMemory : null,
        language: self.navigator.language || 'unsupported',
        currencyString: currencyStr,
        timezone: tz,
        timezoneOffset: new Date().getTimezoneOffset(),
        gpuVendor,
        gpuRenderer,
        userAgentData: uad
      });
    };
  `;

  try {
    const blob = new Blob([workerCode], { type: 'application/javascript' });
    const blobUrl = URL.createObjectURL(blob);
    const worker = new Worker(blobUrl);

    const workerResponse = await new Promise<any>((resolve, reject) => {
      const timer = setTimeout(() => {
        worker.terminate();
        URL.revokeObjectURL(blobUrl);
        reject(new Error('Worker timeout'));
      }, 1500);

      worker.onmessage = (e) => {
        clearTimeout(timer);
        worker.terminate();
        URL.revokeObjectURL(blobUrl);
        resolve(e.data);
      };

      worker.onerror = (err) => {
        clearTimeout(timer);
        worker.terminate();
        URL.revokeObjectURL(blobUrl);
        reject(err);
      };

      worker.postMessage('start');
    });

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
  } catch {
    result.supported = false;
  }

  return result;
}
