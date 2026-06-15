const mongoose = require("mongoose");

const HabitSchema = new mongoose.Schema(
{
  name: {
    type: String,
    required: true
  },

  description: {
    type: String,
    default: ""
  },

  icon: {
    type: String,
    default: "📝"
  },

  goal: {
    type: String,
    default: "Once daily"
  },

  month: {
    type: String,
    required: true
  },

  phase: {
    type: String,
    enum: [
      "morning",
      "afternoon",
      "night"
    ],
    default: "morning"
  },

  /* 
     entries array:
     0 = empty
     1 = completed
     2 = failed / missed
  */

  entries: {
    type: [Number],
    default: Array(31).fill(0)
  }
},
{
  timestamps: true
});

module.exports =
mongoose.model(
  "Habit",
  HabitSchema
);