import React, { useEffect, useState } from "react";
import { api } from "../api.js";
import { TextInput, Toggle, ImageInput } from "../components/Fields.jsx";

export default function ClientsManager() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
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

  const form = editing || { name: "", websiteUrl: "", logo: "", description: "", active: true };

  function updateForm(field, v) {
    setEditing({ ...form, [field]: v });
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
        <button type="button" className="btn btn--primary" onClick={() => setEditing({ name: "", websiteUrl: "", logo: "", description: "", active: true })}>
          + Add client
        </button>
      </header>
      {status === "saved" && <p className="toast">Saved ✓</p>}
      {error && <p className="page-error">{error}</p>}

      {editing && (
        <div className="form-card">
          <h2>{editing.id ? "Edit client" : "New client"}</h2>
          <div className="form-grid">
            <TextInput label="Name" value={form.name} onChange={(v) => updateForm("name", v)} />
            <TextInput label="Website URL" value={form.websiteUrl} onChange={(v) => updateForm("websiteUrl", v)} />
            <TextInput label="Project description" value={form.description || ""} onChange={(v) => updateForm("description", v)} />
            <ImageInput label="Logo" value={form.logo} onChange={(v) => updateForm("logo", v)} />
            <Toggle label="Visible on site" value={form.active} onChange={(v) => updateForm("active", v)} />
          </div>
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
            <button type="button" className="btn btn--ghost" onClick={() => setEditing({ ...c })}>
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
