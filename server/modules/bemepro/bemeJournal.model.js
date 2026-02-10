const mongoose = require("mongoose");

const BemeJournalSchema = new mongoose.Schema({
  taskId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "BemeTask",
    required: true,
    unique: true,
  },

  reflectionText: {
    type: String,
    required: true,
  },

  emotionScore: {
    type: Number,
    min: 1,
    max: 10,
    default: null,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("BemeJournal", BemeJournalSchema);
