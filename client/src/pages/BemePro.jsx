import React, { useEffect, useMemo, useRef, useState, useCallback, useReducer } from "react";
import axios from "axios";
import "./BemePro.css";

/* =============================================
   BEME.PRO v4 - ULTRA PREMIUM HABIT SYSTEM
   iTunes-Powered Alarm System
============================================= */

const API_BASE = "http://localhost:5000/api/bemepro";

/* =========================
   DATE UTILITIES
========================= */
const getToday = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

const getMonth = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
};

const formatDateKey = (yearMonth, day) => {
  return `${yearMonth}-${String(day).padStart(2, "0")}`;
};

const getDaysInMonth = (yearMonth) => {
  const [year, month] = yearMonth.split("-").map(Number);
  return new Date(year, month, 0).getDate();
};

/* =========================
   DEBOUNCE HOOK
========================= */
function useDebounce(value, delay) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

/* =========================
   REDUCER FOR FORM STATE
========================= */
const formReducer = (state, action) => {
  switch (action.type) {
    case "UPDATE_FIELD":
      return { ...state, [action.field]: action.value };
    case "RESET":
      return {
        title: "",
        reason: "",
        alarmTime: "06:00",
        windowMinutes: 15,
        fromMonth: getMonth(),
        toMonth: getMonth(),
        musicPreviewUrl: "",
        musicTrackUrl: "",
        musicTitle: "",
        musicArtwork: "",
      };
    default:
      return state;
  }
};

export default function BemePro({ onExit }) {
  /* =========================
     CORE STATES
  ========================= */
  const [items, setItems] = useState([]);
  const [monthView, setMonthView] = useState(getMonth());
  const [showCreate, setShowCreate] = useState(false);
  const [alarmItem, setAlarmItem] = useState(null);
  const [journalItem, setJournalItem] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);

  // Alarm music state
  const [alarmPlaying, setAlarmPlaying] = useState(false);
  const alarmMusicRef = useRef(null);

  const [form, dispatchForm] = useReducer(formReducer, {
    title: "",
    reason: "",
    alarmTime: "06:00",
    windowMinutes: 15,
    fromMonth: getMonth(),
    toMonth: getMonth(),
    musicPreviewUrl: "",
    musicTrackUrl: "",
    musicTitle: "",
    musicArtwork: "",
  });

  const [journal, setJournal] = useState({ text: "", mood: 5 });

  // Music Search States
  const [musicSearch, setMusicSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [previewAudio, setPreviewAudio] = useState(null);

  const debouncedMusicSearch = useDebounce(musicSearch, 400);

  const today = getToday();
  const intervalRef = useRef(null);
  const ringingRef = useRef(false);

  /* =========================
     ALARM AUDIO ENGINE
  ========================= */
  const playAlarm = useCallback((item) => {
    if (alarmMusicRef.current) {
      alarmMusicRef.current.pause();
      alarmMusicRef.current = null;
    }

    const src = item?.musicUrl || "/alarm.mp3";
    const audio = new Audio(src);

    audio.volume = 0.92;
    audio.loop = true;

  audio.addEventListener("ended", () => {
    audio.currentTime = 0;
    audio.play().catch(() => {});
  });

    audio.play().then(() => {
      ringingRef.current = true;
      setAlarmPlaying(true);
    }).catch((err) => {
      console.warn("🔇 Autoplay blocked by browser:", err);
      ringingRef.current = true;
    });

    alarmMusicRef.current = audio;
  }, []);

  const stopAlarm = useCallback(() => {
    if (alarmMusicRef.current) {
      alarmMusicRef.current.pause();
      alarmMusicRef.current.currentTime = 0;
      alarmMusicRef.current = null;
    }
    ringingRef.current = false;
    setAlarmPlaying(false);
  }, []);

  const toggleAlarmMusic = useCallback(() => {
    if (!alarmMusicRef.current) return;
    if (alarmMusicRef.current.paused) {
      alarmMusicRef.current.play().catch(() => {});
      setAlarmPlaying(true);
    } else {
      alarmMusicRef.current.pause();
      setAlarmPlaying(false);
    }
  }, []);

  /* =========================
     MUSIC SEARCH - iTunes API
  ========================= */
  useEffect(() => {
    if (!debouncedMusicSearch || debouncedMusicSearch.length < 2) {
      setSearchResults([]);
      return;
    }

    const controller = new AbortController();
    setSearching(true);

    axios.get("https://itunes.apple.com/search", {
      params: { term: debouncedMusicSearch, media: "music", limit: 15 },
      signal: controller.signal,
    })
      .then((res) => {
        const results = res.data.results
          .filter((r) => r.previewUrl)
          .map((r) => ({
            name: `${r.trackName} — ${r.artistName}`,
            previewUrl: r.previewUrl,
            trackUrl: r.trackViewUrl,
            artwork: r.artworkUrl100?.replace("100x100", "200x200") || "",
          }));
        setSearchResults(results);
      })
      .catch((err) => {
        if (!axios.isCancel(err)) {
          console.error("Music search error:", err);
          setSearchResults([]);
        }
      })
      .finally(() => setSearching(false));

    return () => controller.abort();
  }, [debouncedMusicSearch]);

  const selectSong = (song) => {
    dispatchForm({ type: "UPDATE_FIELD", field: "musicPreviewUrl", value: song.previewUrl });
    dispatchForm({ type: "UPDATE_FIELD", field: "musicTrackUrl",   value: song.trackUrl });
    dispatchForm({ type: "UPDATE_FIELD", field: "musicTitle",      value: song.name });
    dispatchForm({ type: "UPDATE_FIELD", field: "musicArtwork",    value: song.artwork });

    if (previewAudio) previewAudio.pause();
    const audio = new Audio(song.previewUrl);
    audio.volume = 0.8;
    audio.play().catch(() => {});
    setPreviewAudio(audio);
  };

  const stopPreview = useCallback(() => {
    if (previewAudio) {
      previewAudio.pause();
      setPreviewAudio(null);
    }
  }, [previewAudio]);

  /* =========================
     API HELPERS
  ========================= */
  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`${API_BASE}/commitments`);
      setItems(res.data || []);
    } catch (err) {
      console.error("❌ Load error:", err);
      setError("Failed to load commitments. Check server.");
    } finally {
      setLoading(false);
    }
  }, []);

  const createCommitment = async () => {
    if (!form.title.trim()) {
      setError("Habit name is required");
      return;
    }
    setError(null);
    try {
      await axios.post(`${API_BASE}/commitments`, {
        title:        form.title,
        reason:       form.reason,
        alarmTime:    form.alarmTime,
        windowMinutes: Number(form.windowMinutes),
        musicUrl:     form.musicPreviewUrl,   // iTunes 30-sec preview URL
        musicTitle:   form.musicTitle,
        musicArtwork: form.musicArtwork,
      });

      setSuccessMessage("✅ Commitment created!");
      setShowCreate(false);
      stopPreview();
      dispatchForm({ type: "RESET" });
      setMusicSearch("");
      setSearchResults([]);
      loadData();
      setTimeout(() => setSuccessMessage(""), 2800);
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.error || "Failed to create commitment";
      setError(msg);
    }
  };

  const markPresentWithJournal = async () => {
    if (!journal.text.trim()) {
      setError("Please write a short reflection");
      return;
    }
    setError(null);
    try {
      await axios.post(`${API_BASE}/mark-present`, {
        commitmentId:   journalItem._id,
        reflectionText: journal.text,
        emotionScore:   Number(journal.mood),
      });
      setSuccessMessage("✅ Reflection saved!");
      setJournalItem(null);
      setJournal({ text: "", mood: 5 });
      loadData();
      setTimeout(() => setSuccessMessage(""), 2500);
    } catch (err) {
      console.error(err);
      setError("Failed to save reflection");
    }
  };

  const markAbsent = useCallback(async (id) => {
    try {
      await axios.post(`${API_BASE}/mark-absent`, { commitmentId: id });
      loadData();
    } catch (err) {
      console.error(err);
    }
  }, [loadData]);

  const removeItem = async (id) => {
    try {
      await axios.delete(`${API_BASE}/commitments/${id}`);
      setShowDeleteConfirm(null);
      loadData();
      setSuccessMessage("🗑️ Commitment deleted");
      setTimeout(() => setSuccessMessage(""), 2200);
    } catch (err) {
      console.error(err);
      setError("Failed to delete");
    }
  };

  /* =========================
     ALARM SYSTEM
     Checks every 20s; triggers iTunes preview as alarm sound
  ========================= */
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      const now = new Date();
      const currentMinutes = now.getHours() * 60 + now.getMinutes();

      items.forEach((item) => {
        // Skip if already logged today
        if (item.attendance?.[today]) return;

        const [hour, minute] = item.alarmTime.split(":").map(Number);
        const start = hour * 60 + minute;
        const end   = start + Number(item.windowMinutes || 15);

        // Fire alarm within window (only once — ringingRef guards it)
        if (currentMinutes >= start && currentMinutes < end && !ringingRef.current) {
          setAlarmItem(item);
          playAlarm(item);
        }

        // Auto-mark absent when window closes without a check-in
        if (currentMinutes >= end && !item.attendance?.[today]) {
          markAbsent(item._id);
        }
      });
    }, 20000);

    return () => clearInterval(intervalRef.current);
  }, [items, today, playAlarm, markAbsent]);

  /* =========================
     INITIAL LOAD
  ========================= */
  useEffect(() => {
    loadData();
  }, [loadData]);

  /* =========================
     CLEANUP ON UNMOUNT
  ========================= */
  useEffect(() => {
    return () => {
      stopAlarm();
      stopPreview();
    };
  }, [stopAlarm, stopPreview]);

  /* =========================
     STATS CALCULATION
     FIX: attendance values are objects { status, loggedAt, reflection }
     not plain strings, so we must read entry.status
  ========================= */
  const stats = useMemo(() => {
    let total = 0, present = 0, absent = 0;
    items.forEach((item) => {
      Object.values(item.attendance || {}).forEach((entry) => {
        total++;
        if (entry?.status === "present") present++;
        if (entry?.status === "absent")  absent++;
      });
    });
    return {
      total,
      present,
      absent,
      rate: total ? Math.round((present / total) * 100) : 0,
    };
  }, [items]);

  const daysInMonth = useMemo(() => getDaysInMonth(monthView), [monthView]);

  /* =========================
     KEYBOARD SHORTCUTS
  ========================= */
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        if (showCreate)         { setShowCreate(false); stopPreview(); }
        if (alarmItem)          { stopAlarm(); setAlarmItem(null); }
        if (journalItem)        setJournalItem(null);
        if (showDeleteConfirm)  setShowDeleteConfirm(null);
      }
      if (e.key.toLowerCase() === "n" && e.ctrlKey) {
        e.preventDefault();
        setShowCreate(true);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [showCreate, alarmItem, journalItem, showDeleteConfirm, stopAlarm, stopPreview]);

  /* =========================
     RENDER
  ========================= */
  return (
    <div className="bemepro-wrapper">
      {/* HEADER */}
      <header className="bemepro-header">
        <button
          className="bemepro-back"
          onClick={() => { stopAlarm(); stopPreview(); onExit(); }}
          aria-label="Exit BemePro"
        >
          ← EXIT
        </button>

        <div className="bemepro-brand">
          <h1>BEME<span>.PRO</span></h1>
          <p className="bemepro-tagline">DISCIPLINE THROUGH SYSTEMS</p>
        </div>

        <button className="bemepro-new" onClick={() => setShowCreate(true)} aria-label="New Commitment">
          + NEW HABIT
        </button>
      </header>

      {/* SUCCESS / ERROR BANNER */}
      {(successMessage || error) && (
        <div
          className="bemepro-panel"
          style={{
            background:   successMessage ? "#052e16" : "#450a0a",
            borderColor:  successMessage ? "#22c55e" : "#ef4444",
            marginBottom: "16px",
            padding:      "14px 20px",
            textAlign:    "center",
            fontWeight:   "700",
            cursor:       error ? "pointer" : "default",
          }}
          onClick={() => { if (error) setError(null); }}
        >
          {successMessage || error}
          {error && <span style={{ marginLeft: 12, opacity: 0.6, fontSize: "0.8rem" }}>click to dismiss</span>}
        </div>
      )}

      {/* STATS SECTION */}
      <section className="bemepro-stats">
        <div className="stat-card"><small>SUCCESS RATE</small><h2>{stats.rate}%</h2></div>
        <div className="stat-card"><small>PRESENT</small><h2>{stats.present}</h2></div>
        <div className="stat-card"><small>ABSENT</small><h2>{stats.absent}</h2></div>
        <div className="stat-card"><small>TOTAL LOGS</small><h2>{stats.total}</h2></div>
      </section>

      {/* MAIN PANEL */}
      <section className="bemepro-panel">
        <div className="panel-title">
          <h3>TIME ENFORCED HABITS • {monthView}</h3>
          <input
            type="month"
            value={monthView}
            onChange={(e) => setMonthView(e.target.value)}
            aria-label="Change month view"
          />
        </div>

        <div className="table-wrap">
          <table className="beme-table">
            <thead>
              <tr>
                <th style={{ minWidth: "260px" }}>HABIT</th>
                {Array.from({ length: daysInMonth }).map((_, i) => (
                  <th key={i} style={{ fontSize: "0.85rem" }}>{i + 1}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {items.length > 0 ? (
                items.map((item) => (
                  <tr key={item._id}>
                    <td className="col-habit">
                      <div>{item.title}</div>
                      <span className="habit-sub">
                        ⏰ {item.alarmTime} • {item.windowMinutes || 15}m window
                      </span>
                      {item.musicTitle && (
                        <span style={{ color: "#22d3ee", marginLeft: "10px" }}>
                          🎵 {item.musicTitle}
                        </span>
                      )}
                      {/* Streak badge */}
                      {item.currentStreak > 0 && (
                        <span style={{
                          marginLeft: "10px",
                          background: "linear-gradient(135deg,#ffd700,#ff6b00)",
                          color: "#000",
                          fontWeight: 900,
                          fontSize: "0.7rem",
                          padding: "2px 8px",
                          borderRadius: "20px",
                        }}>
                          🔥 {item.currentStreak}d streak
                        </span>
                      )}
                      <button className="mini-del" onClick={() => setShowDeleteConfirm(item._id)}>
                        Delete
                      </button>
                    </td>
                    {Array.from({ length: daysInMonth }).map((_, i) => {
                      const dateKey = formatDateKey(monthView, i + 1);
                      const entry   = item.attendance?.[dateKey];
                      const status  = entry?.status;
                      return (
                        <td key={i}>
                          {status === "present" && <div className="chip present">✓</div>}
                          {status === "absent"  && <div className="chip absent">✕</div>}
                          {!status              && <div className="chip pending" />}
                        </td>
                      );
                    })}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={daysInMonth + 1}>
                    <div className="empty-note">
                      No commitments yet.<br />
                      Press <strong>+ NEW HABIT</strong> to begin.
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {loading && <div className="empty-note">Loading your systems...</div>}
      </section>

      {/* ==========================================
          CREATE MODAL — iTunes Music Search
      ========================================== */}
      {showCreate && (
        <div className="bp-overlay">
          <div className="bp-form">
            <h2>New Time-Bound Commitment</h2>

            <label>Habit Name</label>
            <input
              placeholder="e.g. Morning Run"
              value={form.title}
              onChange={(e) => dispatchForm({ type: "UPDATE_FIELD", field: "title", value: e.target.value })}
            />

            <label>Why This Matters</label>
            <textarea
              placeholder="Deep reason that will push you even on hard days..."
              value={form.reason}
              onChange={(e) => dispatchForm({ type: "UPDATE_FIELD", field: "reason", value: e.target.value })}
            />

            <label>Alarm Time</label>
            <input
              type="time"
              value={form.alarmTime}
              onChange={(e) => dispatchForm({ type: "UPDATE_FIELD", field: "alarmTime", value: e.target.value })}
            />

            <label>Grace Window (minutes)</label>
            <input
              type="number"
              min="5"
              max="180"
              value={form.windowMinutes}
              onChange={(e) => dispatchForm({ type: "UPDATE_FIELD", field: "windowMinutes", value: e.target.value })}
            />

            <label>🎵 Alarm Song — Search iTunes</label>
            <input
              type="text"
              placeholder="Search song name or artist... (plays when alarm fires)"
              value={musicSearch}
              onChange={(e) => setMusicSearch(e.target.value)}
            />

            <div className="music-results">
              {searching && <p style={{ textAlign: "center", padding: "12px" }}>Searching iTunes...</p>}
              {!searching && searchResults.length === 0 && musicSearch.length >= 2 && (
                <p style={{ textAlign: "center", padding: "12px", color: "#71717a" }}>No results found.</p>
              )}
              {searchResults.map((song, i) => (
                <div
                  key={i}
                  className={`music-item ${form.musicTitle === song.name ? "selected" : ""}`}
                  onClick={() => selectSong(song)}
                >
                  {song.artwork && <img src={song.artwork} alt="cover" className="artwork" />}
                  <div className="music-info">
                    <strong>{song.name}</strong>
                    <small style={{ display: "block", marginTop: "4px", opacity: 0.6 }}>
                      Tap to preview · Will play as your alarm
                    </small>
                  </div>
                  <button
                    className="preview-btn"
                    onClick={(e) => { e.stopPropagation(); selectSong(song); }}
                    aria-label={`Preview ${song.name}`}
                  >
                    ▶ Preview
                  </button>
                </div>
              ))}
            </div>

            {form.musicTitle && (
              <div className="selected-song-banner">
                {form.musicArtwork && (
                  <img src={form.musicArtwork} alt="Selected" className="selected-artwork" />
                )}
                <div>
                  <p style={{ color: "#22d3ee", fontWeight: "700", margin: 0 }}>
                    🔔 Alarm song set
                  </p>
                  <p style={{ color: "#a1a1aa", fontSize: "0.82rem", margin: 0 }}>
                    {form.musicTitle}
                  </p>
                </div>
                <button
                  className="preview-btn"
                  onClick={stopPreview}
                  style={{ marginLeft: "auto" }}
                >
                  ■ Stop
                </button>
              </div>
            )}

            <div className="bp-form-btns">
              <button className="bp-cancel" onClick={() => { setShowCreate(false); stopPreview(); }}>
                CANCEL
              </button>
              <button className="bp-commit" onClick={createCommitment}>
                CREATE SYSTEM
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==========================================
          ALARM MODAL — iTunes song auto-plays
      ========================================== */}
      {alarmItem && (
        <div className="bp-overlay alarm-overlay">
          <div className="bp-form alarm-form">
            <div className="alarm-ring-container">
              <div className="alarm-ring" />
              <div className="alarm-ring alarm-ring--delay" />
              <span className="alarm-icon">⏰</span>
            </div>

            <h2 className="alarm-title">TIME TO ACT</h2>
            <h3 style={{ color: "#22ff88", marginBottom: "10px" }}>{alarmItem.title}</h3>

            {alarmItem.reason && (
              <p className="popup-text" style={{ marginBottom: "16px" }}>{alarmItem.reason}</p>
            )}

            {alarmItem.musicUrl && (
              <div className="alarm-music-bar">
                {alarmItem.musicArtwork && (
                  <img src={alarmItem.musicArtwork} alt="Album art" className="alarm-artwork" />
                )}
                <div className="alarm-music-info">
                  <p style={{ fontWeight: "700", margin: 0, fontSize: "0.9rem" }}>
                    {alarmItem.musicTitle || "Your alarm song"}
                  </p>
                  <p style={{ color: "#71717a", margin: 0, fontSize: "0.78rem" }}>
                    iTunes Preview
                  </p>
                </div>
                <button
                  className={`alarm-music-btn ${alarmPlaying ? "playing" : ""}`}
                  onClick={toggleAlarmMusic}
                  aria-label={alarmPlaying ? "Pause alarm music" : "Play alarm music"}
                >
                  {alarmPlaying ? "❚❚ PAUSE" : "▶ PLAY"}
                </button>
              </div>
            )}

            <div className="bp-form-btns" style={{ marginTop: "20px" }}>
              <button
                className="bp-cancel"
                onClick={async () => {
                  stopAlarm();
                  await markAbsent(alarmItem._id);
                  setAlarmItem(null);
                }}
              >
                ✕ FAILED
              </button>
              <button
                className="bp-commit"
                onClick={() => {
                  stopAlarm();
                  setJournalItem(alarmItem);
                  setAlarmItem(null);
                }}
              >
                ✅ I DID IT
              </button>
            </div>
          </div>
        </div>
      )}

      {/* JOURNAL MODAL */}
      {journalItem && (
        <div className="bp-overlay">
          <div className="bp-form">
            <h2>Reflection for Today</h2>
            <p style={{ marginBottom: "16px", color: "#a1a1aa" }}>{journalItem.title}</p>

            <textarea
              placeholder="How did it feel? What went well? What can improve?"
              value={journal.text}
              onChange={(e) => setJournal({ ...journal, text: e.target.value })}
            />

            <label>Mood • {journal.mood} / 10</label>
            <input
              type="range"
              min="1"
              max="10"
              value={journal.mood}
              onChange={(e) => setJournal({ ...journal, mood: Number(e.target.value) })}
            />

            <div className="bp-form-btns">
              <button className="bp-commit" onClick={markPresentWithJournal}>
                SAVE &amp; COMPLETE
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION */}
      {showDeleteConfirm && (
        <div className="bp-overlay">
          <div className="bp-form" style={{ maxWidth: "420px" }}>
            <h2>Delete Commitment?</h2>
            <p className="popup-text">This action cannot be undone. All history will be lost.</p>
            <div className="bp-form-btns">
              <button className="bp-cancel" onClick={() => setShowDeleteConfirm(null)}>CANCEL</button>
              <button
                className="bp-commit"
                style={{ background: "linear-gradient(135deg, #ef4444, #b91c1c)" }}
                onClick={() => removeItem(showDeleteConfirm)}
              >
                YES, DELETE
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FOOTER */}
      <div style={{ textAlign: "center", marginTop: "40px", color: "#52525b", fontSize: "0.75rem" }}>
        BemePro v4 • Built for unbreakable discipline
      </div>
    </div>
  );
}