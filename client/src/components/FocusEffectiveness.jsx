// FocusEffectiveness.jsx
const FocusEffectiveness = ({ focus = [], completed = 0 }) => {
  const minutes = focus.reduce((a, b) => a + b.minutes, 0);

  const efficiency =
    minutes > 0 ? Math.round((completed / minutes) * 100) : 0;

  return (
    <div className="glass card premium-chart yellow-card focus-box">
      <div className="chart-head">
        <h4>🧠 Focus Efficiency</h4>
        <span>Deep Work Index</span>
      </div>

      <div className="focus-number">{efficiency}%</div>

      <small>
        Effort without distraction becomes output.
      </small>
    </div>
  );
};

export default FocusEffectiveness;