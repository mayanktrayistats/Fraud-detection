import { hashToHex } from '../fingerprint/hasher';

export interface SpeechData {
  hash: string;
  localCount: number;
  localHash: string;
  remoteCount: number;
  remoteHash: string;
  languagesCount: number;
  languagesHash: string;
  defaultVoice: string;
  voicesList: string[];
}

export async function collectSpeech(): Promise<SpeechData> {
  const result: SpeechData = {
    hash: 'unsupported',
    localCount: 0,
    localHash: 'unsupported',
    remoteCount: 0,
    remoteHash: 'unsupported',
    languagesCount: 0,
    languagesHash: 'unsupported',
    defaultVoice: 'unsupported',
    voicesList: []
  };

  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    return result;
  }

  try {
    const getVoices = () => {
      return new Promise<SpeechSynthesisVoice[]>((resolve) => {
        let v = window.speechSynthesis.getVoices();
        if (v && v.length > 0) return resolve(v);
        window.speechSynthesis.onvoiceschanged = () => {
          resolve(window.speechSynthesis.getVoices() || []);
        };
        setTimeout(() => resolve(window.speechSynthesis.getVoices() || []), 800);
      });
    };

    const voices = await getVoices();
    if (voices && voices.length > 0) {
      const localVoices = voices.filter(v => v.localService);
      const remoteVoices = voices.filter(v => !v.localService);
      const langs = new Set(voices.map(v => v.lang));

      result.localCount = localVoices.length;
      result.remoteCount = remoteVoices.length;
      result.languagesCount = langs.size;

      result.localHash = hashToHex(localVoices.map(v => v.name).join(','));
      result.remoteHash = hashToHex(remoteVoices.map(v => v.name).join(','));
      result.languagesHash = hashToHex(Array.from(langs).join(','));

      const def = voices.find(v => v.default) || voices[0];
      if (def) {
        result.defaultVoice = `${def.name} [${def.lang}]`;
      }
      result.voicesList = voices.map(v => `${v.name} (${v.lang})`);
      result.hash = hashToHex(`${result.localHash}:${result.remoteHash}:${result.languagesHash}`);
    } else {
      result.defaultVoice = 'none';
      result.hash = 'none';
    }
  } catch {
    result.defaultVoice = 'blocked';
    result.hash = 'blocked';
  }

  return result;
}
