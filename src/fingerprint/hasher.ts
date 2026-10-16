// MurmurHash3 x86 32-bit implementation
export function murmurhash3(key: string, seed: number = 0): number {
  let remainder = key.length & 3;
  let bytes = key.length - remainder;
  let h1 = seed;
  const c1 = 0xcc9e2d51;
  const c2 = 0x1b873593;
  let i = 0;

  while (i < bytes) {
    let k1 =
      (key.charCodeAt(i) & 0xff) |
      ((key.charCodeAt(++i) & 0xff) << 8) |
      ((key.charCodeAt(++i) & 0xff) << 16) |
      ((key.charCodeAt(++i) & 0xff) << 24);
    ++i;

    k1 = Math.imul(k1, c1);
    k1 = (k1 << 15) | (k1 >>> 17);
    k1 = Math.imul(k1, c2);

    h1 ^= k1;
    h1 = (h1 << 13) | (h1 >>> 19);
    h1 = Math.imul(h1, 5) + 0xe6546b64;
  }

  let k1 = 0;
  switch (remainder) {
    case 3:
      k1 ^= (key.charCodeAt(i + 2) & 0xff) << 16;
    case 2:
      k1 ^= (key.charCodeAt(i + 1) & 0xff) << 8;
    case 1:
      k1 ^= key.charCodeAt(i) & 0xff;
      k1 = Math.imul(k1, c1);
      k1 = (k1 << 15) | (k1 >>> 17);
      k1 = Math.imul(k1, c2);
      h1 ^= k1;
  }

  h1 ^= key.length;
  h1 ^= h1 >>> 16;
  h1 = Math.imul(h1, 0x85ebca6b);
  h1 ^= h1 >>> 13;
  h1 = Math.imul(h1, 0xc2b2ae35);
  h1 ^= h1 >>> 16;

  return h1 >>> 0;
}

export function hashToHex(val: string | object, seed: number = 0): string {
  const str = typeof val === 'string' ? val : JSON.stringify(val);
  const hash = murmurhash3(str, seed);
  return hash.toString(16).padStart(8, '0');
}

// Generate 64-character hex composite FP ID
export async function generate64CharHash(input: string): Promise<string> {
  try {
    const encoder = new TextEncoder();
    const data = encoder.encode(input);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  } catch {
    // Fallback if subtle crypto is unavailable
    const h1 = hashToHex(input, 1);
    const h2 = hashToHex(input, 2);
    const h3 = hashToHex(input, 3);
    const h4 = hashToHex(input, 4);
    const h5 = hashToHex(input, 5);
    const h6 = hashToHex(input, 6);
    const h7 = hashToHex(input, 7);
    const h8 = hashToHex(input, 8);
    return `${h1}${h2}${h3}${h4}${h5}${h6}${h7}${h8}`;
  }
}
