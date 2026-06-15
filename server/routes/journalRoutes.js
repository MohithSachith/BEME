const express = require("express");
const router = express.Router();
const JournalEntry = require("../models/JournalEntry");

router.post("/", async (req, res) => {
  try {
    const entry = await JournalEntry.create(req.body);
    res.status(201).json(entry);
  } catch (err) {
    res.status(500).json({ message: "Failed to save journal" });
  }
});

router.get("/", async (req, res) => {
  try {
    const entries = await JournalEntry.find().sort({ createdAt: -1 });
    res.json(entries);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch journals" });
  }
});

module.exports = router;