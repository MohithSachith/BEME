const mongoose = require("mongoose");

const HabitSchema = new mongoose.Schema({
  /* ---------------- BASIC HABIT ---------------- */
  name: { type: String, required: true },

  description: { type: String, default: "" },

  icon: { type: String, default: "📝" },

  goal: { type: String, default: "Once daily" },

  entries: {
    type: [Number], // 0 = empty, 1 = done, 2 = failed
    default: () => Array(31).fill(0)
  },

  month: { type: String, required: true },

  phase: {
    type: String,
    enum: ["morning", "afternoon", "night"],
    default: "morning"
  },

});

module.exports = mongoose.model("Habit", HabitSchema);
