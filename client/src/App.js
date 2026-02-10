import React, {
  useEffect,
  useMemo,
  useState,
  useCallback
} from "react";
import axios from "axios";

/* ===== EXISTING PAGES ===== */
import LandingPage from "./LandingPage";
import Notebook from "./Notebook";
import Alarm from "./Alarm";
import Analytics from "./Analytics";

/* ===== BEME.PRO ===== */
import BemePro from "./pages/BemePro";
import BemeCreate from "./pages/BemeCreate";

/* ===== COMPONENTS ===== */
import HabitModal from "./components/HabitModal";

/* ===== CHART ===== */
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";

import "./App.css";

export default function App() {

  /* ================= VIEW ROUTER ================= */
  // landing | dashboard | notebook | alarm | analytics | bemepro | bemepro-create
  const [view, setView] = useState("landing");

  /* ================= DATE ================= */
  const now = new Date();
  const todayIndex = now.getDate() - 1;

  const [month, setMonth] = useState(
    `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`
  );

  const daysInMonth = useMemo(() => {
    const [y, m] = month.split("-");
    return new Date(y, m, 0).getDate();
  }, [month]);

  /* ================= DATA ================= */
  const [habits, setHabits] = useState([]);
  const [graphData, setGraphData] = useState([]);
  const [loading, setLoading] = useState(false);

  /* ================= MODAL ================= */
  const [modalOpen, setModalOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState(null);

  /* ================= FETCH ================= */
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `http://localhost:5000/api/habits/${month}`
      );

      setHabits(res.data?.habits || []);
      setGraphData(
        (res.data?.graphData || []).slice(0, daysInMonth)
      );
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, [month, daysInMonth]);

  useEffect(() => {
    if (view === "dashboard") {
      fetchData();
    }
  }, [fetchData, view]);

  /* ================= CELL TOGGLE ================= */
  async function toggleCell(habitId, dayIndex, current) {
    const next = (current + 1) % 3;
    await axios.patch("http://localhost:5000/api/habits/update", {
      habitId,
      dayIndex,
      status: next
    });
    fetchData();
  }

  /* ================= ADD / EDIT ================= */
  async function saveHabit(data) {
    if (editingHabit) {
      await axios.patch(
        "http://localhost:5000/api/habits/update",
        {
          habitId: editingHabit._id,
          updates: data
        }
      );
    } else {
      await axios.post(
        "http://localhost:5000/api/habits/add",
        {
          ...data,
          month
        }
      );
    }
    setModalOpen(false);
    setEditingHabit(null);
    fetchData();
  }

  async function deleteHabit() {
    await axios.delete(
      `http://localhost:5000/api/habits/delete/${editingHabit._id}`
    );
    setModalOpen(false);
    setEditingHabit(null);
    fetchData();
  }

  /* ================= LANDING ================= */
  if (view === "landing") {
    return <LandingPage onEnter={setView} />;
  }

  /* ================= NOTEBOOK ================= */
  if (view === "notebook") {
    return <Notebook onBack={() => setView("landing")} />;
  }

  /* ================= ALARM ================= */
  if (view === "alarm") {
    return (
      <Alarm
        onBack={() => setView("landing")}
        onAlarm={() => setView("bemepro")} // 🔥 IMPORTANT
      />
    );
  }

  /* ================= BEME.PRO ================= */
  if (view === "bemepro") {
    return (
      <BemePro
        onExit={() => setView("landing")}
        onCreate={() => setView("bemepro-create")}
      />
    );
  }

  if (view === "bemepro-create") {
    return (
      <BemeCreate
        onBack={() => setView("bemepro")}
      />
    );
  }

  /* ================= ANALYTICS ================= */
  if (view === "analytics") {
    return (
      <Analytics
        habits={habits}
        daysInMonth={daysInMonth}
        todayIndex={todayIndex}
        month={month}
        onExit={() => setView("dashboard")}
      />
    );
  }

  /* ================= DASHBOARD ================= */
  return (
    <div className={`app ${loading ? "blur" : ""}`}>

      {/* HEADER */}
      <header className="topbar">
        <button className="exit" onClick={() => setView("landing")}>
          ← EXIT
        </button>

        <div className="logo">
          BEME<span>.PRO</span>
        </div>

        <div className="actions">
          <input
            type="month"
            value={month}
            onChange={e => setMonth(e.target.value)}
          />

          <button
            className="ghost"
            onClick={() => setView("analytics")}
          >
            GOD MODE
          </button>

          <button
            className="primary"
            onClick={() => {
              setEditingHabit(null);
              setModalOpen(true);
            }}
          >
            + New Habit
          </button>

          {/* 🔒 BEME.PRO ENTRY */}
          <button
            className="danger"
            onClick={() => setView("bemepro")}
          >
            BEME.PRO
          </button>
        </div>
      </header>

      {/* CONSISTENCY FLOW */}
      <section className="card">
        <h3>Consistency Flow</h3>

        <ResponsiveContainer width="100%" height={260}>
          <AreaChart data={graphData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="day" />
            <YAxis domain={[0, 100]} />
            <Tooltip />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#6366f1"
              strokeWidth={3}
              fillOpacity={0.3}
              fill="#6366f1"
            />
          </AreaChart>
        </ResponsiveContainer>
      </section>

      {/* HABIT MATRIX */}
      <section className="card">
        <table>
          <thead>
            <tr>
              <th>Habit</th>
              {[...Array(daysInMonth)].map((_, i) => (
                <th key={i}>{i + 1}</th>
              ))}
            </tr>
          </thead>

          <tbody>
            {habits.map(h => (
              <tr key={h._id} className={`phase-${h.phase}`}>
                <td
                  className="habit-name"
                  onClick={() => {
                    setEditingHabit(h);
                    setModalOpen(true);
                  }}
                >
                  {h.name}
                </td>

                {h.entries.slice(0, daysInMonth).map((v, i) => (
                  <td key={i}>
                    <button
                      className={`cell s${v}`}
                      onClick={() => toggleCell(h._id, i, v)}
                    >
                      {v === 1 ? "✓" : v === 2 ? "✕" : ""}
                    </button>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* HABIT MODAL */}
      <HabitModal
        isOpen={modalOpen}
        initialData={editingHabit}
        onClose={() => {
          setModalOpen(false);
          setEditingHabit(null);
        }}
        onSave={saveHabit}
        onDelete={deleteHabit}
      />
    </div>
  );
}
