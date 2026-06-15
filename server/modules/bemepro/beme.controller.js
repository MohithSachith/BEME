// backend/modules/bemepro/beme.controller.js
// BEME.PRO v4 — Named controller functions

"use strict";

const BemeCommitment = require("./beme.model");

/* ──────────────────────────────────────────────
   DATE HELPERS — local time, never UTC
────────────────────────────────────────────── */
function localDateKey(d = new Date()) {
  return [
    d.getFullYear(),
    String(d.getMonth() + 1).padStart(2, "0"),
    String(d.getDate()).padStart(2, "0"),
  ].join("-");
}

function localMonthKey(d = new Date()) {
  return localDateKey(d).slice(0, 7);
}

/* ──────────────────────────────────────────────
   RESPONSE HELPERS
────────────────────────────────────────────── */
const ok   = (res, data, status = 200) => res.status(status).json(data);
const fail = (res, message, status = 400) =>
  res.status(status).json({ error: message });

/* ──────────────────────────────────────────────
   GET /commitments
────────────────────────────────────────────── */
exports.getCommitments = async (req, res) => {
  try {
    const docs = await BemeCommitment.find({}).sort({ createdAt: -1 }).lean();
    ok(res, docs);
  } catch (err) {
    console.error("[BemePro] getCommitments:", err.message);
    fail(res, err.message, 500);
  }
};

/* ──────────────────────────────────────────────
   POST /commitments
────────────────────────────────────────────── */
exports.createCommitment = async (req, res) => {
  try {
    const {
      title,
      reason        = "",
      alarmTime,
      windowMinutes = 15,
      musicUrl      = "",
      musicTitle    = "",
      musicArtwork  = "",
      fromMonth,
      toMonth,
    } = req.body;

    if (!title || !title.trim()) {
      return fail(res, "title is required");
    }
    if (!alarmTime || !/^\d{2}:\d{2}$/.test(alarmTime)) {
      return fail(res, "alarmTime must be in HH:MM format (e.g. 06:30)");
    }

    const currentMonth = localMonthKey();

    // Use new + save instead of create() to ensure pre-save hooks
    // fire reliably across all Mongoose v6/v7/v8 versions.
    const doc = new BemeCommitment({
      title:         title.trim(),
      reason:        (reason || "").trim(),
      alarmTime,
      windowMinutes: Number(windowMinutes) || 15,
      musicUrl:      (musicUrl     || "").trim(),
      musicTitle:    (musicTitle   || "").trim(),
      musicArtwork:  (musicArtwork || "").trim(),
      fromMonth:     fromMonth || currentMonth,
      toMonth:       toMonth   || currentMonth,
      attendance:    {},
    });

    await doc.save();

    ok(res, doc, 201);
  } catch (err) {
    console.error("[BemePro] createCommitment:", err.message);
    if (err.name === "ValidationError") {
      const messages = Object.values(err.errors).map((e) => e.message);
      return fail(res, messages.join("; "), 400);
    }
    fail(res, err.message, 500);
  }
};

/* ──────────────────────────────────────────────
   DELETE /commitments/:id
────────────────────────────────────────────── */
exports.deleteCommitment = async (req, res) => {
  try {
    const doc = await BemeCommitment.findByIdAndDelete(req.params.id);
    if (!doc) return fail(res, "Commitment not found", 404);
    ok(res, { message: "Deleted successfully", id: req.params.id });
  } catch (err) {
    console.error("[BemePro] deleteCommitment:", err.message);
    if (err.name === "CastError") return fail(res, "Invalid ID", 404);
    fail(res, err.message, 500);
  }
};

/* ──────────────────────────────────────────────
   POST /mark-present
────────────────────────────────────────────── */
exports.markPresent = async (req, res) => {
  try {
    const { commitmentId, reflectionText = "", emotionScore = 5 } = req.body;

    if (!commitmentId) return fail(res, "commitmentId is required");
    if (!reflectionText.trim()) {
      return fail(res, "reflectionText is required when marking present");
    }

    const doc = await BemeCommitment.findById(commitmentId);
    if (!doc) return fail(res, "Commitment not found", 404);

    const key = localDateKey();

    const entry = {
      status:   "present",
      loggedAt: new Date(),
      reflection: {
        text:         reflectionText.trim(),
        emotionScore: Math.min(10, Math.max(1, Number(emotionScore) || 5)),
      },
    };

    await BemeCommitment.findByIdAndUpdate(
      commitmentId,
      { $set: { [`attendance.${key}`]: entry } },
      { runValidators: false }
    );

    const fresh = await BemeCommitment.findById(commitmentId);
    await fresh.recalcStreaks();

    ok(res, {
      message:       "Marked present",
      date:          key,
      currentStreak: fresh.currentStreak,
      longestStreak: fresh.longestStreak,
    });
  } catch (err) {
    console.error("[BemePro] markPresent:", err.message);
    if (err.name === "CastError") return fail(res, "Invalid ID", 404);
    fail(res, err.message, 500);
  }
};

/* ──────────────────────────────────────────────
   POST /mark-absent
────────────────────────────────────────────── */
exports.markAbsent = async (req, res) => {
  try {
    const { commitmentId, date } = req.body;

    if (!commitmentId) return fail(res, "commitmentId is required");

    const doc = await BemeCommitment.findById(commitmentId);
    if (!doc) return fail(res, "Commitment not found", 404);

    const key = date || localDateKey();

    // Never overwrite a present entry
    if (doc.attendance?.[key]?.status === "present") {
      return ok(res, { message: "Already marked present — skipped", date: key });
    }

    await BemeCommitment.findByIdAndUpdate(
      commitmentId,
      {
        $set: {
          [`attendance.${key}`]: {
            status:     "absent",
            loggedAt:   new Date(),
            reflection: null,
          },
        },
      },
      { runValidators: false }
    );

    const fresh = await BemeCommitment.findById(commitmentId);
    await fresh.recalcStreaks();

    ok(res, { message: "Marked absent", date: key });
  } catch (err) {
    console.error("[BemePro] markAbsent:", err.message);
    if (err.name === "CastError") return fail(res, "Invalid ID", 404);
    fail(res, err.message, 500);
  }
};

/* ──────────────────────────────────────────────
   GET /journals/:id
────────────────────────────────────────────── */
exports.getJournals = async (req, res) => {
  try {
    const doc = await BemeCommitment.findById(req.params.id);
    if (!doc) return fail(res, "Commitment not found", 404);

    const reflections = Object.entries(doc.attendance || {})
      .filter(([, e]) => e?.status === "present" && e?.reflection?.text)
      .map(([date, e]) => ({
        date,
        text:         e.reflection.text,
        emotionScore: e.reflection.emotionScore,
        loggedAt:     e.loggedAt,
      }))
      .sort((a, b) => b.date.localeCompare(a.date));

    ok(res, reflections);
  } catch (err) {
    console.error("[BemePro] getJournals:", err.message);
    if (err.name === "CastError") return fail(res, "Invalid ID", 404);
    fail(res, err.message, 500);
  }
};