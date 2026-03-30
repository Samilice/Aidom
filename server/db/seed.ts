// ============================================
// AIDOM — Seed admin account
// ============================================

import { initDb, dbRun, dbGet } from './index.js';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

async function seed() {
  await initDb();

  const email = 'busquetsthomas1@gmail.com';
  const password = 'ns4p6bls';
  const firstName = 'Thomas';
  const lastName = 'Busquets';

  const existing = dbGet('SELECT id FROM users WHERE email = ?', [email]);
  if (existing) {
    console.log(`Account already exists for ${email}`);
    return;
  }

  const id = 'usr_' + crypto.randomBytes(12).toString('hex');
  const hash = await bcrypt.hash(password, 10);

  dbRun(
    'INSERT INTO users (id, email, password_hash, first_name, last_name, plan, subscription_status) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [id, email, hash, firstName, lastName, 'essentiel', 'active']
  );

  console.log(`Admin account created: ${email}`);
  console.log(`Plan: essentiel (active)`);
  process.exit(0);
}

seed().catch(console.error);
