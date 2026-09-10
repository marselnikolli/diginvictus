import React, { useEffect, useState } from "react";
import { LOCALES, LOCALE_LABELS } from "shared";
import { api } from "../api.js";
import { TextInput, Toggle, ImageInput } from "../components/Fields.jsx";

const EMPTY = { name: "", websiteUrl: "", logo: "", description: "", active: true };

function withTranslations(client) {
  return {
    ...EMPTY,
    ...client,
    translations: {
      it: { name: "", description: "", ...(client?.translations?.it || {}) },
      sq: { name: "", description: "", ...(client?.translations?.sq || {}) },
    },
  };
}

export default function ClientsManager() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [activeLocale, setActiveLocale] = useState("en");
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");

  function load() {
    api
      .getClients()
      .then((data) => setClients(data))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }

  useEffect(load, []);

  function startEditing(client) {
    setActiveLocale("en");
    setEditing(withTranslations(client));
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
        await api.updateClient(editing.id, editing);
      } else {
        await api.createClient(editing);
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

  async function toggleActive(c) {
    try {
      await api.updateClient(c.id, { active: !c.active });
      load();
    } catch (e) {
      setError(e.message);
    }
  }

  async function remove(c) {
    if (!window.confirm(`Delete client "${c.name}"?`)) return;
    try {
      await api.deleteClient(c.id);
      load();
    } catch (e) {
      setError(e.message);
    }
  }

  if (loading) return <p className="loading">Loading…</p>;

  return (
    <div>
      <header className="page-header">
        <h1>Clients</h1>
        <button type="button" className="btn btn--primary" onClick={() => startEditing(null)}>
          + Add client
        </button>
      </header>
      {status === "saved" && <p className="toast">Saved ✓</p>}
      {error && <p className="page-error">{error}</p>}

      {editing && (
        <div className="form-card">
          <h2>{editing.id ? "Edit client" : "New client"}</h2>
          <div className="form-grid">
            <TextInput label="Website URL" value={form.websiteUrl} onChange={(v) => updateForm("websiteUrl", v)} />
            <ImageInput label="Logo" value={form.logo} onChange={(v) => updateForm("logo", v)} />
            <Toggle label="Visible on site" value={form.active} onChange={(v) => updateForm("active", v)} />
          </div>

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
              <TextInput label="Name" value={form.name} onChange={(v) => updateForm("name", v)} />
              <TextInput
                label="Project description"
                value={form.description || ""}
                onChange={(v) => updateForm("description", v)}
              />
            </div>
          ) : (
            <div className="lang-panel">
              <TextInput
                label="Name"
                value={form.translations[activeLocale].name}
                onChange={(v) => updateTranslation(activeLocale, "name", v)}
              />
              <TextInput
                label="Project description"
                value={form.translations[activeLocale].description}
                onChange={(v) => updateTranslation(activeLocale, "description", v)}
              />
            </div>
          )}

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
        {clients.map((c) => (
          <div className="list-row" key={c.id}>
            {c.logo ? <img src={c.logo} alt="" className="list-logo" /> : <div className="list-logo list-logo--empty" />}
            <div className="list-info">
              <strong>{c.name}</strong>
              <small>{c.websiteUrl || "—"}</small>
            </div>
            <button
              type="button"
              className={`badge ${c.active ? "badge--on" : "badge--off"}`}
              onClick={() => toggleActive(c)}
            >
              {c.active ? "Visible" : "Hidden"}
            </button>
            <button type="button" className="btn btn--ghost" onClick={() => startEditing(c)}>
              Edit
            </button>
            <button type="button" className="btn btn--danger" onClick={() => remove(c)}>
              Delete
            </button>
          </div>
        ))}
        {clients.length === 0 && <p className="empty">No clients yet.</p>}
      </div>
    </div>
  );
}
