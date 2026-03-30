// ============================================
// AIDOM — ID Generator (Web Crypto compatible)
// ============================================

export function generateId(prefix: string = ''): string {
  const bytes = new Uint8Array(12);
  crypto.getRandomValues(bytes);
  const hex = Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');
  return prefix ? `${prefix}_${hex}` : hex;
}
