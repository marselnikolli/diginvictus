import express from "express";
import db from "../db.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

function rowToClient(row) {
  return {
    id: row.id,
    name: row.name,
    websiteUrl: row.website_url,
    logo: row.logo,
    description: row.description,
    active: row.active,
    order: row.position,
  };
}

router.get("/", (req, res) => {
  const rows = db
    .prepare("SELECT * FROM clients ORDER BY position ASC, id ASC")
    .all();
  res.json(rows.map(rowToClient));
});

router.post("/", requireAuth, (req, res) => {
  const { name, websiteUrl, logo, description, active, order } = req.body || {};
  if (!name) return res.status(400).json({ error: "Name is required" });
  const max = db.prepare("SELECT COALESCE(MAX(position), 0) AS m FROM clients").get().m;
  const result = db
    .prepare(
      "INSERT INTO clients (name, website_url, logo, description, active, position) VALUES (?, ?, ?, ?, ?, ?)"
    )
    .run(name, websiteUrl || "", logo || "", description || "", active === false ? 0 : 1, order ?? max + 1);
  const row = db.prepare("SELECT * FROM clients WHERE id = ?").get(result.lastInsertRowid);
  res.status(201).json(rowToClient(row));
});

router.put("/:id", requireAuth, (req, res) => {
  const { id } = req.params;
  const { name, websiteUrl, logo, description, active, order } = req.body || {};
  const existing = db.prepare("SELECT * FROM clients WHERE id = ?").get(id);
  if (!existing) return res.status(404).json({ error: "Client not found" });
  db.prepare(
    "UPDATE clients SET name = ?, website_url = ?, logo = ?, description = ?, active = ?, position = ? WHERE id = ?"
  ).run(
    name ?? existing.name,
    websiteUrl ?? existing.website_url,
    logo ?? existing.logo,
    description ?? existing.description,
    active === undefined ? existing.active : active ? 1 : 0,
    order ?? existing.position,
    id
  );
  const row = db.prepare("SELECT * FROM clients WHERE id = ?").get(id);
  res.json(rowToClient(row));
});

router.delete("/:id", requireAuth, (req, res) => {
  const { id } = req.params;
  db.prepare("DELETE FROM clients WHERE id = ?").run(id);
  res.json({ ok: true });
});

export default router;
