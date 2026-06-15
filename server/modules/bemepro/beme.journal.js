// backend/modules/bemepro/beme.journal.js
// 🔥 COMPLETE FINAL FILE

const mongoose = require("mongoose");

const BemeJournalSchema =
  new mongoose.Schema(
    {
      commitmentId: {
        type:
          mongoose.Schema.Types.ObjectId,
        ref: "BemeCommitment",
        required: true
      },

      date: {
        type: String,
        required: true
      },

      reflectionText: {
        type: String,
        required: true
      },

      emotionScore: {
        type: Number,
        min: 1,
        max: 10,
        default: 5
      }
    },
    {
      timestamps: true
    }
  );

module.exports =
  mongoose.model(
    "BemeJournal",
    BemeJournalSchema
  );