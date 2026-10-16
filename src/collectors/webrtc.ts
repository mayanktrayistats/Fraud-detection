import { hashToHex } from '../fingerprint/hasher';

export interface WebRTCData {
  supported: boolean;
  hostCandidate: string;
  stunCandidate: string;
  foundation: string;
  publicIp: string;
  sdpCapabilitiesHash: string;
  devices: string[];
  rawCandidates: string[];
}

export async function collectWebRTC(): Promise<WebRTCData> {
  const result: WebRTCData = {
    supported: false,
    hostCandidate: 'unsupported',
    stunCandidate: 'unsupported',
    foundation: 'unsupported',
    publicIp: 'unsupported',
    sdpCapabilitiesHash: 'unsupported',
    devices: [],
    rawCandidates: []
  };

  const RTCPC = window.RTCPeerConnection || (window as any).webkitRTCPeerConnection || (window as any).mozRTCPeerConnection;
  if (!RTCPC) {
    return result;
  }
  result.supported = true;
  result.hostCandidate = 'blocked';
  result.stunCandidate = 'blocked';
  result.foundation = 'blocked';
  result.publicIp = 'blocked';

  // Real media devices enumeration
  try {
    if (navigator.mediaDevices && navigator.mediaDevices.enumerateDevices) {
      const devs = await navigator.mediaDevices.enumerateDevices();
      const types = new Set<string>();
      devs.forEach(d => {
        if (d.kind === 'audioinput') types.add('mic');
        if (d.kind === 'audiooutput') types.add('audio');
        if (d.kind === 'videoinput') types.add('webcam');
      });
      result.devices = Array.from(types);
    }
  } catch {
    // Permission restricted
  }

  // Real ICE gathering
  try {
    await new Promise<void>((resolve) => {
      const config: RTCConfiguration = {
        iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
      };
      const pc = new RTCPC(config);
      let resolved = false;

      const finish = () => {
        if (!resolved) {
          resolved = true;
          try { pc.close(); } catch {}
          resolve();
        }
      };

      const timeout = setTimeout(finish, 2000);

      pc.onicecandidate = (event) => {
        if (!event.candidate || !event.candidate.candidate) {
          finish();
          return;
        }

        const cand = event.candidate.candidate;
        result.rawCandidates.push(cand);

        if (cand.includes('typ host')) {
          result.hostCandidate = cand;
          const match = cand.match(/candidate:(\d+)/);
          if (match && result.foundation === 'blocked') {
            result.foundation = match[1];
          }
        } else if (cand.includes('typ srflx')) {
          result.stunCandidate = cand;
          const parts = cand.split(' ');
          if (parts[4]) {
            result.publicIp = parts[4];
          }
          if (parts[0]) {
            const fMatch = parts[0].match(/candidate:(\d+)/);
            if (fMatch) result.foundation = fMatch[1];
          }
        }
      };

      pc.createDataChannel('creep-test');
      pc.createOffer().then(offer => {
        result.sdpCapabilitiesHash = hashToHex(offer.sdp || '');
        return pc.setLocalDescription(offer);
      }).catch(() => {
        finish();
      });
    });
  } catch {
    // WebRTC blocked
  }

  return result;
}
