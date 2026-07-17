import Database from 'better-sqlite3';
import { mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

const databasePath = resolve(process.cwd(), process.env.DATABASE_PATH ?? './data/pda-bliss.sqlite');
mkdirSync(dirname(databasePath), { recursive: true });

export const db = new Database(databasePath);
db.pragma('foreign_keys = ON');
db.pragma('journal_mode = WAL');

export const initDb = (): void => {
  db.exec(`
    CREATE TABLE IF NOT EXISTS admin_users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL CHECK (role IN ('SUPERADMIN', 'ADMIN')),
      is_active INTEGER NOT NULL DEFAULT 1,
      last_login_at TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS admin_sessions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      admin_user_id INTEGER NOT NULL,
      token_hash TEXT NOT NULL UNIQUE,
      expires_at TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      last_used_at TEXT,
      user_agent TEXT,
      ip_hash TEXT,
      FOREIGN KEY (admin_user_id) REFERENCES admin_users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS contact_leads (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      phone TEXT NOT NULL,
      email TEXT,
      topic TEXT,
      details TEXT NOT NULL,
      source_page TEXT,
      status TEXT NOT NULL DEFAULT 'NEW' CHECK (status IN ('NEW', 'CONTACTED', 'FOLLOW_UP', 'COMPLETED', 'CANCELLED')),
      email_delivery_status TEXT NOT NULL DEFAULT 'PENDING' CHECK (email_delivery_status IN ('PENDING', 'SENT', 'FAILED')),
      email_provider_id TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS analytics_sessions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      session_id TEXT NOT NULL UNIQUE,
      visitor_id_hash TEXT,
      first_page TEXT,
      last_page TEXT,
      referrer TEXT,
      utm_source TEXT,
      utm_medium TEXT,
      utm_campaign TEXT,
      device_type TEXT,
      browser TEXT,
      operating_system TEXT,
      started_at TEXT NOT NULL,
      last_seen_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS analytics_events (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      event_id TEXT NOT NULL UNIQUE,
      session_id TEXT NOT NULL,
      event_type TEXT NOT NULL,
      event_name TEXT NOT NULL,
      page_path TEXT NOT NULL,
      element_id TEXT,
      metadata TEXT,
      created_at TEXT NOT NULL,
      FOREIGN KEY (session_id) REFERENCES analytics_sessions(session_id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS seo_pages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      route_path TEXT NOT NULL UNIQUE,
      page_name TEXT NOT NULL,
      title TEXT,
      meta_description TEXT,
      canonical_url TEXT,
      robots_index INTEGER NOT NULL DEFAULT 1,
      robots_follow INTEGER NOT NULL DEFAULT 1,
      og_title TEXT,
      og_description TEXT,
      og_image TEXT,
      twitter_card TEXT,
      primary_keyword TEXT,
      secondary_keywords TEXT,
      schema_type TEXT,
      schema_json TEXT,
      is_active INTEGER NOT NULL DEFAULT 1,
      updated_by_admin_id INTEGER,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (updated_by_admin_id) REFERENCES admin_users(id) ON DELETE SET NULL
    );

    CREATE TABLE IF NOT EXISTS seo_audits (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      route_path TEXT NOT NULL,
      overall_score INTEGER NOT NULL,
      technical_score INTEGER NOT NULL,
      content_score INTEGER NOT NULL,
      metadata_score INTEGER NOT NULL,
      accessibility_score INTEGER NOT NULL,
      performance_score INTEGER,
      issues_json TEXT NOT NULL,
      metrics_json TEXT,
      source_type TEXT NOT NULL CHECK (source_type IN ('SOURCE_SCAN', 'LIVE_SCAN', 'MANUAL', 'AI_REVIEW')),
      created_by_admin_id INTEGER,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (created_by_admin_id) REFERENCES admin_users(id) ON DELETE SET NULL
    );

    CREATE TABLE IF NOT EXISTS seo_recommendations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      route_path TEXT NOT NULL,
      recommendation_type TEXT NOT NULL,
      title TEXT NOT NULL,
      current_value TEXT,
      proposed_value TEXT,
      reasoning TEXT,
      expected_impact TEXT,
      priority TEXT NOT NULL CHECK (priority IN ('CRITICAL', 'HIGH', 'MEDIUM', 'LOW')),
      confidence_score INTEGER,
      status TEXT NOT NULL DEFAULT 'DRAFT' CHECK (status IN ('DRAFT', 'APPROVED', 'REJECTED', 'APPLIED')),
      provider TEXT,
      model_name TEXT,
      prompt_version TEXT,
      approved_by_admin_id INTEGER,
      approved_at TEXT,
      applied_at TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (approved_by_admin_id) REFERENCES admin_users(id) ON DELETE SET NULL
    );

    CREATE TABLE IF NOT EXISTS seo_experiments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      route_path TEXT NOT NULL,
      experiment_name TEXT NOT NULL,
      hypothesis TEXT NOT NULL,
      metric_name TEXT NOT NULL,
      baseline_value REAL,
      target_value REAL,
      result_value REAL,
      status TEXT NOT NULL DEFAULT 'DRAFT' CHECK (status IN ('DRAFT', 'RUNNING', 'COMPLETED', 'CANCELLED')),
      started_at TEXT,
      ended_at TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS seo_change_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      seo_page_id INTEGER NOT NULL,
      route_path TEXT NOT NULL,
      changed_by_admin_id INTEGER,
      old_values_json TEXT NOT NULL,
      new_values_json TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (seo_page_id) REFERENCES seo_pages(id) ON DELETE CASCADE,
      FOREIGN KEY (changed_by_admin_id) REFERENCES admin_users(id) ON DELETE SET NULL
    );

    CREATE INDEX IF NOT EXISTS idx_admin_sessions_token_hash ON admin_sessions(token_hash);
    CREATE INDEX IF NOT EXISTS idx_admin_sessions_expires_at ON admin_sessions(expires_at);
    CREATE INDEX IF NOT EXISTS idx_contact_leads_status ON contact_leads(status);
    CREATE INDEX IF NOT EXISTS idx_contact_leads_created_at ON contact_leads(created_at);
    CREATE INDEX IF NOT EXISTS idx_contact_leads_email_delivery_status ON contact_leads(email_delivery_status);
    CREATE INDEX IF NOT EXISTS idx_analytics_sessions_session_id ON analytics_sessions(session_id);
    CREATE INDEX IF NOT EXISTS idx_analytics_sessions_started_at ON analytics_sessions(started_at);
    CREATE INDEX IF NOT EXISTS idx_analytics_sessions_last_seen_at ON analytics_sessions(last_seen_at);
    CREATE INDEX IF NOT EXISTS idx_analytics_events_session_id ON analytics_events(session_id);
    CREATE INDEX IF NOT EXISTS idx_analytics_events_event_type ON analytics_events(event_type);
    CREATE INDEX IF NOT EXISTS idx_analytics_events_event_name ON analytics_events(event_name);
    CREATE INDEX IF NOT EXISTS idx_analytics_events_page_path ON analytics_events(page_path);
    CREATE INDEX IF NOT EXISTS idx_analytics_events_created_at ON analytics_events(created_at);
    CREATE INDEX IF NOT EXISTS idx_seo_pages_route_path ON seo_pages(route_path);
    CREATE INDEX IF NOT EXISTS idx_seo_audits_route_path ON seo_audits(route_path);
    CREATE INDEX IF NOT EXISTS idx_seo_audits_created_at ON seo_audits(created_at);
    CREATE INDEX IF NOT EXISTS idx_seo_recommendations_route_path ON seo_recommendations(route_path);
    CREATE INDEX IF NOT EXISTS idx_seo_recommendations_status ON seo_recommendations(status);
    CREATE INDEX IF NOT EXISTS idx_seo_recommendations_priority ON seo_recommendations(priority);
    CREATE INDEX IF NOT EXISTS idx_seo_experiments_route_path ON seo_experiments(route_path);
    CREATE INDEX IF NOT EXISTS idx_seo_experiments_status ON seo_experiments(status);
    CREATE INDEX IF NOT EXISTS idx_seo_change_logs_seo_page_id ON seo_change_logs(seo_page_id);
    CREATE INDEX IF NOT EXISTS idx_seo_change_logs_route_path ON seo_change_logs(route_path);
  `);

  const seoPages = [
    ['/', 'หน้าแรก'],
    ['/about', 'เกี่ยวกับเรา'],
    ['/services', 'บริการ'],
    ['/process', 'ขั้นตอนบริการ'],
    ['/contact', 'ติดต่อเรา'],
  ];
  const insertSeoPage = db.prepare('INSERT OR IGNORE INTO seo_pages (route_path, page_name) VALUES (?, ?)');
  for (const page of seoPages) insertSeoPage.run(...page);

  const contactLeadColumns = new Set(
    db.prepare('PRAGMA table_info(contact_leads)').all().map(column => (column as { name: string }).name)
  );
  if (!contactLeadColumns.has('note')) db.exec('ALTER TABLE contact_leads ADD COLUMN note TEXT');
  if (!contactLeadColumns.has('assigned_to')) db.exec('ALTER TABLE contact_leads ADD COLUMN assigned_to TEXT');

  const adminUserColumns = new Set(
    db.prepare('PRAGMA table_info(admin_users)').all().map(column => (column as { name: string }).name)
  );
  if (!adminUserColumns.has('must_change_password')) {
    db.exec('ALTER TABLE admin_users ADD COLUMN must_change_password INTEGER NOT NULL DEFAULT 0');
  }
};

initDb();
