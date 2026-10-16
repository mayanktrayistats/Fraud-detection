import { hashToHex } from '../fingerprint/hasher';

export interface FontsData {
  fontsHash: string;
  loadedCount: number;
  totalTested: number;
  installedFonts: string[];
  metricsFloat: string;
  glyphs: string;
}

const FONTS_TO_CHECK = [
  'Arial', 'Calibri', 'Cambria Math', 'Consolas', 'Courier New', 'Georgia',
  'Ink Free', 'Javanese Text', 'Leelawadee UI', 'Lucida Console', 'Lucida Sans',
  'Malgun Gothic', 'Microsoft Himalaya', 'Microsoft JhengHei', 'Microsoft YaHei',
  'MS Outlook', 'MS PGothic', 'MS Gothic', 'Myanmar Text', 'Nirmala UI',
  'Palatino Linotype', 'Segoe Fluent Icons', 'Segoe MDL2 Assets', 'Segoe UI',
  'Segoe UI Emoji', 'Segoe UI Historic', 'Segoe UI Symbol', 'SimSun',
  'Sitka Text', 'Sylfaen', 'Tahoma', 'Times New Roman', 'Trebuchet MS',
  'Verdana', 'Yu Gothic', 'Bahnschrift', 'Gadugi', 'Franklin Gothic',
  'Apple Color Emoji', 'Menlo', 'Monaco', 'Geneva', 'Helvetica', 'Ubuntu',
  'Roboto', 'Cantarell', 'DejaVu Sans', 'Liberation Sans', 'Noto Color Emoji', 'Noto Sans'
];

export function collectFonts(): FontsData {
  const container = document.createElement('div');
  container.style.position = 'absolute';
  container.style.left = '-9999px';
  container.style.top = '-9999px';
  container.style.visibility = 'hidden';
  document.body.appendChild(container);

  const testString = 'mmmmmmmmmmlliWWWWWW@@@';
  const testSize = '72px';

  const baseSpanMono = document.createElement('span');
  baseSpanMono.style.fontSize = testSize;
  baseSpanMono.style.fontFamily = 'monospace';
  baseSpanMono.textContent = testString;
  container.appendChild(baseSpanMono);

  const baseSpanSans = document.createElement('span');
  baseSpanSans.style.fontSize = testSize;
  baseSpanSans.style.fontFamily = 'sans-serif';
  baseSpanSans.textContent = testString;
  container.appendChild(baseSpanSans);

  const monoWidth = baseSpanMono.offsetWidth;
  const monoHeight = baseSpanMono.offsetHeight;
  const sansWidth = baseSpanSans.offsetWidth;
  const sansHeight = baseSpanSans.offsetHeight;

  const installed: string[] = [];

  for (const font of FONTS_TO_CHECK) {
    const span = document.createElement('span');
    span.style.fontSize = testSize;
    span.style.fontFamily = `"${font}", monospace`;
    span.textContent = testString;
    container.appendChild(span);

    const spanSans = document.createElement('span');
    spanSans.style.fontSize = testSize;
    spanSans.style.fontFamily = `"${font}", sans-serif`;
    spanSans.textContent = testString;
    container.appendChild(spanSans);

    const matchMono = span.offsetWidth !== monoWidth || span.offsetHeight !== monoHeight;
    const matchSans = spanSans.offsetWidth !== sansWidth || spanSans.offsetHeight !== sansHeight;

    if (matchMono || matchSans) {
      installed.push(font);
    }
  }

  // Sub-pixel metric calculation
  const metricSpan = document.createElement('span');
  metricSpan.style.font = '16.3px "Segoe UI", sans-serif';
  metricSpan.textContent = '😀👥©™⬛';
  container.appendChild(metricSpan);
  const bbox = metricSpan.getBoundingClientRect();
  const subpixel = Math.abs(bbox.width - Math.floor(bbox.width));
  const metricsFloat = subpixel !== 0 ? subpixel.toFixed(8) : '0.02369484';

  document.body.removeChild(container);

  const fontsHash = hashToHex(installed.join(','));

  return {
    fontsHash,
    loadedCount: installed.length,
    totalTested: FONTS_TO_CHECK.length,
    installedFonts: installed,
    metricsFloat,
    glyphs: '😀 👥 ©™ ⬛'
  };
}
