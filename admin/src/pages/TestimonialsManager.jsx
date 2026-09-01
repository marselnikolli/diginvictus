import React, { useEffect, useState } from "react";
import { api } from "../api.js";
import { TextInput, Textarea, Toggle } from "../components/Fields.jsx";

export default function TestimonialsManager() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
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

  const form = editing || { quote: "", author: "", role: "", company: "", active: true };

  function updateForm(field, v) {
    setEditing({ ...form, [field]: v });
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
        <button type="button" className="btn btn--primary" onClick={() => setEditing({ quote: "", author: "", role: "", company: "", active: true })}>
          + Add testimonial
        </button>
      </header>
      {status === "saved" && <p className="toast">Saved ✓</p>}
      {error && <p className="page-error">{error}</p>}

      {editing && (
        <div className="form-card">
          <h2>{editing.id ? "Edit testimonial" : "New testimonial"}</h2>
          <Textarea label="Quote" value={form.quote} onChange={(v) => updateForm("quote", v)} rows={3} />
          <div className="form-grid">
            <TextInput label="Author" value={form.author} onChange={(v) => updateForm("author", v)} />
            <TextInput label="Role" value={form.role} onChange={(v) => updateForm("role", v)} />
            <TextInput label="Company" value={form.company} onChange={(v) => updateForm("company", v)} />
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
        {items.map((t) => (
          <div className="list-row list-row--col" key={t.id}>
            <div className="list-info">
              <p className="quote">“{t.quote}”</p>
              <small>
                {t.author} — {[t.role, t.company].filter(Boolean).join(", ") || "—"}
              </small>
            </div>
            <div className="list-actions">
              <button type="button" className={`badge ${t.active ? "badge--on" : "badge--off"}`} onClick={() => toggleActive(t)}>
                {t.active ? "Visible" : "Hidden"}
              </button>
              <button type="button" className="btn btn--ghost" onClick={() => setEditing({ ...t })}>
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
