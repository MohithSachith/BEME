const FocusEffectiveness = ({ focus = [], completed = 0 }) => {
  const minutes = focus.reduce((a, b) => a + b.minutes, 0);

  const efficiency =
    minutes > 0 ? Math.round((completed / minutes) * 100) : 0;

  return (
    <div className="glass card">
      <h4>Focus Efficiency</h4>
      <strong>{efficiency}%</strong>
      <small>Completion per focus minute</small>
    </div>
  );
};

export default FocusEffectiveness;
