// backend/modules/bemepro/beme.model.js
// BEME.PRO v4 — Mongoose Model

"use strict";

const mongoose = require("mongoose");

/* ================================================
   SUB-SCHEMA: Daily Journal Reflection
================================================ */
const ReflectionSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      maxlength: [1000, "Reflection cannot exceed 1000 characters"],
    },
    emotionScore: {
      type: Number,
      min: [1, "Score must be at least 1"],
      max: [10, "Score cannot exceed 10"],
      default: 5,
    },
  },
  { _id: false }
);

/* ================================================
   HELPERS
================================================ */

/** Safe URL validator — passes empty/null/undefined, rejects non-http strings. */
function isValidUrlOrEmpty(v) {
  if (!v || v.trim() === "") return true;
  return /^https?:\/\/.+/.test(v.trim());
}

/** Safe month validator — passes empty/null/undefined, validates YYYY-MM format. */
function isValidMonthOrEmpty(v) {
  if (!v || v.trim() === "") return true;
  return /^\d{4}-\d{2}$/.test(v.trim());
}

/* ================================================
   MAIN SCHEMA: BemeCommitment
================================================ */
const BemeCommitmentSchema = new mongoose.Schema(
  {
    // ── Core identity ──────────────────────────────
    title: {
      type: String,
      required: [true, "Habit title is required"],
      trim: true,
      minlength: [3, "Title must be at least 3 characters"],
      maxlength: [120, "Title cannot exceed 120 characters"],
    },

    reason: {
      type: String,
      trim: true,
      default: "",
      maxlength: [500, "Reason cannot exceed 500 characters"],
    },

    // ── Alarm config ───────────────────────────────
    alarmTime: {
      type: String,
      required: [true, "Alarm time is required"],
      match: [/^\d{2}:\d{2}$/, "Alarm time must be in HH:MM format"],
    },

    windowMinutes: {
      type: Number,
      default: 15,
      min: [5, "Minimum window is 5 minutes"],
      max: [180, "Maximum window is 180 minutes"],
    },

    // ── iTunes alarm music ─────────────────────────
    musicUrl: {
      type: String,
      default: "",
      validate: {
        validator: isValidUrlOrEmpty,
        message: "musicUrl must be a valid http(s) URL",
      },
    },

    musicTitle: {
      type: String,
      default: "",
      maxlength: [200, "Music title cannot exceed 200 characters"],
    },

    musicArtwork: {
      type: String,
      default: "",
      validate: {
        validator: isValidUrlOrEmpty,
        message: "musicArtwork must be a valid http(s) URL",
      },
    },

    // ── Date range ─────────────────────────────────
    // FIX: Use custom validator instead of match so empty string "" passes.
    // The match regex /^\d{4}-\d{2}$/ fails on "" and causes 500 errors.
    fromMonth: {
      type: String,
      default: "",
      validate: {
        validator: isValidMonthOrEmpty,
        message: "fromMonth must be in YYYY-MM format",
      },
    },

    toMonth: {
      type: String,
      default: "",
      validate: {
        validator: isValidMonthOrEmpty,
        message: "toMonth must be in YYYY-MM format",
      },
    },

    // ── Attendance ─────────────────────────────────
    // Plain Object: "YYYY-MM-DD" → { status, loggedAt, reflection }
    attendance: {
      type: Object,
      default: {},
    },

    // ── Streak tracking ────────────────────────────
    currentStreak: {
      type: Number,
      default: 0,
      min: 0,
    },

    longestStreak: {
      type: Number,
      default: 0,
      min: 0,
    },

    // ── Optional parent Habit link ─────────────────
    habitId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Habit",
      default: null,
    },
  },
  {
    timestamps: true,
    toJSON:   { virtuals: true },
    toObject: { virtuals: true },
  }
);

/* ================================================
   INDEXES
================================================ */
BemeCommitmentSchema.index({ alarmTime: 1 });
BemeCommitmentSchema.index({ fromMonth: 1, toMonth: 1 });
BemeCommitmentSchema.index({ createdAt: -1 });
BemeCommitmentSchema.index({ habitId: 1 }, { sparse: true });

/* ================================================
   VIRTUALS
================================================ */

BemeCommitmentSchema.virtual("totalLogs").get(function () {
  return Object.keys(this.attendance || {}).length;
});

BemeCommitmentSchema.virtual("presentCount").get(function () {
  return Object.values(this.attendance || {}).filter(
    (e) => e?.status === "present"
  ).length;
});

BemeCommitmentSchema.virtual("successRate").get(function () {
  const total = this.totalLogs;
  if (!total) return 0;
  return Math.round((this.presentCount / total) * 100);
});

BemeCommitmentSchema.virtual("hasMusicAlarm").get(function () {
  return Boolean(this.musicUrl && this.musicUrl.trim());
});

/* ================================================
   PRE-SAVE MIDDLEWARE
   FIX: async function — no next() parameter needed.
   Mongoose v6/v7/v8 all support async pre-hooks.
   The old next-callback form throws "next is not a
   function" when called via Model.create() in v7+.
================================================ */
BemeCommitmentSchema.pre("save", async function () {
  if (this.musicUrl)     this.musicUrl     = this.musicUrl.trim();
  if (this.musicTitle)   this.musicTitle   = this.musicTitle.trim();
  if (this.musicArtwork) this.musicArtwork = this.musicArtwork.trim();

  if (this.fromMonth && this.toMonth && this.toMonth < this.fromMonth) {
    this.toMonth = this.fromMonth;
  }
});

/* ================================================
   INSTANCE METHOD: recalcStreaks
================================================ */
BemeCommitmentSchema.methods.recalcStreaks = function () {
  const entries = this.attendance || {};

  const presentDays = Object.entries(entries)
    .filter(([, e]) => e?.status === "present")
    .map(([dateKey]) => dateKey)
    .sort();

  if (!presentDays.length) {
    this.currentStreak = 0;
    this.longestStreak = 0;
    return this.save();
  }

  // Longest streak
  let longest    = 1;
  let tempStreak = 1;

  for (let i = 1; i < presentDays.length; i++) {
    const diffDays = Math.round(
      (new Date(presentDays[i]) - new Date(presentDays[i - 1])) / 86_400_000
    );
    if (diffDays === 1) {
      tempStreak++;
      if (tempStreak > longest) longest = tempStreak;
    } else {
      tempStreak = 1;
    }
  }

  // Current streak — walk backwards from today or yesterday
  const todayStr     = localDateKey();
  const yesterdayStr = localDateKey(new Date(Date.now() - 86_400_000));

  let anchor = null;
  if (entries[todayStr]?.status === "present")     anchor = todayStr;
  else if (entries[yesterdayStr]?.status === "present") anchor = yesterdayStr;

  let streakCount = 0;
  if (anchor) {
    let check = new Date(anchor);
    while (true) {
      const key = localDateKey(check);
      if (entries[key]?.status === "present") {
        streakCount++;
        check.setDate(check.getDate() - 1);
      } else {
        break;
      }
    }
  }

  this.currentStreak = streakCount;
  this.longestStreak = Math.max(longest, streakCount);

  return this.save();
};

/* ================================================
   STATIC: findUpcoming
================================================ */
BemeCommitmentSchema.statics.findUpcoming = function (lookaheadMinutes = 30) {
  return this.find({}).then((docs) => {
    const now  = new Date();
    const nowM = now.getHours() * 60 + now.getMinutes();
    return docs.filter((doc) => {
      const [h, m] = doc.alarmTime.split(":").map(Number);
      const start  = h * 60 + m;
      return start >= nowM && start <= nowM + lookaheadMinutes;
    });
  });
};

/* ================================================
   SHARED HELPERS
================================================ */
function localDateKey(date = new Date()) {
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join("-");
}

function localMonthKey(date = new Date()) {
  return localDateKey(date).slice(0, 7);
}

/* ================================================
   EXPORTS
================================================ */
const BemeCommitment = mongoose.model("BemeCommitment", BemeCommitmentSchema);

module.exports = BemeCommitment;
module.exports.localDateKey  = localDateKey;
module.exports.localMonthKey = localMonthKey;