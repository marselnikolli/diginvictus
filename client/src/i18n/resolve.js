function isPlainObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

export function resolveLocale(base, overlay) {
  if (Array.isArray(base) || Array.isArray(overlay)) {
    const b = Array.isArray(base) ? base : [];
    const o = Array.isArray(overlay) ? overlay : [];
    const length = Math.max(b.length, o.length);
    return Array.from({ length }, (_, i) => resolveLocale(b[i], o[i]));
  }

  if (isPlainObject(base) || isPlainObject(overlay)) {
    const out = isPlainObject(base) ? { ...base } : {};
    if (isPlainObject(overlay)) {
      for (const key of Object.keys(overlay)) {
        out[key] = resolveLocale(out[key], overlay[key]);
      }
    }
    return out;
  }

  if (overlay === undefined || overlay === null || overlay === "") return base;
  return overlay;
}

export function getSection(section, locale) {
  if (!section || typeof section !== "object") return section;
  if (!("en" in section)) return section;
  if (!locale || locale === "en") return section.en;
  return resolveLocale(section.en, section[locale] || {});
}

export function localizeItem(item, locale) {
  if (!item || !locale || locale === "en") return item;
  const overlay = item.translations?.[locale];
  if (!overlay) return item;
  return { ...item, ...resolveLocale(item, overlay) };
}
