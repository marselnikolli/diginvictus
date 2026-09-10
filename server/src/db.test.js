import test from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import Database from "better-sqlite3";

async function loadDb() {
  const dir = mkdtempSync(join(tmpdir(), "dig-db-"));
  process.env.DATA_DIR = dir;
  process.env.UPLOAD_DIR = join(dir, "uploads");
  return { dir };
}

test("fresh database is seeded with nested locales and translations", async () => {
  const { dir } = await loadDb();
  const mod = await import(`./db.js?fresh=${Date.now()}`);
  const db = mod.default;

  const hero = JSON.parse(db.prepare("SELECT value FROM settings WHERE key = 'hero'").get().value);
  assert.ok(hero.en && hero.it && hero.sq);
  assert.equal(hero.en.headline, "Building Digital");

  const services = db.prepare("SELECT value FROM settings WHERE key = 'services'").get();
  assert.ok(services, "services section seeded");

  const client = db.prepare("SELECT translations FROM clients ORDER BY id LIMIT 1").get();
  assert.ok(client.translations && client.translations !== "{}");

  db.close();
  rmSync(dir, { recursive: true, force: true });
});

test("legacy flat settings are migrated preserving edits", async () => {
  const { dir } = await loadDb();
  const legacy = new Database(join(dir, "diginvictus.db"));
  legacy.exec("CREATE TABLE settings (key TEXT PRIMARY KEY, value TEXT NOT NULL);");
  legacy
    .prepare("INSERT INTO settings (key, value) VALUES (?, ?)")
    .run("hero", JSON.stringify({ headline: "Custom", subTitle: "X", ctaEnabled: true }));
  legacy.close();

  const mod = await import(`./db.js?legacy=${Date.now()}`);
  const db = mod.default;
  const hero = JSON.parse(db.prepare("SELECT value FROM settings WHERE key = 'hero'").get().value);
  assert.equal(hero.en.headline, "Custom");
  assert.ok(hero.it, "starter italian overlay filled in");
  assert.ok(hero.sq, "starter albanian overlay filled in");

  db.close();
  rmSync(dir, { recursive: true, force: true });
});
