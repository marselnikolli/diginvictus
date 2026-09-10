import test from "node:test";
import assert from "node:assert/strict";
import { resolveLocale, getSection, localizeItem } from "./resolve.js";

test("overlay overrides base scalars", () => {
  assert.equal(resolveLocale("Hello", "Ciao"), "Ciao");
});

test("missing, null and empty overlays fall back to base", () => {
  assert.equal(resolveLocale("Hello", undefined), "Hello");
  assert.equal(resolveLocale("Hello", null), "Hello");
  assert.equal(resolveLocale("Hello", ""), "Hello");
});

test("objects merge key by key", () => {
  const base = { a: "A", b: "B" };
  assert.deepEqual(resolveLocale(base, { b: "Bee" }), { a: "A", b: "Bee" });
});

test("arrays merge by index and keep trailing base items", () => {
  const base = [{ title: "One", icon: "code" }, { title: "Two", icon: "server" }];
  const overlay = [{ title: "Uno" }];
  assert.deepEqual(resolveLocale(base, overlay), [
    { title: "Uno", icon: "code" },
    { title: "Two", icon: "server" },
  ]);
});

test("getSection returns the en master for en", () => {
  const section = { en: { heading: "Hi" }, it: { heading: "Ciao" } };
  assert.deepEqual(getSection(section, "en"), { heading: "Hi" });
});

test("getSection merges a locale overlay over en", () => {
  const section = {
    en: { heading: "Hi", subtitle: "Sub", items: [{ title: "A", icon: "code" }] },
    it: { heading: "Ciao", items: [{ title: "Uno" }] },
  };
  assert.deepEqual(getSection(section, "it"), {
    heading: "Ciao",
    subtitle: "Sub",
    items: [{ title: "Uno", icon: "code" }],
  });
});

test("getSection passes legacy flat sections through unchanged", () => {
  const flat = { heading: "Legacy" };
  assert.deepEqual(getSection(flat, "it"), flat);
});

test("localizeItem merges item translations", () => {
  const item = { id: 1, name: "Bank", description: "English", translations: { it: { description: "Italiano" } } };
  assert.deepEqual(localizeItem(item, "it"), { id: 1, name: "Bank", description: "Italiano", translations: item.translations });
});

test("localizeItem returns the item unchanged for en or missing translations", () => {
  const item = { id: 1, name: "Bank" };
  assert.equal(localizeItem(item, "en"), item);
  assert.equal(localizeItem(item, "it"), item);
});
