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

  for (const key of ["site", "hero", "highlights", "services", "process", "cta", "footer", "ui"]) {
    assert.ok(db.prepare("SELECT value FROM settings WHERE key = ?").get(key), `${key} section seeded`);
  }

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
  legacy
    .prepare("INSERT INTO settings (key, value) VALUES (?, ?)")
    .run(
      "highlights",
      JSON.stringify({ heading: "H", items: [{ icon: "code", title: "T", description: "D" }] })
    );
  legacy
    .prepare("INSERT INTO settings (key, value) VALUES (?, ?)")
    .run("footer", JSON.stringify({ copyright: "C", socialLinks: [] }));
  legacy.close();

  const mod = await import(`./db.js?legacy=${Date.now()}`);
  const db = mod.default;
  const hero = JSON.parse(db.prepare("SELECT value FROM settings WHERE key = 'hero'").get().value);
  assert.equal(hero.en.headline, "Custom");
  assert.notEqual(hero.en.ctaEnabled, undefined, "new hero default backfilled");
  assert.ok(hero.en.ctaLink, "new hero ctaLink default backfilled");
  assert.ok(hero.it, "starter italian overlay filled in");
  assert.ok(hero.sq, "starter albanian overlay filled in");

  const highlights = JSON.parse(
    db.prepare("SELECT value FROM settings WHERE key = 'highlights'").get().value
  );
  assert.ok(highlights.en.subtitle, "new highlights subtitle default backfilled");
  assert.equal(highlights.en.heading, "H", "legacy highlights heading preserved");
  assert.deepEqual(highlights.en.items, [{ icon: "code", title: "T", description: "D" }]);

  const footer = JSON.parse(db.prepare("SELECT value FROM settings WHERE key = 'footer'").get().value);
  assert.ok(footer.en.tagline, "new footer tagline default backfilled");
  assert.equal(footer.en.copyright, "C", "legacy footer copyright preserved");

  db.close();
  rmSync(dir, { recursive: true, force: true });
});

test("locale migration is idempotent and does not double-wrap en", async () => {
  const { dir } = await loadDb();
  const first = await import(`./db.js?idem-first=${Date.now()}`);
  first.default.close();

  const second = await import(`./db.js?idem-second=${Date.now()}`);
  const hero = JSON.parse(
    second.default.prepare("SELECT value FROM settings WHERE key = 'hero'").get().value
  );
  assert.equal(hero.en.headline, "Building Digital");
  assert.equal(hero.en.en, undefined, "en is not double-wrapped");

  second.default.close();
  rmSync(dir, { recursive: true, force: true });
});
