import { Hono } from 'hono';
import { dbRun, dbGet } from '../db/index.js';
import { generateId } from '../lib/id.js';
import { hashPassword, verifyPassword } from '../lib/password.js';
import { signToken, verifyToken, type Env } from '../middleware/auth.js';

const auth = new Hono<Env>();

auth.post('/signup', async (c) => {
  const { email, password, firstName, lastName } = await c.req.json();
  if (!email || !password || !firstName || !lastName)
    return c.json({ success: false, error: 'Tous les champs sont requis.' }, 400);
  if (password.length < 8)
    return c.json({ success: false, error: 'Le mot de passe doit contenir au moins 8 caractères.' }, 400);

  const db = c.env.DB;
  const existing = await dbGet(db, 'SELECT id FROM users WHERE email = ?', [email]);
  if (existing) return c.json({ success: false, error: 'Un compte existe déjà avec cet email.' }, 409);

  const id = generateId('usr');
  const passwordHash = await hashPassword(password);
  await dbRun(db, 'INSERT INTO users (id, email, password_hash, first_name, last_name) VALUES (?, ?, ?, ?, ?)',
    [id, email, passwordHash, firstName, lastName]);

  const token = await signToken({ userId: id, email }, c.env.JWT_SECRET || 'dev-secret');
  return c.json({ success: true, data: { token, user: { id, email, firstName, lastName, plan: null, subscriptionStatus: null } } });
});

auth.post('/login', async (c) => {
  const { email, password } = await c.req.json();
  if (!email || !password) return c.json({ success: false, error: 'Email et mot de passe requis.' }, 400);

  const db = c.env.DB;
  const user = await dbGet(db, 'SELECT id, email, password_hash, first_name, last_name, plan, subscription_status FROM users WHERE email = ?', [email]);
  if (!user) return c.json({ success: false, error: 'Identifiants incorrects.' }, 401);

  const valid = await verifyPassword(password, user.password_hash);
  if (!valid) return c.json({ success: false, error: 'Identifiants incorrects.' }, 401);

  const token = await signToken({ userId: user.id, email: user.email }, c.env.JWT_SECRET || 'dev-secret');
  return c.json({ success: true, data: { token, user: { id: user.id, email: user.email, firstName: user.first_name, lastName: user.last_name, plan: user.plan, subscriptionStatus: user.subscription_status } } });
});

auth.get('/me', async (c) => {
  const header = c.req.header('Authorization');
  if (!header?.startsWith('Bearer ')) return c.json({ success: false, error: 'Non autorisé' }, 401);
  try {
    const payload = await verifyToken(header.slice(7), c.env.JWT_SECRET || 'dev-secret');
    const user = await dbGet(c.env.DB, 'SELECT id, email, first_name, last_name, plan, subscription_status FROM users WHERE id = ?', [payload.userId]);
    if (!user) return c.json({ success: false, error: 'Utilisateur introuvable' }, 404);
    return c.json({ success: true, data: { id: user.id, email: user.email, firstName: user.first_name, lastName: user.last_name, plan: user.plan, subscriptionStatus: user.subscription_status } });
  } catch { return c.json({ success: false, error: 'Token invalide' }, 401); }
});

export default auth;
