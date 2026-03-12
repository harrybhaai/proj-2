// ============================================================
//  routes/api.js — CRUD API Routes
//
//  Endpoints:
//    GET    /api/items       → fetch all items
//    POST   /api/items       → create new item
//    PUT    /api/items/:id   → update item by ID
//    DELETE /api/items/:id   → delete item by ID
//
//  No route changes needed between projects.
//  Only the model import and the fields sent from the
//  frontend need to match your schema.
// ============================================================

const express = require("express");
const router  = express.Router();

// ===== MODIFY ENTITY NAME HERE (import path stays the same) =====
const Item = require("../models/model");
// ================================================================

// ── GET /api/items ─────────────────────────────────────────
//    Returns all documents, newest first
router.get("/", async (req, res) => {
  try {
    const items = await Item.find().sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch items", detail: err.message });
  }
});

// ── POST /api/items ────────────────────────────────────────
//    Creates a new document from req.body
router.post("/", async (req, res) => {
  try {
    const newItem = new Item(req.body); // req.body must match schema fields
    const saved   = await newItem.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: "Failed to create item", detail: err.message });
  }
});

// ── PUT /api/items/:id ─────────────────────────────────────
//    Updates an existing document by MongoDB _id
router.put("/:id", async (req, res) => {
  try {
    const updated = await Item.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true } // return updated doc + validate
    );
    if (!updated) return res.status(404).json({ error: "Item not found" });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: "Failed to update item", detail: err.message });
  }
});

// ── DELETE /api/items/:id ──────────────────────────────────
//    Deletes a document by MongoDB _id
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Item.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Item not found" });
    res.json({ message: "Deleted successfully", id: req.params.id });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete item", detail: err.message });
  }
});

module.exports = router;
