# Multilingual Site (EN / IT / SQ) — Design

Date: 2026-09-10
Status: Approved for planning

## Goal

Make the DIGInvictus public website available in English, Italian and Albanian,
with URL-prefixed locales and a language switcher, and make **all** visible site
content editable in all three languages from the admin panel.

## Decisions

- **Language selection:** URL path prefix — `/en`, `/it`, `/sq`. `/` redirects to
  the last-used locale (localStorage) or `en`.
- **Scope:** All site content is translatable, including the currently hardcoded
  Services, Process, CTA banner, header nav and small UI strings.
- **Admin UX:** Language tabs (English / Italiano / Shqip) inside each section
  editor and inside the client/testimonial forms.
- **Default & fallback:** English is the default and the fallback. Any missing
  translation resolves to the English value.
- **Storage:** Nested locale JSON in the existing `settings` table; clients and
  testimonials gain a `translations` JSON column. The API returns all locales in
  one payload and the client resolves, so switching language needs no refetch.

## Non-goals

- No server-side rendering or static per-locale HTML generation.
- No `hreflang` tags or sitemap changes.
- No new public testimonials section (testimonials are managed but not rendered
  today; they only gain translation support).
- No automated test suite (the repo has none); verification is a production build
  plus an API smoke check.

## Data model

### Locale constants (`shared/index.js`)

```js
export const LOCALES = ["en", "it", "sq"];
export const DEFAULT_LOCALE = "en";
export const LOCALE_LABELS = { en: "English", it: "Italiano", sq: "Shqip" };
export const CONTENT_SECTIONS = ["site", "hero", "highlights", "services", "process", "cta", "footer", "ui"];
```

### Section shape

Every settings section is stored as:

```js
{
  en: { ...complete master object... },
  it: { ...only the localized (text) fields that have translations... },
  sq: { ...only the localized (text) fields that have translations... }
}
```

English (`en`) is the **master**: it is structurally complete. Italian and
Albanian are **overlays** that may contain any subset of text fields. Structural
fields (icons, images, URLs, prices, toggles) live only in `en` and are inherited
by every locale.

### Resolution algorithm (`resolve`)

`resolve(base, overlay)` recursively merges `overlay` over `base`:

- **objects** merge key-by-key;
- **arrays** merge element-by-element by index (each element is itself resolved);
  an overlay array that is shorter than the base leaves trailing base items
  intact; an overlay array that is longer adds items;
- **primitives** (and `undefined` / `null` / `""` overlays) — a non-empty overlay
  wins, otherwise the base value is kept.

`getSection(section, locale)` returns `resolve(section.en, section[locale])` when
`section.en` exists; if the stored value has no `en` key (legacy flat data) it
returns the value unchanged.

Collections are resolved per item:

```js
localizeItem(item, locale) =
  locale === "en" || !item.translations
    ? item
    : { ...item, ...resolve(item, item.translations[locale] || {}) };
```

### Section field inventory

`L` = localized (edited per language tab). `S` = structural (edited once, English).

**site** — S: `name`, `year`; L: `tagline`, `metaDescription`, `keywords`, `copyright`.

**hero** — S: `ctaLink`, `ctaEnabled`, `scrollEnabled`, `threejsEnabled`;
L: `headline`, `subTitle`, `ctaLabel`.

**highlights** — L: `eyebrow`, `heading`, `subtitle`, `items[].title`,
`items[].description`; S: `items[].icon`.

**services** (new) — L: `eyebrow`, `heading`, `subtitle`, `fromLabel`,
`ctaLabel`, `bestValueLabel`, `items[].title`, `items[].description`,
`items[].features[]`; S: `items[].icon`, `items[].price`, `items[].delivery`,
`items[].bestValue`.

**process** (new) — L: `eyebrow`, `heading`, `subtitle`, `steps[].title`,
`steps[].description`.

**cta** (new) — L: `eyebrow`, `heading`, `text`, `ctaLabel`; S: `ctaLink`.

**footer** — L: `copyright`, `tagline`, `exploreHeading`, `contactHeading`,
`statusText`, `socialLinks[].name`; S: `year`, `socialLinks[].url`,
`socialLinks[].icon`.

**ui** (new) — L: `navServices`, `navProcess`, `navWork`, `navContact`,
`getInTouch`, `headerStatus`, `scrollAria`, `footerStatus`, `workEyebrow`,
`workHeading`, `workSubtitle`, `loadingText`, `errorText`.

### Collections

- `clients`: base columns keep English `name` / `description`; `translations`
  JSON holds `{ it: { name, description }, sq: { name, description } }`.
  `website_url`, `logo`, `active`, `position` are structural.
- `testimonials`: base columns keep English `quote`, `author`, `role`,
  `company`; `translations` JSON holds `{ it: {...}, sq: {...} }`. `active`,
  `position` are structural.

### Starter translations

`shared/index.js` defaults include full Italian and Albanian starter copy for
every existing section, service card, process step, client and testimonial, so
no locale renders blank. These are a starting point for the site owner to refine
in the admin panel.

## Server

### `db.js`

1. Add `translations TEXT` column to `clients` and `testimonials` if missing
   (idempotent, mirroring the existing `migrateClientsDescription` pattern).
2. `seedSettings` inserts any missing section keys with the new nested defaults
   (`INSERT OR IGNORE`), including the new `services`, `process`, `cta`, `ui`.
3. New `migrateSettingsLocales()`: for each section row, parse the JSON; if it
   has no `en` key, rewrite it as
   `{ en: { ...DEFAULT[section].en, ...existingValue }, it: DEFAULT[section].it, sq: DEFAULT[section].sq }`.
   This preserves user edits made to the old flat English value while backfilling
   missing default fields and filling in starter translations.
4. New collection translation seed: for each existing client/testimonial whose
   `translations` is empty, fill it from the matching `DEFAULT_CLIENTS` /
   `DEFAULT_TESTIMONIALS` entry (match clients by `name`, testimonials by
   `quote`/`author`). Idempotent.

### `routes/content.js`

- `GET /` — returns every settings row parsed, i.e. `{ site: {en,it,sq}, ... }`.
- `GET /:section` — returns the nested object for one section (404 if missing).
- `PUT /:section` — requires auth. Validates the section name against
  `CONTENT_SECTIONS` and that the body is a non-null object with an `en` object.
  Stores `JSON.stringify(body)`.

### `routes/clients.js` and `routes/testimonials.js`

- `rowToClient` / `rowToTestimonial` parse and include `translations`
  (default `{}`).
- `POST` / `PUT` accept a `translations` object and persist
  `JSON.stringify(translations || {})`; existing fields keep their current
  behaviour.

## Public client

### Routing (`main.jsx`, `App.jsx`)

- Wrap the app in `BrowserRouter`.
- Routes:
  - `/` → `<Navigate to={"/" + (localStorage locale || "en")} replace />`
  - `/:lang` → validate `lang` against `LOCALES`; if invalid redirect to `/en`;
    otherwise render the site inside `<LocaleProvider locale={lang}>`.
  - `*` → redirect to `/en`.
- nginx already falls back to `index.html`, so `/en` deep links work in
  production; Vite's dev server handles the SPA fallback.

### i18n module (`client/src/i18n/`)

- `resolve.js` — pure `resolve`, `getSection`, `localizeItem` functions
  implementing the resolution algorithm above. The server stores and returns the
  raw nested data; only the client resolves it.
- `LocaleContext.jsx` — provides `{ locale, setLocale }`; on mount sets
  `localStorage["dig_locale"]` and `document.documentElement.lang = locale`.
  Exposes `useLocale()` and a `useLocalizedSection(section)` helper.

### Components / sections

- New `components/LanguageSwitcher.jsx`: three links (EN / IT / SQ) built with
  react-router `Link`, preserving the current `location.hash`.
- `Header`: localized nav labels from `ui`, localized status, `getInTouch`
  label, and the `LanguageSwitcher`.
- `Hero`, `Highlights`, `Services`, `Process`, `Clients`, `CtaBanner`, `Footer`:
  read localized content. `Services`, `Process` and `CtaBanner` are rewritten to
  render from content instead of hardcoded arrays.
- `Footer` reuses `ui.nav*` labels for the Explore column.
- On locale change, update `document.title`, the meta description and
  `document.documentElement.lang` from the localized `site` section.
- Loading and error screens use `ui.loadingText` / `ui.errorText`.

## Admin panel

### `SectionEditor.jsx`

- Fetch the nested section object; keep it in state; track `activeLocale`.
- Render a tab row (English / Italiano / Shqip).
- Structural top-level fields render once in a "Shared" area (edited on `en`).
- Localized top-level fields render for `activeLocale`.
- Repeaters:
  - English tab: full repeater (structural + localized subfields) with add /
    remove — this controls the array structure.
  - IT/SQ tabs: one block per existing English item, showing only localized
    subfields; add/remove hidden so structure stays owned by English.
- Save sends the whole nested object via `PUT /api/content/:section`.
- Add schemas for `services`, `process`, `cta`, `ui`; extend `site`, `hero`,
  `highlights`, `footer` with the new fields and `structural` flags.

### `ClientsManager.jsx` / `TestimonialsManager.jsx`

- Add a language tab row to the edit form. Structural fields (URL, logo, active,
  order) render once; localized fields render per tab.
- Form state keeps English in the base fields and the other locales under
  `translations`; Save posts both. List view continues to show the English
  values.

### Navigation

- `Layout.jsx` and `Dashboard.jsx` gain entries for Services, Process, CTA and
  UI / Navigation.

### Styles

- Admin: `.lang-tabs` / `.lang-tab` (+ `.active`) in `admin.css`.
- Client: `.lang-switch` in `styles.css`.

## Files touched

- `shared/index.js`
- `server/src/db.js`, `server/src/routes/content.js`,
  `server/src/routes/clients.js`, `server/src/routes/testimonials.js`
- `client/src/main.jsx`, `client/src/App.jsx`,
  `client/src/components/Header.jsx`,
  `client/src/components/LanguageSwitcher.jsx` (new),
  `client/src/i18n/resolve.js` (new), `client/src/i18n/LocaleContext.jsx` (new),
  `client/src/sections/*.jsx`, `client/src/styles.css`
- `admin/src/pages/SectionEditor.jsx`, `admin/src/pages/ClientsManager.jsx`,
  `admin/src/pages/TestimonialsManager.jsx`, `admin/src/pages/Dashboard.jsx`,
  `admin/src/components/Layout.jsx`, `admin/src/admin.css`

## Verification

1. `npm run build` (client + admin) succeeds.
2. Start the server against a fresh DB and an existing DB:
   - `GET /api/content` returns nested `{en,it,sq}` for all eight sections.
   - `GET /api/clients` / `/api/testimonials` include `translations`.
   - `PUT /api/content/hero` (authenticated) round-trips a nested object.
3. Existing DB migration preserves previously edited English values and fills
   `it`/`sq`.
4. Manual: visit `/`, `/en`, `/it`, `/sq`; switch language preserving the hash;
   confirm fallback when an Italian field is cleared; confirm admin tabs edit and
   save each locale.
