import { hashToHex } from '../fingerprint/hasher';

export interface DOMRectData {
  hash: string;
  elemsA: string;
  elemsB: string;
  rangeA: string;
  rangeB: string;
  metricFloat: string;
  glyphs: string;
}

export interface SVGRectData {
  hash: string;
  bBox: string;
  char: string;
  subs: string;
  text: string;
  metricFloat: string;
  glyphs: string;
}

export function collectGeometry(): { domRect: DOMRectData; svgRect: SVGRectData } {
  const container = document.createElement('div');
  container.style.position = 'absolute';
  container.style.left = '-9999px';
  container.style.top = '-9999px';
  container.style.visibility = 'hidden';
  document.body.appendChild(container);

  // DOMRect
  const el = document.createElement('div');
  el.style.fontSize = '12.35px';
  el.style.fontFamily = 'monospace';
  el.innerHTML = '<span id="spanA">CreeperPrototypeA</span><span id="spanB">SubPixelTestB</span>';
  container.appendChild(el);

  const spanA = el.querySelector('#spanA')!;
  const spanB = el.querySelector('#spanB')!;
  const rA = spanA.getBoundingClientRect();
  const rB = spanB.getBoundingClientRect();

  const getSubpixel = (n: number) => {
    const frac = n - Math.floor(n);
    return frac > 0 ? frac.toFixed(17) : n.toFixed(17);
  };

  const elemsA = getSubpixel(rA.width);
  const elemsB = getSubpixel(rB.height);

  let rangeA = elemsA;
  let rangeB = elemsB;
  try {
    const range = document.createRange();
    range.selectNodeContents(spanA);
    const rangeRect = range.getBoundingClientRect();
    rangeA = getSubpixel(rangeRect.width);
    rangeB = getSubpixel(rangeRect.height);
  } catch {}

  const metricDiv = document.createElement('div');
  metricDiv.style.font = '16.7px "Times New Roman", serif';
  metricDiv.textContent = '😀👥©™⬛';
  container.appendChild(metricDiv);
  const mRect = metricDiv.getBoundingClientRect();
  const domMetricFloat = getSubpixel(mRect.width);

  const domHash = hashToHex(`${elemsA}:${elemsB}:${rangeA}:${rangeB}:${domMetricFloat}`);

  // SVGRect
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('width', '200');
  svg.setAttribute('height', '50');
  const svgText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
  svgText.setAttribute('x', '0');
  svgText.setAttribute('y', '25');
  svgText.setAttribute('font-size', '14.33px');
  svgText.textContent = 'CreepJSSVGSubpixelMetrics';
  svg.appendChild(svgText);
  container.appendChild(svg);

  let bBoxVal = 'unsupported';
  let charVal = 'unsupported';
  let subsVal = 'unsupported';
  let textVal = 'unsupported';

  try {
    const bbox = svgText.getBBox();
    bBoxVal = getSubpixel(bbox.width);
    if ((svgText as any).getStartPositionOfChar) {
      const charPos = (svgText as any).getStartPositionOfChar(2);
      charVal = getSubpixel(charPos.x);
    }
    if ((svgText as any).getSubStringLength) {
      const subLen = (svgText as any).getSubStringLength(0, 5);
      subsVal = getSubpixel(subLen);
      textVal = getSubpixel((svgText as any).getSubStringLength(0, 10));
    }
  } catch {}

  const svgMetricFloat = getSubpixel(mRect.height);
  const svgHash = hashToHex(`${bBoxVal}:${charVal}:${subsVal}:${textVal}:${svgMetricFloat}`);

  document.body.removeChild(container);

  return {
    domRect: {
      hash: domHash,
      elemsA,
      elemsB,
      rangeA,
      rangeB,
      metricFloat: domMetricFloat,
      glyphs: '😀 👥 ©™ ⬛'
    },
    svgRect: {
      hash: svgHash,
      bBox: bBoxVal,
      char: charVal,
      subs: subsVal,
      text: textVal,
      metricFloat: svgMetricFloat,
      glyphs: '😀 👥 ©™ ⬛'
    }
  };
}
