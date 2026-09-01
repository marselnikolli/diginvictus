import express from "express";
import db from "../db.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

function rowToTestimonial(row) {
  return {
    id: row.id,
    quote: row.quote,
    author: row.author,
    role: row.role,
    company: row.company,
    active: row.active,
    order: row.position,
  };
}

router.get("/", (req, res) => {
  const rows = db
    .prepare("SELECT * FROM testimonials ORDER BY position ASC, id ASC")
    .all();
  res.json(rows.map(rowToTestimonial));
});

router.post("/", requireAuth, (req, res) => {
  const { quote, author, role, company, active, order } = req.body || {};
  if (!quote) return res.status(400).json({ error: "Quote is required" });
  const max = db.prepare("SELECT COALESCE(MAX(position), 0) AS m FROM testimonials").get().m;
  const result = db
    .prepare(
      "INSERT INTO testimonials (quote, author, role, company, active, position) VALUES (?, ?, ?, ?, ?, ?)"
    )
    .run(quote, author || "", role || "", company || "", active === false ? 0 : 1, order ?? max + 1);
  const row = db.prepare("SELECT * FROM testimonials WHERE id = ?").get(result.lastInsertRowid);
  res.status(201).json(rowToTestimonial(row));
});

router.put("/:id", requireAuth, (req, res) => {
  const { id } = req.params;
  const { quote, author, role, company, active, order } = req.body || {};
  const existing = db.prepare("SELECT * FROM testimonials WHERE id = ?").get(id);
  if (!existing) return res.status(404).json({ error: "Testimonial not found" });
  db.prepare(
    "UPDATE testimonials SET quote = ?, author = ?, role = ?, company = ?, active = ?, position = ? WHERE id = ?"
  ).run(
    quote ?? existing.quote,
    author ?? existing.author,
    role ?? existing.role,
    company ?? existing.company,
    active === undefined ? existing.active : active ? 1 : 0,
    order ?? existing.position,
    id
  );
  const row = db.prepare("SELECT * FROM testimonials WHERE id = ?").get(id);
  res.json(rowToTestimonial(row));
});

router.delete("/:id", requireAuth, (req, res) => {
  const { id } = req.params;
  db.prepare("DELETE FROM testimonials WHERE id = ?").run(id);
  res.json({ ok: true });
});

export default router;
