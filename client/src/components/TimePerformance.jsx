const TimePerformance = ({ logs = [] }) => {
  const buckets = { morning: 0, afternoon: 0, night: 0 };

  logs.forEach(l => {
    if (l.hour < 12) buckets.morning++;
    else if (l.hour < 18) buckets.afternoon++;
    else buckets.night++;
  });

  const best = Object.keys(buckets).reduce((a, b) =>
    buckets[a] > buckets[b] ? a : b
  );

  return (
    <div className="glass card">
      <h4>Best Performance Time</h4>
      <strong>{best.toUpperCase()}</strong>
      <small>Highest success window</small>
    </div>
  );
};

export default TimePerformance;
