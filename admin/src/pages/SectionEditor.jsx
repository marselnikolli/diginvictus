import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../api.js";
import { TextInput, Textarea, Toggle, ImageInput, IconPicker } from "../components/Fields.jsx";

const SCHEMAS = {
  site: [
    { key: "name", label: "Site name", type: "text" },
    { key: "tagline", label: "Tagline", type: "text" },
    { key: "metaDescription", label: "Meta description", type: "textarea" },
    { key: "keywords", label: "Keywords", type: "textarea" },
    { key: "copyright", label: "Copyright text", type: "text" },
    { key: "year", label: "Copyright year", type: "text" },
  ],
  hero: [
    { key: "headline", label: "Headline", type: "text" },
    { key: "subTitle", label: "Sub-title", type: "text" },
    { key: "ctaLabel", label: "CTA label", type: "text" },
    { key: "ctaLink", label: "CTA link", type: "text" },
    { key: "ctaEnabled", label: "Show “Get in touch” button", type: "toggle" },
    { key: "scrollEnabled", label: "Show scroll-down arrow", type: "toggle" },
    { key: "threejsEnabled", label: "Show 3D particle sphere", type: "toggle" },
  ],
  highlights: [
    { key: "heading", label: "Heading", type: "text" },
  ],
  footer: [
    { key: "copyright", label: "Copyright text", type: "text" },
    { key: "year", label: "Copyright year", type: "text" },
  ],
};

function Repeater({ label, items, onChange, fields }) {
  function update(index, field, value) {
    const next = items.map((item, i) => (i === index ? { ...item, [field]: value } : item));
    onChange(next);
  }
  function remove(index) {
    onChange(items.filter((_, i) => i !== index));
  }
  function add() {
    const base = Object.fromEntries(fields.map((f) => [f.key, f.type === "toggle" ? true : ""]));
    onChange([...items, base]);
  }
  return (
    <div className="field">
      <span className="field-label">{label}</span>
      {items.map((item, index) => (
        <div className="repeater-row" key={index}>
          <div className="repeater-grid">
            {fields.map((f) => (
              <RepeaterField key={f.key} field={f} value={item[f.key]} onChange={(v) => update(index, f.key, v)} />
            ))}
          </div>
          <button type="button" className="btn btn--danger" onClick={() => remove(index)}>
            Remove
          </button>
        </div>
      ))}
      <button type="button" className="btn btn--ghost" onClick={add}>
        + Add {label.toLowerCase()}
      </button>
    </div>
  );
}

function RepeaterField({ field, value, onChange }) {
  switch (field.type) {
    case "toggle":
      return <Toggle label={field.label} value={value} onChange={onChange} />;
    case "textarea":
      return <Textarea label={field.label} value={value} onChange={onChange} rows={2} />;
    case "image":
      return <ImageInput label={field.label} value={value} onChange={onChange} />;
    case "icon":
      return <IconPicker label={field.label} value={value} onChange={onChange} />;
    default:
      return <TextInput label={field.label} value={value} onChange={onChange} />;
  }
}

const LIST_FIELDS = {
  highlights: {
    label: "Service cards",
    fields: [
      { key: "icon", label: "Icon", type: "icon" },
      { key: "title", label: "Title", type: "text" },
      { key: "description", label: "Description", type: "textarea" },
    ],
  },
  footer: {
    label: "Social links",
    fields: [
      { key: "name", label: "Name", type: "text" },
      { key: "url", label: "URL", type: "text" },
      { key: "icon", label: "Icon", type: "icon" },
    ],
  },
};

export default function SectionEditor() {
  const { name } = useParams();
  const navigate = useNavigate();
  const [value, setValue] = useState(null);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    setStatus("");
    setError("");
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

  const list = LIST_FIELDS[name];

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
        {schema.map((field) => {
          if (field.type === "toggle") {
            return (
              <Toggle
                key={field.key}
                label={field.label}
                value={value[field.key]}
                onChange={(v) => setValue({ ...value, [field.key]: v })}
              />
            );
          }
          if (field.type === "textarea") {
            return (
              <Textarea
                key={field.key}
                label={field.label}
                value={value[field.key]}
                onChange={(v) => setValue({ ...value, [field.key]: v })}
              />
            );
          }
          return (
            <TextInput
              key={field.key}
              label={field.label}
              value={value[field.key]}
              onChange={(v) => setValue({ ...value, [field.key]: v })}
            />
          );
        })}

        {list && (
          <Repeater
            label={list.label}
            fields={list.fields}
            items={value[list.label === "Service cards" ? "items" : "socialLinks"] || []}
            onChange={(items) =>
              setValue({
                ...value,
                [list.label === "Service cards" ? "items" : "socialLinks"]: items,
              })
            }
          />
        )}
      </div>
    </div>
  );
}
