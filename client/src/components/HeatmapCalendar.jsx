import React, { useMemo } from "react";
import "./HeatmapCalendar.css";

export default function HeatmapCalendar({ habits = [], daysInMonth }) {
  const heatmapData = useMemo(() => {
    if (!habits.length) return [];

    return Array.from({ length: daysInMonth }).map((_, day) => {
      let done = 0;
      let total = habits.length;

      habits.forEach(h => {
        const v = h.entries?.[day] ?? 0;
        if (v === 1) done++;
      });

      const percent = total ? Math.round((done / total) * 100) : 0;

      return { day: day + 1, percent };
    });
  }, [habits, daysInMonth]);

  function getLevel(p) {
    if (p === 0) return "lvl0";
    if (p <= 25) return "lvl1";
    if (p <= 50) return "lvl2";
    if (p <= 75) return "lvl3";
    return "lvl4";
  }

  return (
    <div className="heatmap-wrapper">
      <h3 className="heatmap-title">Consistency Heatmap</h3>

      <div className="heatmap-grid">
        {heatmapData.map(d => (
          <div
            key={d.day}
            className={`heatmap-cell ${getLevel(d.percent)}`}
            title={`Day ${d.day} • ${d.percent}%`}
          >
            <span>{d.day}</span>
          </div>
        ))}
      </div>

      <div className="heatmap-legend">
        <span>Less</span>
        <div className="box lvl0" />
        <div className="box lvl1" />
        <div className="box lvl2" />
        <div className="box lvl3" />
        <div className="box lvl4" />
        <span>More</span>
      </div>
    </div>
  );
}
