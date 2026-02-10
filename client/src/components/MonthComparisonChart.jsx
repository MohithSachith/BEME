import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";

export default function MonthComparisonChart({ current, previous }) {
  if (!current || !previous) return null;

  const data = [
    {
      metric: "Attendance %",
      Current: current.attendance,
      Previous: previous.attendance
    },
    {
      metric: "Avg Completion %",
      Current: current.avgCompletion,
      Previous: previous.avgCompletion
    },
    {
      metric: "Perfect Days",
      Current: current.perfectDays,
      Previous: previous.perfectDays
    },
    {
      metric: "Lazy Days",
      Current: current.lazyDays,
      Previous: previous.lazyDays
    }
  ];

  return (
    <section className="card">
      <h3>Month to Month Comparison</h3>

      <ResponsiveContainer width="100%" height={320}>
        <BarChart data={data}>
          <XAxis dataKey="metric" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="Previous" fill="#64748b" />
          <Bar dataKey="Current" fill="#6366f1" />
        </BarChart>
      </ResponsiveContainer>
    </section>
  );
}
