import React, { useRef, useState } from "react";
import { api } from "../api.js";

export function TextInput({ label, value, onChange, placeholder }) {
  return (
    <label className="field">
      <span className="field-label">{label}</span>
      <input
        type="text"
        value={value || ""}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  );
}

export function Textarea({ label, value, onChange, rows = 3 }) {
  return (
    <label className="field">
      <span className="field-label">{label}</span>
      <textarea rows={rows} value={value || ""} onChange={(e) => onChange(e.target.value)} />
    </label>
  );
}

export function Toggle({ label, value, onChange }) {
  return (
    <label className="field field--toggle">
      <span className="field-label">{label}</span>
      <button
        type="button"
        className={`toggle ${value ? "on" : ""}`}
        onClick={() => onChange(!value)}
        aria-pressed={!!value}
      >
        <span className="toggle-knob" />
      </button>
    </label>
  );
}

export function ImageInput({ label, value, onChange }) {
  const inputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function handleFile(file) {
    if (!file) return;
    setError("");
    setUploading(true);
    try {
      const { url } = await api.upload(file);
      onChange(url);
    } catch (e) {
      setError(e.message);
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="field">
      <span className="field-label">{label}</span>
      <div className="image-input">
        {value ? (
          <img src={value} alt="" className="image-preview" />
        ) : (
          <div className="image-empty">No image</div>
        )}
        <div className="image-actions">
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            hidden
            onChange={(e) => handleFile(e.target.files?.[0])}
          />
          <button type="button" className="btn btn--ghost" onClick={() => inputRef.current?.click()} disabled={uploading}>
            {uploading ? "Uploading…" : "Upload"}
          </button>
          {value && (
            <button type="button" className="btn btn--ghost" onClick={() => onChange("")}>
              Remove
            </button>
          )}
        </div>
      </div>
      <input
        type="text"
        className="image-url"
        placeholder="…or paste an image URL"
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
      />
      {error && <span className="field-error">{error}</span>}
    </div>
  );
}

const ICON_OPTIONS = ["code", "pen-tool", "share-2", "trending-up", "arrow-down", "facebook", "instagram", "linkedin", "twitter"];

export function IconPicker({ label, value, onChange }) {
  return (
    <label className="field">
      <span className="field-label">{label}</span>
      <select value={value || ""} onChange={(e) => onChange(e.target.value)}>
        <option value="">— select icon —</option>
        {ICON_OPTIONS.map((icon) => (
          <option key={icon} value={icon}>
            {icon}
          </option>
        ))}
      </select>
    </label>
  );
}
