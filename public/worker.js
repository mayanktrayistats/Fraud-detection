self.onmessage = async function () {
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

  let currencyStr = '1 US dollar';
  try {
    currencyStr = (1).toLocaleString('en-US', { style: 'currency', currency: 'USD' });
  } catch (e) {}

  let uad = null;
  try {
    if (self.navigator && self.navigator.userAgentData) {
      const u = self.navigator.userAgentData;
      let brands = '';
      if (Array.isArray(u.brands)) {
        brands = u.brands.map(b => b.brand + ' ' + b.version).join(', ');
      }
      let platform = u.platform || 'unsupported';
      let platformVersion = 'unsupported';
      let architecture = 'unsupported';
      if (typeof u.getHighEntropyValues === 'function') {
        try {
          const high = await u.getHighEntropyValues(['platform', 'platformVersion', 'architecture']);
          if (high) {
            platform = high.platform || platform;
            platformVersion = high.platformVersion || platformVersion;
            architecture = high.architecture || architecture;
          }
        } catch (e) {}
      }
      uad = { brands, platform, platformVersion, architecture };
    }
  } catch (e) {}

  let tz = 'unsupported';
  let tzOffset = null;
  try {
    tz = Intl.DateTimeFormat().resolvedOptions().timeZone || 'unsupported';
    tzOffset = new Date().getTimezoneOffset();
  } catch (e) {}

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
  } catch (e) {}

  self.postMessage({
    userAgent: ua,
    platform: plat,
    cores: cores,
    memory: mem,
    language: lang,
    currencyString: currencyStr,
    timezone: tz,
    timezoneOffset: tzOffset,
    gpuVendor: gpuVendor,
    gpuRenderer: gpuRenderer,
    userAgentData: uad
  });
};
