import React from "react";
import { PieChart, Pie, Cell, Tooltip } from "recharts";

const COLORS = ["#6366f1", "#22c55e", "#facc15", "#ef4444", "#38bdf8"];

const HabitPieChart = ({ habitStats }) => {
  const data = habitStats.map(h => ({
    name: h.name,
    value: Number(h.percent)
  }));

  return (
    <div className="glass card">
      <h4>Habit Contribution</h4>
      <PieChart width={260} height={260}>
        <Pie data={data} dataKey="value" outerRadius={100}>
          {data.map((_, i) => (
            <Cell key={i} fill={COLORS[i % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
      <small>Share of monthly effort</small>
    </div>
  );
};

export default HabitPieChart;
