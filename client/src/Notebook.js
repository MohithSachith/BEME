import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import "./Notebook.css";

export default function Notebook({ onBack }) {
  const [text, setText] = useState("");
  const [entries, setEntries] = useState([]);
  const [habits, setHabits] = useState([]);
  const [mood, setMood] = useState(null);
  const [loading, setLoading] = useState(true);

  const today = new Date();
  const dayIndex = today.getDate() - 1;

  const month = `${today.getFullYear()}-${String(
    today.getMonth() + 1
  ).padStart(2, "0")}`;

  /* =====================================
     LOAD DATA
  ===================================== */

  useEffect(() => {
    const load = async () => {
      try {
        const [journalRes, habitsRes] =
          await Promise.all([
            axios.get(
              "http://localhost:5000/api/journal"
            ),
            axios.get(
              `http://localhost:5000/api/habits/${month}`
            )
          ]);

        setEntries(journalRes.data || []);
        setHabits(
          habitsRes.data?.habits || []
        );
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [month]);

  /* =====================================
     REAL METRICS
  ===================================== */

  const metrics = useMemo(() => {
    if (!habits.length) {
      return {
        focus: 0,
        attendance: 0,
        streak: 0,
        missedToday: 0,
        entropy: 100,
        score: 0,
        label: "NO DATA"
      };
    }

    let total = 0;
    let done = 0;
    let missedToday = 0;

    habits.forEach(h => {
      h.entries.forEach(v => {
        if (v === 1 || v === 2) total++;
        if (v === 1) done++;
      });

      if (
        h.entries?.[dayIndex] === 2
      )
        missedToday++;
    });

    const attendance = total
      ? Math.round(
          (done / total) * 100
        )
      : 0;

    const productive = habits.filter(h =>
      [
        "study",
        "coding",
        "gym",
        "reading",
        "meditation"
      ].some(k =>
        h.name
          .toLowerCase()
          .includes(k)
      )
    );

    let productiveTotal = 0;
    let productiveDone = 0;

    productive.forEach(h => {
      h.entries.forEach(v => {
        if (v === 1 || v === 2)
          productiveTotal++;
        if (v === 1)
          productiveDone++;
      });
    });

    const focus =
      productiveTotal > 0
        ? Math.round(
            (productiveDone /
              productiveTotal) *
              100
          )
        : attendance;

    /* streak */
    let streak = 0;

    for (
      let d = dayIndex;
      d >= 0;
      d--
    ) {
      let ok = false;

      for (let h of habits) {
        if (
          h.entries?.[d] === 1
        ) {
          ok = true;
          break;
        }
      }

      if (ok) streak++;
      else break;
    }

    const entropy =
      100 -
      Math.round(
        attendance * 0.7 +
          focus * 0.3
      );

    const score = Math.round(
      attendance * 0.4 +
        focus * 0.3 +
        streak * 1.5 -
        missedToday * 4
    );

    const label =
      score >= 80
        ? "OPTIMAL"
        : score >= 60
        ? "STABLE"
        : score >= 40
        ? "WARNING"
        : "CRITICAL";

    return {
      focus,
      attendance,
      streak,
      missedToday,
      entropy:
        entropy < 0
          ? 0
          : entropy,
      score:
        score < 0
          ? 0
          : score,
      label
    };
  }, [habits, dayIndex]);

  /* =====================================
     TIME CYCLE
  ===================================== */

  const cycle = (() => {
    const h =
      new Date().getHours();

    if (h < 5)
      return "Recovery Cycle";
    if (h < 12)
      return "Morning Prime";
    if (h < 17)
      return "Execution Window";
    if (h < 22)
      return "Reflection Phase";
    return "Shutdown Cycle";
  })();

  /* =====================================
     SAVE ENTRY
  ===================================== */

  const saveEntry =
    async () => {
      if (!text.trim())
        return;

      try {
        const payload = {
          text,
          mood,
          systemState: {
            ...metrics,
            cycle
          }
        };

        const res =
          await axios.post(
            "http://localhost:5000/api/journal",
            payload
          );

        setEntries(prev => [
          res.data,
          ...prev
        ]);

        setText("");
        setMood(null);
      } catch (err) {
        console.log(err);
      }
    };

  return (
    <div className="journal-page">
      <header className="journal-header">
        <h1>
          NEURAL
          <span>
            NOTEBOOK
          </span>
        </h1>

        <button
          className="back-btn"
          onClick={onBack}
        >
          ← Return
        </button>
      </header>

      <main className="journal-container">

        {/* TOP PANEL */}
        <section className="editor-card">

          <div className="system-pill">
            <span className="label">
              {metrics.label}
            </span>

            <span className="blue">
              🎯 Focus{" "}
              {metrics.focus}%
            </span>

            <span className="green">
              📊 Attendance{" "}
              {
                metrics.attendance
              }
              %
            </span>

            <span>
              ⚡ Score{" "}
              {metrics.score}
            </span>

            <span>
              🌪 Entropy{" "}
              {
                metrics.entropy
              }
            </span>

            <span>
              🔥 Streak{" "}
              {metrics.streak}
            </span>

            <span>
              ❌ Missed{" "}
              {
                metrics.missedToday
              }
            </span>

            <span>
              🕒 {cycle}
            </span>
          </div>

          {/* Mood */}
          <div className="mood-row">
            {[
              "🚀",
              "🙂",
              "😐",
              "😔",
              "😡",
              "😴"
            ].map(m => (
              <button
                key={m}
                className={`mood ${
                  mood === m
                    ? "active"
                    : ""
                }`}
                onClick={() =>
                  setMood(m)
                }
              >
                {m}
              </button>
            ))}
          </div>

          {/* textarea */}
          <textarea
            value={text}
            onChange={e =>
              setText(
                e.target.value
              )
            }
            placeholder="Write resistance, wins, distractions, thoughts, patterns..."
          />

          <button
            className="save-btn"
            onClick={saveEntry}
          >
            SAVE ENTRY
          </button>
        </section>

        {/* Entries */}
        {loading && (
          <p className="empty">
            Loading...
          </p>
        )}

        {!loading &&
          entries.length ===
            0 && (
            <p className="empty">
              No neural logs.
            </p>
          )}

        <section className="entries">
          {entries.map(e => (
            <div
              key={e._id}
              className="entry-card"
            >
              <div className="entry-top">
                <span>
                  {new Date(
                    e.createdAt
                  ).toLocaleDateString()}
                </span>

                <span>
                  {e.mood}
                </span>
              </div>

              <p className="entry-text">
                {e.text}
              </p>

              {e.systemState && (
                <div className="entry-stats">
                  <div>
                    🎯{" "}
                    {
                      e
                        .systemState
                        .focus
                    }
                    %
                  </div>

                  <div>
                    📊{" "}
                    {
                      e
                        .systemState
                        .attendance
                    }
                    %
                  </div>

                  <div>
                    🔥{" "}
                    {
                      e
                        .systemState
                        .streak
                    }
                  </div>

                  <div>
                    ⚡{" "}
                    {
                      e
                        .systemState
                        .score
                    }
                  </div>
                </div>
              )}
            </div>
          ))}
        </section>
      </main>
    </div>
  );
}