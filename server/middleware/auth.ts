// ============================================
// AIDOM — JWT Auth (jose — Web Crypto compatible)
// ============================================

import { Context, Next } from 'hono';
import { SignJWT, jwtVerify } from 'jose';

export interface JwtPayload {
  userId: string;
  email: string;
}

export type Env = {
  Bindings: {
    DB: D1Database;
    JWT_SECRET: string;
  };
};

function getSecret(secretStr: string) {
  return new TextEncoder().encode(secretStr);
}

export async function signToken(payload: JwtPayload, secret: string): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('7d')
    .sign(getSecret(secret));
}

export async function verifyToken(token: string, secret: string): Promise<JwtPayload> {
  const { payload } = await jwtVerify(token, getSecret(secret));
  return { userId: payload.userId as string, email: payload.email as string };
}

export async function authMiddleware(c: Context<any>, next: Next) {
  const header = c.req.header('Authorization');
  if (!header?.startsWith('Bearer ')) {
    return c.json({ success: false, error: 'Non autorisé' }, 401);
  }

  try {
    const token = header.slice(7);
    const secret = c.env.JWT_SECRET || 'dev-secret-change-me';
    const payload = await verifyToken(token, secret);
    c.set('userId' as any, payload.userId);
    c.set('email' as any, payload.email);
    await next();
  } catch {
    return c.json({ success: false, error: 'Token invalide' }, 401);
  }
}
