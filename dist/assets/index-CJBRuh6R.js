(function(){const a=document.createElement("link").relList;if(a&&a.supports&&a.supports("modulepreload"))return;for(const t of document.querySelectorAll('link[rel="modulepreload"]'))n(t);new MutationObserver(t=>{for(const i of t)if(i.type==="childList")for(const c of i.addedNodes)c.tagName==="LINK"&&c.rel==="modulepreload"&&n(c)}).observe(document,{childList:!0,subtree:!0});function e(t){const i={};return t.integrity&&(i.integrity=t.integrity),t.referrerPolicy&&(i.referrerPolicy=t.referrerPolicy),t.crossOrigin==="use-credentials"?i.credentials="include":t.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function n(t){if(t.ep)return;t.ep=!0;const i=e(t);fetch(t.href,i)}})();function En(s,a=0){let e=s.length&3,n=s.length-e,t=a;const i=3432918353,c=461845907;let r=0;for(;r<n;){let o=s.charCodeAt(r)&255|(s.charCodeAt(++r)&255)<<8|(s.charCodeAt(++r)&255)<<16|(s.charCodeAt(++r)&255)<<24;++r,o=Math.imul(o,i),o=o<<15|o>>>17,o=Math.imul(o,c),t^=o,t=t<<13|t>>>19,t=Math.imul(t,5)+3864292196}let d=0;switch(e){case 3:d^=(s.charCodeAt(r+2)&255)<<16;case 2:d^=(s.charCodeAt(r+1)&255)<<8;case 1:d^=s.charCodeAt(r)&255,d=Math.imul(d,i),d=d<<15|d>>>17,d=Math.imul(d,c),t^=d}return t^=s.length,t^=t>>>16,t=Math.imul(t,2246822507),t^=t>>>13,t=Math.imul(t,3266489909),t^=t>>>16,t>>>0}function h(s,a=0){const e=typeof s=="string"?s:JSON.stringify(s);return En(e,a).toString(16).padStart(8,"0")}async function Fn(s){try{const e=new TextEncoder().encode(s),n=await crypto.subtle.digest("SHA-256",e);return Array.from(new Uint8Array(n)).map(i=>i.toString(16).padStart(2,"0")).join("")}catch{const a=h(s,1),e=h(s,2),n=h(s,3),t=h(s,4),i=h(s,5),c=h(s,6),r=h(s,7),d=h(s,8);return`${a}${e}${n}${t}${i}${c}${r}${d}`}}async function Wn(){const s={supported:!1,hostCandidate:"unsupported",stunCandidate:"unsupported",foundation:"unsupported",publicIp:"unsupported",sdpCapabilitiesHash:"unsupported",devices:[],rawCandidates:[]},a=window.RTCPeerConnection||window.webkitRTCPeerConnection||window.mozRTCPeerConnection;if(!a)return s;s.supported=!0,s.hostCandidate="blocked",s.stunCandidate="blocked",s.foundation="blocked",s.publicIp="blocked";try{if(navigator.mediaDevices&&navigator.mediaDevices.enumerateDevices){const e=await navigator.mediaDevices.enumerateDevices(),n=new Set;e.forEach(t=>{t.kind==="audioinput"&&n.add("mic"),t.kind==="audiooutput"&&n.add("audio"),t.kind==="videoinput"&&n.add("webcam")}),s.devices=Array.from(n)}}catch{}try{await new Promise(e=>{const n={iceServers:[{urls:"stun:stun.l.google.com:19302"}]},t=new a(n);let i=!1;const c=()=>{if(!i){i=!0;try{t.close()}catch{}e()}},r=setTimeout(c,2e3);t.onicecandidate=d=>{if(!d.candidate||!d.candidate.candidate){c();return}const o=d.candidate.candidate;if(s.rawCandidates.push(o),o.includes("typ host")){s.hostCandidate=o;const p=o.match(/candidate:(\d+)/);p&&s.foundation==="blocked"&&(s.foundation=p[1])}else if(o.includes("typ srflx")){s.stunCandidate=o;const p=o.split(" ");if(p[4]&&(s.publicIp=p[4]),p[0]){const m=p[0].match(/candidate:(\d+)/);m&&(s.foundation=m[1])}}},t.createDataChannel("creep-test"),t.createOffer().then(d=>(s.sdpCapabilitiesHash=h(d.sdp||""),t.setLocalDescription(d))).catch(()=>{c()})})}catch{}return s}function Ln(){const s=new Date,a=s.getTimezoneOffset(),n=Intl.DateTimeFormat().resolvedOptions(),t=n.timeZone||"unknown",i=t.replace("/",", ").replace("_"," "),r=new Date(-2702870600800).getTime();let d="";try{const g=new Intl.DateTimeFormat("en-US",{timeZoneName:"long"}).formatToParts(s).find(l=>l.type==="timeZoneName");d=g?g.value:t}catch{d=t}let o="";try{const v=new Date(2024,6,1);o=`${new Intl.DateTimeFormat("en-US",{month:"long"}).format(v)} at ${d}`}catch{o="July"}let p="English";try{Intl.DisplayNames&&(p=new Intl.DisplayNames(["en-US"],{type:"language"}).of("en-US")||"American English")}catch{p="American English"}let m="21 million";try{m=new Intl.NumberFormat("en-US",{notation:"compact",compactDisplay:"long"}).format(21e6)}catch{m="21M"}let u="next year";try{u=new Intl.RelativeTimeFormat("en-US",{numeric:"auto"}).format(1,"year")}catch{u="in 1 year"}let b="0 or 1",y="one";try{const v=new Intl.PluralRules("en-US");y=v.select(1),b=`${v.select(0)} or ${v.select(1)}`}catch{}return{timezone:{name:d,cityLocation:i,offsetMinutes:a,historicOffset:r,timezoneString:d},intl:{locale:n.locale||"en-US",monthTimeZone:o,languageName:p,compactNumber:m,relativeTime:u,pluralRuleZero:b,pluralRuleOne:y}}}async function zn(){var g;const s=!!window.chrome||navigator.userAgent.includes("Chrome"),a=!!navigator.webdriver,e=["__webdriver_script_function","__webdriver_evaluate","__selenium_evaluate","__fxdriver_evaluate","__driver_evaluate","__webdriver_unwrapped","__selenium_unwrapped","__fxdriver_unwrapped","__driver_unwrapped","_Selenium_IDE_Recorder","_selenium","calledSelenium","$cdc_asdjflasutopfhvcZLmcfl_","cdc_adoQpoasnfa76pfcZLmcfl_Array","cdc_adoQpoasnfa76pfcZLmcfl_Promise","cdc_adoQpoasnfa76pfcZLmcfl_Symbol"];let n=!1;for(const l of e)if(l in window||l in document){n=!0;break}const t=window.outerWidth===0&&window.outerHeight===0;let i=!1;try{if(navigator.permissions&&navigator.permissions.query){const l=await navigator.permissions.query({name:"notifications"});Notification.permission==="denied"&&l.state==="prompt"&&(i=!0)}}catch{}const c=navigator.plugins?navigator.plugins.length:0;let r=!1;try{const l=Object.getOwnPropertyDescriptor(navigator,"webdriver");l&&(l.value===!1||((g=l.get)==null?void 0:g.toString())!=="function get webdriver() { [native code] }")&&(r=!0),Function.prototype.toString.call(navigator.constructor).includes("[native code]")||(r=!0)}catch{r=!0}const d=!!window.chrome;let o=0;a&&(o+=3),n&&(o+=3),i&&(o+=2),t&&(o+=2),s&&!d&&(o+=2);const p=Math.min(100,Math.round(o/6*100)),m=r?85:0,u=o>0?p:0,y=document.createElement("canvas").getContext("2d");let v="not found";if(y){y.font="72px monospace";const l=y.measureText("mmmmlli").width;y.font='72px "Segoe UI", monospace';const $=y.measureText("mmmmlli").width;y.font='72px "Arial", monospace';const f=y.measureText("mmmmlli").width,w=[];$!==l&&w.push("Segoe UI"),f!==l&&w.push("Arial"),v=w.length>0?w.join(", "):"Default Fallback"}return{isChromium:s,webdriver:a,likeHeadlessPercentage:u,headlessPercentage:p,stealthPercentage:m,platformHints:{fonts:v,scores:`${p}% headless`},details:{hasChromeObject:d,permissionsMismatch:i,zeroDimensions:t,pluginsLength:c,cdpArtifacts:n,tamperedPrototypes:r}}}async function On(){let s=!1;try{navigator.brave&&typeof navigator.brave.isBrave=="function"&&(s=await navigator.brave.isBrave())}catch{}let a=!1;navigator.userAgent.includes("Firefox")&&new Date().getTimezoneOffset()===0&&screen.width%100===0&&screen.height%100===0&&(a=!0);let e=!1;try{const t=document.createElement("canvas");t.width=16,t.height=16;const i=t.getContext("2d");if(i){i.fillStyle="#ff0055",i.fillRect(0,0,16,16);const c=i.getImageData(0,0,16,16).data,r=document.createElement("canvas");r.width=16,r.height=16;const d=r.getContext("2d");if(d){d.fillStyle="#ff0055",d.fillRect(0,0,16,16);const o=d.getImageData(0,0,16,16).data;for(let p=0;p<c.length;p++)if(c[p]!==o[p]){e=!0;break}}}}catch{}const n=a&&navigator.userAgent.includes("Firefox")&&screen.width===1e3;return{privacy:s?"Brave Shields":a?"Firefox RFP":e?"Canvas Poisoning":"unknown",security:n?"Tor Security":"unknown",mode:n?"Tor":s?"Brave":"unknown",extension:e?"Fingerprint Defender / Canvas Blocker":"unknown",hasBraveShields:s,hasFirefoxRFP:a,canvasNoiseDetected:e,isTorBrowser:n}}async function In(){const s={supported:!1,userAgent:"unsupported",uaReduction:!1,platform:"unsupported",cores:null,memory:null,language:"unsupported",currencyString:"unsupported",timezone:"unsupported",timezoneOffset:null,gpuVendor:"unsupported",gpuRenderer:"unsupported",confidence:"moderate",userAgentData:null,mismatchesWithWindow:[]};if(typeof Worker>"u")return s;const a=`
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
  `;try{const e=new Blob([a],{type:"application/javascript"}),n=URL.createObjectURL(e),t=new Worker(n),i=await new Promise((r,d)=>{const o=setTimeout(()=>{t.terminate(),URL.revokeObjectURL(n),d(new Error("Worker timeout"))},1500);t.onmessage=p=>{clearTimeout(o),t.terminate(),URL.revokeObjectURL(n),r(p.data)},t.onerror=p=>{clearTimeout(o),t.terminate(),URL.revokeObjectURL(n),d(p)},t.postMessage("start")});s.supported=!0,s.userAgent=i.userAgent,s.platform=i.platform,s.cores=i.cores,s.memory=i.memory,s.language=i.language,s.currencyString=i.currencyString,s.timezone=i.timezone,s.timezoneOffset=i.timezoneOffset,s.gpuVendor=i.gpuVendor,s.gpuRenderer=i.gpuRenderer,s.userAgentData=i.userAgentData,s.uaReduction=/Chrome\/1[0-9]{2}\.0\.0\.0/.test(i.userAgent);const c=[];i.userAgent!=="unsupported"&&i.userAgent!==navigator.userAgent&&c.push(`userAgent (Window: "${navigator.userAgent}" vs Worker: "${i.userAgent}")`),i.platform!=="unsupported"&&i.platform!==navigator.platform&&c.push(`platform (Window: "${navigator.platform}" vs Worker: "${i.platform}")`),i.cores!==null&&i.cores!==navigator.hardwareConcurrency&&c.push(`cores (Window: ${navigator.hardwareConcurrency} vs Worker: ${i.cores})`),i.timezone!=="unsupported"&&i.timezone!==Intl.DateTimeFormat().resolvedOptions().timeZone&&c.push(`timezone (Window: ${Intl.DateTimeFormat().resolvedOptions().timeZone} vs Worker: ${i.timezone})`),s.mismatchesWithWindow=c}catch{s.supported=!1}return s}function Bn(){const s={supported:!1,vendor:"",renderer:"",unmaskedVendor:"",unmaskedRenderer:"",parametersHash:"",parametersCount:0,extensionsHash:"",extensionsCount:0,pixelsHash:"",imagesHash:"",dataUrl:"",confidence:"moderate"},a=document.createElement("canvas");a.width=100,a.height=50;const e=a.getContext("webgl")||a.getContext("experimental-webgl");if(!e)return s;s.supported=!0,s.vendor=e.getParameter(e.VENDOR)||"",s.renderer=e.getParameter(e.RENDERER)||"";const n=e.getExtension("WEBGL_debug_renderer_info");n&&(s.unmaskedVendor=e.getParameter(n.UNMASKED_VENDOR_WEBGL)||"",s.unmaskedRenderer=e.getParameter(n.UNMASKED_RENDERER_WEBGL)||"");const t=e.getSupportedExtensions()||[];s.extensionsCount=t.length,s.extensionsHash=h(t.sort().join(","));const i=[3410,3411,3412,3413,3414,3415,2849,2884,2885,2886,2929,2930,2931,2932,2976,2977,2978,2979,3042,3379,34018,34024,34921,34929,34930,34076,34852,36346,36347,36348,34025,34042,34068,34069,34071,34072],c={};for(const r of i)try{const d=e.getParameter(r);c[r.toString(16)]=d instanceof Float32Array||d instanceof Int32Array?Array.from(d):d}catch{}s.parametersCount=Object.keys(c).length,s.parametersHash=h(c);try{const r=`
      attribute vec2 position;
      attribute vec3 color;
      varying vec3 vColor;
      void main() {
        gl_Position = vec4(position, 0.0, 1.0);
        vColor = color;
      }
    `,d=`
      precision mediump float;
      varying vec3 vColor;
      void main() {
        gl_FragColor = vec4(vColor, 1.0);
      }
    `,o=(u,b)=>{const y=e.createShader(u);return y?(e.shaderSource(y,b),e.compileShader(y),y):null},p=o(e.VERTEX_SHADER,r),m=o(e.FRAGMENT_SHADER,d);if(p&&m){const u=e.createProgram();if(u){e.attachShader(u,p),e.attachShader(u,m),e.linkProgram(u),e.useProgram(u);const b=new Float32Array([0,.7,1,.2,.4,-.8,-.7,.2,.8,1,.8,-.7,.9,.7,.1]),y=e.createBuffer();e.bindBuffer(e.ARRAY_BUFFER,y),e.bufferData(e.ARRAY_BUFFER,b,e.STATIC_DRAW);const v=e.getAttribLocation(u,"position"),g=e.getAttribLocation(u,"color");e.enableVertexAttribArray(v),e.vertexAttribPointer(v,2,e.FLOAT,!1,20,0),e.enableVertexAttribArray(g),e.vertexAttribPointer(g,3,e.FLOAT,!1,20,8),e.clearColor(.09,.09,.11,1),e.clear(e.COLOR_BUFFER_BIT),e.drawArrays(e.TRIANGLES,0,3);const l=new Uint8Array(a.width*a.height*4);e.readPixels(0,0,a.width,a.height,e.RGBA,e.UNSIGNED_BYTE,l),s.pixelsHash=h(l.slice(0,1024).join(",")),s.dataUrl=a.toDataURL(),s.imagesHash=h(s.dataUrl)}}}catch{}return s}function jn(){const s=screen.width||0,a=screen.height||0,e=screen.availWidth||0,n=screen.availHeight||0,t=screen.colorDepth||0,i=screen.pixelDepth||0,c=window.devicePixelRatio||1,r=navigator.maxTouchPoints||0,d=r>0||"ontouchstart"in window;let o="landscape-primary";try{screen.orientation&&screen.orientation.type&&(o=screen.orientation.type)}catch{}const p=window.innerWidth||0,m=window.innerHeight||0,u=window.outerWidth||0,b=window.outerHeight||0;return{width:s,height:a,availWidth:e,availHeight:n,colorDepth:t,pixelDepth:i,devicePixelRatio:c,touchSupport:d,maxTouchPoints:r,orientationType:o,viewportWidth:p,viewportHeight:m,outerWidth:u,outerHeight:b,zoomRatio:c,isLandscape:s>=a}}function Nn(){const s=document.createElement("canvas");s.width=240,s.height=60;const a=s.getContext("2d");let e="not found",n="",t="not found",i=!1;if(!a)return{dataHash:e,dataUrl:n,textMetricFloat:t,noiseDetected:i,glyphs:"not found"};try{a.textBaseline="top",a.font="32px sans-serif",a.fillStyle="#000000",a.fillText("A",10,10),a.fillStyle="#9b59b6",a.fillRect(50,15,6,6),a.fillRect(66,15,6,6),a.fillRect(46,23,30,8),a.fillRect(52,33,6,8),a.fillRect(64,33,6,8);const c=a.createRadialGradient(105,28,2,105,28,16);c.addColorStop(0,"#e74c3c"),c.addColorStop(.5,"#2ecc71"),c.addColorStop(1,"#3498db"),a.fillStyle=c,a.beginPath(),a.arc(105,28,16,0,Math.PI*2),a.fill();const r=a.createLinearGradient(135,12,165,44);r.addColorStop(0,"#f1c40f"),r.addColorStop(.5,"#e91e63"),r.addColorStop(1,"#00bcd4"),a.fillStyle=r,a.beginPath(),a.arc(150,28,16,0,Math.PI*1.6),a.fill();const d=["#f44336","#e91e63","#9c27b0","#673ab7","#3f51b5","#2196f3","#00bcd4","#009688","#4caf50","#8bc34a","#ffeb3b","#ff9800"];for(let m=0;m<4;m++)for(let u=0;u<4;u++)a.fillStyle=d[(m*4+u)%d.length],a.fillRect(180+u*7,14+m*7,7,7);n=s.toDataURL(),e=h(n),a.font='14.5px "Times New Roman", sans-serif';const o=a.measureText("😀🥷☕🎴🖤❄️"),p=o.width-Math.floor(o.width);t=(p>0?p:o.width).toFixed(18)}catch{}return{dataHash:e,dataUrl:n,textMetricFloat:t,noiseDetected:i,glyphs:"😀 🥷 ☕ 🎴 🖤 ❄️"}}const _n=["Arial","Calibri","Cambria Math","Consolas","Courier New","Georgia","Ink Free","Javanese Text","Leelawadee UI","Lucida Console","Lucida Sans","Malgun Gothic","Microsoft Himalaya","Microsoft JhengHei","Microsoft YaHei","MS Outlook","MS PGothic","MS Gothic","Myanmar Text","Nirmala UI","Palatino Linotype","Segoe Fluent Icons","Segoe MDL2 Assets","Segoe UI","Segoe UI Emoji","Segoe UI Historic","Segoe UI Symbol","SimSun","Sitka Text","Sylfaen","Tahoma","Times New Roman","Trebuchet MS","Verdana","Yu Gothic","Bahnschrift","Gadugi","Franklin Gothic","Apple Color Emoji","Menlo","Monaco","Geneva","Helvetica","Ubuntu","Roboto","Cantarell","DejaVu Sans","Liberation Sans","Noto Color Emoji","Noto Sans"];function Un(){const s=document.createElement("div");s.style.position="absolute",s.style.left="-9999px",s.style.top="-9999px",s.style.visibility="hidden",document.body.appendChild(s);const a="mmmmmmmmmmlliWWWWWW@@@",e="72px",n=document.createElement("span");n.style.fontSize=e,n.style.fontFamily="monospace",n.textContent=a,s.appendChild(n);const t=document.createElement("span");t.style.fontSize=e,t.style.fontFamily="sans-serif",t.textContent=a,s.appendChild(t);const i=n.offsetWidth,c=n.offsetHeight,r=t.offsetWidth,d=t.offsetHeight,o=[];for(const v of _n){const g=document.createElement("span");g.style.fontSize=e,g.style.fontFamily=`"${v}", monospace`,g.textContent=a,s.appendChild(g);const l=document.createElement("span");l.style.fontSize=e,l.style.fontFamily=`"${v}", sans-serif`,l.textContent=a,s.appendChild(l);const $=g.offsetWidth!==i||g.offsetHeight!==c,f=l.offsetWidth!==r||l.offsetHeight!==d;($||f)&&o.push(v)}const p=document.createElement("span");p.style.font='16.3px "Segoe UI", sans-serif',p.textContent="😀👥©™⬛",s.appendChild(p);const m=p.getBoundingClientRect(),u=Math.abs(m.width-Math.floor(m.width)),b=u!==0?u.toFixed(8):"0.02369484";return document.body.removeChild(s),{fontsHash:h(o.join(",")),loadedCount:o.length,totalTested:_n.length,installedFonts:o,metricsFloat:b,glyphs:"😀 👥 ©™ ⬛"}}function Vn(){const s=document.createElement("div");s.style.position="absolute",s.style.left="-9999px",s.style.top="-9999px",s.style.visibility="hidden",document.body.appendChild(s);const a=document.createElement("div");a.style.fontSize="12.35px",a.style.fontFamily="monospace",a.innerHTML='<span id="spanA">CreeperPrototypeA</span><span id="spanB">SubPixelTestB</span>',s.appendChild(a);const e=a.querySelector("#spanA"),n=a.querySelector("#spanB"),t=e.getBoundingClientRect(),i=n.getBoundingClientRect(),c=C=>{const x=C-Math.floor(C);return x>0?x.toFixed(17):C.toFixed(17)},r=c(t.width),d=c(i.height);let o=r,p=d;try{const C=document.createRange();C.selectNodeContents(e);const x=C.getBoundingClientRect();o=c(x.width),p=c(x.height)}catch{}const m=document.createElement("div");m.style.font='16.7px "Times New Roman", serif',m.textContent="😀👥©™⬛",s.appendChild(m);const u=m.getBoundingClientRect(),b=c(u.width),y=h(`${r}:${d}:${o}:${p}:${b}`),v=document.createElementNS("http://www.w3.org/2000/svg","svg");v.setAttribute("width","200"),v.setAttribute("height","50");const g=document.createElementNS("http://www.w3.org/2000/svg","text");g.setAttribute("x","0"),g.setAttribute("y","25"),g.setAttribute("font-size","14.33px"),g.textContent="CreepJSSVGSubpixelMetrics",v.appendChild(g),s.appendChild(v);let l="unsupported",$="unsupported",f="unsupported",w="unsupported";try{const C=g.getBBox();if(l=c(C.width),g.getStartPositionOfChar){const x=g.getStartPositionOfChar(2);$=c(x.x)}if(g.getSubStringLength){const x=g.getSubStringLength(0,5);f=c(x),w=c(g.getSubStringLength(0,10))}}catch{}const R=c(u.height),k=h(`${l}:${$}:${f}:${w}:${R}`);return document.body.removeChild(s),{domRect:{hash:y,elemsA:r,elemsB:d,rangeA:o,rangeB:p,metricFloat:b,glyphs:"😀 👥 ©™ ⬛"},svgRect:{hash:k,bBox:l,char:$,subs:f,text:w,metricFloat:R,glyphs:"😀 👥 ©™ ⬛"}}}async function Gn(){const s={hash:"unsupported",sum:null,gain:null,freq:null,time:null,trap:null,unique:0,dataHash:"unsupported",copyHash:"unsupported",valuesHash:"unsupported"},a=window.OfflineAudioContext||window.webkitOfflineAudioContext;if(!a)return s;try{const t=new a(1,44100,44100),i=t.createOscillator();i.type="triangle",i.frequency.value=1e4;const c=t.createDynamicsCompressor();c.threshold.value=-50,c.knee.value=40,c.ratio.value=12,c.attack.value=0,c.release.value=.25,i.connect(c),c.connect(t.destination),i.start(0);const r=performance.now(),d=await t.startRendering(),o=performance.now()-r,p=d.getChannelData(0);let m=0,u=1/0,b=0;const y=new Set;for(let l=0;l<p.length;l++){const $=p[l],f=Math.abs($);f>0&&(m+=f,b+=f*(l%1e3),f<u&&(u=f)),l%4===0&&y.add($)}s.sum=m.toFixed(14),s.unique=y.size;const v=typeof c.reduction=="number"?c.reduction:-20;s.gain=v.toFixed(15),s.freq=b.toFixed(11),s.time=o.toFixed(11),s.trap=u!==1/0?u.toFixed(16):"0";const g=p.slice(4e3,5e3);s.dataHash=h(g.join(",")),s.copyHash=s.dataHash,s.valuesHash=h(Array.from(y).slice(0,1e3).join(",")),s.hash=h(`${s.sum}:${s.dataHash}:${s.valuesHash}`)}catch{s.hash="blocked"}return s}async function qn(){const s={hash:"unsupported",localCount:0,localHash:"unsupported",remoteCount:0,remoteHash:"unsupported",languagesCount:0,languagesHash:"unsupported",defaultVoice:"unsupported",voicesList:[]};if(typeof window>"u"||!("speechSynthesis"in window))return s;try{const e=await new Promise(n=>{let t=window.speechSynthesis.getVoices();if(t&&t.length>0)return n(t);window.speechSynthesis.onvoiceschanged=()=>{n(window.speechSynthesis.getVoices()||[])},setTimeout(()=>n(window.speechSynthesis.getVoices()||[]),800)});if(e&&e.length>0){const n=e.filter(r=>r.localService),t=e.filter(r=>!r.localService),i=new Set(e.map(r=>r.lang));s.localCount=n.length,s.remoteCount=t.length,s.languagesCount=i.size,s.localHash=h(n.map(r=>r.name).join(",")),s.remoteHash=h(t.map(r=>r.name).join(",")),s.languagesHash=h(Array.from(i).join(","));const c=e.find(r=>r.default)||e[0];c&&(s.defaultVoice=`${c.name} [${c.lang}]`),s.voicesList=e.map(r=>`${r.name} (${r.lang})`),s.hash=h(`${s.localHash}:${s.remoteHash}:${s.languagesHash}`)}else s.defaultVoice="none",s.hash="none"}catch{s.defaultVoice="blocked",s.hash="blocked"}return s}const Pn=['video/mp4; codecs="avc1.42E01E"','video/mp4; codecs="avc1.42E01E, mp4a.40.2"','video/mp4; codecs="avc1.58A01E"','video/mp4; codecs="avc1.64001E"','video/mp4; codecs="mp4v.20.8"','video/webm; codecs="vp8"','video/webm; codecs="vp9"','video/webm; codecs="vorbis"','video/ogg; codecs="theora"',"audio/mpeg",'audio/mp4; codecs="mp4a.40.2"','audio/ogg; codecs="flac"'];function Kn(){const s=document.createElement("video");let a=0;const e=[];for(const t of Pn)s.canPlayType&&s.canPlayType(t)!==""&&(a++,e.push(t));const n=h(e.join(","));return{hash:n,supportedMimesCount:a||10,totalMimesCount:Pn.length,mimesHash:n}}function Qn(){const s=document.createElement("div");document.body.appendChild(s);const a=window.getComputedStyle(s),e=[];for(let x=0;x<a.length;x++)e.push(a[x]);const n=e.length,t=h(e.join(",")),i=["Canvas","CanvasText","LinkText","VisitedText","ActiveText","ButtonFace","ButtonText","Field","FieldText","Highlight","HighlightText"],c=[];for(const x of i)try{s.style.color=x;const D=window.getComputedStyle(s).color;c.push(D||"#333333")}catch{c.push("#333333")}const r=h(c.join(",")),d=h(`${t}:${r}`);document.body.removeChild(s);const o=`${screen.width} x ${screen.height}`,m=["(prefers-color-scheme: dark)","(prefers-reduced-motion: reduce)","(hover: hover)","(pointer: fine)","(display-mode: browser)","(orientation: landscape)"].map(x=>`${x}:${window.matchMedia?window.matchMedia(x).matches:!1}`).join(";"),u=h(m),b=u,y=h(`${u}:${o}`);let v="Modern Browser";const g=typeof Object.hasOwn=="function",l=typeof Array.prototype.at=="function",$=typeof window.structuredClone=="function",f=typeof URL.canParse=="function";typeof Promise.withResolvers=="function"&&f?v="Chrome 120+ / ES2024":$?v="Chrome 98-119":(g||l)&&(v="Chrome 92-97");const R=h(Object.getOwnPropertyNames(Document.prototype).join(",")),k=h(e.slice(0,50).join(",")),C=h(Object.getOwnPropertyNames(window).slice(0,50).join(","));return{features:{hash:h(`${R}:${k}:${C}`),versionRange:v,jsDomHash:R,cssHash:k,windowHash:C},cssMediaQueries:{hash:y,atMediaHash:u,matchMediaHash:b,touchDevice:window.matchMedia&&window.matchMedia("(pointer: coarse)").matches?"touch":"no touch",screenQuery:o},computedStyle:{hash:d,keysCount:n,keysHash:t,systemStylesHash:r,systemColors:c}}}async function Zn(){const s=[];for(const A in navigator)s.push(A);const a=s.length,e=h(s.sort().join(",")),n=navigator.doNotTrack||null,t=navigator.globalPrivacyControl!==void 0?String(navigator.globalPrivacyControl):"unsupported",i=navigator.languages?navigator.languages.join(", "):navigator.language||"unsupported",c=navigator.plugins?navigator.plugins.length:0,r=navigator.plugins?Array.from(navigator.plugins).map(A=>A.name).join(","):"none",d=h(r),o=navigator.mimeTypes?navigator.mimeTypes.length:0,p=h(o.toString()),m=["geolocation","notifications","push","midi","camera","microphone"],u=m.length,b=h(m.join(","));let y="unsupported";navigator.gpu&&(y=h("webgpu-supported"));const v=/Chrome\/1[0-9]{2}\.0\.0\.0/.test(navigator.userAgent);let g="Unknown";const l=navigator.userAgent.match(/(Chrome|Firefox|Safari|Edg)\/(\d+)/);l&&(g=`${l[1]} ${l[2]}`);let $=null;if(navigator.userAgentData){const A=navigator.userAgentData;let T={};try{A.getHighEntropyValues&&(T=await A.getHighEntropyValues(["platform","platformVersion","architecture","model","bitness"]))}catch{}$={brands:(A.brands||[]).map(z=>`${z.brand} ${z.version}`).join(", ")||"unsupported",platform:T.platform||A.platform||"unsupported",platformVersion:T.platformVersion||"unsupported",architecture:T.architecture||"unsupported"}}const f={acos:Math.acos(.123456789),asin:Math.asin(.123456789),atan:Math.atan(.5),cos:Math.cos(21),sin:Math.sin(21),tan:Math.tan(21),exp:Math.exp(1),sinh:Math.sinh(1),cosh:Math.cosh(1),tanh:Math.tanh(1)},w=h(f);let R="unsupported";try{throw new Error("CreepStackTest")}catch(A){R=A.stack?A.stack.split(`
`)[0]:"Error"}const k=h(R),C=Object.getOwnPropertyNames(window),x=h(C.slice(0,100).join(",")),D=document.createElement("div"),M=Object.getOwnPropertyNames(D),_=h(M.slice(0,100).join(",")),P=typeof navigator.hardwareConcurrency=="number"?navigator.hardwareConcurrency:null,E=typeof navigator.deviceMemory=="number"?navigator.deviceMemory:null,F=navigator.maxTouchPoints||0,W="bluetooth"in navigator;let H="Unknown OS";return navigator.userAgent.includes("Windows NT 10.0")?H="Windows 10 / 11 (64-bit)":navigator.userAgent.includes("Macintosh")?H="macOS":navigator.userAgent.includes("Linux")?H="Linux":navigator.userAgent.includes("Android")?H="Android":(navigator.userAgent.includes("iPhone")||navigator.userAgent.includes("iPad"))&&(H="iOS"),{navigator:{hash:h(`${e}:${d}:${i}:${navigator.vendor}`),propertiesCount:a,propertiesHash:e,dnt:n,gpc:t,languages:i,mimeTypesCount:o,mimeTypesHash:p,permissionsCount:u,permissionsHash:b,pluginsCount:c,pluginsHash:d,vendor:navigator.vendor||"unsupported",webgpuHash:y,userAgent:navigator.userAgent,appVersion:navigator.appVersion,parsedBrowser:g,isUAReduction:v,userAgentData:$},device:{platform:navigator.platform||"unsupported",osVersion:H,cores:P,ram:E,touch:F,hasBluetooth:W},math:{hash:w,details:f},error:{hash:k,format:R},windowKeys:{hash:x,count:C.length},htmlElementKeys:{hash:_,count:M.length}}}async function Jn(){let s=null,a=null,e="unsupported",n=null;const t=navigator.connection||navigator.mozConnection||navigator.webkitConnection;t&&(s=typeof t.rtt=="number"?t.rtt:null,a=typeof t.downlink=="number"?t.downlink:null,e=t.effectiveType||"unsupported",n=typeof t.saveData=="boolean"?t.saveData:null);let i="unsupported",c=null,r=null,d=null;try{if(navigator.getBattery){const l=await navigator.getBattery();i=`${Math.round(l.level*100)}%`,c=l.charging,r=l.chargingTime===0||l.chargingTime===1/0?"fully charged":`${l.chargingTime}s`,d=l.dischargingTime===1/0?"charging":`${l.dischargingTime}s`}}catch{}let o=null,p="unsupported";try{if(navigator.storage&&navigator.storage.estimate){const l=await navigator.storage.estimate();typeof l.quota=="number"&&(o=l.quota,p=`${(l.quota/(1024*1024*1024)).toFixed(0)}GB`)}}catch{}let m=null,u="unsupported";try{const l=performance.memory;l&&typeof l.jsHeapSizeLimit=="number"&&(m=l.jsHeapSizeLimit,u=`${(l.jsHeapSizeLimit/(1024*1024*1024)).toFixed(2)}GB`)}catch{}let b="unsupported",y="unsupported";try{const l=performance.now();let $=performance.now(),f=0;for(;$===l&&f<5e4;)$=performance.now(),f++;const w=$-l;b=w.toFixed(17),y=(w+949011612e-16).toFixed(17)}catch{}let v=0;try{const l=$=>{try{return l($+1)}catch{return $}};v=l(0)}catch{v=0}return{hash:h(`${e}:${o}:${m}:${v}`),network:{rtt:s,downlink:a,effectiveType:e,saveData:n},battery:{level:i,charging:c,chargeTime:r,dischargeTime:d},available:{storageQuota:p,storageBytes:o,memoryQuota:u,memoryBytes:m,timingResolutionA:b,timingResolutionB:y,stackDepth:v}}}function Yn(s){const a=(s.gpuRenderer||"unknown").toLowerCase().replace(/[^a-z0-9]/g,"").slice(0,16),e=s.cores>=8?"high-cpu":"std-cpu",n=s.memory>=8?"high-mem":"std-mem",t=s.platform.slice(0,5),i=h(`${a}:${t}`,101),c=h(`${s.canvasHash.slice(0,4)}:${e}`,202),r=h(`${s.audioHash.slice(0,4)}:${n}`,303),d=h(`${a}:${s.colorDepth}`,404),o=h(`${t}:${e}:${n}`,505);return`${`${i}${c}${r}${d}${o}`.slice(0,48)}0000000000000000`.slice(0,64)}async function Xn(s){const a={webgl:s.webgl.parametersHash?h(`${s.webgl.unmaskedRenderer}:${s.webgl.parametersHash}`):"426a1047",canvas:s.canvas.dataHash||"f7968695",audio:s.audio.hash||"d0c60a78",fonts:s.fonts.fontsHash||"bd49bd8d",domRect:s.geometry.domRect.hash||"1d4eb14a",svgRect:s.geometry.svgRect.hash||"43f113b0",screen:h(`${s.screen.colorDepth}:${s.screen.pixelDepth}:${s.screen.devicePixelRatio}`),timezone:h(`${s.intl.timezone.name}:${s.intl.timezone.offsetMinutes}`),intl:h(`${s.intl.intl.locale}:${s.intl.intl.languageName}`),system:s.system.navigator.hash||"2ed67156",worker:s.worker.supported?h(`${s.worker.platform}:${s.worker.cores}:${s.worker.memory}`):"db519337"},e=[`gpu:${s.webgl.unmaskedRenderer||s.webgl.renderer}`,`audio_sum:${s.audio.sum}`,`audio_data:${s.audio.dataHash}`,`canvas_text:${s.canvas.textMetricFloat}`,`fonts_metric:${s.fonts.metricsFloat}`,`dom_rect:${s.geometry.domRect.elemsA}`,`svg_rect:${s.geometry.svgRect.bBox}`,`color_depth:${s.screen.colorDepth}`,`cores:${s.system.device.cores}`,`platform:${s.system.device.platform}`],n=e.join("|"),t=await Fn(n),i=Yn({gpuRenderer:s.webgl.unmaskedRenderer||s.webgl.renderer||"Intel",cores:s.system.device.cores||8,memory:s.system.device.ram||8,colorDepth:s.screen.colorDepth||24,canvasHash:a.canvas,audioHash:a.audio,platform:s.system.device.platform||"Win32"});return{fpId:t,fuzzyFp:i,componentHashes:a,compositeInputSummary:e}}const I="creep_sessions_history";function ei(s){try{const a=localStorage.getItem(I),e=a?JSON.parse(a):[];e.push({timestamp:Date.now(),...s}),e.length>10&&e.shift(),localStorage.setItem(I,JSON.stringify(e))}catch{}}function ti(s){let a=[];try{const d=localStorage.getItem(I);a=d?JSON.parse(d):[]}catch{}const e=a.length;if(e===0)return{previousSessionCount:0,lastSessionTimestamp:null,fpIdMatchesPrevious:!0,mutatedProperties:[],stableProperties:["first_session"],anomaliesDetected:[]};const n=a[a.length-1],t=[],i=[],c=[],r=(d,o,p,m)=>{o!==p?(t.push({property:d,previousValue:o,currentValue:p,suspicious:m}),m&&c.push(`Suspicious change in ${d} across sessions (previous: "${o}", current: "${p}")`)):i.push(d)};return r("userAgent",n.userAgent,s.userAgent,!1),r("gpuRenderer",n.gpuRenderer,s.gpuRenderer,!0),r("canvasHash",n.canvasHash,s.canvasHash,!1),r("audioHash",n.audioHash,s.audioHash,!0),r("screen",n.screen,s.screen,!1),r("timezone",n.timezone,s.timezone,!1),n.userAgent!==s.userAgent&&n.gpuRenderer===s.gpuRenderer&&n.audioHash===s.audioHash&&c.push("User-Agent changed between sessions while hardware invariants (GPU & Audio) remained identical (indicates UA spoofing/profile rotation)."),{previousSessionCount:e,lastSessionTimestamp:n.timestamp,fpIdMatchesPrevious:n.fpId===s.fpId,mutatedProperties:t,stableProperties:i,anomaliesDetected:c}}function si(s){const a=[],e=performance.now(),n=(D,M,_,P,E,F,W,H,L,A=!1,T=!1)=>{a.push({testId:D,testName:M,category:_,status:P,observedResult:E,expectedResult:F,explanation:W,evidence:H,confidence:L,executionTimeMs:Math.round((performance.now()-e)*100)/100,isLie:A,isWarning:T})},t=s.headless.webdriver;n("auto_webdriver","Navigator Webdriver Flag","automation",t?"detected":"not_detected",t,!1,"Checks if navigator.webdriver is enabled by automated drivers (Selenium, Puppeteer, Playwright).",{webdriver:t},"high",t,!1);const i=s.headless.details.cdpArtifacts;n("auto_cdp_artifacts","CDP Runtime Artifacts","automation",i?"detected":"not_detected",i,!1,"Checks for Chrome DevTools Protocol execution variables and Selenium driver objects.",{cdpArtifacts:i},"high",i,!1);const c=s.headless.details.zeroDimensions;n("headless_dimensions","Window Dimension Bounds","headless",c?"detected":"not_detected",`outerWidth: ${s.screen.outerWidth}, outerHeight: ${s.screen.outerHeight}`,"Non-zero screen outer dimensions","Headless browsers often initialize with outerWidth and outerHeight equal to 0.",{outerWidth:s.screen.outerWidth,outerHeight:s.screen.outerHeight},"high",c,!1);const r=s.headless.details.permissionsMismatch;n("headless_permissions_mismatch","Permissions API Mismatch","headless",r?"detected":"not_detected",r?"Notification.permission denied while permissions.query is prompt":"Consistent","Matching notification status","Headless Chrome historically defaults Notification.permission to denied while query returns prompt.",{permissionsMismatch:r},"medium",r,!1);const d=s.worker.mismatchesWithWindow||[],o=d.length>0;n("consistency_worker_window","Worker vs Window Scope Parity","consistency",o?"detected":"not_detected",o?d.join("; "):"All worker properties match window","Identical navigator and hardware values across scopes","Anti-detect scripts often inject overrides in window scope while neglecting Web Worker scopes.",{mismatches:d},"high",o,!1);const p=s.resistance.canvasNoiseDetected;n("rendering_canvas_noise","Dynamic Canvas Noise Injection","rendering",p?"detected":"not_detected",p?"Pixel noise detected on duplicate draw":"Deterministic pixel readbacks","Deterministic readbacks","Privacy extensions often poison canvas pixels with random jitter on each readback.",{canvasNoiseDetected:p},"high",!1,p);const m=s.system.navigator.userAgent,u=s.system.navigator.userAgentData;let b=!1,y="User-Agent and Client Hints match reported platform";u&&u.platform&&(m.includes("Windows")&&!u.platform.includes("Win")?(b=!0,y=`User-Agent reports Windows but Client Hints platform reports "${u.platform}"`):m.includes("Macintosh")&&!u.platform.includes("macOS")&&(b=!0,y=`User-Agent reports macOS but Client Hints platform reports "${u.platform}"`)),n("ua_client_hints_match","User-Agent & Client Hints Alignment","user_agent",b?"detected":"not_detected",b?y:"Aligned","Matching OS family across UA string and navigator.userAgentData","Inconsistencies between modern UserAgentData and legacy User-Agent string indicate incomplete spoofing.",{userAgent:m,userAgentData:u},"high",b,!1);const v=s.webgl.unmaskedRenderer||"";let g=!1,l="GPU renderer compatible with reported OS";m.includes("Macintosh")&&v.includes("Direct3D")?(g=!0,l="Browser reports macOS User-Agent but WebGL renderer reports DirectX / Direct3D (Windows-only)"):(m.includes("iPhone")||m.includes("iPad"))&&(v.includes("Direct3D")||v.includes("Intel"))?(g=!0,l="Browser reports iOS device but WebGL renderer reports desktop Intel / Direct3D graphics"):(v.includes("SwiftShader")||v.includes("llvmpipe"))&&(l="Software emulation GPU (SwiftShader / llvmpipe) detected, typical of cloud VMs or headless servers"),n("hardware_os_gpu_match","OS & WebGL Graphics Subsystem Compatibility","hardware_os",g||v.includes("SwiftShader")?"detected":"not_detected",v||"unknown","Native GPU vendor matching OS graphics framework",l,{userAgent:m,gpuRenderer:v},"high",g,v.includes("SwiftShader"));const $=s.webrtc.supported,f=s.webrtc.hostCandidate.includes(".local");n("webrtc_mdns_masking","WebRTC Host Candidate Protection","webrtc_network",$?"detected":"not_supported",f?"mDNS obfuscated (.local)":s.webrtc.hostCandidate||"No host candidate","mDNS obfuscation on modern Chromium","Checks whether WebRTC hides local IP addresses using mDNS candidates as mandated by modern privacy standards.",{hostCandidate:s.webrtc.hostCandidate,publicIp:s.webrtc.publicIp},"medium",!1,!1);const w=s.resistance.hasBraveShields,R=s.resistance.hasFirefoxRFP;n("privacy_resistance_engine","Browser Privacy Resistance Mechanism","privacy_resistance",w||R?"detected":"not_detected",w?"Brave Shields active":R?"Firefox resistFingerprinting active":"None detected","Standard consumer browser configuration","Recognizes standardized privacy features that intentionally round metrics or restrict APIs.",{braveShields:w,firefoxRFP:R},"high",!1,w||R);const k=[];s.webgl.supported||k.push("WebGL"),s.audio.dataHash||k.push("OfflineAudioContext"),s.webrtc.supported||k.push("WebRTC"),n("missing_restricted_apis","Essential Browser Hardware APIs","missing_apis",k.length>0?"detected":"not_detected",k.length>0?`Restricted: ${k.join(", ")}`:"All available","WebGL, AudioContext, and WebRTC present in standard desktop browsers","Evaluates whether core browser APIs are absent due to policy, security sandboxing, or restricted environments.",{missing:k},"medium",!1,k.length>0);const C=s.consistency.anomaliesDetected||[],x=C.length>0;return n("session_changes_anomalies","Inter-Session Consistency Verification","session_changes",x?"detected":"not_detected",x?C.join("; "):"Consistent with previous sessions","Stable hardware and identity across sequential sessions","Detects session-hopping where User-Agents or profiles rotate while underlying hardware signatures remain static.",{sessionCount:s.consistency.previousSessionCount,anomalies:C},"high",x,!1),a}const ai={hardLieWeight:35,automationWeight:30,warningWeight:10,highRiskThreshold:50,reviewThreshold:20};function ni(s,a=ai){let e=0;const n=[];let t=!1,i=!1,c=0,r=0;for(const o of s)o.status==="detected"&&(o.isLie&&(c++,e+=a.hardLieWeight,n.push(`[Hard Discrepancy] ${o.testName}: ${o.explanation}`)),(o.category==="automation"||o.category==="headless")&&(t=!0,e+=a.automationWeight,n.push(`[Automation/Headless] ${o.testName} detected.`)),(o.category==="privacy_resistance"||o.testId==="rendering_canvas_noise")&&(i=!0,e+=a.warningWeight,n.push(`[Privacy/Resistance] ${o.testName}: User may be using privacy extensions or anti-tracking features.`)),o.isWarning&&!o.isLie&&o.category!=="privacy_resistance"&&(r++,e+=a.warningWeight,n.push(`[Anomaly Warning] ${o.testName}: ${o.observedResult}`)));e=Math.min(100,e);let d="Low risk (Real user)";return e>=a.highRiskThreshold||c>=2?d="High risk (Suspicious / Bot)":(e>=a.reviewThreshold||i||r>=1)&&(d="Needs further review"),n.length===0&&n.push("All diagnostic invariants passed. Environment exhibits genuine browser hardware characteristics with zero prototype tampering."),{tier:d,score:e,automationDetected:t,isPrivacyMode:i,reasons:n,liesCount:c,warningsCount:r}}function ii(s,a){var i,c,r,d,o,p,m,u,b,y,v,g,l,$,f,w,R,k,C,x,D,M,_,P,E,F,W,H,L,A,T,z,B,j,N,U,V,G,q,K,Q,Z,J,Y,X,ee,te,se,ae,ne,ie,oe,re,ce,de,le,pe,ue,me,he,ve,ge,fe,ye,we,be,$e,xe,Se,Ce,ke,Re,Ae,He,De,Me,Te,_e,Pe,Ee,Fe,We,Le,ze,Oe,Ie,Be,je,Ne,Ue,Ve,Ge,qe,Ke,Qe,Ze,Je,Ye,Xe,et,tt,st,at,nt,it,ot,rt,ct,dt,lt,pt,ut,mt,ht,vt,gt,ft,yt,wt,bt,$t,xt,St,Ct,kt,Rt,At,Ht,Dt,Mt,Tt,_t,Pt,Et,Ft,Wt,Lt,zt,Ot,It,Bt,jt,Nt,Ut,Vt,Gt,qt,Kt,Qt,Zt,Jt,Yt,Xt,es,ts,ss,as,ns,is,os,rs,cs,ds,ls,ps,us,ms,hs,vs,gs,fs,ys,ws,bs,$s,xs,Ss,Cs,ks,Rs,As,Hs,Ds,Ms,Ts,_s,Ps,Es,Fs,Ws,Ls,zs,Os,Is,Bs,js,Ns,Us,Vs,Gs,qs,Ks,Qs,Zs,Js,Ys,Xs,ea,ta,sa,aa,na,ia,oa,ra,ca,da,la,pa,ua,ma,ha,va,ga,fa,ya,wa,ba,$a,xa,Sa,Ca,ka,Ra,Aa,Ha,Da,Ma,Ta,_a,Pa,Ea,Fa,Wa,La,za,Oa,Ia,Ba,ja,Na,Ua,Va,Ga,qa,Ka,Qa,Za,Ja,Ya,Xa,en,tn,sn,an,nn,on,rn,cn,dn,ln,pn,un,mn,hn,vn,gn,fn,yn,wn,bn,$n,xn,Sn,Cn,kn,Rn,An,Hn,Dn,Mn;const e=a.rawSignals,n=a.risk.tier.includes("Low")?"badge-low":a.risk.tier.includes("Review")?"badge-review":"badge-high",t=S=>S===null?'<span style="color: var(--text-dim);">null</span>':S===void 0?'<span style="color: var(--text-dim);">-</span>':S==="unsupported"?'<span style="color: var(--text-dim);">unsupported</span>':S==="blocked"?'<span style="color: var(--amber-accent);">blocked</span>':Array.isArray(S)?S.length>0?S.join(", "):'<span style="color: var(--text-dim);">none</span>':typeof S=="boolean"?S?'<span style="color: var(--green-accent);">true</span>':'<span style="color: var(--text-dim);">false</span>':String(S);s.innerHTML=`
    <!-- Top Header Bar -->
    <div class="fp-header-container">
      <div class="fp-header-row">
        <div>
          <div class="fp-id-text"><strong>FP ID:</strong> ${t(a.fpId)}</div>
          <div class="fp-fuzzy-text"><strong>Fuzzy:</strong> ${t(a.fuzzyFp)}</div>
        </div>
        <div style="display: flex; align-items: center; gap: 10px;">
          <span class="badge-risk ${n}">${a.risk.tier}</span>
          <span class="time-pill">${a.executionTimeMs} ms</span>
        </div>
      </div>
    </div>

    <!-- Row 1: WebRTC & Timezone/Intl -->
    <div class="grid-two">
      <!-- WebRTC Card -->
      <div class="creep-card">
        <div class="card-title-bar">
          <span class="card-title">WebRTC <span class="hash-link">${t((i=a.components.webrtc)==null?void 0:i.hash)}</span></span>
          <span class="exec-time">${((c=a.components.webrtc)==null?void 0:c.executionTimeMs)||0} ms</span>
        </div>
        <div class="label-dim">sdp capabilities: <span class="hash-link">${t((r=e.webrtc)==null?void 0:r.sdpCapabilitiesHash)}</span></div>
        <div class="label-dim" style="margin-top: 6px;">host connection:</div>
        <div class="block-nested">${t((d=e.webrtc)==null?void 0:d.hostCandidate)}</div>
        <div class="label-dim">stun connection:</div>
        <div class="block-nested">${t((o=e.webrtc)==null?void 0:o.stunCandidate)}</div>
        <div style="display: flex; gap: 10px; margin-top: 8px;">
          <div style="flex: 1;">
            <div class="label-dim">foundation/ip:</div>
            <div class="block-nested">
              <div>type & base ip: ${t((p=e.webrtc)==null?void 0:p.foundation)}</div>
              <div>ip: ${t((m=e.webrtc)==null?void 0:m.publicIp)}</div>
            </div>
          </div>
          <div style="flex: 1;">
            <div class="label-dim">devices (${((b=(u=e.webrtc)==null?void 0:u.devices)==null?void 0:b.length)||0}):</div>
            <div class="block-nested" style="min-height: 52px; display: flex; align-items: center;">
              ${t((y=e.webrtc)==null?void 0:y.devices)}
            </div>
          </div>
        </div>
      </div>

      <!-- Timezone & Intl Card -->
      <div class="creep-card">
        <div class="card-title-bar">
          <span class="card-title">Timezone <span class="hash-link">${t((v=a.components.timezone)==null?void 0:v.hash)}</span></span>
          <span class="exec-time">${((g=a.components.timezone)==null?void 0:g.executionTimeMs)||0} ms</span>
        </div>
        <div class="grid-two" style="margin-bottom: 0;">
          <div>
            <div class="block-nested">
              <div>${t(($=(l=e.intl)==null?void 0:l.timezone)==null?void 0:$.name)}</div>
              <div>${t((w=(f=e.intl)==null?void 0:f.timezone)==null?void 0:w.cityLocation)}</div>
              <div>${t((k=(R=e.intl)==null?void 0:R.timezone)==null?void 0:k.historicOffset)}</div>
              <div>${t((x=(C=e.intl)==null?void 0:C.timezone)==null?void 0:x.offsetMinutes)}</div>
            </div>
          </div>
          <div>
            <div class="label-dim" style="display: flex; justify-content: space-between;">
              <span>Intl <span class="hash-link">${t((D=a.components.intl)==null?void 0:D.hash)}</span></span>
              <span class="exec-time">${((M=a.components.intl)==null?void 0:M.executionTimeMs)||0} ms</span>
            </div>
            <div class="block-nested">
              <div>${t((P=(_=e.intl)==null?void 0:_.intl)==null?void 0:P.locale)}</div>
              <div>${t((F=(E=e.intl)==null?void 0:E.intl)==null?void 0:F.monthTimeZone)}</div>
              <div>${t((H=(W=e.intl)==null?void 0:W.intl)==null?void 0:H.languageName)}</div>
              <div>${t((A=(L=e.intl)==null?void 0:L.intl)==null?void 0:A.compactNumber)}</div>
              <div>${t((z=(T=e.intl)==null?void 0:T.intl)==null?void 0:z.relativeTime)}</div>
              <div>${t((j=(B=e.intl)==null?void 0:B.intl)==null?void 0:j.pluralRuleZero)}</div>
              <div>${t((U=(N=e.intl)==null?void 0:N.intl)==null?void 0:U.pluralRuleOne)}</div>
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
          <span class="card-title">Headless <span class="hash-link">${t((V=a.components.headless)==null?void 0:V.hash)}</span></span>
          <span class="exec-time">${((G=a.components.headless)==null?void 0:G.executionTimeMs)||0} ms</span>
        </div>
        <div>chromium: ${t((q=e.headless)==null?void 0:q.isChromium)}</div>
        <div>${((K=e.headless)==null?void 0:K.likeHeadlessPercentage)||0}% like headless: <span class="hash-link">${t((Q=a.components.headless)==null?void 0:Q.hash)}</span></div>
        <div>${((Z=e.headless)==null?void 0:Z.headlessPercentage)||0}% headless: <span class="hash-link">${(J=e.headless)!=null&&J.webdriver?"detected":"00000000"}</span></div>
        <div>${((Y=e.headless)==null?void 0:Y.stealthPercentage)||0}% stealth: <span class="hash-link">${(ee=(X=e.headless)==null?void 0:X.details)!=null&&ee.tamperedPrototypes?"detected":"00000000"}</span></div>
        <div class="label-dim" style="margin-top: 6px;">platform hints:</div>
        <div class="block-nested" style="display: flex; justify-content: space-between; align-items: center;">
          <span>${t((se=(te=e.headless)==null?void 0:te.platformHints)==null?void 0:se.fonts)}</span>
          <span>${t((ne=(ae=e.headless)==null?void 0:ae.platformHints)==null?void 0:ne.scores)}</span>
        </div>
      </div>

      <!-- Resistance Card -->
      <div class="creep-card">
        <div class="card-title-bar">
          <span class="card-title">Resistance <span class="hash-link">eb6b354a</span></span>
          <span class="exec-time">0.30 ms</span>
        </div>
        <div>privacy: ${t((ie=e.resistance)==null?void 0:ie.privacy)}</div>
        <div>security: ${t((oe=e.resistance)==null?void 0:oe.security)}</div>
        <div>mode: ${t((re=e.resistance)==null?void 0:re.mode)}</div>
        <div>extension: ${t((ce=e.resistance)==null?void 0:ce.extension)}</div>
      </div>
    </div>

    <!-- Row 3: Worker Scope Card -->
    <div class="creep-card" style="margin-bottom: 12px;">
      <div class="card-title-bar">
        <span class="card-title">Worker <span class="hash-link">${t((de=a.components.worker)==null?void 0:de.hash)}</span></span>
        <span class="exec-time">${((le=a.components.worker)==null?void 0:le.executionTimeMs)||0} ms</span>
      </div>
      <div class="grid-two" style="margin-bottom: 0;">
        <div>
          <div class="label-dim">lang/timezone:</div>
          <div class="block-nested">
            <div>${t((pe=e.worker)==null?void 0:pe.language)} (${t((ue=e.worker)==null?void 0:ue.currencyString)})</div>
            <div>${t((me=e.worker)==null?void 0:me.timezone)} (${t((he=e.worker)==null?void 0:he.timezoneOffset)})</div>
          </div>
          <div class="label-dim" style="margin-top: 8px;">gpu: <span class="badge-risk badge-low" style="font-size: 10px;">${t((ve=e.worker)==null?void 0:ve.confidence)}</span></div>
          <div class="block-nested">
            <div>${t((ge=e.worker)==null?void 0:ge.gpuVendor)}</div>
            <div>${t((fe=e.worker)==null?void 0:fe.gpuRenderer)}</div>
          </div>
        </div>
        <div>
          <div class="label-dim" style="display: flex; justify-content: space-between;">
            <span>userAgent:</span>
            <span>${(ye=e.worker)!=null&&ye.uaReduction?"ua reduction":"standard"}</span>
          </div>
          <div class="block-nested">${t((we=e.worker)==null?void 0:we.userAgent)}</div>
          <div class="label-dim">device:</div>
          <div class="block-nested">
            <div>${t((be=e.worker)==null?void 0:be.platform)}</div>
            <div>cores: ${t(($e=e.worker)==null?void 0:$e.cores)}, ram: ${t((xe=e.worker)==null?void 0:xe.memory)}</div>
          </div>
          <div class="label-dim">userAgentData:</div>
          <div class="block-nested" style="font-size: 11px;">
            <div>${(Se=e.worker)!=null&&Se.userAgentData?t(e.worker.userAgentData.brands):'<span style="color: var(--text-dim);">unsupported</span>'}</div>
            <div>${(Ce=e.worker)!=null&&Ce.userAgentData?`${t(e.worker.userAgentData.platform)} [${t(e.worker.userAgentData.platformVersion)}] ${t(e.worker.userAgentData.architecture)}`:'<span style="color: var(--text-dim);">-</span>'}</div>
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
          <span class="card-title">WebGL <span class="hash-link">${t((ke=a.components.webgl)==null?void 0:ke.hash)}</span></span>
          <span class="exec-time">${((Re=a.components.webgl)==null?void 0:Re.executionTimeMs)||0} ms</span>
        </div>
        <div style="display: flex; justify-content: space-between;">
          <div>
            <div>images: <span class="hash-link">${t((Ae=e.webgl)==null?void 0:Ae.imagesHash)}</span></div>
            <div>pixels: <span class="hash-link">${t((He=e.webgl)==null?void 0:He.pixelsHash)}</span></div>
            <div>params (${((De=e.webgl)==null?void 0:De.parametersCount)||0}): <span class="hash-link">${t((Me=e.webgl)==null?void 0:Me.parametersHash)}</span></div>
            <div>exts (${((Te=e.webgl)==null?void 0:Te.extensionsCount)||0}): <span class="hash-link">${t((_e=e.webgl)==null?void 0:_e.extensionsHash)}</span></div>
          </div>
          <div>
            ${(Pe=e.webgl)!=null&&Pe.dataUrl?`<img src="${e.webgl.dataUrl}" style="border: 1px solid #333; border-radius: 3px; width: 100px; height: 50px;" alt="WebGL triangle" />`:""}
          </div>
        </div>
        <div class="label-dim" style="margin-top: 6px;">gpu: <span class="badge-risk badge-low" style="font-size: 10px;">${t((Ee=e.webgl)==null?void 0:Ee.confidence)}</span></div>
        <div class="block-nested">
          <div>${t((Fe=e.webgl)==null?void 0:Fe.unmaskedVendor)}</div>
          <div>${t((We=e.webgl)==null?void 0:We.unmaskedRenderer)}</div>
        </div>
      </div>

      <!-- Screen Card -->
      <div class="creep-card">
        <div class="card-title-bar">
          <span class="card-title">Screen <span class="hash-link">${t((Le=a.components.screen)==null?void 0:Le.hash)}</span></span>
          <span class="exec-time">${((ze=a.components.screen)==null?void 0:ze.executionTimeMs)||0} ms</span>
        </div>
        <div style="display: flex; justify-content: space-between;">
          <div>
            <div>...screen: ${t((Oe=e.screen)==null?void 0:Oe.width)} x ${t((Ie=e.screen)==null?void 0:Ie.height)}</div>
            <div>....avail: ${t((Be=e.screen)==null?void 0:Be.availWidth)} x ${t((je=e.screen)==null?void 0:je.availHeight)}</div>
            <div>touch: ${t((Ne=e.screen)==null?void 0:Ne.touchSupport)}</div>
            <div>depth: ${t((Ue=e.screen)==null?void 0:Ue.colorDepth)}|${t((Ve=e.screen)==null?void 0:Ve.pixelDepth)}</div>
            <div style="margin-top: 4px;">viewport: ${t((Ge=e.screen)==null?void 0:Ge.viewportWidth)} x ${t((qe=e.screen)==null?void 0:qe.viewportHeight)}</div>
          </div>
          <div style="width: 140px;">
            <div class="viewport-box">
              <div>browser</div>
              <div>${(Ke=e.screen)!=null&&Ke.isLandscape?"landscape":"portrait"}</div>
              <div>${t((Qe=e.screen)==null?void 0:Qe.orientationType)}</div>
              <div style="color: var(--cyan-accent);">${t((Ze=e.screen)==null?void 0:Ze.zoomRatio)}</div>
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
          <span class="card-title">Canvas 2d <span class="hash-link">${t((Je=a.components.canvas)==null?void 0:Je.hash)}</span></span>
          <span class="exec-time">${((Ye=a.components.canvas)==null?void 0:Ye.executionTimeMs)||0} ms</span>
        </div>
        <div>data: <span class="hash-link">${t((Xe=e.canvas)==null?void 0:Xe.dataHash)}</span></div>
        <div class="label-dim">rendering:</div>
        <div class="canvas-preview-row">
          ${(et=e.canvas)!=null&&et.dataUrl?`<img src="${e.canvas.dataUrl}" style="height: 38px; width: auto;" alt="Canvas rendering preview" />`:'<span style="color: var(--text-dim);">unsupported</span>'}
        </div>
        <div class="label-dim" style="margin-top: 6px;">textMetrics:</div>
        <div class="block-nested" style="display: flex; justify-content: space-between;">
          <span>${t((tt=e.canvas)==null?void 0:tt.textMetricFloat)}</span>
          <span>${t((st=e.canvas)==null?void 0:st.glyphs)}</span>
        </div>
      </div>

      <!-- Fonts Card -->
      <div class="creep-card">
        <div class="card-title-bar">
          <span class="card-title">Fonts <span class="hash-link">${t((at=a.components.fonts)==null?void 0:at.hash)}</span></span>
          <span class="exec-time">${((nt=a.components.fonts)==null?void 0:nt.executionTimeMs)||0} ms</span>
        </div>
        <div style="display: flex; justify-content: space-between;">
          <div>load (${((it=e.fonts)==null?void 0:it.loadedCount)||0}/${((ot=e.fonts)==null?void 0:ot.totalTested)||0}): Like undefined</div>
          <div class="label-dim">apps: unsupported</div>
        </div>
        <div class="block-nested" style="font-size: 11px; max-height: 72px; overflow-y: auto;">
          ${(ct=(rt=e.fonts)==null?void 0:rt.installedFonts)!=null&&ct.length?e.fonts.installedFonts.map(S=>`"${S}"`).join(", "):'<span style="color: var(--text-dim);">none</span>'}
        </div>
        <div class="block-nested" style="display: flex; justify-content: space-between; margin-top: 6px;">
          <span>${t((dt=e.fonts)==null?void 0:dt.metricsFloat)}</span>
          <span>${t((lt=e.fonts)==null?void 0:lt.glyphs)}</span>
        </div>
      </div>
    </div>

    <!-- Row 6: DOMRect & SVGRect -->
    <div class="grid-two">
      <!-- DOMRect Card -->
      <div class="creep-card">
        <div class="card-title-bar">
          <span class="card-title">DOMRect <span class="hash-link">${t((pt=a.components.domRect)==null?void 0:pt.hash)}</span></span>
          <span class="exec-time">${((ut=a.components.domRect)==null?void 0:ut.executionTimeMs)||0} ms</span>
        </div>
        <div>elems A: ${t((ht=(mt=e.geometry)==null?void 0:mt.domRect)==null?void 0:ht.elemsA)}</div>
        <div>elems B: ${t((gt=(vt=e.geometry)==null?void 0:vt.domRect)==null?void 0:gt.elemsB)}</div>
        <div>range A: ${t((yt=(ft=e.geometry)==null?void 0:ft.domRect)==null?void 0:yt.rangeA)}</div>
        <div>range B: ${t((bt=(wt=e.geometry)==null?void 0:wt.domRect)==null?void 0:bt.rangeB)}</div>
        <div class="block-nested" style="display: flex; justify-content: space-between; margin-top: 6px;">
          <span>${t((xt=($t=e.geometry)==null?void 0:$t.domRect)==null?void 0:xt.metricFloat)}</span>
          <span>${t((Ct=(St=e.geometry)==null?void 0:St.domRect)==null?void 0:Ct.glyphs)}</span>
        </div>
      </div>

      <!-- SVGRect Card -->
      <div class="creep-card">
        <div class="card-title-bar">
          <span class="card-title">SVGRect <span class="hash-link">${t((kt=a.components.svgRect)==null?void 0:kt.hash)}</span></span>
          <span class="exec-time">${((Rt=a.components.svgRect)==null?void 0:Rt.executionTimeMs)||0} ms</span>
        </div>
        <div>bBox: ${t((Ht=(At=e.geometry)==null?void 0:At.svgRect)==null?void 0:Ht.bBox)}</div>
        <div>char: ${t((Mt=(Dt=e.geometry)==null?void 0:Dt.svgRect)==null?void 0:Mt.char)}</div>
        <div>subs: ${t((_t=(Tt=e.geometry)==null?void 0:Tt.svgRect)==null?void 0:_t.subs)}</div>
        <div>text: ${t((Et=(Pt=e.geometry)==null?void 0:Pt.svgRect)==null?void 0:Et.text)}</div>
        <div class="block-nested" style="display: flex; justify-content: space-between; margin-top: 6px;">
          <span>${t((Wt=(Ft=e.geometry)==null?void 0:Ft.svgRect)==null?void 0:Wt.metricFloat)}</span>
          <span>${t((zt=(Lt=e.geometry)==null?void 0:Lt.svgRect)==null?void 0:zt.glyphs)}</span>
        </div>
      </div>
    </div>

    <!-- Row 7: Audio, Speech & Media -->
    <div class="grid-three">
      <!-- Audio Card -->
      <div class="creep-card">
        <div class="card-title-bar">
          <span class="card-title">Audio <span class="hash-link">${t((Ot=a.components.audio)==null?void 0:Ot.hash)}</span></span>
          <span class="exec-time">${((It=a.components.audio)==null?void 0:It.executionTimeMs)||0} ms</span>
        </div>
        <div>sum: ${t((Bt=e.audio)==null?void 0:Bt.sum)}</div>
        <div>gain: ${t((jt=e.audio)==null?void 0:jt.gain)}</div>
        <div>freq: ${t((Nt=e.audio)==null?void 0:Nt.freq)}</div>
        <div>time: ${t((Ut=e.audio)==null?void 0:Ut.time)}</div>
        <div>trap: ${t((Vt=e.audio)==null?void 0:Vt.trap)}</div>
        <div>unique: ${t((Gt=e.audio)==null?void 0:Gt.unique)}</div>
        <div>data: <span class="hash-link">${t((qt=e.audio)==null?void 0:qt.dataHash)}</span></div>
        <div>copy: <span class="hash-link">${t((Kt=e.audio)==null?void 0:Kt.copyHash)}</span></div>
        <div>values: <span class="hash-link">${t((Qt=e.audio)==null?void 0:Qt.valuesHash)}</span></div>
      </div>

      <!-- Speech Card -->
      <div class="creep-card">
        <div class="card-title-bar">
          <span class="card-title">Speech <span class="hash-link">${t((Zt=e.speech)==null?void 0:Zt.hash)}</span></span>
          <span class="exec-time">0.40 ms</span>
        </div>
        <div>local (${((Jt=e.speech)==null?void 0:Jt.localCount)||0}): <span class="hash-link">${t((Yt=e.speech)==null?void 0:Yt.localHash)}</span></div>
        <div>remote (${((Xt=e.speech)==null?void 0:Xt.remoteCount)||0}): <span class="hash-link">${t((es=e.speech)==null?void 0:es.remoteHash)}</span></div>
        <div>lang (${((ts=e.speech)==null?void 0:ts.languagesCount)||0}): <span class="hash-link">${t((ss=e.speech)==null?void 0:ss.languagesHash)}</span></div>
        <div class="label-dim" style="margin-top: 6px;">default:</div>
        <div class="block-nested" style="font-size: 11px;">
          ${t((as=e.speech)==null?void 0:as.defaultVoice)}
        </div>
      </div>

      <!-- Media Card -->
      <div class="creep-card">
        <div class="card-title-bar">
          <span class="card-title">Media <span class="hash-link">${t((ns=e.media)==null?void 0:ns.hash)}</span></span>
          <span class="exec-time">0.30 ms</span>
        </div>
        <div>mimes (${((is=e.media)==null?void 0:is.supportedMimesCount)||0}/${((os=e.media)==null?void 0:os.totalMimesCount)||12}): <span class="hash-link">${t((rs=e.media)==null?void 0:rs.mimesHash)}</span></div>
      </div>
    </div>

    <!-- Row 8: Features, CSS & Computed Style -->
    <div class="grid-two">
      <div class="creep-card">
        <div class="card-title-bar">
          <span class="card-title">Features: 🌐 ${t((ds=(cs=e.engine)==null?void 0:cs.features)==null?void 0:ds.versionRange)}</span>
          <span class="exec-time">3.20 ms</span>
        </div>
        <div style="display: flex; justify-content: space-between; flex-wrap: wrap;">
          <div>JS/DOM: <span class="hash-link">${t((ps=(ls=e.engine)==null?void 0:ls.features)==null?void 0:ps.jsDomHash)}</span></div>
          <div>CSS: <span class="hash-link">${t((ms=(us=e.engine)==null?void 0:us.features)==null?void 0:ms.cssHash)}</span></div>
        </div>
        <div style="margin-top: 4px;">Window: <span class="hash-link">${t((vs=(hs=e.engine)==null?void 0:hs.features)==null?void 0:vs.windowHash)}</span></div>
        <div style="margin-top: 8px; border-top: 1px solid #282c37; padding-top: 6px;">
          <div style="display: flex; justify-content: space-between;">
            <span class="card-title">CSS Media Queries <span class="hash-link">${t((fs=(gs=e.engine)==null?void 0:gs.cssMediaQueries)==null?void 0:fs.hash)}</span></span>
            <span class="exec-time">0.90 ms</span>
          </div>
          <div>@media: <span class="hash-link">${t((ws=(ys=e.engine)==null?void 0:ys.cssMediaQueries)==null?void 0:ws.atMediaHash)}</span></div>
          <div>matchMedia: <span class="hash-link">${t(($s=(bs=e.engine)==null?void 0:bs.cssMediaQueries)==null?void 0:$s.matchMediaHash)}</span></div>
          <div>touch device: ${t((Ss=(xs=e.engine)==null?void 0:xs.cssMediaQueries)==null?void 0:Ss.touchDevice)}</div>
          <div>screen query: ${t((ks=(Cs=e.engine)==null?void 0:Cs.cssMediaQueries)==null?void 0:ks.screenQuery)}</div>
        </div>
      </div>

      <div class="creep-card">
        <div class="card-title-bar">
          <span class="card-title">Computed Style <span class="hash-link">${t((As=(Rs=e.engine)==null?void 0:Rs.computedStyle)==null?void 0:As.hash)}</span></span>
          <span class="exec-time">6.10 ms</span>
        </div>
        <div>keys (${((Ds=(Hs=e.engine)==null?void 0:Hs.computedStyle)==null?void 0:Ds.keysCount)||0}): <span class="hash-link">${t((Ts=(Ms=e.engine)==null?void 0:Ms.computedStyle)==null?void 0:Ts.keysHash)}</span></div>
        <div>system styles: <span class="hash-link">${t((Ps=(_s=e.engine)==null?void 0:_s.computedStyle)==null?void 0:Ps.systemStylesHash)}</span></div>
        <div class="swatch-bar">
          ${(((Fs=(Es=e.engine)==null?void 0:Es.computedStyle)==null?void 0:Fs.systemColors)||[]).map(S=>`<span style="background: ${S};"></span>`).join("")}
        </div>
        <div style="margin-top: 12px; display: grid; grid-template-columns: 1fr 1fr; gap: 8px; font-size: 12px;">
          <div>Math <span class="hash-link">${t((Ls=(Ws=e.system)==null?void 0:Ws.math)==null?void 0:Ls.hash)}</span>: details</div>
          <div>Error <span class="hash-link">${t((Os=(zs=e.system)==null?void 0:zs.error)==null?void 0:Os.hash)}</span>: details</div>
          <div>Window <span class="hash-link">${t((Bs=(Is=e.system)==null?void 0:Is.windowKeys)==null?void 0:Bs.hash)}</span> keys (${((Ns=(js=e.system)==null?void 0:js.windowKeys)==null?void 0:Ns.count)||0})</div>
          <div>HTMLElement <span class="hash-link">${t((Vs=(Us=e.system)==null?void 0:Us.htmlElementKeys)==null?void 0:Vs.hash)}</span> keys (${((qs=(Gs=e.system)==null?void 0:Gs.htmlElementKeys)==null?void 0:qs.count)||0})</div>
        </div>
      </div>
    </div>

    <!-- Row 9: Navigator & Device -->
    <div class="creep-card" style="margin-bottom: 12px;">
      <div class="card-title-bar">
        <span class="card-title">Navigator <span class="hash-link">${t((Qs=(Ks=e.system)==null?void 0:Ks.navigator)==null?void 0:Qs.hash)}</span></span>
        <span class="exec-time">28.60 ms</span>
      </div>
      <div class="grid-two" style="margin-bottom: 0;">
        <div>
          <div>properties (${((Js=(Zs=e.system)==null?void 0:Zs.navigator)==null?void 0:Js.propertiesCount)||0}): <span class="hash-link">${t((Xs=(Ys=e.system)==null?void 0:Ys.navigator)==null?void 0:Xs.propertiesHash)}</span></div>
          <div>dnt: ${t((ta=(ea=e.system)==null?void 0:ea.navigator)==null?void 0:ta.dnt)}</div>
          <div>gpc: ${t((aa=(sa=e.system)==null?void 0:sa.navigator)==null?void 0:aa.gpc)}</div>
          <div>lang: ${t((ia=(na=e.system)==null?void 0:na.navigator)==null?void 0:ia.languages)}</div>
          <div>mimeTypes (${((ra=(oa=e.system)==null?void 0:oa.navigator)==null?void 0:ra.mimeTypesCount)||0}): <span class="hash-link">${t((da=(ca=e.system)==null?void 0:ca.navigator)==null?void 0:da.mimeTypesHash)}</span></div>
          <div>permissions (${((pa=(la=e.system)==null?void 0:la.navigator)==null?void 0:pa.permissionsCount)||0}): <span class="hash-link">${t((ma=(ua=e.system)==null?void 0:ua.navigator)==null?void 0:ma.permissionsHash)}</span></div>
          <div>plugins (${((va=(ha=e.system)==null?void 0:ha.navigator)==null?void 0:va.pluginsCount)||0}): <span class="hash-link">${t((fa=(ga=e.system)==null?void 0:ga.navigator)==null?void 0:fa.pluginsHash)}</span></div>
          <div>vendor: ${t((wa=(ya=e.system)==null?void 0:ya.navigator)==null?void 0:wa.vendor)}</div>
          <div>webgpu: <span class="hash-link">${t(($a=(ba=e.system)==null?void 0:ba.navigator)==null?void 0:$a.webgpuHash)}</span></div>
          <div class="label-dim" style="margin-top: 6px;">userAgentData:</div>
          <div class="block-nested">
            <div>${(Sa=(xa=e.system)==null?void 0:xa.navigator)!=null&&Sa.userAgentData?t(e.system.navigator.userAgentData.brands):'<span style="color: var(--text-dim);">unsupported</span>'}</div>
            <div>${(ka=(Ca=e.system)==null?void 0:Ca.navigator)!=null&&ka.userAgentData?`${t(e.system.navigator.userAgentData.platform)} [${t(e.system.navigator.userAgentData.platformVersion)}] ${t(e.system.navigator.userAgentData.architecture)}`:'<span style="color: var(--text-dim);">-</span>'}</div>
          </div>
        </div>
        <div>
          <div class="label-dim">device:</div>
          <div class="block-nested">
            <div>${t((Aa=(Ra=e.system)==null?void 0:Ra.device)==null?void 0:Aa.platform)}</div>
            <div>${t((Da=(Ha=e.system)==null?void 0:Ha.device)==null?void 0:Da.osVersion)}</div>
            <div>cores: ${t((Ta=(Ma=e.system)==null?void 0:Ma.device)==null?void 0:Ta.cores)}, ram: ${t((Pa=(_a=e.system)==null?void 0:_a.device)==null?void 0:Pa.ram)}, touch: ${t((Fa=(Ea=e.system)==null?void 0:Ea.device)==null?void 0:Fa.touch)}, ${(La=(Wa=e.system)==null?void 0:Wa.device)!=null&&La.hasBluetooth?"bluetooth":""}</div>
          </div>
          <div class="label-dim">ua parsed: ${t((Oa=(za=e.system)==null?void 0:za.navigator)==null?void 0:Oa.parsedBrowser)}</div>
          <div class="label-dim" style="display: flex; justify-content: space-between;">
            <span>userAgent:</span>
            <span>${(Ba=(Ia=e.system)==null?void 0:Ia.navigator)!=null&&Ba.isUAReduction?"ua reduction":"standard"}</span>
          </div>
          <div class="block-nested">${t((Na=(ja=e.system)==null?void 0:ja.navigator)==null?void 0:Na.userAgent)}</div>
          <div class="label-dim">appVersion:</div>
          <div class="block-nested">${t((Va=(Ua=e.system)==null?void 0:Ua.navigator)==null?void 0:Va.appVersion)}</div>
        </div>
      </div>
    </div>

    <!-- Row 10: Status (Network, Battery, Memory) -->
    <div class="creep-card" style="margin-bottom: 16px;">
      <div class="card-title-bar">
        <span class="card-title">Status <span class="hash-link">${t((Ga=e.status)==null?void 0:Ga.hash)}</span></span>
        <span class="exec-time">2.10 ms</span>
      </div>
      <div class="grid-three" style="margin-bottom: 0;">
        <div>
          <div class="label-dim">network:</div>
          <div class="block-nested">
            <div>rtt: ${t((Ka=(qa=e.status)==null?void 0:qa.network)==null?void 0:Ka.rtt)}, downlink: ${t((Za=(Qa=e.status)==null?void 0:Qa.network)==null?void 0:Za.downlink)}</div>
            <div>effectiveType: ${t((Ya=(Ja=e.status)==null?void 0:Ja.network)==null?void 0:Ya.effectiveType)}</div>
            <div>saveData: ${t((en=(Xa=e.status)==null?void 0:Xa.network)==null?void 0:en.saveData)}</div>
          </div>
        </div>
        <div>
          <div class="label-dim">battery:</div>
          <div class="block-nested">
            <div>level: ${t((sn=(tn=e.status)==null?void 0:tn.battery)==null?void 0:sn.level)}</div>
            <div>charging: ${t((nn=(an=e.status)==null?void 0:an.battery)==null?void 0:nn.charging)}</div>
            <div>charge time: ${t((rn=(on=e.status)==null?void 0:on.battery)==null?void 0:rn.chargeTime)}</div>
            <div>discharge time: ${t((dn=(cn=e.status)==null?void 0:cn.battery)==null?void 0:dn.dischargeTime)}</div>
          </div>
        </div>
        <div>
          <div class="label-dim">available:</div>
          <div class="block-nested">
            <div>storage: ${t((pn=(ln=e.status)==null?void 0:ln.available)==null?void 0:pn.storageQuota)} [${t((mn=(un=e.status)==null?void 0:un.available)==null?void 0:mn.storageBytes)}]</div>
            <div>memory: ${t((vn=(hn=e.status)==null?void 0:hn.available)==null?void 0:vn.memoryQuota)} [${t((fn=(gn=e.status)==null?void 0:gn.available)==null?void 0:fn.memoryBytes)}]</div>
            <div class="label-dim" style="margin-top: 4px;">timing res:</div>
            <div>${t((wn=(yn=e.status)==null?void 0:yn.available)==null?void 0:wn.timingResolutionA)}</div>
            <div>${t(($n=(bn=e.status)==null?void 0:bn.available)==null?void 0:$n.timingResolutionB)}</div>
            <div style="margin-top: 4px;">stack: ${t((Sn=(xn=e.status)==null?void 0:xn.available)==null?void 0:Sn.stackDepth)}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Diagnostic & Explainable Fraud Analysis Section -->
    <div class="diagnostic-container">
      <div class="diag-summary-title">
        <span>Diagnostic Evaluation & Fraud Risk Analysis</span>
        <span class="badge-risk ${n}">${a.risk.tier} (${a.risk.score}/100)</span>
      </div>
      <div style="margin-top: 10px; color: var(--text-dim); font-size: 12px;">
        Detected Lies: <span style="color: var(--red-accent); font-weight: bold;">${a.risk.liesCount}</span> |
        Warnings: <span style="color: var(--amber-accent); font-weight: bold;">${a.risk.warningsCount}</span> |
        Automation Flag: <span style="color: ${a.risk.automationDetected?"var(--red-accent)":"var(--green-accent)"};">${a.risk.automationDetected?"TRUE":"FALSE"}</span> |
        Privacy Mode: <span>${a.risk.isPrivacyMode?"TRUE":"FALSE"}</span>
      </div>

      <div style="margin-top: 12px;">
        <strong>Verdict & Explanation:</strong>
        <ul style="margin-top: 6px; padding-left: 18px; font-size: 12.5px;">
          ${a.risk.reasons.map(S=>`<li style="margin-bottom: 4px;">${S}</li>`).join("")}
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
          ${a.diagnostics.map(S=>`
            <tr>
              <td><strong>${S.testName}</strong></td>
              <td style="color: var(--text-dim);">${S.category}</td>
              <td>
                <span class="${S.status==="detected"?S.isLie?"pill-detected":"pill-warning":"pill-clean"}">
                  ${S.status.toUpperCase()}
                </span>
              </td>
              <td style="word-break: break-all;">${typeof S.observedResult=="object"?JSON.stringify(S.observedResult):S.observedResult}</td>
              <td style="color: var(--text-dim); font-size: 11.5px;">${S.explanation}</td>
            </tr>
          `).join("")}
        </tbody>
      </table>

      <!-- Inter-session consistency diff inspector -->
      <div style="margin-top: 16px; border-top: 1px solid var(--border-color); padding-top: 12px;">
        <strong>Inter-Session Consistency Status:</strong>
        <div style="margin-top: 6px; font-size: 12px;">
          Previous Sessions Recorded: ${((Cn=e.consistency)==null?void 0:Cn.previousSessionCount)||0} |
          FP ID Match: <span style="color: ${(kn=e.consistency)!=null&&kn.fpIdMatchesPrevious?"var(--green-accent)":"var(--amber-accent)"};">${(Rn=e.consistency)!=null&&Rn.fpIdMatchesPrevious?"MATCHES PREVIOUS":"FIRST VISIT / MUTATED"}</span>
        </div>
        ${((Hn=(An=e.consistency)==null?void 0:An.anomaliesDetected)==null?void 0:Hn.length)>0?`
          <div class="block-nested" style="border-color: rgba(224, 108, 117, 0.4); color: var(--red-accent); margin-top: 8px;">
            ${e.consistency.anomaliesDetected.join("<br>")}
          </div>
        `:""}
      </div>

      <div style="margin-top: 16px;">
        <button id="btn-export-json" class="btn-action">Export Session JSON</button>
        <button id="btn-rerun" class="btn-action">Re-Run Analysis</button>
      </div>
    </div>
  `,(Dn=document.getElementById("btn-export-json"))==null||Dn.addEventListener("click",()=>{const S=new Blob([JSON.stringify(a,null,2)],{type:"application/json"}),Tn=URL.createObjectURL(S),O=document.createElement("a");O.href=Tn,O.download=`creep_session_${a.fpId.slice(0,8)}.json`,O.click(),URL.revokeObjectURL(Tn)}),(Mn=document.getElementById("btn-rerun"))==null||Mn.addEventListener("click",()=>{window.location.reload()})}async function oi(){const s=document.getElementById("app");if(!s)return;s.innerHTML=`
    <div style="padding: 40px; text-align: center; font-family: monospace; color: #abb2bf;">
      <h2>CreepJS Prototype: Probing Browser Signals...</h2>
      <p style="margin-top: 10px; color: #636d83;">Evaluating hardware invariants, prototypes, and cross-thread consistency...</p>
    </div>
  `;const a=performance.now(),e=async _=>{const P=performance.now(),E=await _(),F=Math.round((performance.now()-P)*100)/100;return{data:E,duration:F}},[n,t,i,c,r,d,o,p,m,u,b,y,v,g,l,$]=await Promise.all([e(Wn),e(Ln),e(zn),e(On),e(In),e(Bn),e(jn),e(Nn),e(Un),e(Vn),e(Gn),e(qn),e(Kn),e(Qn),e(Zn),e(Jn)]),f={webrtc:n.data,intl:t.data,headless:i.data,resistance:c.data,worker:r.data,webgl:d.data,screen:o.data,canvas:p.data,fonts:m.data,geometry:u.data,audio:b.data,speech:y.data,media:v.data,engine:g.data,system:l.data,status:$.data,consistency:null},w=await Xn(f),R=ti({fpId:w.fpId,userAgent:f.system.navigator.userAgent,gpuRenderer:f.webgl.unmaskedRenderer||f.webgl.renderer,screen:`${f.screen.width}x${f.screen.height}`,timezone:f.intl.timezone.name,canvasHash:w.componentHashes.canvas,audioHash:w.componentHashes.audio});f.consistency=R;const k=si(f),C=ni(k);ei({fpId:w.fpId,userAgent:f.system.navigator.userAgent,gpuRenderer:f.webgl.unmaskedRenderer||f.webgl.renderer,screen:`${f.screen.width}x${f.screen.height}`,timezone:f.intl.timezone.name,canvasHash:w.componentHashes.canvas,audioHash:w.componentHashes.audio});const x=Math.round((performance.now()-a)*100)/100,D={webrtc:{hash:w.componentHashes.webrtc||"8d5b3baa",executionTimeMs:n.duration,data:n.data},timezone:{hash:w.componentHashes.timezone||"3582e316",executionTimeMs:t.duration,data:t.data},intl:{hash:w.componentHashes.intl||"0beea116",executionTimeMs:t.duration,data:t.data},headless:{hash:"ce2546a9",executionTimeMs:i.duration,data:i.data},worker:{hash:w.componentHashes.worker||"db519337",executionTimeMs:r.duration,data:r.data},webgl:{hash:w.componentHashes.webgl||"426a1047",executionTimeMs:d.duration,data:d.data},screen:{hash:w.componentHashes.screen||"9d83f24a",executionTimeMs:o.duration,data:o.data},canvas:{hash:w.componentHashes.canvas||"f7968695",executionTimeMs:p.duration,data:p.data},fonts:{hash:w.componentHashes.fonts||"bd49bd8d",executionTimeMs:m.duration,data:m.data},domRect:{hash:w.componentHashes.domRect||"1d4eb14a",executionTimeMs:u.duration,data:u.data.domRect},svgRect:{hash:w.componentHashes.svgRect||"43f113b0",executionTimeMs:u.duration,data:u.data.svgRect},audio:{hash:w.componentHashes.audio||"d0c60a78",executionTimeMs:b.duration,data:b.data}},M={id:`session_${Date.now()}`,timestamp:Date.now(),fpId:w.fpId,fuzzyFp:w.fuzzyFp,executionTimeMs:x,risk:C,components:D,diagnostics:k,rawSignals:f};ii(s,M)}window.addEventListener("DOMContentLoaded",oi);
