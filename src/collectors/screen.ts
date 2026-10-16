export interface ScreenData {
  width: number;
  height: number;
  availWidth: number;
  availHeight: number;
  colorDepth: number;
  pixelDepth: number;
  devicePixelRatio: number;
  touchSupport: boolean;
  maxTouchPoints: number;
  orientationType: string;
  viewportWidth: number;
  viewportHeight: number;
  outerWidth: number;
  outerHeight: number;
  zoomRatio: number;
  isLandscape: boolean;
}

export function collectScreen(): ScreenData {
  const width = screen.width || 0;
  const height = screen.height || 0;
  const availWidth = screen.availWidth || 0;
  const availHeight = screen.availHeight || 0;
  const colorDepth = screen.colorDepth || 0;
  const pixelDepth = screen.pixelDepth || 0;
  const devicePixelRatio = window.devicePixelRatio || 1;
  const maxTouchPoints = navigator.maxTouchPoints || 0;
  const touchSupport = maxTouchPoints > 0 || 'ontouchstart' in window;

  let orientationType = 'landscape-primary';
  try {
    if (screen.orientation && screen.orientation.type) {
      orientationType = screen.orientation.type;
    }
  } catch {}

  const viewportWidth = window.innerWidth || 0;
  const viewportHeight = window.innerHeight || 0;
  const outerWidth = window.outerWidth || 0;
  const outerHeight = window.outerHeight || 0;

  // Zoom ratio calculation
  const zoomRatio = devicePixelRatio;

  return {
    width,
    height,
    availWidth,
    availHeight,
    colorDepth,
    pixelDepth,
    devicePixelRatio,
    touchSupport,
    maxTouchPoints,
    orientationType,
    viewportWidth,
    viewportHeight,
    outerWidth,
    outerHeight,
    zoomRatio,
    isLandscape: width >= height
  };
}
