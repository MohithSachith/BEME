import React, { useState, useEffect } from "react";
import "./Alarm.css";

const Alarm = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState("alarm");
  const [currentTime, setCurrentTime] = useState(new Date());

  /* ---------- ALARM ---------- */
  const [alarmTime, setAlarmTime] = useState("");
  const [isAlarmSet, setIsAlarmSet] = useState(false);
  const [isRinging, setIsRinging] = useState(false);

  /* ---------- STOPWATCH ---------- */
  const [stopwatchTime, setStopwatchTime] = useState(0);
  const [isStopwatchActive, setIsStopwatchActive] = useState(false);
  const [laps, setLaps] = useState([]);

  /* ---------- POMODORO ---------- */
  const focusTiers = {
    SPRINT: 25 * 60,
    DEEP: 90 * 60,
    BURST: 10 * 60
  };
  const [pomoTime, setPomoTime] = useState(focusTiers.SPRINT);
  const [isPomoActive, setIsPomoActive] = useState(false);

  /* ---------- CLOCK ---------- */
  useEffect(() => {
    const t = setInterval(() => {
      const now = new Date();
      setCurrentTime(now);

      if (isAlarmSet && alarmTime) {
        const [h, m] = alarmTime.split(":");
        if (
          now.getHours() === +h &&
          now.getMinutes() === +m &&
          now.getSeconds() === 0
        ) {
          triggerAlarm();
        }
      }
    }, 1000);
    return () => clearInterval(t);
  }, [isAlarmSet, alarmTime]);

  /* ---------- STOPWATCH TICK ---------- */
  useEffect(() => {
    let interval;
    if (isStopwatchActive) {
      interval = setInterval(() => {
        setStopwatchTime(t => t + 10);
      }, 10);
    }
    return () => clearInterval(interval);
  }, [isStopwatchActive]);

  /* ---------- POMODORO TICK ---------- */
  useEffect(() => {
    let interval;
    if (isPomoActive && pomoTime > 0) {
      interval = setInterval(() => setPomoTime(t => t - 1), 1000);
    }
    if (pomoTime === 0 && isPomoActive) {
      triggerAlarm();
      setIsPomoActive(false);
    }
    return () => clearInterval(interval);
  }, [isPomoActive, pomoTime]);

  /* ---------- HELPERS ---------- */
  const triggerAlarm = () => {
    setIsRinging(true);
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    osc.frequency.value = 440;
    osc.connect(ctx.destination);
    osc.start();
    setTimeout(() => {
      osc.stop();
      setIsRinging(false);
    }, 8000);
  };

  const resetStopwatch = () => {
    setIsStopwatchActive(false);
    setStopwatchTime(0);
    setLaps([]);
  };

  const formatStopwatch = ms => {
    const m = Math.floor(ms / 60000);
    const s = Math.floor((ms % 60000) / 1000);
    const c = Math.floor((ms % 1000) / 10);
    return `${m.toString().padStart(2, "0")}:${s
      .toString()
      .padStart(2, "0")}.${c.toString().padStart(2, "0")}`;
  };

  return (
    <div className={`alarm-container ${isRinging ? "ringing" : ""}`}>
      <header className="alarm-header">
        <button className="exit-btn" onClick={onBack}>← EXIT</button>
        <div className="tabs">
          {["alarm", "pomodoro", "stopwatch"].map(t => (
            <button
              key={t}
              className={activeTab === t ? "active" : ""}
              onClick={() => setActiveTab(t)}
            >
              {t.toUpperCase()}
            </button>
          ))}
        </div>
      </header>

      <div className="alarm-body">

        {/* ALARM */}
        {activeTab === "alarm" && (
          <>
            <h1 className="big-time">
              {currentTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </h1>
            <input
              type="time"
              value={alarmTime}
              onChange={e => setAlarmTime(e.target.value)}
            />
            <button
              className={isAlarmSet ? "btn stop" : "btn start"}
              onClick={() => setIsAlarmSet(!isAlarmSet)}
            >
              {isAlarmSet ? "STOP ALARM" : "SET ALARM"}
            </button>
          </>
        )}

        {/* POMODORO */}
        {activeTab === "pomodoro" && (
          <>
            <div className="tier-row">
              {Object.keys(focusTiers).map(k => (
                <button
                  key={k}
                  className={pomoTime === focusTiers[k] ? "active" : ""}
                  onClick={() => {
                    setIsPomoActive(false);
                    setPomoTime(focusTiers[k]);
                  }}
                >
                  {k}
                </button>
              ))}
            </div>
            <h1 className="big-time">
              {Math.floor(pomoTime / 60)}:{(pomoTime % 60).toString().padStart(2, "0")}
            </h1>
            <button className="btn start" onClick={() => setIsPomoActive(!isPomoActive)}>
              {isPomoActive ? "PAUSE" : "START"}
            </button>
          </>
        )}

        {/* STOPWATCH */}
        {activeTab === "stopwatch" && (
          <>
            <h1 className="big-time">{formatStopwatch(stopwatchTime)}</h1>
            <div className="controls">
              <button className="btn start" onClick={() => setIsStopwatchActive(!isStopwatchActive)}>
                {isStopwatchActive ? "STOP" : "START"}
              </button>
              <button className="btn lap" disabled={!isStopwatchActive} onClick={() => setLaps([stopwatchTime, ...laps])}>
                LAP
              </button>
              <button className="btn stop" onClick={resetStopwatch}>RESET</button>
            </div>

            <div className="laps">
              {laps.map((l, i) => (
                <div key={i} className="lap">
                  LAP {laps.length - i}: {formatStopwatch(l)}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Alarm;
