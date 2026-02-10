const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const habitRoutes = require("./routes/habitRoutes");
const journalRoutes = require("./routes/journalRoutes");
const bemeProRoutes = require("./modules/bemepro/beme.routes");

const app = express();

app.use(cors());
app.use(express.json());

/* DATABASE */
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ BEME Database Connected"))
  .catch((err) => console.log("❌ DB Error:", err.message));

/* ROUTES */
app.use("/api/habits", habitRoutes);
app.use("/api/journal", journalRoutes);
app.use("/api/bemepro", bemeProRoutes);

/* 🔒 BEME.PRO CRON (AUTO FAIL) */
require("./modules/bemepro/beme.cron");

app.get("/", (req, res) => {
  res.send("BEME backend running");
});

/* SERVER */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`🚀 BEME Server running on port ${PORT}`)
);
