const WeeklyComparison = ({ thisWeek = 0, lastWeek = 0 }) => {
  const diff = thisWeek - lastWeek;

  return (
    <div className="glass card">
      <h4>Weekly Change</h4>
      <strong className={diff >= 0 ? 'ok' : 'danger'}>
        {diff >= 0 ? `+${diff}` : diff}%
      </strong>
      <small>Compared to last week</small>
    </div>
  );
};

export default WeeklyComparison;
