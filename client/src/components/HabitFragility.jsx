import React from "react";
import "./HabitFragility.css";

const HabitFragility = ({ habits = [] }) => {
  const fragile = habits.filter(
    h => h.missed >= 3
  );

  const severity =
    fragile.length === 0
      ? "safe"
      : fragile.length <= 2
      ? "warn"
      : "danger";

  return (
    <div
      className={`fragility-card ${severity}`}
    >
      {/* Header */}
      <div className="fragility-top">
        <h4>⚠ Habit Fragility</h4>
        <span>
          Risk Detection Layer
        </span>
      </div>

      {/* Main Number */}
      <div
        className={`fragility-number ${severity}`}
      >
        {fragile.length}
      </div>

      {/* Text */}
      <small className="fragility-text">
        {fragile.length
          ? fragile
              .slice(0, 3)
              .map(h => h.name)
              .join(", ")
          : "All habits stable"}
      </small>

      {/* Footer */}
      <p className="fragility-quote">
        Discipline ignored becomes
        weakness repeated.
      </p>
    </div>
  );
};

export default HabitFragility;