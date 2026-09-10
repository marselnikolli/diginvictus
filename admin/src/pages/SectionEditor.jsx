import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { LOCALES, LOCALE_LABELS } from "shared";
import { api } from "../api.js";
import { TextInput, Textarea, Toggle, ImageInput, IconPicker, ListInput } from "../components/Fields.jsx";

const SCHEMAS = {
  site: [
    { key: "name", label: "Site name", type: "text", structural: true },
    { key: "year", label: "Copyright year", type: "text", structural: true },
    { key: "tagline", label: "Tagline", type: "text" },
    { key: "metaDescription", label: "Meta description", type: "textarea" },
    { key: "keywords", label: "Keywords", type: "textarea" },
    { key: "copyright", label: "Copyright text", type: "text" },
  ],
  hero: [
    { key: "headline", label: "Headline", type: "text" },
    { key: "subTitle", label: "Sub-title", type: "text" },
    { key: "ctaLabel", label: "CTA label", type: "text" },
    { key: "ctaLink", label: "CTA link", type: "text", structural: true },
    { key: "ctaEnabled", label: "Show CTA button", type: "toggle", structural: true },
    { key: "scrollEnabled", label: "Show scroll-down arrow", type: "toggle", structural: true },
    { key: "threejsEnabled", label: "Show 3D particle sphere", type: "toggle", structural: true },
  ],
  highlights: [
    { key: "eyebrow", label: "Eyebrow", type: "text" },
    { key: "heading", label: "Heading", type: "text" },
    { key: "subtitle", label: "Subtitle", type: "textarea" },
    {
      key: "items",
      label: "Service cards",
      type: "repeater",
      fields: [
        { key: "icon", label: "Icon", type: "icon", structural: true },
        { key: "title", label: "Title", type: "text" },
        { key: "description", label: "Description", type: "textarea" },
      ],
    },
  ],
  services: [
    { key: "eyebrow", label: "Eyebrow", type: "text" },
    { key: "heading", label: "Heading", type: "text" },
    { key: "subtitle", label: "Subtitle", type: "textarea" },
    { key: "fromLabel", label: "\"Fixed from\" label", type: "text" },
    { key: "ctaLabel", label: "Card CTA label", type: "text" },
    { key: "bestValueLabel", label: "\"Best value\" badge", type: "text" },
    {
      key: "items",
      label: "Service cards",
      type: "repeater",
      fields: [
        { key: "icon", label: "Icon", type: "icon", structural: true },
        { key: "price", label: "Price", type: "text", structural: true },
        { key: "delivery", label: "Delivery", type: "text", structural: true },
        { key: "bestValue", label: "Best value", type: "toggle", structural: true },
        { key: "title", label: "Title", type: "text" },
        { key: "description", label: "Description", type: "textarea" },
        { key: "features", label: "Features (one per line)", type: "list" },
      ],
    },
  ],
  process: [
    { key: "eyebrow", label: "Eyebrow", type: "text" },
    { key: "heading", label: "Heading", type: "text" },
    { key: "subtitle", label: "Subtitle", type: "textarea" },
    {
      key: "steps",
      label: "Steps",
      type: "repeater",
      fields: [
        { key: "title", label: "Title", type: "text" },
        { key: "description", label: "Description", type: "textarea" },
      ],
    },
  ],
  cta: [
    { key: "eyebrow", label: "Eyebrow", type: "text" },
    { key: "heading", label: "Heading", type: "text" },
    { key: "text", label: "Text", type: "textarea" },
    { key: "ctaLabel", label: "CTA label", type: "text" },
    { key: "ctaLink", label: "CTA link", type: "text", structural: true },
  ],
  footer: [
    { key: "year", label: "Copyright year", type: "text", structural: true },
    { key: "copyright", label: "Copyright text", type: "text" },
    { key: "tagline", label: "Tagline", type: "text" },
    { key: "exploreHeading", label: "\"Explore\" heading", type: "text" },
    { key: "contactHeading", label: "\"Contact\" heading", type: "text" },
    { key: "statusText", label: "Status text", type: "text" },
    {
      key: "socialLinks",
      label: "Social links",
      type: "repeater",
      fields: [
        { key: "url", label: "URL", type: "text", structural: true },
        { key: "icon", label: "Icon", type: "icon", structural: true },
        { key: "name", label: "Name", type: "text" },
      ],
    },
  ],
  ui: [
    { key: "navServices", label: "Nav: Services", type: "text" },
    { key: "navProcess", label: "Nav: Process", type: "text" },
    { key: "navWork", label: "Nav: Work", type: "text" },
    { key: "navContact", label: "Nav: Contact", type: "text" },
    { key: "getInTouch", label: "Get in touch", type: "text" },
    { key: "headerStatus", label: "Header status", type: "text" },
    { key: "scrollAria", label: "Scroll arrow aria-label", type: "text" },
    { key: "footerStatus", label: "Footer status", type: "text" },
    { key: "workEyebrow", label: "Work section eyebrow", type: "text" },
    { key: "workHeading", label: "Work section heading", type: "text" },
    { key: "workSubtitle", label: "Work section subtitle", type: "textarea" },
    { key: "loadingText", label: "Loading text", type: "text" },
    { key: "errorText", label: "Error text", type: "textarea" },
  ],
};

function isStructural(field) {
  return field.structural === true || field.type === "toggle" || field.type === "icon" || field.type === "image";
}

function FieldControl({ field, value, onChange }) {
  switch (field.type) {
    case "toggle":
      return <Toggle label={field.label} value={value} onChange={onChange} />;
    case "textarea":
      return <Textarea label={field.label} value={value} onChange={onChange} />;
    case "image":
      return <ImageInput label={field.label} value={value} onChange={onChange} />;
    case "icon":
      return <IconPicker label={field.label} value={value} onChange={onChange} />;
    case "list":
      return <ListInput label={field.label} value={value} onChange={onChange} />;
    default:
      return <TextInput label={field.label} value={value} onChange={onChange} />;
  }
}

function setLocaleField(value, locale, key, v) {
  return { ...value, [locale]: { ...(value[locale] || {}), [key]: v } };
}

function setEnField(value, key, v) {
  return { ...value, en: { ...(value.en || {}), [key]: v } };
}

function setLocaleItem(value, locale, key, index, field, v) {
  const arr = Array.isArray(value[locale]?.[key]) ? [...value[locale][key]] : [];
  while (arr.length <= index) arr.push({});
  arr[index] = { ...(arr[index] || {}), [field]: v };
  return { ...value, [locale]: { ...(value[locale] || {}), [key]: arr } };
}

function setEnItem(value, key, index, field, v) {
  const arr = [...(value.en?.[key] || [])];
  arr[index] = { ...(arr[index] || {}), [field]: v };
  return { ...value, en: { ...value.en, [key]: arr } };
}

function addEnItem(value, key, fields) {
  const base = Object.fromEntries(
    fields.map((f) => [f.key, f.type === "toggle" ? true : f.type === "list" ? [] : ""])
  );
  return { ...value, en: { ...value.en, [key]: [...(value.en?.[key] || []), base] } };
}

function removeEnItem(value, key, index) {
  return { ...value, en: { ...value.en, [key]: (value.en?.[key] || []).filter((_, i) => i !== index) } };
}

export default function SectionEditor() {
  const { name } = useParams();
  const navigate = useNavigate();
  const [value, setValue] = useState(null);
  const [activeLocale, setActiveLocale] = useState("en");
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    setStatus("");
    setError("");
    setActiveLocale("en");
    api
      .getSection(name)
      .then(setValue)
      .catch((e) => {
        setError(e.message);
        navigate("/", { replace: true });
      });
  }, [name]);

  const schema = SCHEMAS[name];
  if (!schema) return <p>Unknown section.</p>;
  if (!value) return <p className="loading">Loading…</p>;

  const topLevel = schema.filter((f) => f.type !== "repeater");
  const structuralFields = topLevel.filter(isStructural);
  const localizedFields = topLevel.filter((f) => !isStructural(f));
  const repeaters = schema.filter((f) => f.type === "repeater");

  async function save() {
    setStatus("saving");
    setError("");
    try {
      await api.updateSection(name, value);
      setStatus("saved");
      setTimeout(() => setStatus(""), 2000);
    } catch (e) {
      setError(e.message);
      setStatus("");
    }
  }

  return (
    <div>
      <header className="page-header">
        <h1>Edit: {name}</h1>
        <button type="button" className="btn btn--primary" onClick={save}>
          {status === "saving" ? "Saving…" : "Save changes"}
        </button>
      </header>
      {status === "saved" && <p className="toast">Saved ✓</p>}
      {error && <p className="page-error">{error}</p>}

      <div className="form-card">
        {structuralFields.length > 0 && (
          <div className="shared-fields">
            <h2 className="shared-fields-title">Shared settings</h2>
            {structuralFields.map((field) => (
              <FieldControl
                key={field.key}
                field={field}
                value={value.en?.[field.key]}
                onChange={(v) => setValue(setEnField(value, field.key, v))}
              />
            ))}
          </div>
        )}

        <div className="lang-tabs" role="tablist" aria-label="Language">
          {LOCALES.map((locale) => (
            <button
              key={locale}
              type="button"
              role="tab"
              aria-selected={locale === activeLocale}
              className={locale === activeLocale ? "lang-tab active" : "lang-tab"}
              onClick={() => setActiveLocale(locale)}
            >
              {LOCALE_LABELS[locale]}
            </button>
          ))}
        </div>

        <div className="lang-panel">
          {localizedFields.map((field) => (
            <FieldControl
              key={field.key}
              field={field}
              value={value[activeLocale]?.[field.key]}
              onChange={(v) => setValue(setLocaleField(value, activeLocale, field.key, v))}
            />
          ))}

          {repeaters.map((repeater) => {
            const fields = activeLocale === "en" ? repeater.fields : repeater.fields.filter((f) => !isStructural(f));
            const items =
              activeLocale === "en"
                ? value.en?.[repeater.key] || []
                : (value.en?.[repeater.key] || []).map((_, i) => value[activeLocale]?.[repeater.key]?.[i] || {});

            return (
              <div className="field" key={repeater.key}>
                <span className="field-label">{repeater.label}</span>
                {activeLocale !== "en" && (
                  <p className="field-hint">
                    Translate the cards defined in the English tab. Add or remove cards there.
                  </p>
                )}
                {items.map((item, index) => (
                  <div className="repeater-row" key={index}>
                    <div className="repeater-grid">
                      {fields.map((f) => (
                        <FieldControl
                          key={f.key}
                          field={f}
                          value={item[f.key]}
                          onChange={(v) =>
                            activeLocale === "en"
                              ? setValue(setEnItem(value, repeater.key, index, f.key, v))
                              : setValue(setLocaleItem(value, activeLocale, repeater.key, index, f.key, v))
                          }
                        />
                      ))}
                    </div>
                    {activeLocale === "en" && (
                      <button
                        type="button"
                        className="btn btn--danger"
                        onClick={() => setValue(removeEnItem(value, repeater.key, index))}
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}
                {activeLocale === "en" && (
                  <button
                    type="button"
                    className="btn btn--ghost"
                    onClick={() => setValue(addEnItem(value, repeater.key, repeater.fields))}
                  >
                    + Add {repeater.label.toLowerCase()}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
