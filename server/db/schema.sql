-- ============================================
-- AIDOM — Schéma SQLite
-- ============================================

CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  plan TEXT, -- 'essentiel' | 'duo' | 'serenite'
  stripe_customer_id TEXT,
  subscription_status TEXT, -- 'active' | 'past_due' | 'canceled'
  reset_token TEXT,
  reset_token_expires TEXT,
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS employers (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  address TEXT NOT NULL,
  postal_code TEXT NOT NULL,
  city TEXT NOT NULL,
  canton TEXT NOT NULL, -- GE, VD, NE, FR, VS, JU, BE
  phone TEXT NOT NULL,
  avs_number TEXT DEFAULT '',
  created_at TEXT DEFAULT (datetime('now')),
  UNIQUE(user_id) -- 1 dossier employeur par user
);

CREATE TABLE IF NOT EXISTS employees (
  id TEXT PRIMARY KEY,
  employer_id TEXT NOT NULL REFERENCES employers(id) ON DELETE CASCADE,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  date_of_birth TEXT NOT NULL,
  nationality TEXT DEFAULT 'Suisse',
  permit_type TEXT,
  avs_number TEXT DEFAULT '',
  type TEXT NOT NULL, -- 'menage' | 'nounou' | 'babysitter'
  gross_hourly_rate REAL NOT NULL,
  hours_per_week REAL NOT NULL,
  start_date TEXT NOT NULL,
  end_date TEXT,
  status TEXT DEFAULT 'active', -- 'active' | 'ended'
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS reminders (
  id TEXT PRIMARY KEY,
  employer_id TEXT NOT NULL REFERENCES employers(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  due_date TEXT NOT NULL,
  status TEXT DEFAULT 'pending', -- 'pending' | 'done' | 'dismissed'
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS checklist_items (
  id TEXT PRIMARY KEY,
  employer_id TEXT NOT NULL REFERENCES employers(id) ON DELETE CASCADE,
  label TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL, -- 'obligatoire' | 'recommande' | 'optionnel'
  completed INTEGER DEFAULT 0,
  due_description TEXT,
  sort_order INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS documents (
  id TEXT PRIMARY KEY,
  employer_id TEXT NOT NULL REFERENCES employers(id) ON DELETE CASCADE,
  employee_id TEXT REFERENCES employees(id) ON DELETE SET NULL,
  type TEXT NOT NULL, -- 'contrat' | 'fiche_paie'
  title TEXT NOT NULL,
  file_path TEXT NOT NULL,
  month INTEGER,
  year INTEGER,
  created_at TEXT DEFAULT (datetime('now'))
);
