import React, { useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  BarChart,
  Bar
} from "recharts";
import "./SecondaryGraphs.css";

export default function SecondaryGraphs({
  habitStats = [],
  habits = [],
  daysInMonth = 30,
  month = ""
}) {

  /* ---------------- DAILY AGGREGATION ---------------- */
  const daily = useMemo(() => {
    if (!Array.isArray(habits) || habits.length === 0) {
      return Array(daysInMonth).fill(0);
    }

    const arr = Array(daysInMonth).fill(0);

    habits.forEach(h => {
      if (!Array.isArray(h.entries)) return;
      h.entries.slice(0, daysInMonth).forEach((v, i) => {
        if (v === 1) arr[i]++;
      });
    });

    return arr;
  }, [habits, daysInMonth]);

  /* ---------------- BEST / WORST CONTINUOUS WEEK ---------------- */
  const weekStats = useMemo(() => {
    if (!daily.length) {
      return {
        bestLabel: "-",
        worstLabel: "-"
      };
    }

    let best = { sum: -1, start: 0 };
    let worst = { sum: Infinity, start: 0 };

    for (let i = 0; i <= daily.length - 7; i++) {
      const sum = daily.slice(i, i + 7).reduce((a, b) => a + b, 0);
      if (sum > best.sum) best = { sum, start: i };
      if (sum < worst.sum) worst = { sum, start: i };
    }

    const toDate = d =>
      `${month}-${String(d + 1).padStart(2, "0")}`;

    return {
      bestLabel: `${toDate(best.start)} → ${toDate(best.start + 6)}`,
      worstLabel: `${toDate(worst.start)} → ${toDate(worst.start + 6)}`
    };
  }, [daily, month]);

  /* ---------------- STREAK CURVE ---------------- */
  const streakCurve = useMemo(() => {
    let streak = 0;
    return daily.map((v, i) => {
      streak = v > 0 ? streak + 1 : 0;
      return { day: i + 1, streak };
    });
  }, [daily]);

  /* ---------------- MOMENTUM ---------------- */
  const momentum = useMemo(() => {
    return daily.map((v, i) => ({
      day: i + 1,
      momentum: i === 0 ? v : v - daily[i - 1]
    }));
  }, [daily]);

  /* ---------------- ENTROPY ---------------- */
  const entropy = useMemo(() => {
    return daily.map((v, i) => ({
      day: i + 1,
      entropy: habits.length - v
    }));
  }, [daily, habits.length]);

  /* ---------------- EMPTY GUARD (AFTER HOOKS) ---------------- */
  if (!Array.isArray(habits) || habits.length === 0) {
    return null;
  }

  /* ---------------- UI ---------------- */
  return (
    <section className="secondary-section">

      {/* WEEK SUMMARY */}
      <div className="week-summary">
        <div>
          <h4>🏆 Best Week</h4>
          <p>{weekStats.bestLabel}</p>
        </div>
        <div>
          <h4>⚠️ Worst Week</h4>
          <p>{weekStats.worstLabel}</p>
        </div>
      </div>

      {/* STREAK */}
      <Graph title="Streak Curve">
        <LineChart data={streakCurve}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="day" />
          <YAxis />
          <Tooltip />
          <Line dataKey="streak" stroke="#22c55e" strokeWidth={3} />
        </LineChart>
      </Graph>

      {/* MOMENTUM */}
      <Graph title="Habit Momentum">
        <BarChart data={momentum}>
          <XAxis dataKey="day" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="momentum" fill="#6366f1" />
        </BarChart>
      </Graph>

      {/* ENTROPY */}
      <Graph title="Behavioral Entropy">
        <LineChart data={entropy}>
          <XAxis dataKey="day" />
          <YAxis />
          <Tooltip />
          <Line dataKey="entropy" stroke="#ef4444" strokeWidth={2} />
        </LineChart>
      </Graph>

    </section>
  );
}

/* ---------------- GRAPH WRAPPER ---------------- */
function Graph({ title, children }) {
  return (
    <div className="secondary-card">
      <h4>{title}</h4>
      <ResponsiveContainer width="100%" height={240}>
        {children}
      </ResponsiveContainer>
    </div>
  );
}
