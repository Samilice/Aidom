// ============================================
// AIDOM — Cloudflare Worker Entry Point
// ============================================

import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { getAssetFromKV } from '@cloudflare/kv-asset-handler';
// @ts-ignore - generated at build time by wrangler
import manifestJSON from '__STATIC_CONTENT_MANIFEST';
import type { Env } from './middleware/auth.js';
import auth from './routes/auth.js';
import employer from './routes/employer.js';
import employees from './routes/employees.js';
import simulation from './routes/simulation.js';
import documents from './routes/documents.js';
import remindersRoute from './routes/reminders.js';
import checklist from './routes/checklist.js';
import stripe from './routes/stripe.js';

const assetManifest = JSON.parse(manifestJSON);

const app = new Hono<Env>();

app.use('*', cors());

// API routes
app.route('/api/auth', auth);
app.route('/api/employer', employer);
app.route('/api/employees', employees);
app.route('/api/simulate', simulation);
app.route('/api/documents', documents);
app.route('/api/reminders', remindersRoute);
app.route('/api/checklist', checklist);
app.route('/api/stripe', stripe);
app.get('/api/health', (c) => c.json({ status: 'ok', name: 'Aidom API' }));

export default {
  async fetch(request: Request, env: any, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);

    // API routes → Hono
    if (url.pathname.startsWith('/api')) {
      return app.fetch(request, env, ctx);
    }

    // Static assets
    try {
      return await getAssetFromKV(
        { request, waitUntil: ctx.waitUntil.bind(ctx) } as any,
        {
          ASSET_NAMESPACE: env.__STATIC_CONTENT,
          ASSET_MANIFEST: assetManifest,
        }
      );
    } catch {
      // SPA fallback → index.html
      try {
        const notFoundReq = new Request(new URL('/index.html', request.url).toString(), request);
        return await getAssetFromKV(
          { request: notFoundReq, waitUntil: ctx.waitUntil.bind(ctx) } as any,
          {
            ASSET_NAMESPACE: env.__STATIC_CONTENT,
            ASSET_MANIFEST: assetManifest,
          }
        );
      } catch {
        return new Response('Not found', { status: 404 });
      }
    }
  },
};
