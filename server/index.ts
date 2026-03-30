import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { initDb } from './db/index.js';
import auth from './routes/auth.js';
import employer from './routes/employer.js';
import employees from './routes/employees.js';
import simulation from './routes/simulation.js';
import documents from './routes/documents.js';
import remindersRoute from './routes/reminders.js';
import checklist from './routes/checklist.js';
import stripe from './routes/stripe.js';

async function main() {
  await initDb();

  const app = new Hono();

  app.use('*', cors({ origin: 'http://localhost:5173', credentials: true }));
  app.use('*', logger());

  app.route('/api/auth', auth);
  app.route('/api/employer', employer);
  app.route('/api/employees', employees);
  app.route('/api/simulate', simulation);
  app.route('/api/documents', documents);
  app.route('/api/reminders', remindersRoute);
  app.route('/api/checklist', checklist);
  app.route('/api/stripe', stripe);

  app.get('/api/health', (c) => c.json({ status: 'ok', name: 'Aidom API' }));

  const port = Number(process.env.PORT) || 3001;

  serve({ fetch: app.fetch, port }, () => {
    console.log(`\n  Aidom API running on http://localhost:${port}\n`);
  });
}

main().catch(console.error);
