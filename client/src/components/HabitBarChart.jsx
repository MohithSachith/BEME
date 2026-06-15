// HabitBarChart.jsx
import React from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from "recharts";

const HabitBarChart = ({ habitStats }) => {
  const data = habitStats.map(h => ({
    name: h.name,
    percent: Number(h.percent)
  }));

  return (
    <div className="glass card premium-chart blue-card">
      <div className="chart-head">
        <h4>🔥 Habit Performance</h4>
        <span>Execution Score</span>
      </div>

      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,.05)" />
          <XAxis dataKey="name" stroke="#64748b" hide />
          <YAxis stroke="#64748b" />
          <Tooltip
            contentStyle={{
              background: "#0f172a",
              border: "1px solid #3b82f6",
              borderRadius: "14px"
            }}
          />
          <Bar
            dataKey="percent"
            fill="#3b82f6"
            radius={[10, 10, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>

      <small>Winning habits are measurable habits.</small>
    </div>
  );
};

export default HabitBarChart;