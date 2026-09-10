import Database from "better-sqlite3";
import { existsSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import bcrypt from "bcryptjs";
import {
  DEFAULT_SITE,
  DEFAULT_HERO,
  DEFAULT_HIGHLIGHTS,
  DEFAULT_SERVICES,
  DEFAULT_PROCESS,
  DEFAULT_CTA,
  DEFAULT_FOOTER,
  DEFAULT_UI,
  DEFAULT_CLIENTS,
  DEFAULT_TESTIMONIALS,
  DEFAULT_ADMIN,
} from "shared";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_DIR = process.env.DATA_DIR || join(__dirname, "..", "data");

if (!existsSync(DATA_DIR)) {
  mkdirSync(DATA_DIR, { recursive: true });
}

const UPLOAD_DIR = process.env.UPLOAD_DIR || join(DATA_DIR, "uploads");
if (!existsSync(UPLOAD_DIR)) {
  mkdirSync(UPLOAD_DIR, { recursive: true });
}

const db = new Database(join(DATA_DIR, "diginvictus.db"));
db.pragma("journal_mode = WAL");

db.exec(`
  CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS clients (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    website_url TEXT,
    logo TEXT,
    description TEXT,
    translations TEXT,
    active INTEGER NOT NULL DEFAULT 1,
    position INTEGER NOT NULL DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS testimonials (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    quote TEXT NOT NULL,
    author TEXT,
    role TEXT,
    company TEXT,
    translations TEXT,
    active INTEGER NOT NULL DEFAULT 1,
    position INTEGER NOT NULL DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL
  );
`);

const DEFAULT_SECTIONS = {
  site: DEFAULT_SITE,
  hero: DEFAULT_HERO,
  highlights: DEFAULT_HIGHLIGHTS,
  services: DEFAULT_SERVICES,
  process: DEFAULT_PROCESS,
  cta: DEFAULT_CTA,
  footer: DEFAULT_FOOTER,
  ui: DEFAULT_UI,
};

function ensureColumn(table, column, type) {
  const columns = db.prepare(`PRAGMA table_info(${table})`).all();
  if (!columns.some((c) => c.name === column)) {
    db.exec(`ALTER TABLE ${table} ADD COLUMN ${column} ${type}`);
  }
}

ensureColumn("clients", "description", "TEXT");
ensureColumn("clients", "translations", "TEXT");
ensureColumn("testimonials", "translations", "TEXT");

function migrateClientsDescription() {
  const byName = new Map(DEFAULT_CLIENTS.map((c) => [c.name, c.description]));
  const stmt = db.prepare(
    "UPDATE clients SET description = ? WHERE name = ? AND (description IS NULL OR description = '')"
  );
  for (const [name, description] of byName) {
    if (description) stmt.run(description, name);
  }
}
migrateClientsDescription();

function seedSettings() {
  const stmt = db.prepare("INSERT OR IGNORE INTO settings (key, value) VALUES (?, ?)");
  for (const [key, value] of Object.entries(DEFAULT_SECTIONS)) {
    stmt.run(key, JSON.stringify(value));
  }
}
seedSettings();

function migrateSettingsLocales() {
  const rows = db.prepare("SELECT key, value FROM settings").all();
  const update = db.prepare("UPDATE settings SET value = ? WHERE key = ?");
  for (const row of rows) {
    let parsed;
    try {
      parsed = JSON.parse(row.value);
    } catch {
      continue;
    }
    if (parsed && typeof parsed === "object" && "en" in parsed) continue;
    const defaults = DEFAULT_SECTIONS[row.key] || { it: {}, sq: {} };
    update.run(JSON.stringify({ en: parsed, it: defaults.it || {}, sq: defaults.sq || {} }), row.key);
  }
}
migrateSettingsLocales();

function seedCollectionTranslations(table, defaults, matchKey) {
  const rows = db.prepare(`SELECT * FROM ${table}`).all();
  const update = db.prepare(`UPDATE ${table} SET translations = ? WHERE id = ?`);
  for (const row of rows) {
    const has = row.translations && row.translations !== "" && row.translations !== "{}";
    if (has) continue;
    const def = defaults.find((d) => d[matchKey] === row[matchKey]);
    if (def?.translations) update.run(JSON.stringify(def.translations), row.id);
  }
}

function seedClients() {
  const count = db.prepare("SELECT COUNT(*) AS c FROM clients").get().c;
  if (count > 0) return;
  const stmt = db.prepare(
    "INSERT INTO clients (name, website_url, logo, description, translations, active, position) VALUES (?, ?, ?, ?, ?, ?, ?)"
  );
  for (const c of DEFAULT_CLIENTS) {
    stmt.run(
      c.name,
      c.websiteUrl,
      c.logo,
      c.description || "",
      JSON.stringify(c.translations || {}),
      c.active,
      c.order
    );
  }
}

function seedTestimonials() {
  const count = db.prepare("SELECT COUNT(*) AS c FROM testimonials").get().c;
  if (count > 0) return;
  const stmt = db.prepare(
    "INSERT INTO testimonials (quote, author, role, company, translations, active, position) VALUES (?, ?, ?, ?, ?, ?, ?)"
  );
  for (const t of DEFAULT_TESTIMONIALS) {
    stmt.run(
      t.quote,
      t.author,
      t.role,
      t.company,
      JSON.stringify(t.translations || {}),
      t.active,
      t.order
    );
  }
}

function seedUsers() {
  const count = db.prepare("SELECT COUNT(*) AS c FROM users").get().c;
  if (count > 0) return;
  const email = process.env.ADMIN_EMAIL || DEFAULT_ADMIN.email;
  const password = process.env.ADMIN_PASSWORD || DEFAULT_ADMIN.password;
  const hash = bcrypt.hashSync(password, 10);
  db.prepare("INSERT INTO users (email, password_hash) VALUES (?, ?)").run(email, hash);
  console.log(`Seeded admin user: ${email}`);
}

seedClients();
seedTestimonials();
seedCollectionTranslations("clients", DEFAULT_CLIENTS, "name");
seedCollectionTranslations("testimonials", DEFAULT_TESTIMONIALS, "quote");
seedUsers();

export default db;
export { DATA_DIR, UPLOAD_DIR };
