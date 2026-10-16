import { SessionReport } from '../types';

export function renderDashboard(container: HTMLElement, report: SessionReport): void {
  const s = report.rawSignals;
  const riskClass = report.risk.tier.includes('Low')
    ? 'badge-low'
    : report.risk.tier.includes('Review')
    ? 'badge-review'
    : 'badge-high';

  // Context-aware type renderer
  const fmt = (v: any): string => {
    if (v === null) return '<span style="color: var(--text-dim);">null</span>';
    if (v === undefined) return '<span style="color: var(--text-dim);">-</span>';
    if (v === 'unsupported') return '<span style="color: var(--text-dim);">unsupported</span>';
    if (v === 'blocked') return '<span style="color: var(--amber-accent);">blocked</span>';
    if (Array.isArray(v)) {
      return v.length > 0 ? v.join(', ') : '<span style="color: var(--text-dim);">none</span>';
    }
    if (typeof v === 'boolean') {
      return v ? '<span style="color: var(--green-accent);">true</span>' : '<span style="color: var(--text-dim);">false</span>';
    }
    return String(v);
  };

  container.innerHTML = `
    <!-- Top Header Bar -->
    <div class="fp-header-container">
      <div class="fp-header-row">
        <div>
          <div class="fp-id-text"><strong>FP ID:</strong> ${fmt(report.fpId)}</div>
          <div class="fp-fuzzy-text"><strong>Fuzzy:</strong> ${fmt(report.fuzzyFp)}</div>
        </div>
        <div style="display: flex; align-items: center; gap: 10px;">
          <span class="badge-risk ${riskClass}">${report.risk.tier}</span>
          <span class="time-pill">${report.executionTimeMs} ms</span>
        </div>
      </div>
    </div>

    <!-- Row 1: WebRTC & Timezone/Intl -->
    <div class="grid-two">
      <!-- WebRTC Card -->
      <div class="creep-card">
        <div class="card-title-bar">
          <span class="card-title">WebRTC <span class="hash-link">${fmt(report.components.webrtc?.hash)}</span></span>
          <span class="exec-time">${report.components.webrtc?.executionTimeMs || 0} ms</span>
        </div>
        <div class="label-dim">sdp capabilities: <span class="hash-link">${fmt(s.webrtc?.sdpCapabilitiesHash)}</span></div>
        <div class="label-dim" style="margin-top: 6px;">host connection:</div>
        <div class="block-nested">${fmt(s.webrtc?.hostCandidate)}</div>
        <div class="label-dim">stun connection:</div>
        <div class="block-nested">${fmt(s.webrtc?.stunCandidate)}</div>
        <div style="display: flex; gap: 10px; margin-top: 8px;">
          <div style="flex: 1;">
            <div class="label-dim">foundation/ip:</div>
            <div class="block-nested">
              <div>type & base ip: ${fmt(s.webrtc?.foundation)}</div>
              <div>ip: ${fmt(s.webrtc?.publicIp)}</div>
            </div>
          </div>
          <div style="flex: 1;">
            <div class="label-dim">devices (${s.webrtc?.devices?.length || 0}):</div>
            <div class="block-nested" style="min-height: 52px; display: flex; align-items: center;">
              ${fmt(s.webrtc?.devices)}
            </div>
          </div>
        </div>
      </div>

      <!-- Timezone & Intl Card -->
      <div class="creep-card">
        <div class="card-title-bar">
          <span class="card-title">Timezone <span class="hash-link">${fmt(report.components.timezone?.hash)}</span></span>
          <span class="exec-time">${report.components.timezone?.executionTimeMs || 0} ms</span>
        </div>
        <div class="grid-two" style="margin-bottom: 0;">
          <div>
            <div class="block-nested">
              <div>${fmt(s.intl?.timezone?.name)}</div>
              <div>${fmt(s.intl?.timezone?.cityLocation)}</div>
              <div>${fmt(s.intl?.timezone?.historicOffset)}</div>
              <div>${fmt(s.intl?.timezone?.offsetMinutes)}</div>
            </div>
          </div>
          <div>
            <div class="label-dim" style="display: flex; justify-content: space-between;">
              <span>Intl <span class="hash-link">${fmt(report.components.intl?.hash)}</span></span>
              <span class="exec-time">${report.components.intl?.executionTimeMs || 0} ms</span>
            </div>
            <div class="block-nested">
              <div>${fmt(s.intl?.intl?.locale)}</div>
              <div>${fmt(s.intl?.intl?.monthTimeZone)}</div>
              <div>${fmt(s.intl?.intl?.languageName)}</div>
              <div>${fmt(s.intl?.intl?.compactNumber)}</div>
              <div>${fmt(s.intl?.intl?.relativeTime)}</div>
              <div>${fmt(s.intl?.intl?.pluralRuleZero)}</div>
              <div>${fmt(s.intl?.intl?.pluralRuleOne)}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Row 2: Headless & Resistance -->
    <div class="grid-two">
      <!-- Headless Card -->
      <div class="creep-card">
        <div class="card-title-bar">
          <span class="card-title">Headless <span class="hash-link">${fmt(report.components.headless?.hash)}</span></span>
          <span class="exec-time">${report.components.headless?.executionTimeMs || 0} ms</span>
        </div>
        <div>chromium: ${fmt(s.headless?.isChromium)}</div>
        <div>${s.headless?.likeHeadlessPercentage || 0}% like headless: <span class="hash-link">${fmt(report.components.headless?.hash)}</span></div>
        <div>${s.headless?.headlessPercentage || 0}% headless: <span class="hash-link">${s.headless?.webdriver ? 'detected' : '00000000'}</span></div>
        <div>${s.headless?.stealthPercentage || 0}% stealth: <span class="hash-link">${s.headless?.details?.tamperedPrototypes ? 'detected' : '00000000'}</span></div>
        <div class="label-dim" style="margin-top: 6px;">platform hints:</div>
        <div class="block-nested" style="display: flex; justify-content: space-between; align-items: center;">
          <span>${fmt(s.headless?.platformHints?.fonts)}</span>
          <span>${fmt(s.headless?.platformHints?.scores)}</span>
        </div>
      </div>

      <!-- Resistance Card -->
      <div class="creep-card">
        <div class="card-title-bar">
          <span class="card-title">Resistance <span class="hash-link">eb6b354a</span></span>
          <span class="exec-time">0.30 ms</span>
        </div>
        <div>privacy: ${fmt(s.resistance?.privacy)}</div>
        <div>security: ${fmt(s.resistance?.security)}</div>
        <div>mode: ${fmt(s.resistance?.mode)}</div>
        <div>extension: ${fmt(s.resistance?.extension)}</div>
      </div>
    </div>

    <!-- Row 3: Worker Scope Card -->
    <div class="creep-card" style="margin-bottom: 12px;">
      <div class="card-title-bar">
        <span class="card-title">Worker <span class="hash-link">${fmt(report.components.worker?.hash)}</span></span>
        <span class="exec-time">${report.components.worker?.executionTimeMs || 0} ms</span>
      </div>
      <div class="grid-two" style="margin-bottom: 0;">
        <div>
          <div class="label-dim">lang/timezone:</div>
          <div class="block-nested">
            <div>${fmt(s.worker?.language)} (${fmt(s.worker?.currencyString)})</div>
            <div>${fmt(s.worker?.timezone)} (${fmt(s.worker?.timezoneOffset)})</div>
          </div>
          <div class="label-dim" style="margin-top: 8px;">gpu: <span class="badge-risk badge-low" style="font-size: 10px;">${fmt(s.worker?.confidence)}</span></div>
          <div class="block-nested">
            <div>${fmt(s.worker?.gpuVendor)}</div>
            <div>${fmt(s.worker?.gpuRenderer)}</div>
          </div>
        </div>
        <div>
          <div class="label-dim" style="display: flex; justify-content: space-between;">
            <span>userAgent:</span>
            <span>${s.worker?.uaReduction ? 'ua reduction' : 'standard'}</span>
          </div>
          <div class="block-nested">${fmt(s.worker?.userAgent)}</div>
          <div class="label-dim">device:</div>
          <div class="block-nested">
            <div>${fmt(s.worker?.platform)}</div>
            <div>cores: ${fmt(s.worker?.cores)}, ram: ${fmt(s.worker?.memory)}</div>
          </div>
          <div class="label-dim">userAgentData:</div>
          <div class="block-nested" style="font-size: 11px;">
            <div>${s.worker?.userAgentData ? fmt(s.worker.userAgentData.brands) : '<span style="color: var(--text-dim);">unsupported</span>'}</div>
            <div>${s.worker?.userAgentData ? `${fmt(s.worker.userAgentData.platform)} [${fmt(s.worker.userAgentData.platformVersion)}] ${fmt(s.worker.userAgentData.architecture)}` : '<span style="color: var(--text-dim);">-</span>'}</div>
            <div style="color: var(--text-dim); text-align: right; margin-top: 4px;">WorkerGlobalScope</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Row 4: WebGL & Screen -->
    <div class="grid-two">
      <!-- WebGL Card -->
      <div class="creep-card">
        <div class="card-title-bar">
          <span class="card-title">WebGL <span class="hash-link">${fmt(report.components.webgl?.hash)}</span></span>
          <span class="exec-time">${report.components.webgl?.executionTimeMs || 0} ms</span>
        </div>
        <div style="display: flex; justify-content: space-between;">
          <div>
            <div>images: <span class="hash-link">${fmt(s.webgl?.imagesHash)}</span></div>
            <div>pixels: <span class="hash-link">${fmt(s.webgl?.pixelsHash)}</span></div>
            <div>params (${s.webgl?.parametersCount || 0}): <span class="hash-link">${fmt(s.webgl?.parametersHash)}</span></div>
            <div>exts (${s.webgl?.extensionsCount || 0}): <span class="hash-link">${fmt(s.webgl?.extensionsHash)}</span></div>
          </div>
          <div>
            ${s.webgl?.dataUrl ? `<img src="${s.webgl.dataUrl}" style="border: 1px solid #333; border-radius: 3px; width: 100px; height: 50px;" alt="WebGL triangle" />` : ''}
          </div>
        </div>
        <div class="label-dim" style="margin-top: 6px;">gpu: <span class="badge-risk badge-low" style="font-size: 10px;">${fmt(s.webgl?.confidence)}</span></div>
        <div class="block-nested">
          <div>${fmt(s.webgl?.unmaskedVendor)}</div>
          <div>${fmt(s.webgl?.unmaskedRenderer)}</div>
        </div>
      </div>

      <!-- Screen Card -->
      <div class="creep-card">
        <div class="card-title-bar">
          <span class="card-title">Screen <span class="hash-link">${fmt(report.components.screen?.hash)}</span></span>
          <span class="exec-time">${report.components.screen?.executionTimeMs || 0} ms</span>
        </div>
        <div style="display: flex; justify-content: space-between;">
          <div>
            <div>...screen: ${fmt(s.screen?.width)} x ${fmt(s.screen?.height)}</div>
            <div>....avail: ${fmt(s.screen?.availWidth)} x ${fmt(s.screen?.availHeight)}</div>
            <div>touch: ${fmt(s.screen?.touchSupport)}</div>
            <div>depth: ${fmt(s.screen?.colorDepth)}|${fmt(s.screen?.pixelDepth)}</div>
            <div style="margin-top: 4px;">viewport: ${fmt(s.screen?.viewportWidth)} x ${fmt(s.screen?.viewportHeight)}</div>
          </div>
          <div style="width: 140px;">
            <div class="viewport-box">
              <div>browser</div>
              <div>${s.screen?.isLandscape ? 'landscape' : 'portrait'}</div>
              <div>${fmt(s.screen?.orientationType)}</div>
              <div style="color: var(--cyan-accent);">${fmt(s.screen?.zoomRatio)}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Row 5: Canvas 2d & Fonts -->
    <div class="grid-two">
      <!-- Canvas 2d Card -->
      <div class="creep-card">
        <div class="card-title-bar">
          <span class="card-title">Canvas 2d <span class="hash-link">${fmt(report.components.canvas?.hash)}</span></span>
          <span class="exec-time">${report.components.canvas?.executionTimeMs || 0} ms</span>
        </div>
        <div>data: <span class="hash-link">${fmt(s.canvas?.dataHash)}</span></div>
        <div class="label-dim">rendering:</div>
        <div class="canvas-preview-row">
          ${s.canvas?.dataUrl ? `<img src="${s.canvas.dataUrl}" style="height: 38px; width: auto;" alt="Canvas rendering preview" />` : '<span style="color: var(--text-dim);">unsupported</span>'}
        </div>
        <div class="label-dim" style="margin-top: 6px;">textMetrics:</div>
        <div class="block-nested" style="display: flex; justify-content: space-between;">
          <span>${fmt(s.canvas?.textMetricFloat)}</span>
          <span>${fmt(s.canvas?.glyphs)}</span>
        </div>
      </div>

      <!-- Fonts Card -->
      <div class="creep-card">
        <div class="card-title-bar">
          <span class="card-title">Fonts <span class="hash-link">${fmt(report.components.fonts?.hash)}</span></span>
          <span class="exec-time">${report.components.fonts?.executionTimeMs || 0} ms</span>
        </div>
        <div style="display: flex; justify-content: space-between;">
          <div>load (${s.fonts?.loadedCount || 0}/${s.fonts?.totalTested || 0}): Like undefined</div>
          <div class="label-dim">apps: unsupported</div>
        </div>
        <div class="block-nested" style="font-size: 11px; max-height: 72px; overflow-y: auto;">
          ${s.fonts?.installedFonts?.length ? s.fonts.installedFonts.map((f: string) => `"${f}"`).join(', ') : '<span style="color: var(--text-dim);">none</span>'}
        </div>
        <div class="block-nested" style="display: flex; justify-content: space-between; margin-top: 6px;">
          <span>${fmt(s.fonts?.metricsFloat)}</span>
          <span>${fmt(s.fonts?.glyphs)}</span>
        </div>
      </div>
    </div>

    <!-- Row 6: DOMRect & SVGRect -->
    <div class="grid-two">
      <!-- DOMRect Card -->
      <div class="creep-card">
        <div class="card-title-bar">
          <span class="card-title">DOMRect <span class="hash-link">${fmt(report.components.domRect?.hash)}</span></span>
          <span class="exec-time">${report.components.domRect?.executionTimeMs || 0} ms</span>
        </div>
        <div>elems A: ${fmt(s.geometry?.domRect?.elemsA)}</div>
        <div>elems B: ${fmt(s.geometry?.domRect?.elemsB)}</div>
        <div>range A: ${fmt(s.geometry?.domRect?.rangeA)}</div>
        <div>range B: ${fmt(s.geometry?.domRect?.rangeB)}</div>
        <div class="block-nested" style="display: flex; justify-content: space-between; margin-top: 6px;">
          <span>${fmt(s.geometry?.domRect?.metricFloat)}</span>
          <span>${fmt(s.geometry?.domRect?.glyphs)}</span>
        </div>
      </div>

      <!-- SVGRect Card -->
      <div class="creep-card">
        <div class="card-title-bar">
          <span class="card-title">SVGRect <span class="hash-link">${fmt(report.components.svgRect?.hash)}</span></span>
          <span class="exec-time">${report.components.svgRect?.executionTimeMs || 0} ms</span>
        </div>
        <div>bBox: ${fmt(s.geometry?.svgRect?.bBox)}</div>
        <div>char: ${fmt(s.geometry?.svgRect?.char)}</div>
        <div>subs: ${fmt(s.geometry?.svgRect?.subs)}</div>
        <div>text: ${fmt(s.geometry?.svgRect?.text)}</div>
        <div class="block-nested" style="display: flex; justify-content: space-between; margin-top: 6px;">
          <span>${fmt(s.geometry?.svgRect?.metricFloat)}</span>
          <span>${fmt(s.geometry?.svgRect?.glyphs)}</span>
        </div>
      </div>
    </div>

    <!-- Row 7: Audio, Speech & Media -->
    <div class="grid-three">
      <!-- Audio Card -->
      <div class="creep-card">
        <div class="card-title-bar">
          <span class="card-title">Audio <span class="hash-link">${fmt(report.components.audio?.hash)}</span></span>
          <span class="exec-time">${report.components.audio?.executionTimeMs || 0} ms</span>
        </div>
        <div>sum: ${fmt(s.audio?.sum)}</div>
        <div>gain: ${fmt(s.audio?.gain)}</div>
        <div>freq: ${fmt(s.audio?.freq)}</div>
        <div>time: ${fmt(s.audio?.time)}</div>
        <div>trap: ${fmt(s.audio?.trap)}</div>
        <div>unique: ${fmt(s.audio?.unique)}</div>
        <div>data: <span class="hash-link">${fmt(s.audio?.dataHash)}</span></div>
        <div>copy: <span class="hash-link">${fmt(s.audio?.copyHash)}</span></div>
        <div>values: <span class="hash-link">${fmt(s.audio?.valuesHash)}</span></div>
      </div>

      <!-- Speech Card -->
      <div class="creep-card">
        <div class="card-title-bar">
          <span class="card-title">Speech <span class="hash-link">${fmt(s.speech?.hash)}</span></span>
          <span class="exec-time">0.40 ms</span>
        </div>
        <div>local (${s.speech?.localCount || 0}): <span class="hash-link">${fmt(s.speech?.localHash)}</span></div>
        <div>remote (${s.speech?.remoteCount || 0}): <span class="hash-link">${fmt(s.speech?.remoteHash)}</span></div>
        <div>lang (${s.speech?.languagesCount || 0}): <span class="hash-link">${fmt(s.speech?.languagesHash)}</span></div>
        <div class="label-dim" style="margin-top: 6px;">default:</div>
        <div class="block-nested" style="font-size: 11px;">
          ${fmt(s.speech?.defaultVoice)}
        </div>
      </div>

      <!-- Media Card -->
      <div class="creep-card">
        <div class="card-title-bar">
          <span class="card-title">Media <span class="hash-link">${fmt(s.media?.hash)}</span></span>
          <span class="exec-time">0.30 ms</span>
        </div>
        <div>mimes (${s.media?.supportedMimesCount || 0}/${s.media?.totalMimesCount || 12}): <span class="hash-link">${fmt(s.media?.mimesHash)}</span></div>
      </div>
    </div>

    <!-- Row 8: Features, CSS & Computed Style -->
    <div class="grid-two">
      <div class="creep-card">
        <div class="card-title-bar">
          <span class="card-title">Features: 🌐 ${fmt(s.engine?.features?.versionRange)}</span>
          <span class="exec-time">3.20 ms</span>
        </div>
        <div style="display: flex; justify-content: space-between; flex-wrap: wrap;">
          <div>JS/DOM: <span class="hash-link">${fmt(s.engine?.features?.jsDomHash)}</span></div>
          <div>CSS: <span class="hash-link">${fmt(s.engine?.features?.cssHash)}</span></div>
        </div>
        <div style="margin-top: 4px;">Window: <span class="hash-link">${fmt(s.engine?.features?.windowHash)}</span></div>
        <div style="margin-top: 8px; border-top: 1px solid #282c37; padding-top: 6px;">
          <div style="display: flex; justify-content: space-between;">
            <span class="card-title">CSS Media Queries <span class="hash-link">${fmt(s.engine?.cssMediaQueries?.hash)}</span></span>
            <span class="exec-time">0.90 ms</span>
          </div>
          <div>@media: <span class="hash-link">${fmt(s.engine?.cssMediaQueries?.atMediaHash)}</span></div>
          <div>matchMedia: <span class="hash-link">${fmt(s.engine?.cssMediaQueries?.matchMediaHash)}</span></div>
          <div>touch device: ${fmt(s.engine?.cssMediaQueries?.touchDevice)}</div>
          <div>screen query: ${fmt(s.engine?.cssMediaQueries?.screenQuery)}</div>
        </div>
      </div>

      <div class="creep-card">
        <div class="card-title-bar">
          <span class="card-title">Computed Style <span class="hash-link">${fmt(s.engine?.computedStyle?.hash)}</span></span>
          <span class="exec-time">6.10 ms</span>
        </div>
        <div>keys (${s.engine?.computedStyle?.keysCount || 0}): <span class="hash-link">${fmt(s.engine?.computedStyle?.keysHash)}</span></div>
        <div>system styles: <span class="hash-link">${fmt(s.engine?.computedStyle?.systemStylesHash)}</span></div>
        <div class="swatch-bar">
          ${(s.engine?.computedStyle?.systemColors || []).map((col: string) => `<span style="background: ${col};"></span>`).join('')}
        </div>
        <div style="margin-top: 12px; display: grid; grid-template-columns: 1fr 1fr; gap: 8px; font-size: 12px;">
          <div>Math <span class="hash-link">${fmt(s.system?.math?.hash)}</span>: details</div>
          <div>Error <span class="hash-link">${fmt(s.system?.error?.hash)}</span>: details</div>
          <div>Window <span class="hash-link">${fmt(s.system?.windowKeys?.hash)}</span> keys (${s.system?.windowKeys?.count || 0})</div>
          <div>HTMLElement <span class="hash-link">${fmt(s.system?.htmlElementKeys?.hash)}</span> keys (${s.system?.htmlElementKeys?.count || 0})</div>
        </div>
      </div>
    </div>

    <!-- Row 9: Navigator & Device -->
    <div class="creep-card" style="margin-bottom: 12px;">
      <div class="card-title-bar">
        <span class="card-title">Navigator <span class="hash-link">${fmt(s.system?.navigator?.hash)}</span></span>
        <span class="exec-time">28.60 ms</span>
      </div>
      <div class="grid-two" style="margin-bottom: 0;">
        <div>
          <div>properties (${s.system?.navigator?.propertiesCount || 0}): <span class="hash-link">${fmt(s.system?.navigator?.propertiesHash)}</span></div>
          <div>dnt: ${fmt(s.system?.navigator?.dnt)}</div>
          <div>gpc: ${fmt(s.system?.navigator?.gpc)}</div>
          <div>lang: ${fmt(s.system?.navigator?.languages)}</div>
          <div>mimeTypes (${s.system?.navigator?.mimeTypesCount || 0}): <span class="hash-link">${fmt(s.system?.navigator?.mimeTypesHash)}</span></div>
          <div>permissions (${s.system?.navigator?.permissionsCount || 0}): <span class="hash-link">${fmt(s.system?.navigator?.permissionsHash)}</span></div>
          <div>plugins (${s.system?.navigator?.pluginsCount || 0}): <span class="hash-link">${fmt(s.system?.navigator?.pluginsHash)}</span></div>
          <div>vendor: ${fmt(s.system?.navigator?.vendor)}</div>
          <div>webgpu: <span class="hash-link">${fmt(s.system?.navigator?.webgpuHash)}</span></div>
          <div class="label-dim" style="margin-top: 6px;">userAgentData:</div>
          <div class="block-nested">
            <div>${s.system?.navigator?.userAgentData ? fmt(s.system.navigator.userAgentData.brands) : '<span style="color: var(--text-dim);">unsupported</span>'}</div>
            <div>${s.system?.navigator?.userAgentData ? `${fmt(s.system.navigator.userAgentData.platform)} [${fmt(s.system.navigator.userAgentData.platformVersion)}] ${fmt(s.system.navigator.userAgentData.architecture)}` : '<span style="color: var(--text-dim);">-</span>'}</div>
          </div>
        </div>
        <div>
          <div class="label-dim">device:</div>
          <div class="block-nested">
            <div>${fmt(s.system?.device?.platform)}</div>
            <div>${fmt(s.system?.device?.osVersion)}</div>
            <div>cores: ${fmt(s.system?.device?.cores)}, ram: ${fmt(s.system?.device?.ram)}, touch: ${fmt(s.system?.device?.touch)}, ${s.system?.device?.hasBluetooth ? 'bluetooth' : ''}</div>
          </div>
          <div class="label-dim">ua parsed: ${fmt(s.system?.navigator?.parsedBrowser)}</div>
          <div class="label-dim" style="display: flex; justify-content: space-between;">
            <span>userAgent:</span>
            <span>${s.system?.navigator?.isUAReduction ? 'ua reduction' : 'standard'}</span>
          </div>
          <div class="block-nested">${fmt(s.system?.navigator?.userAgent)}</div>
          <div class="label-dim">appVersion:</div>
          <div class="block-nested">${fmt(s.system?.navigator?.appVersion)}</div>
        </div>
      </div>
    </div>

    <!-- Row 10: Status (Network, Battery, Memory) -->
    <div class="creep-card" style="margin-bottom: 16px;">
      <div class="card-title-bar">
        <span class="card-title">Status <span class="hash-link">${fmt(s.status?.hash)}</span></span>
        <span class="exec-time">2.10 ms</span>
      </div>
      <div class="grid-three" style="margin-bottom: 0;">
        <div>
          <div class="label-dim">network:</div>
          <div class="block-nested">
            <div>rtt: ${fmt(s.status?.network?.rtt)}, downlink: ${fmt(s.status?.network?.downlink)}</div>
            <div>effectiveType: ${fmt(s.status?.network?.effectiveType)}</div>
            <div>saveData: ${fmt(s.status?.network?.saveData)}</div>
          </div>
        </div>
        <div>
          <div class="label-dim">battery:</div>
          <div class="block-nested">
            <div>level: ${fmt(s.status?.battery?.level)}</div>
            <div>charging: ${fmt(s.status?.battery?.charging)}</div>
            <div>charge time: ${fmt(s.status?.battery?.chargeTime)}</div>
            <div>discharge time: ${fmt(s.status?.battery?.dischargeTime)}</div>
          </div>
        </div>
        <div>
          <div class="label-dim">available:</div>
          <div class="block-nested">
            <div>storage: ${fmt(s.status?.available?.storageQuota)} [${fmt(s.status?.available?.storageBytes)}]</div>
            <div>memory: ${fmt(s.status?.available?.memoryQuota)} [${fmt(s.status?.available?.memoryBytes)}]</div>
            <div class="label-dim" style="margin-top: 4px;">timing res:</div>
            <div>${fmt(s.status?.available?.timingResolutionA)}</div>
            <div>${fmt(s.status?.available?.timingResolutionB)}</div>
            <div style="margin-top: 4px;">stack: ${fmt(s.status?.available?.stackDepth)}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Diagnostic & Explainable Fraud Analysis Section -->
    <div class="diagnostic-container">
      <div class="diag-summary-title">
        <span>Diagnostic Evaluation & Fraud Risk Analysis</span>
        <span class="badge-risk ${riskClass}">${report.risk.tier} (${report.risk.score}/100)</span>
      </div>
      <div style="margin-top: 10px; color: var(--text-dim); font-size: 12px;">
        Detected Lies: <span style="color: var(--red-accent); font-weight: bold;">${report.risk.liesCount}</span> |
        Warnings: <span style="color: var(--amber-accent); font-weight: bold;">${report.risk.warningsCount}</span> |
        Automation Flag: <span style="color: ${report.risk.automationDetected ? 'var(--red-accent)' : 'var(--green-accent)'};">${report.risk.automationDetected ? 'TRUE' : 'FALSE'}</span> |
        Privacy Mode: <span>${report.risk.isPrivacyMode ? 'TRUE' : 'FALSE'}</span>
      </div>

      <div style="margin-top: 12px;">
        <strong>Verdict & Explanation:</strong>
        <ul style="margin-top: 6px; padding-left: 18px; font-size: 12.5px;">
          ${report.risk.reasons.map((r: string) => `<li style="margin-bottom: 4px;">${r}</li>`).join('')}
        </ul>
      </div>

      <table class="diag-table">
        <thead>
          <tr>
            <th>Test</th>
            <th>Category</th>
            <th>Status</th>
            <th>Observed Result</th>
            <th>Evidence / Explanation</th>
          </tr>
        </thead>
        <tbody>
          ${report.diagnostics.map((d: any) => `
            <tr>
              <td><strong>${d.testName}</strong></td>
              <td style="color: var(--text-dim);">${d.category}</td>
              <td>
                <span class="${d.status === 'detected' ? (d.isLie ? 'pill-detected' : 'pill-warning') : 'pill-clean'}">
                  ${d.status.toUpperCase()}
                </span>
              </td>
              <td style="word-break: break-all;">${typeof d.observedResult === 'object' ? JSON.stringify(d.observedResult) : d.observedResult}</td>
              <td style="color: var(--text-dim); font-size: 11.5px;">${d.explanation}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>

      <!-- Inter-session consistency diff inspector -->
      <div style="margin-top: 16px; border-top: 1px solid var(--border-color); padding-top: 12px;">
        <strong>Inter-Session Consistency Status:</strong>
        <div style="margin-top: 6px; font-size: 12px;">
          Previous Sessions Recorded: ${s.consistency?.previousSessionCount || 0} |
          FP ID Match: <span style="color: ${s.consistency?.fpIdMatchesPrevious ? 'var(--green-accent)' : 'var(--amber-accent)'};">${s.consistency?.fpIdMatchesPrevious ? 'MATCHES PREVIOUS' : 'FIRST VISIT / MUTATED'}</span>
        </div>
        ${s.consistency?.anomaliesDetected?.length > 0 ? `
          <div class="block-nested" style="border-color: rgba(224, 108, 117, 0.4); color: var(--red-accent); margin-top: 8px;">
            ${s.consistency.anomaliesDetected.join('<br>')}
          </div>
        ` : ''}
      </div>

      <div style="margin-top: 16px;">
        <button id="btn-export-json" class="btn-action">Export Session JSON</button>
        <button id="btn-rerun" class="btn-action">Re-Run Analysis</button>
      </div>
    </div>
  `;

  // Attach event handlers
  document.getElementById('btn-export-json')?.addEventListener('click', () => {
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `creep_session_${report.fpId.slice(0, 8)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  });

  document.getElementById('btn-rerun')?.addEventListener('click', () => {
    window.location.reload();
  });
}
