const JournalEntry = require("../models/JournalEntry");

/* CREATE JOURNAL ENTRY */
const createEntry = async (req, res) => {
  try {
    const entry = await JournalEntry.create(req.body);
    res.status(201).json(entry);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to save journal entry" });
  }
};

/* GET ALL JOURNAL ENTRIES */
const getEntries = async (req, res) => {
  try {
    const entries = await JournalEntry.find().sort({ createdAt: -1 });
    res.json(entries);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch journal entries" });
  }
};

module.exports = { createEntry, getEntries };