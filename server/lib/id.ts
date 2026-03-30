import crypto from 'crypto';

export function generateId(prefix: string = ''): string {
  const rand = crypto.randomBytes(12).toString('hex');
  return prefix ? `${prefix}_${rand}` : rand;
}
