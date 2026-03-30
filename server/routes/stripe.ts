import { Hono } from 'hono';
import { dbRun, dbGet } from '../db/index.js';
import { authMiddleware } from '../middleware/auth.js';

const stripe = new Hono();

// Mock Stripe for MVP

stripe.post('/create-checkout', authMiddleware, async (c) => {
  const { plan } = await c.req.json();
  if (!['essentiel', 'duo', 'serenite'].includes(plan)) {
    return c.json({ success: false, error: 'Formule invalide.' }, 400);
  }
  return c.json({
    success: true,
    data: { checkoutUrl: `/pricing/success?plan=${plan}&mock=true`, mock: true },
  });
});

stripe.post('/activate', authMiddleware, async (c) => {
  const userId = (c as any).get('userId') as string;
  const { plan } = await c.req.json();
  if (!['essentiel', 'duo', 'serenite'].includes(plan)) {
    return c.json({ success: false, error: 'Formule invalide.' }, 400);
  }

  dbRun('UPDATE users SET plan = ?, subscription_status = ? WHERE id = ?', [plan, 'active', userId]);
  return c.json({ success: true, data: { plan, status: 'active' } });
});

stripe.get('/status', authMiddleware, (c) => {
  const userId = (c as any).get('userId') as string;
  const user = dbGet('SELECT plan, subscription_status FROM users WHERE id = ?', [userId]);
  return c.json({
    success: true,
    data: { plan: user?.plan || null, status: user?.subscription_status || null },
  });
});

export default stripe;
