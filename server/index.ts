// ============================================
// AIDOM — Cloudflare Worker Entry Point
// ============================================

import { Hono } from 'hono';
import { cors } from 'hono/cors';
import type { Env } from './middleware/auth.js';
import auth from './routes/auth.js';
import employer from './routes/employer.js';
import employees from './routes/employees.js';
import simulation from './routes/simulation.js';
import documents from './routes/documents.js';
import remindersRoute from './routes/reminders.js';
import checklist from './routes/checklist.js';
import stripe from './routes/stripe.js';

const api = new Hono<Env>();

api.use('*', cors());

api.route('/api/auth', auth);
api.route('/api/employer', employer);
api.route('/api/employees', employees);
api.route('/api/simulate', simulation);
api.route('/api/documents', documents);
api.route('/api/reminders', remindersRoute);
api.route('/api/checklist', checklist);
api.route('/api/stripe', stripe);

api.get('/api/health', (c) => c.json({ status: 'ok', name: 'Aidom API' }));

// Serve static assets (Cloudflare Workers Sites)
api.get('*', (c) => {
  // In production, static assets are served by Cloudflare Pages
  // This fallback returns index.html for SPA routing
  return c.html('<!DOCTYPE html><html><head><meta charset="UTF-8" /><meta http-equiv="refresh" content="0;url=/" /></head><body></body></html>');
});

export default api;
