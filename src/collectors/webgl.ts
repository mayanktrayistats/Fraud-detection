import { hashToHex } from '../fingerprint/hasher';

export interface WebGLData {
  supported: boolean;
  vendor: string;
  renderer: string;
  unmaskedVendor: string;
  unmaskedRenderer: string;
  parametersHash: string;
  parametersCount: number;
  extensionsHash: string;
  extensionsCount: number;
  pixelsHash: string;
  imagesHash: string;
  dataUrl: string;
  confidence: string;
}

export function collectWebGL(): WebGLData {
  const result: WebGLData = {
    supported: false,
    vendor: '',
    renderer: '',
    unmaskedVendor: '',
    unmaskedRenderer: '',
    parametersHash: '',
    parametersCount: 0,
    extensionsHash: '',
    extensionsCount: 0,
    pixelsHash: '',
    imagesHash: '',
    dataUrl: '',
    confidence: 'moderate'
  };

  const canvas = document.createElement('canvas');
  canvas.width = 100;
  canvas.height = 50;

  const gl = canvas.getContext('webgl') || (canvas.getContext('experimental-webgl') as WebGLRenderingContext | null);
  if (!gl) {
    return result;
  }

  result.supported = true;
  result.vendor = gl.getParameter(gl.VENDOR) || '';
  result.renderer = gl.getParameter(gl.RENDERER) || '';

  // Debug renderer info
  const dbg = gl.getExtension('WEBGL_debug_renderer_info');
  if (dbg) {
    result.unmaskedVendor = gl.getParameter(dbg.UNMASKED_VENDOR_WEBGL) || '';
    result.unmaskedRenderer = gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL) || '';
  }

  // Extensions
  const exts = gl.getSupportedExtensions() || [];
  result.extensionsCount = exts.length;
  result.extensionsHash = hashToHex(exts.sort().join(','));

  // Parameters
  const paramNames = [
    0x0d52, 0x0d53, 0x0d54, 0x0d55, 0x0d56, 0x0d57, 0x0b21, 0x0b44, 0x0b45,
    0x0b46, 0x0b71, 0x0b72, 0x0b73, 0x0b74, 0x0ba0, 0x0ba1, 0x0ba2, 0x0ba3,
    0x0be2, 0x0d33, 0x84e2, 0x84e8, 0x8869, 0x8871, 0x8872, 0x851c, 0x8824,
    0x8dfa, 0x8dfb, 0x8dfc, 0x84e9, 0x84fa, 0x8514, 0x8515, 0x8517, 0x8518
  ];
  const params: Record<string, any> = {};
  for (const p of paramNames) {
    try {
      const val = gl.getParameter(p);
      params[p.toString(16)] = val instanceof Float32Array || val instanceof Int32Array ? Array.from(val) : val;
    } catch {}
  }
  result.parametersCount = Object.keys(params).length;
  result.parametersHash = hashToHex(params);

  // Draw WebGL gradient triangle
  try {
    const vsSource = `
      attribute vec2 position;
      attribute vec3 color;
      varying vec3 vColor;
      void main() {
        gl_Position = vec4(position, 0.0, 1.0);
        vColor = color;
      }
    `;
    const fsSource = `
      precision mediump float;
      varying vec3 vColor;
      void main() {
        gl_FragColor = vec4(vColor, 1.0);
      }
    `;

    const createShader = (type: number, src: string) => {
      const s = gl.createShader(type);
      if (!s) return null;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return s;
    };

    const vs = createShader(gl.VERTEX_SHADER, vsSource);
    const fs = createShader(gl.FRAGMENT_SHADER, fsSource);
    if (vs && fs) {
      const prog = gl.createProgram();
      if (prog) {
        gl.attachShader(prog, vs);
        gl.attachShader(prog, fs);
        gl.linkProgram(prog);
        gl.useProgram(prog);

        const vertices = new Float32Array([
          0.0,  0.7,   1.0, 0.2, 0.4,
         -0.8, -0.7,   0.2, 0.8, 1.0,
          0.8, -0.7,   0.9, 0.7, 0.1
        ]);

        const buf = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buf);
        gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

        const posLoc = gl.getAttribLocation(prog, 'position');
        const colLoc = gl.getAttribLocation(prog, 'color');

        gl.enableVertexAttribArray(posLoc);
        gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 20, 0);

        gl.enableVertexAttribArray(colLoc);
        gl.vertexAttribPointer(colLoc, 3, gl.FLOAT, false, 20, 8);

        gl.clearColor(0.09, 0.09, 0.11, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.drawArrays(gl.TRIANGLES, 0, 3);

        const pixels = new Uint8Array(canvas.width * canvas.height * 4);
        gl.readPixels(0, 0, canvas.width, canvas.height, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
        result.pixelsHash = hashToHex(pixels.slice(0, 1024).join(','));

        result.dataUrl = canvas.toDataURL();
        result.imagesHash = hashToHex(result.dataUrl);
      }
    }
  } catch {}

  return result;
}
