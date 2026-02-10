const MomentumAnalysis = ({ data = [] }) => {
  const last7 = data.slice(-7);
  const prev7 = data.slice(-14, -7);

  const avg = arr => arr.reduce((a, b) => a + b, 0) / (arr.length || 1);

  const momentum = avg(last7) - avg(prev7);

  return (
    <div className="glass card">
      <h4>Momentum</h4>
      <strong className={momentum > 0 ? 'ok' : momentum < 0 ? 'danger' : 'warn'}>
        {momentum > 0 ? '↗ Improving' : momentum < 0 ? '↘ Declining' : '→ Stable'}
      </strong>
      <small>7-day behavioral trend</small>
    </div>
  );
};

export default MomentumAnalysis;
