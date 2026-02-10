import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";

const HabitBarChart = ({ habitStats }) => {
  const data = habitStats.map(h => ({
    name: h.name,
    percent: Number(h.percent)
  }));

  return (
    <div className="glass card">
      <h4>Habit Performance</h4>
      <BarChart width={320} height={240} data={data}>
        <XAxis dataKey="name" hide />
        <YAxis />
        <Tooltip />
        <Bar dataKey="percent" fill="#6366f1" />
      </BarChart>
      <small>Completion % by habit</small>
    </div>
  );
};

export default HabitBarChart;
