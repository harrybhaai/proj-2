// ============================================================
//  models/model.js — Mongoose Schema
//
//  HOW TO ADAPT:
//    1. Change the model name (first argument to mongoose.model)
//    2. Replace / add fields inside the schema object
// ============================================================

const mongoose = require("mongoose");

// ===== ADD / MODIFY SCHEMA FIELDS HERE =====
//
//  Common field types:
//    String  → { type: String, required: true, trim: true }
//    Number  → { type: Number, required: true }
//    Boolean → { type: Boolean, default: false }
//    Date    → { type: Date, default: Date.now }
//
const itemSchema = new mongoose.Schema(
  {
    // ── Field 1 ─────────────────────────────────────────────
    name: {
      type: String,
      required: true,
      trim: true,
    },

    // ── Field 2 ─────────────────────────────────────────────
    description: {
      type: String,
      trim: true,
      default: "",
    },

    // ── Field 3 ─────────────────────────────────────────────
    status: {
      type: String,
      enum: ["active", "inactive", "pending"],
      default: "active",
    },

    // ── ADD MORE FIELDS BELOW THIS LINE ─────────────────────
    // Example:
    //   age:      { type: Number },
    //   email:    { type: String },
    //   price:    { type: Number, required: true },
    //   isActive: { type: Boolean, default: true },
    // ────────────────────────────────────────────────────────
  },
  {
    timestamps: true, // Adds createdAt and updatedAt automatically
  }
);

// ===== MODIFY ENTITY NAME HERE =====
//  First arg  → Collection name in MongoDB (auto-pluralised)
//  "Item"     → stored as "items" collection
const Item = mongoose.model("Item", itemSchema);
// ====================================

module.exports = Item;
