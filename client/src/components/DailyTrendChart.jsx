import React from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip } from "recharts";

const DailyTrendChart = ({ completionRates }) => {
  const data = completionRates.map((v, i) => ({
    day: i + 1,
    value: v
  }));

  return (
    <div className="glass card">
      <h4>Daily Consistency Trend</h4>
      <LineChart width={320} height={240} data={data}>
        <XAxis dataKey="day" />
        <YAxis />
        <Tooltip />
        <Line
          type="monotone"
          dataKey="value"
          stroke="#22c55e"
          strokeWidth={3}
        />
      </LineChart>
      <small>Day-by-day discipline</small>
    </div>
  );
};

export default DailyTrendChart;
