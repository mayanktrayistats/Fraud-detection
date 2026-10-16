import { hashToHex } from '../fingerprint/hasher';

export interface MediaData {
  hash: string;
  supportedMimesCount: number;
  totalMimesCount: number;
  mimesHash: string;
}

const COMMON_MEDIA_TYPES = [
  'video/mp4; codecs="avc1.42E01E"',
  'video/mp4; codecs="avc1.42E01E, mp4a.40.2"',
  'video/mp4; codecs="avc1.58A01E"',
  'video/mp4; codecs="avc1.64001E"',
  'video/mp4; codecs="mp4v.20.8"',
  'video/webm; codecs="vp8"',
  'video/webm; codecs="vp9"',
  'video/webm; codecs="vorbis"',
  'video/ogg; codecs="theora"',
  'audio/mpeg',
  'audio/mp4; codecs="mp4a.40.2"',
  'audio/ogg; codecs="flac"'
];

export function collectMedia(): MediaData {
  const video = document.createElement('video');
  let supportedCount = 0;
  const supportedList: string[] = [];

  for (const type of COMMON_MEDIA_TYPES) {
    if (video.canPlayType && video.canPlayType(type) !== '') {
      supportedCount++;
      supportedList.push(type);
    }
  }

  const mimesHash = hashToHex(supportedList.join(','));
  return {
    hash: mimesHash,
    supportedMimesCount: supportedCount || 10,
    totalMimesCount: COMMON_MEDIA_TYPES.length,
    mimesHash
  };
}
