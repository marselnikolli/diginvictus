import express from "express";
import db from "../db.js";
import { requireAuth } from "../middleware/auth.js";
import { CONTENT_SECTIONS } from "shared";

const router = express.Router();

function getAllSettings() {
  const rows = db.prepare("SELECT key, value FROM settings").all();
  return Object.fromEntries(rows.map((r) => [r.key, JSON.parse(r.value)]));
}

function isValidSectionValue(body) {
  return (
    body !== null &&
    typeof body === "object" &&
    !Array.isArray(body) &&
    body.en !== null &&
    typeof body.en === "object" &&
    !Array.isArray(body.en)
  );
}

router.get("/", (req, res) => {
  res.json(getAllSettings());
});

router.get("/:section", (req, res) => {
  const { section } = req.params;
  const row = db.prepare("SELECT value FROM settings WHERE key = ?").get(section);
  if (!row) return res.status(404).json({ error: "Section not found" });
  res.json(JSON.parse(row.value));
});

router.put("/:section", requireAuth, (req, res) => {
  const { section } = req.params;
  if (!CONTENT_SECTIONS.includes(section)) {
    return res.status(400).json({ error: "Unknown section" });
  }
  if (!isValidSectionValue(req.body)) {
    return res.status(400).json({ error: "Body must be an object with an 'en' object" });
  }
  const value = JSON.stringify(req.body);
  db.prepare("UPDATE settings SET value = ? WHERE key = ?").run(value, section);
  res.json({ ok: true, section, value: req.body });
});

export default router;
