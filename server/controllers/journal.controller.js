import JournalEntry from "../models/JournalEntry.js";

/* CREATE JOURNAL ENTRY */
export const createEntry = async (req, res) => {
  try {
    const entry = await JournalEntry.create({
      userId: req.user.id,
      ...req.body
    });

    res.status(201).json(entry);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to save journal entry" });
  }
};

/* GET ALL JOURNAL ENTRIES */
export const getEntries = async (req, res) => {
  try {
    const entries = await JournalEntry.find({
      userId: req.user.id
    }).sort({ createdAt: -1 });

    res.json(entries);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch journal entries" });
  }
};
