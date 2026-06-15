import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts";
import "./HabitPieChart.css";

const COLORS = [
  "#3b82f6",
  "#22c55e",
  "#facc15",
  "#ef4444",
  "#8b5cf6",
  "#06b6d4"
];

const HabitPieChart = ({ habitStats = [] }) => {
  const data = habitStats.map(h => ({
    name: h.name,
    value: Number(h.percent)
  }));

  return (
    <div className="pie-card">
      <h4>Habit Contribution</h4>

      <div className="pie-wrap">
        <ResponsiveContainer width="100%" height={280}>
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              outerRadius={95}
              innerRadius={52}
              paddingAngle={3}
            >
              {data.map((_, i) => (
                <Cell
                  key={i}
                  fill={
                    COLORS[i % COLORS.length]
                  }
                />
              ))}
            </Pie>

            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <small>
        Share of total monthly effort
      </small>
    </div>
  );
};

export default HabitPieChart;