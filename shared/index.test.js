import test from "node:test";
import assert from "node:assert/strict";
import {
  LOCALES,
  DEFAULT_LOCALE,
  CONTENT_SECTIONS,
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
} from "./index.js";

const SECTIONS = {
  site: DEFAULT_SITE,
  hero: DEFAULT_HERO,
  highlights: DEFAULT_HIGHLIGHTS,
  services: DEFAULT_SERVICES,
  process: DEFAULT_PROCESS,
  cta: DEFAULT_CTA,
  footer: DEFAULT_FOOTER,
  ui: DEFAULT_UI,
};

test("locale constants are correct", () => {
  assert.deepEqual(LOCALES, ["en", "it", "sq"]);
  assert.equal(DEFAULT_LOCALE, "en");
  assert.deepEqual(CONTENT_SECTIONS, Object.keys(SECTIONS));
});

test("every section has a complete en master", () => {
  for (const [name, section] of Object.entries(SECTIONS)) {
    assert.ok(section.en && typeof section.en === "object", `${name}.en missing`);
  }
});

test("overlays only contain keys present in en", () => {
  for (const [name, section] of Object.entries(SECTIONS)) {
    const enKeys = new Set(Object.keys(section.en));
    for (const locale of LOCALES) {
      if (locale === "en") continue;
      const overlay = section[locale];
      assert.ok(overlay && typeof overlay === "object", `${name}.${locale} missing`);
      for (const key of Object.keys(overlay)) {
        assert.ok(enKeys.has(key), `${name}.${locale}.${key} is not in en`);
      }
    }
  }
});

test("collections expose it and sq translations", () => {
  for (const item of DEFAULT_CLIENTS) {
    assert.ok(item.translations?.it, `client ${item.name} missing it`);
    assert.ok(item.translations?.sq, `client ${item.name} missing sq`);
  }
  for (const item of DEFAULT_TESTIMONIALS) {
    assert.ok(item.translations?.it, "testimonial missing it");
    assert.ok(item.translations?.sq, "testimonial missing sq");
  }
});
