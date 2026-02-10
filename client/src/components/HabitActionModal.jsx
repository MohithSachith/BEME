import React, { useEffect, useState } from "react";
import "./HabitActionModal.css";

const HabitActionModal = ({
  habit,
  windowMinutes,
  onComplete,
  onFail
}) => {
  const [secondsLeft, setSecondsLeft] = useState(windowMinutes * 60);

  useEffect(() => {
    const t = setInterval(() => {
      setSecondsLeft(s => s - 1);
    }, 1000);

    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (secondsLeft <= 0) {
      onFail();
    }
  }, [secondsLeft, onFail]);

  const mm = Math.floor(secondsLeft / 60);
  const ss = secondsLeft % 60;

  return (
    <div className="habit-action-overlay">
      <div className="habit-action-card">

        <h2>{habit.icon} {habit.name}</h2>
        <p className="habit-desc">{habit.description}</p>

        <div className="timer">
          ⏳ {mm}:{ss.toString().padStart(2, "0")}
        </div>

        <div className="actions">
          <button className="btn-start" onClick={onComplete}>
            ✅ I Did It
          </button>

          <button className="btn-fail" onClick={onFail}>
            ❌ Skip
          </button>
        </div>

        <p className="warning">
          Window closes automatically. No excuses.
        </p>
      </div>
    </div>
  );
};

export default HabitActionModal;
