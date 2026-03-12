// ============================================================
//  db.js — MongoDB Connection
//  No changes needed here unless using a remote MongoDB URI
// ============================================================

const mongoose = require("mongoose");

// ===== MODIFY CONNECTION URI HERE IF NEEDED =====
const MONGO_URI = "mongodb://127.0.0.1:27017/universaldb";
// ================================================

const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log(`✅  MongoDB connected → ${MONGO_URI}`);
  } catch (err) {
    console.error("❌  MongoDB connection failed:", err.message);
    process.exit(1); // Stop server if DB fails
  }
};

module.exports = connectDB;
