// ============================================
// AIDOM — Password Hashing (Web Crypto API)
// ============================================
// Utilise PBKDF2 au lieu de bcrypt pour compatibilité Workers.

const ITERATIONS = 100000;
const HASH_LENGTH = 32;

export async function hashPassword(password: string): Promise<string> {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const key = await deriveKey(password, salt);
  const hash = await crypto.subtle.exportKey('raw', key);

  const saltHex = toHex(salt);
  const hashHex = toHex(new Uint8Array(hash));
  return `pbkdf2:${ITERATIONS}:${saltHex}:${hashHex}`;
}

export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const parts = stored.split(':');
  if (parts[0] !== 'pbkdf2' || parts.length !== 4) return false;

  const iterations = parseInt(parts[1]);
  const salt = fromHex(parts[2]);
  const expectedHash = parts[3];

  const key = await deriveKey(password, salt, iterations);
  const hash = await crypto.subtle.exportKey('raw', key);
  const hashHex = toHex(new Uint8Array(hash));

  return hashHex === expectedHash;
}

async function deriveKey(password: string, salt: Uint8Array, iterations: number = ITERATIONS) {
  const enc = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    'raw', enc.encode(password), 'PBKDF2', false, ['deriveKey']
  );
  return crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt: salt as any, iterations, hash: 'SHA-256' },
    keyMaterial,
    { name: 'AES-GCM', length: HASH_LENGTH * 8 },
    true,
    ['encrypt']
  );
}

function toHex(bytes: Uint8Array): string {
  return Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');
}

function fromHex(hex: string): Uint8Array {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.substring(i, i + 2), 16);
  }
  return bytes;
}
