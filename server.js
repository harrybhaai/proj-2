// ============================================================
//  server.js — Express Application Entry Point
// ============================================================

const express  = require("express");
const cors     = require("cors");
const path     = require("path");
const connectDB = require("./db");

const app = express();

// ── Middleware ─────────────────────────────────────────────
app.use(cors());                            // Allow cross-origin requests
app.use(express.json());                    // Parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // Parse form data
app.use(express.static(path.join(__dirname, "public"))); // Serve frontend

// ── Database ───────────────────────────────────────────────
connectDB();

// ── API Routes ─────────────────────────────────────────────
// ===== MODIFY API_ROUTE HERE =====
const API_ROUTE = "/api/items";
// ==================================
const apiRouter = require("./routes/api");
app.use(API_ROUTE, apiRouter);

// ── Catch-all: serve index.html for any unknown route ──────
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// ── Start Server ───────────────────────────────────────────
// ===== MODIFY PORT HERE IF NEEDED =====
const PORT = process.env.PORT || 3000;
// =======================================
app.listen(PORT, () => {
  console.log(`🚀  Server running  → http://localhost:${PORT}`);
  console.log(`📡  API endpoint   → http://localhost:${PORT}${API_ROUTE}`);
});
