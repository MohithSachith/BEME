// HabitClusterChart.jsx
import React from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend
} from "recharts";

const HabitClusterChart = ({ habitStats }) => {
  const data = habitStats.map(h => ({
    name: h.name,
    streak: h.streak,
    lazy: h.lazy
  }));

  return (
    <div className="glass card premium-chart dual-card">
      <div className="chart-head">
        <h4>⚔ Habit Stability</h4>
        <span>Consistency vs Laziness</span>
      </div>

      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,.05)" />
          <XAxis dataKey="name" hide />
          <YAxis stroke="#64748b" />
          <Tooltip
            contentStyle={{
              background: "#0f172a",
              border: "1px solid #8b5cf6",
              borderRadius: "14px"
            }}
          />
          <Legend />
          <Bar dataKey="streak" fill="#22c55e" radius={[8,8,0,0]} />
          <Bar dataKey="lazy" fill="#ef4444" radius={[8,8,0,0]} />
        </BarChart>
      </ResponsiveContainer>

      <small>Strong streaks defeat weak impulses.</small>
    </div>
  );
};

export default HabitClusterChart;