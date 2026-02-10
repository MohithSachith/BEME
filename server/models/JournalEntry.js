const mongoose = require("mongoose");

const JournalEntrySchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: true
    },

    mood: {
      type: String
    },

    systemState: {
      label: String,
      focus: Number,
      attendance: Number,
      streakRisk: String,
      cycle: String,
      missedHabits: Number
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("JournalEntry", JournalEntrySchema);
