export interface ConsistencyReport {
  previousSessionCount: number;
  lastSessionTimestamp: number | null;
  fpIdMatchesPrevious: boolean;
  mutatedProperties: {
    property: string;
    previousValue: any;
    currentValue: any;
    suspicious: boolean;
  }[];
  stableProperties: string[];
  anomaliesDetected: string[];
}

const STORAGE_KEY = 'creep_sessions_history';

export function saveSessionToHistory(session: {
  fpId: string;
  userAgent: string;
  gpuRenderer: string;
  screen: string;
  timezone: string;
  canvasHash: string;
  audioHash: string;
}): void {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const history: any[] = raw ? JSON.parse(raw) : [];
    history.push({
      timestamp: Date.now(),
      ...session
    });
    // Keep last 10
    if (history.length > 10) {
      history.shift();
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  } catch {}
}

export function evaluateConsistency(currentSession: {
  fpId: string;
  userAgent: string;
  gpuRenderer: string;
  screen: string;
  timezone: string;
  canvasHash: string;
  audioHash: string;
}): ConsistencyReport {
  let history: any[] = [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    history = raw ? JSON.parse(raw) : [];
  } catch {}

  const previousSessionCount = history.length;
  if (previousSessionCount === 0) {
    return {
      previousSessionCount: 0,
      lastSessionTimestamp: null,
      fpIdMatchesPrevious: true,
      mutatedProperties: [],
      stableProperties: ['first_session'],
      anomaliesDetected: []
    };
  }

  const lastSession = history[history.length - 1];
  const mutated: any[] = [];
  const stable: string[] = [];
  const anomalies: string[] = [];

  const check = (prop: string, prev: any, curr: any, isSuspiciousIfChanged: boolean) => {
    if (prev !== curr) {
      mutated.push({
        property: prop,
        previousValue: prev,
        currentValue: curr,
        suspicious: isSuspiciousIfChanged
      });
      if (isSuspiciousIfChanged) {
        anomalies.push(`Suspicious change in ${prop} across sessions (previous: "${prev}", current: "${curr}")`);
      }
    } else {
      stable.push(prop);
    }
  };

  check('userAgent', lastSession.userAgent, currentSession.userAgent, false);
  check('gpuRenderer', lastSession.gpuRenderer, currentSession.gpuRenderer, true);
  check('canvasHash', lastSession.canvasHash, currentSession.canvasHash, false);
  check('audioHash', lastSession.audioHash, currentSession.audioHash, true);
  check('screen', lastSession.screen, currentSession.screen, false);
  check('timezone', lastSession.timezone, currentSession.timezone, false);

  // Cross-anomaly: User-Agent mutated while GPU & Audio remained identical
  if (lastSession.userAgent !== currentSession.userAgent && lastSession.gpuRenderer === currentSession.gpuRenderer && lastSession.audioHash === currentSession.audioHash) {
    anomalies.push('User-Agent changed between sessions while hardware invariants (GPU & Audio) remained identical (indicates UA spoofing/profile rotation).');
  }

  return {
    previousSessionCount,
    lastSessionTimestamp: lastSession.timestamp,
    fpIdMatchesPrevious: lastSession.fpId === currentSession.fpId,
    mutatedProperties: mutated,
    stableProperties: stable,
    anomaliesDetected: anomalies
  };
}
