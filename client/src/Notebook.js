import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Notebook.css";

export default function Notebook({ onBack }) {
  const [text, setText] = useState("");
  const [entries, setEntries] = useState([]);
  const [mood, setMood] = useState(null);
  const [loading, setLoading] = useState(true);

  /* ===== SYSTEM SNAPSHOT (safe default) ===== */
  const systemState = {
    label: "STABLE",
    focus: 42,
    attendance: 61,
    missedHabits: 4,
    cycle: new Date().getHours() >= 21 ? "Night Cycle" : "Day Cycle"
  };

  /* ===== LOAD JOURNAL ===== */
  useEffect(() => {
    const load = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/journal");
        setEntries(res.data || []);
      } catch (e) {
        console.error("Journal load failed", e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  /* ===== SAVE ENTRY ===== */
  const saveEntry = async () => {
    if (!text.trim()) return;

    try {
      const res = await axios.post("http://localhost:5000/api/journal", {
        text,
        mood,
        systemState
      });

      setEntries(prev => [res.data, ...prev]);
      setText("");
      setMood(null);
    } catch (e) {
      console.error("Save failed", e);
    }
  };

  return (
    <div className="journal-page">

      {/* ===== HEADER ===== */}
      <header className="journal-header">
        <h1>NEURAL NOTEBOOK</h1>
        <button className="back-btn" onClick={onBack}>← Back</button>
      </header>

      <main className="journal-container">

        {/* ===== EDITOR ===== */}
        <section className="editor-card">

          {/* SYSTEM STATUS */}
          <div className="system-pill">
            <span className="label">{systemState.label}</span>
            <span>Focus {systemState.focus}%</span>
            <span>Attendance {systemState.attendance}%</span>
            <span>{systemState.missedHabits} habits missed</span>
            <span>{systemState.cycle}</span>
          </div>

          {/* MOOD */}
          <div className="mood-row">
            {["🙂", "😐", "😔", "😡", "😴"].map(m => (
              <button
                key={m}
                className={`mood ${mood === m ? "active" : ""}`}
                onClick={() => setMood(m)}
              >
                {m}
              </button>
            ))}
          </div>

          {/* TEXT */}
          <textarea
            placeholder="What did the system feel like today?"
            value={text}
            onChange={e => setText(e.target.value)}
          />

          <button className="save-btn" onClick={saveEntry}>
            SAVE ENTRY
          </button>
        </section>

        {/* ===== ENTRIES ===== */}
        {loading && <p className="empty">Loading journal…</p>}

        {!loading && entries.length === 0 && (
          <p className="empty">No neural logs yet.</p>
        )}

        <section className="entries">
          {entries.map(e => (
            <article key={e._id} className="entry-card">

              <div className="entry-top">
                <span className="date">
                  {new Date(e.createdAt).toLocaleDateString()}
                </span>
                <span className="time">
                  {new Date(e.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit"
                  })}
                </span>
                {e.mood && <span className="entry-mood">{e.mood}</span>}
              </div>

              <p className="entry-text">{e.text}</p>

              {e.systemState && (
                <div className="entry-stats">
                  <div>🎯 Focus: {e.systemState.focus}%</div>
                  <div>📊 Attendance: {e.systemState.attendance}%</div>
                  <div>❌ Missed: {e.systemState.missedHabits}</div>
                  <div>🕒 {e.systemState.cycle}</div>
                </div>
              )}

            </article>
          ))}
        </section>

      </main>
    </div>
  );
}
