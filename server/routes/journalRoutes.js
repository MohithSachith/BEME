const express = require("express");
const JournalEntry = require("../models/JournalEntry");

const router = express.Router();

/* SAVE JOURNAL */
router.post("/", async (req, res) => {
  try {
    const entry = await JournalEntry.create(req.body);
    res.status(201).json(entry);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to save journal" });
  }
});

/* FETCH JOURNALS */
router.get("/", async (req, res) => {
  try {
    const entries = await JournalEntry.find().sort({ createdAt: -1 });
    res.json(entries);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch journals" });
  }
});

module.exports = router;
