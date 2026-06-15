// DailyTrendChart.jsx
import React from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from "recharts";

const DailyTrendChart = ({ completionRates }) => {
  const data = completionRates.map((v, i) => ({
    day: i + 1,
    value: v
  }));

  return (
    <div className="glass card premium-chart green-card">
      <div className="chart-head">
        <h4>📈 Daily Consistency Trend</h4>
        <span>Discipline Curve</span>
      </div>

      <ResponsiveContainer width="100%" height={260}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,.06)" />
          <XAxis dataKey="day" stroke="#64748b" />
          <YAxis stroke="#64748b" />
          <Tooltip
            contentStyle={{
              background: "#0f172a",
              border: "1px solid #22c55e",
              borderRadius: "14px",
              color: "#fff"
            }}
          />
          <Line
            type="monotone"
            dataKey="value"
            stroke="#22c55e"
            strokeWidth={4}
            dot={{ r: 4, fill: "#22c55e" }}
            activeDot={{ r: 7 }}
          />
        </LineChart>
      </ResponsiveContainer>

      <small>Every day matters. Momentum compounds.</small>
    </div>
  );
};

export default DailyTrendChart;