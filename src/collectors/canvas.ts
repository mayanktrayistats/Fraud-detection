import { hashToHex } from '../fingerprint/hasher';

export interface CanvasData {
  dataHash: string;
  dataUrl: string;
  textMetricFloat: string;
  noiseDetected: boolean;
  glyphs: string;
}

export function collectCanvas(): CanvasData {
  const canvas = document.createElement('canvas');
  canvas.width = 240;
  canvas.height = 60;
  const ctx = canvas.getContext('2d');

  let dataHash = 'not found';
  let dataUrl = '';
  let textMetricFloat = 'not found';
  let noiseDetected = false;

  if (!ctx) {
    return { dataHash, dataUrl, textMetricFloat, noiseDetected, glyphs: 'not found' };
  }

  try {
    // 1. Text winding letter 'A'
    ctx.textBaseline = 'top';
    ctx.font = '32px sans-serif';
    ctx.fillStyle = '#000000';
    ctx.fillText('A', 10, 10);

    // 2. Purple 8-bit alien / glyph
    ctx.fillStyle = '#9b59b6';
    ctx.fillRect(50, 15, 6, 6);
    ctx.fillRect(66, 15, 6, 6);
    ctx.fillRect(46, 23, 30, 8);
    ctx.fillRect(52, 33, 6, 8);
    ctx.fillRect(64, 33, 6, 8);

    // 3. Multicolored radial gradient circle
    const radGrad = ctx.createRadialGradient(105, 28, 2, 105, 28, 16);
    radGrad.addColorStop(0, '#e74c3c');
    radGrad.addColorStop(0.5, '#2ecc71');
    radGrad.addColorStop(1, '#3498db');
    ctx.fillStyle = radGrad;
    ctx.beginPath();
    ctx.arc(105, 28, 16, 0, Math.PI * 2);
    ctx.fill();

    // 4. Warped linear gradient sphere
    const linGrad = ctx.createLinearGradient(135, 12, 165, 44);
    linGrad.addColorStop(0, '#f1c40f');
    linGrad.addColorStop(0.5, '#e91e63');
    linGrad.addColorStop(1, '#00bcd4');
    ctx.fillStyle = linGrad;
    ctx.beginPath();
    ctx.arc(150, 28, 16, 0, Math.PI * 1.6);
    ctx.fill();

    // 5. Mosaic pixel grid
    const colors = ['#f44336', '#e91e63', '#9c27b0', '#673ab7', '#3f51b5', '#2196f3', '#00bcd4', '#009688', '#4caf50', '#8bc34a', '#ffeb3b', '#ff9800'];
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        ctx.fillStyle = colors[(row * 4 + col) % colors.length];
        ctx.fillRect(180 + col * 7, 14 + row * 7, 7, 7);
      }
    }

    dataUrl = canvas.toDataURL();
    dataHash = hashToHex(dataUrl);

    // Dynamic sub-pixel text metrics test
    ctx.font = '14.5px "Times New Roman", sans-serif';
    const m1 = ctx.measureText('😀🥷☕🎴🖤❄️');
    const frac = m1.width - Math.floor(m1.width);
    textMetricFloat = (frac > 0 ? frac : m1.width).toFixed(18);
  } catch {
    // Canvas blocked
  }

  return {
    dataHash,
    dataUrl,
    textMetricFloat,
    noiseDetected,
    glyphs: '😀 🥷 ☕ 🎴 🖤 ❄️'
  };
}
