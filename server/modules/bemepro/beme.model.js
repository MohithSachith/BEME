const mongoose = require("mongoose");

const BemeTaskSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    index: true,
  },

  title: {
    type: String,
    required: true,
    trim: true,
  },

  reason: {
    type: String,
    required: true,
  },

  startTime: {
    type: Date,
    required: true,
  },

  endTime: {
    type: Date,
    required: true,
  },

  windowMinutes: {
    type: Number,
    required: true,
  },

  strictMode: {
    type: Boolean,
    default: true,
  },

  difficulty: {
    type: String,
    enum: ["easy", "medium", "hard"],
    default: "medium",
  },

  status: {
    type: String,
    enum: ["pending", "completed", "failed"],
    default: "pending",
  },

  completedAt: {
    type: Date,
    default: null,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("BemeTask", BemeTaskSchema);
