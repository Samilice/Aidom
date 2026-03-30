import { Hono } from 'hono';
import bcrypt from 'bcryptjs';
import { dbRun, dbGet } from '../db/index.js';
import { generateId } from '../lib/id.js';
import { signToken, verifyToken } from '../middleware/auth.js';

const auth = new Hono();

// POST /api/auth/signup
auth.post('/signup', async (c) => {
  const { email, password, firstName, lastName } = await c.req.json();

  if (!email || !password || !firstName || !lastName) {
    return c.json({ success: false, error: 'Tous les champs sont requis.' }, 400);
  }
  if (password.length < 8) {
    return c.json({ success: false, error: 'Le mot de passe doit contenir au moins 8 caractères.' }, 400);
  }

  const existing = dbGet('SELECT id FROM users WHERE email = ?', [email]);
  if (existing) {
    return c.json({ success: false, error: 'Un compte existe déjà avec cet email.' }, 409);
  }

  const id = generateId('usr');
  const passwordHash = await bcrypt.hash(password, 10);

  dbRun(
    'INSERT INTO users (id, email, password_hash, first_name, last_name) VALUES (?, ?, ?, ?, ?)',
    [id, email, passwordHash, firstName, lastName]
  );

  const token = signToken({ userId: id, email });

  return c.json({
    success: true,
    data: {
      token,
      user: { id, email, firstName, lastName, plan: null, subscriptionStatus: null },
    },
  });
});

// POST /api/auth/login
auth.post('/login', async (c) => {
  const { email, password } = await c.req.json();

  if (!email || !password) {
    return c.json({ success: false, error: 'Email et mot de passe requis.' }, 400);
  }

  const user = dbGet(
    'SELECT id, email, password_hash, first_name, last_name, plan, subscription_status FROM users WHERE email = ?',
    [email]
  );

  if (!user) {
    return c.json({ success: false, error: 'Identifiants incorrects.' }, 401);
  }

  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) {
    return c.json({ success: false, error: 'Identifiants incorrects.' }, 401);
  }

  const token = signToken({ userId: user.id, email: user.email });

  return c.json({
    success: true,
    data: {
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        plan: user.plan,
        subscriptionStatus: user.subscription_status,
      },
    },
  });
});

// GET /api/auth/me
auth.get('/me', async (c) => {
  const header = c.req.header('Authorization');
  if (!header?.startsWith('Bearer ')) {
    return c.json({ success: false, error: 'Non autorisé' }, 401);
  }

  try {
    const payload = verifyToken(header.slice(7));
    const user = dbGet(
      'SELECT id, email, first_name, last_name, plan, subscription_status, stripe_customer_id FROM users WHERE id = ?',
      [payload.userId]
    );

    if (!user) {
      return c.json({ success: false, error: 'Utilisateur introuvable' }, 404);
    }

    return c.json({
      success: true,
      data: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        plan: user.plan,
        subscriptionStatus: user.subscription_status,
        stripeCustomerId: user.stripe_customer_id,
      },
    });
  } catch {
    return c.json({ success: false, error: 'Token invalide' }, 401);
  }
});

export default auth;
