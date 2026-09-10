import React, { useEffect, useState } from "react";
import { LOCALES, LOCALE_LABELS } from "shared";
import { api } from "../api.js";
import { TextInput, Textarea, Toggle } from "../components/Fields.jsx";

const EMPTY = { quote: "", author: "", role: "", company: "", active: true };
const FIELDS = ["quote", "author", "role", "company"];

function withTranslations(item) {
  const empty = Object.fromEntries(FIELDS.map((f) => [f, ""]));
  return {
    ...EMPTY,
    ...item,
    translations: {
      it: { ...empty, ...(item?.translations?.it || {}) },
      sq: { ...empty, ...(item?.translations?.sq || {}) },
    },
  };
}

export default function TestimonialsManager() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [activeLocale, setActiveLocale] = useState("en");
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");

  function load() {
    api
      .getTestimonials()
      .then((data) => setItems(data))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }

  useEffect(load, []);

  function startEditing(item) {
    setActiveLocale("en");
    setEditing(withTranslations(item));
  }

  const form = editing || withTranslations(null);

  function updateForm(field, v) {
    setEditing({ ...form, [field]: v });
  }

  function updateTranslation(locale, field, v) {
    setEditing({
      ...form,
      translations: { ...form.translations, [locale]: { ...form.translations[locale], [field]: v } },
    });
  }

  async function save() {
    setError("");
    setStatus("saving");
    try {
      if (editing.id) {
        await api.updateTestimonial(editing.id, editing);
      } else {
        await api.createTestimonial(editing);
      }
      setEditing(null);
      setStatus("saved");
      setTimeout(() => setStatus(""), 2000);
      load();
    } catch (e) {
      setError(e.message);
      setStatus("");
    }
  }

  async function toggleActive(t) {
    try {
      await api.updateTestimonial(t.id, { active: !t.active });
      load();
    } catch (e) {
      setError(e.message);
    }
  }

  async function remove(t) {
    if (!window.confirm("Delete this testimonial?")) return;
    try {
      await api.deleteTestimonial(t.id);
      load();
    } catch (e) {
      setError(e.message);
    }
  }

  if (loading) return <p className="loading">Loading…</p>;

  return (
    <div>
      <header className="page-header">
        <h1>Testimonials</h1>
        <button type="button" className="btn btn--primary" onClick={() => startEditing(null)}>
          + Add testimonial
        </button>
      </header>
      {status === "saved" && <p className="toast">Saved ✓</p>}
      {error && <p className="page-error">{error}</p>}

      {editing && (
        <div className="form-card">
          <h2>{editing.id ? "Edit testimonial" : "New testimonial"}</h2>

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

          {activeLocale === "en" ? (
            <div className="lang-panel">
              <Textarea label="Quote" value={form.quote} onChange={(v) => updateForm("quote", v)} rows={3} />
              <div className="form-grid">
                <TextInput label="Author" value={form.author} onChange={(v) => updateForm("author", v)} />
                <TextInput label="Role" value={form.role} onChange={(v) => updateForm("role", v)} />
                <TextInput label="Company" value={form.company} onChange={(v) => updateForm("company", v)} />
              </div>
            </div>
          ) : (
            <div className="lang-panel">
              <Textarea
                label="Quote"
                value={form.translations[activeLocale].quote}
                onChange={(v) => updateTranslation(activeLocale, "quote", v)}
                rows={3}
              />
              <div className="form-grid">
                <TextInput
                  label="Author"
                  value={form.translations[activeLocale].author}
                  onChange={(v) => updateTranslation(activeLocale, "author", v)}
                />
                <TextInput
                  label="Role"
                  value={form.translations[activeLocale].role}
                  onChange={(v) => updateTranslation(activeLocale, "role", v)}
                />
                <TextInput
                  label="Company"
                  value={form.translations[activeLocale].company}
                  onChange={(v) => updateTranslation(activeLocale, "company", v)}
                />
              </div>
            </div>
          )}

          <Toggle label="Visible on site" value={form.active} onChange={(v) => updateForm("active", v)} />

          <div className="form-actions">
            <button type="button" className="btn btn--primary" onClick={save}>
              {status === "saving" ? "Saving…" : "Save"}
            </button>
            <button type="button" className="btn btn--ghost" onClick={() => setEditing(null)}>
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="list">
        {items.map((t) => (
          <div className="list-row list-row--col" key={t.id}>
            <div className="list-info">
              <p className="quote">“{t.quote}”</p>
              <small>
                {t.author} — {[t.role, t.company].filter(Boolean).join(", ") || "—"}
              </small>
            </div>
            <div className="list-actions">
              <button
                type="button"
                className={`badge ${t.active ? "badge--on" : "badge--off"}`}
                onClick={() => toggleActive(t)}
              >
                {t.active ? "Visible" : "Hidden"}
              </button>
              <button type="button" className="btn btn--ghost" onClick={() => startEditing(t)}>
                Edit
              </button>
              <button type="button" className="btn btn--danger" onClick={() => remove(t)}>
                Delete
              </button>
            </div>
          </div>
        ))}
        {items.length === 0 && <p className="empty">No testimonials yet.</p>}
      </div>
    </div>
  );
}
