# CreepJS-Inspired Browser Fingerprinting & Fraud Detection Prototype

A browser fingerprinting and diagnostic research prototype inspired by [CreepJS](https://abrahamjuliot.github.io/creepjs/). 

This prototype gathers hardware, rendering, thread, and browser API signals, models internal consistency invariants, and provides an explainable 3-tier risk classification (*Real User*, *Needs Review*, *High Risk/Fraud*).

---

## 1. Quick Start

### Install Dependencies
```bash
npm install
```

### Launch Interactive Dashboard
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### Run Controlled Automated Tests (Playwright)
```bash
npm test
```

---

## 2. Visual Architecture & Category Coverage

The UI directly mirrors the visual design, monospace typography, card groupings, execution timers, and sub-hash badges of CreepJS:

| Section Card | Core Metrics Collected | Fraud / Consistency Invariant Check |
| :--- | :--- | :--- |
| **Header Bar** | Composite `FP ID` (64-char hex), `Fuzzy FP` cluster hash, Execution time (ms), and Risk Badge. | Identical physical devices retain the same FP ID across sessions. |
| **WebRTC & Devices** | `host connection` (mDNS `.local`), `stun connection` (srflx IP), SDP hash, mic/audio/webcam counts. | Detects public IP leaks and proxy bypass attempts. |
| **Timezone & Intl** | Timezone offset (`-330`), `Asia, Calcutta`, epoch benchmark, Intl date/number/plural strings. | Catches timezone spoofing where `Date` contradicts `Intl`. |
| **Headless & Resistance** | `chromium: true`, `% like headless`, `% headless`, `% stealth`, platform font hints. | Detects automated drivers (`navigator.webdriver`, CDP artifacts, zero dimensions). |
| **Worker Scope** | Dedicated Web Worker instantiation: `gpuVendor`, `gpuRenderer`, `cores`, `ram`, `userAgent`. | **Hard Lie Detection**: Anti-detect scripts spoofing `window` fail to patch Web Worker scopes. |
| **WebGL & Screen** | Live rendered gradient triangle, 78 parameters, 67 extensions, Intel UHD/ANGLE Direct3D11, 1920x1080. | Graphics driver compatibility (e.g. macOS UA paired with Windows Direct3D is flagged). |
| **Canvas 2D & Fonts** | Rendered 5 glyphs (winding 'A', purple alien emoji, radial gradients, warped sphere, pixel mosaic), subpixel text metrics, installed fonts list (`Cambria Math`, `Segoe UI Emoji`, `Bahnschrift`). | Dynamic canvas noise injection detection; installed font metrics reveal host OS. |
| **DOMRect & SVGRect** | Sub-pixel float bounds: `elems A/B`, `range A/B`, `bBox`, `char`, `subs`, `text`. | Layout engine micro-differences across Blink, Gecko, and WebKit. |
| **Audio, Speech & Media**| `OfflineAudioContext` dynamics compressor sum (`124.0434...`), gain, freq, trap, speech voices list (`Microsoft David`). | Synthesized audio DSP consistency and native OS voice list leaks. |
| **Features & Engine** | Chrome 113-115+, CSS media queries, 1410 computed style keys, system styles color swatch bar. | Engine version consistency and CSS support quirks. |
| **System & Navigator** | Math precision details, Error stack formatting, window/HTMLElement key counts, `userAgentData`. | V8 math precision profile, high-entropy client hints alignment. |
| **Status** | Network (RTT, downlink, 4G), Battery (100% charging), storage quota (10GB), heap memory (4.09GB), stack depth. | System resource thresholds and timing clock resolution. |

---

## 3. Real Users vs. Fraud / Bot Classification

The prototype implements an explainable rule engine that distinguishes legitimate users from bots or spoofers:

1. **Real User (Low Risk)**:
   - Worker context strictly matches the Window context.
   - WebGL GPU renderer aligns with the reported Operating System.
   - Native prototypes are untampered (`navigator.webdriver === false`, native `toString()` format).
   - Canvas and Audio rendering are deterministic across multiple draws.
   - Screen geometry and viewport dimensions are physically valid.

2. **Needs Further Review (Privacy / Anomalous)**:
   - Known privacy modes detected (Brave Shields, Firefox `privacy.resistFingerprinting`, Tor).
   - Canvas noise injector extensions detected (random pixel alterations).
   - Missing optional hardware APIs (camera/mic permissions blocked).
   - *These sessions are not flagged as fraud, recognizing that privacy protections are legitimate.*

3. **High Risk (Suspicious / Fraud / Bot)**:
   - **Worker vs. Window Lie**: User-Agent or timezone differs between the main window and Web Worker.
   - **GPU vs. OS Contradiction**: User-Agent claims macOS/iOS, but WebGL reports Windows DirectX (`Direct3D11`) or Linux VM software emulation (`SwiftShader` / `llvmpipe`).
   - **Headless Artifacts**: `navigator.webdriver === true`, window `outerWidth === 0 && outerHeight === 0`, or permission mismatch.
   - **Prototype Tampering**: Hooked getters on native objects or non-native `Function.prototype.toString`.
   - **Profile Rotation Anomaly**: Inter-session consistency detects rotating User-Agents while underlying hardware hashes remain identical.

---

## 4. Controlled Test Matrix

Automated verification suite located in `tests/controlled-matrix.spec.ts`:
- **Test 1**: Automation and Headless detection under Playwright.
- **Test 2**: Repeated session consistency verification (`MATCHES PREVIOUS` FP ID).
- **Test 3**: Worker vs Window scope parity (detecting selective `window` injection).
- **Test 4**: Hardware & GPU vs OS inconsistency detection (spoofed Mac UA on Windows/Direct3D).
- **Test 5**: JSON session report export and re-run capability.

All tests execute and pass via `npm test`.
