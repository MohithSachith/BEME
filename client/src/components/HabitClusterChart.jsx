import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";

const HabitClusterChart = ({ habitStats }) => {
  const data = habitStats.map(h => ({
    name: h.name,
    streak: h.streak,
    lazy: h.lazy
  }));

  return (
    <div className="glass card">
      <h4>Habit Stability Comparison</h4>
      <BarChart width={340} height={240} data={data}>
        <XAxis dataKey="name" hide />
        <YAxis />
        <Tooltip />
        <Bar dataKey="streak" fill="#22c55e" />
        <Bar dataKey="lazy" fill="#ef4444" />
      </BarChart>
      <small>Streak vs Laziness</small>
    </div>
  );
};

export default HabitClusterChart;
