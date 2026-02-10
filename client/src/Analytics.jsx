import React, { useMemo, useEffect, useState } from "react";
import axios from "axios";
import "./Analytics.css";

/* CORE COMPONENTS */
import HeatmapCalendar from "./components/HeatmapCalendar";
import AnalyticsCards from "./components/AnalyticsCards";
import SecondaryGraphs from "./components/SecondaryGraphs";

/* INTELLIGENCE BLOCKS */
import MomentumAnalysis from "./components/MomentumAnalysis";
import TimePerformance from "./components/TimePerformance";
import HabitFragility from "./components/HabitFragility";
import FocusEffectiveness from "./components/FocusEffectiveness";
import WeeklyComparison from "./components/WeeklyComparison";

/* VISUAL ANALYTICS */
import HabitPieChart from "./components/HabitPieChart";
import HabitBarChart from "./components/HabitBarChart";
import DailyTrendChart from "./components/DailyTrendChart";
import HabitClusterChart from "./components/HabitClusterChart";

/* HUMAN SYSTEM */
import HumanFillProgress from "./components/HumanFillProgress";

/* MONTH COMPARISON */
import MonthComparisonChart from "./components/MonthComparisonChart";

/* ---------------- HELPER ---------------- */
function calculateMonthStats(habits, daysInMonth) {
  if (!habits.length) return null;

  const daily = Array(daysInMonth).fill(0);
  let perfectDays = 0;
  let lazyDays = 0;
  let totalDone = 0;

  habits.forEach(h => {
    h.entries.slice(0, daysInMonth).forEach((v, i) => {
      if (v === 1) {
        daily[i]++;
        totalDone++;
      }
    });
  });

  daily.forEach(v => {
    if (v === habits.length) perfectDays++;
    if (v === 0) lazyDays++;
  });

  return {
    attendance: Math.round(
      (totalDone / (habits.length * daysInMonth)) * 100
    ),
    avgCompletion: Math.round(
      daily.reduce((a, b) => a + b, 0) / daysInMonth
    ),
    perfectDays,
    lazyDays
  };
}

/* ---------------- COMPONENT ---------------- */
export default function Analytics({
  habits = [],
  daysInMonth,
  month,
  onExit
}) {
  const [prevStats, setPrevStats] = useState(null);

  /* ---------- CURRENT MONTH ANALYTICS ---------- */
  const analytics = useMemo(() => {
    if (!habits.length) return null;

    const daily = Array(daysInMonth).fill(0);
    let perfectDays = 0;
    let lazyDays = 0;

    const habitStats = habits.map(h => {
      const entries = h.entries.slice(0, daysInMonth);

      let done = 0, lazy = 0, streak = 0, bestStreak = 0;

      entries.forEach((v, i) => {
        if (v === 1) {
          done++;
          streak++;
          bestStreak = Math.max(bestStreak, streak);
          daily[i]++;
        } else {
          lazy++;
          streak = 0;
        }
      });

      return {
        name: h.name,
        percent: Math.round((done / daysInMonth) * 100),
        streak: bestStreak,
        lazy
      };
    });

    daily.forEach(v => {
      if (v === habits.length) perfectDays++;
      if (v === 0) lazyDays++;
    });

    const attendance = Math.round(
      (daily.reduce((a, b) => a + b, 0) /
        (habits.length * daysInMonth)) * 100
    );

    const completionRates = daily.map(v =>
      Math.round((v / habits.length) * 100)
    );

    /* WEEKLY ANALYSIS */
    const weeks = [];
    for (let i = 0; i <= daily.length - 7; i++) {
      const slice = daily.slice(i, i + 7);
      const completed = slice.reduce((a, b) => a + b, 0);
      weeks.push({
        start: i + 1,
        end: i + 7,
        percent: Math.round(
          (completed / (7 * habits.length)) * 100
        )
      });
    }

    const bestWeek = weeks.reduce((a, b) =>
      b.percent > a.percent ? b : a
    );

    const worstWeek = weeks.reduce((a, b) =>
      b.percent < a.percent ? b : a
    );

    const sorted = [...habitStats].sort((a, b) => b.percent - a.percent);

    return {
      daily,
      completionRates,
      perfectDays,
      lazyDays,
      attendance,
      habitStats,
      bestWeek,
      worstWeek,
      mostDone: sorted[0],
      leastDone: sorted.at(-1),
      average: sorted[Math.floor(sorted.length / 2)]
    };
  }, [habits, daysInMonth]);

  /* ---------- PREVIOUS MONTH FETCH ---------- */
  useEffect(() => {
    const fetchPreviousMonth = async () => {
      const [y, m] = month.split("-");
      const prevDate = new Date(y, m - 2, 1);

      const prevMonth = `${prevDate.getFullYear()}-${String(
        prevDate.getMonth() + 1
      ).padStart(2, "0")}`;

      const prevDays = new Date(
        prevDate.getFullYear(),
        prevDate.getMonth() + 1,
        0
      ).getDate();

      try {
        const res = await axios.get(
          `http://localhost:5000/api/habits/${prevMonth}`
        );

        setPrevStats(
          calculateMonthStats(res.data?.habits || [], prevDays)
        );
      } catch {
        setPrevStats(null);
      }
    };

    fetchPreviousMonth();
  }, [month]);

  if (!analytics) {
    return <div className="analytics-page"><h2>No data</h2></div>;
  }

  return (
    <div className="analytics-page">

      {/* HEADER */}
      <header className="analytics-header">
        <button className="exit-btn" onClick={onExit}>← BACK</button>
        <h2>GOD MODE ANALYTICS</h2>
        <span className="month-label">{month}</span>
      </header>

      {/* HUMAN SYSTEM */}
      <section className="analytics-section">
        <HumanFillProgress
          data={{ overall: analytics.attendance }}
        />
      </section>

      {/* OVERVIEW */}
      <AnalyticsCards analytics={analytics} month={month} />

      {/* MONTH COMPARISON */}
      {prevStats && (
        <MonthComparisonChart
          current={calculateMonthStats(habits, daysInMonth)}
          previous={prevStats}
        />
      )}

      {/* INTELLIGENCE */}
      <section className="analytics-section">
        <MomentumAnalysis data={analytics.completionRates} />
        <WeeklyComparison
          thisWeek={analytics.bestWeek.percent}
          lastWeek={analytics.worstWeek.percent}
        />
        <HabitFragility habits={analytics.habitStats} />
        <TimePerformance logs={[]} />
        <FocusEffectiveness completed={analytics.perfectDays} />
      </section>

      {/* VISUALS */}
      <section className="analytics-section">
        <HabitPieChart habitStats={analytics.habitStats} />
        <HabitBarChart habitStats={analytics.habitStats} />
        <DailyTrendChart completionRates={analytics.completionRates} />
        <HabitClusterChart habitStats={analytics.habitStats} />
      </section>

      {/* HEATMAP */}
      <HeatmapCalendar
        habits={habits}
        daysInMonth={daysInMonth}
      />

      {/* SECONDARY */}
      <SecondaryGraphs
        habits={habits}
        habitStats={analytics.habitStats}
        daysInMonth={daysInMonth}
        month={month}
      />
    </div>
  );
}