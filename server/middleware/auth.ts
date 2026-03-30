import type { Context, Next } from 'hono';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-me';

export interface JwtPayload {
  userId: string;
  email: string;
}

export type AppEnv = {
  Variables: {
    userId: string;
    email: string;
  };
};

export function signToken(payload: JwtPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string): JwtPayload {
  return jwt.verify(token, JWT_SECRET) as JwtPayload;
}

export async function authMiddleware(c: Context, next: Next) {
  const header = c.req.header('Authorization');
  if (!header?.startsWith('Bearer ')) {
    return c.json({ success: false, error: 'Non autorisé' }, 401);
  }

  try {
    const token = header.slice(7);
    const payload = verifyToken(token);
    c.set('userId' as any, payload.userId);
    c.set('email' as any, payload.email);
    await next();
  } catch {
    return c.json({ success: false, error: 'Token invalide' }, 401);
  }
}
