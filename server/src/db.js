import Database from "better-sqlite3";
import { existsSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import bcrypt from "bcryptjs";
import {
  DEFAULT_SITE,
  DEFAULT_HERO,
  DEFAULT_HIGHLIGHTS,
  DEFAULT_FOOTER,
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
    active INTEGER NOT NULL DEFAULT 1,
    position INTEGER NOT NULL DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS testimonials (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    quote TEXT NOT NULL,
    author TEXT,
    role TEXT,
    company TEXT,
    active INTEGER NOT NULL DEFAULT 1,
    position INTEGER NOT NULL DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL
  );
`);

function seedSettings() {
  const sections = {
    site: DEFAULT_SITE,
    hero: DEFAULT_HERO,
    highlights: DEFAULT_HIGHLIGHTS,
    footer: DEFAULT_FOOTER,
  };
  const stmt = db.prepare("INSERT OR IGNORE INTO settings (key, value) VALUES (?, ?)");
  for (const [key, value] of Object.entries(sections)) {
    stmt.run(key, JSON.stringify(value));
  }
}

function seedClients() {
  const count = db.prepare("SELECT COUNT(*) AS c FROM clients").get().c;
  if (count > 0) return;
  const stmt = db.prepare(
    "INSERT INTO clients (name, website_url, logo, active, position) VALUES (?, ?, ?, ?, ?)"
  );
  for (const c of DEFAULT_CLIENTS) {
    stmt.run(c.name, c.websiteUrl, c.logo, c.active, c.order);
  }
}

function seedTestimonials() {
  const count = db.prepare("SELECT COUNT(*) AS c FROM testimonials").get().c;
  if (count > 0) return;
  const stmt = db.prepare(
    "INSERT INTO testimonials (quote, author, role, company, active, position) VALUES (?, ?, ?, ?, ?, ?)"
  );
  for (const t of DEFAULT_TESTIMONIALS) {
    stmt.run(t.quote, t.author, t.role, t.company, t.active, t.order);
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

seedSettings();
seedClients();
seedTestimonials();
seedUsers();

export default db;
export { DATA_DIR, UPLOAD_DIR };
