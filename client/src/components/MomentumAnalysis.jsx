import React from "react";
import "./MomentumAnalysis.css";

const MomentumAnalysis = ({ data = [] }) => {
  const last7 = data.slice(-7);
  const prev7 = data.slice(-14, -7);

  const avg = arr =>
    arr.reduce((a, b) => a + b, 0) /
    (arr.length || 1);

  const momentum =
    avg(last7) - avg(prev7);

  const state =
    momentum > 0
      ? "up"
      : momentum < 0
      ? "down"
      : "stable";

  return (
    <div
      className={`momentum-card ${state}`}
    >
      {/* Header */}
      <div className="momentum-top">
        <h4>🚀 Momentum</h4>
        <span>
          Performance Drift
        </span>
      </div>

      {/* Main Status */}
      <div
        className={`momentum-status ${state}`}
      >
        {momentum > 0
          ? "↗ Improving"
          : momentum < 0
          ? "↘ Declining"
          : "→ Stable"}
      </div>

      {/* Score */}
      <div className="momentum-score">
        {momentum > 0 && "+"}
        {momentum.toFixed(1)}
      </div>

      {/* Footer */}
      <small>
        Last 7 days vs previous 7 days
      </small>

      <p className="momentum-quote">
        Motion repeated becomes
        identity.
      </p>
    </div>
  );
};

export default MomentumAnalysis;