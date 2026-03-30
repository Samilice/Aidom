// ============================================
// AIDOM — D1 Database Helpers
// ============================================
// Wrappers pour Cloudflare D1 (SQLite compatible)

import type { D1Database } from '@cloudflare/workers-types';

export type DB = D1Database;

export async function dbGet(db: DB, sql: string, params: any[] = []): Promise<any> {
  return db.prepare(sql).bind(...params).first();
}

export async function dbAll(db: DB, sql: string, params: any[] = []): Promise<any[]> {
  const result = await db.prepare(sql).bind(...params).all();
  return result.results || [];
}

export async function dbRun(db: DB, sql: string, params: any[] = []): Promise<void> {
  await db.prepare(sql).bind(...params).run();
}
