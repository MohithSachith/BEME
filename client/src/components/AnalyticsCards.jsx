import React from "react";
import "./AnalyticsCards.css";

const AnalyticsCards = ({ analytics, month }) => {
  if (!analytics) return null;

  const {
    bestWeek,
    worstWeek,
    perfectDays,
    lazyDays,
    attendance,
    habitStats,
    mostDone,
    leastDone,
    average
  } = analytics;

  const longestStreak = Math.max(
    ...habitStats.map(h => h.streak),
    0
  );

  /* ---------- SAFE FORMATTERS ---------- */

  const formatWeek = week => {
    if (!week) return "—";
    return `${month}-${String(week.start).padStart(2, "0")} → ${month}-${String(
      week.end
    ).padStart(2, "0")}`;
  };

  return (
    <section className="analytics-wrapper">

      {/* TOP METRICS */}
      <div className="analytics-grid">
        <Metric title="🔥 Best Week" value={formatWeek(bestWeek)} />
        <Metric title="❄️ Worst Week" value={formatWeek(worstWeek)} />
        <Metric title="✅ Perfect Days" value={perfectDays} />
        <Metric title="😴 Lazy Days" value={lazyDays} />
        <Metric title="📊 Attendance" value={`${attendance}%`} />
        <Metric title="⏱ Longest Streak" value={`${longestStreak} days`} />
      </div>

      {/* HABIT TABLE */}
      <div className="analytics-card">
        <h4>Habit-wise Analysis</h4>
        <table>
          <thead>
            <tr>
              <th>Habit</th>
              <th>%</th>
              <th>Streak</th>
              <th>Lazy</th>
            </tr>
          </thead>
          <tbody>
            {habitStats.map(h => (
              <tr key={h.name}>
                <td>{h.name}</td>
                <td>{h.percent}%</td>
                <td>{h.streak}</td>
                <td>{h.lazy}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* INSIGHTS */}
      <div className="analytics-card insight">
        <p>🏆 <strong>Most Done:</strong> {mostDone?.name || "—"}</p>
        <p>⚠️ <strong>Least Done:</strong> {leastDone?.name || "—"}</p>
        <p>⚖️ <strong>Average Habit:</strong> {average?.name || "—"}</p>
        <p className="science">
          🧠 <strong>Insight:</strong> Consistency above <b>66%</b> stabilizes
          habit loops. Below this, entropy rises sharply.
        </p>
      </div>

    </section>
  );
};

/* ---------- METRIC BOX ---------- */
/* GUARANTEED: value is string | number only */

const Metric = ({ title, value }) => (
  <div className="metric-box">
    <span>{title}</span>
    <strong>{value}</strong>
  </div>
);

export default AnalyticsCards;
