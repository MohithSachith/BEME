import React from "react";
import "./HumanBodyProgress.css";

/* COLOR LOGIC */
const getFill = (percent) => {
  if (percent >= 75) return "#22c55e"; // green
  if (percent >= 40) return "#facc15"; // yellow
  return "#ef4444"; // red
};

const HumanBodyProgress = ({ bodyStats = {} }) => {
  return (
    <div className="human-body-wrapper glass card">
      <h4>Habit Body Progress</h4>

      <div className="body-container">

        {/* LEFT HABITS */}
        <div className="body-label left">
          <span>🧠 Study</span>
          <span>💪 Exercise</span>
          <span>💧 Water</span>
        </div>

        {/* BODY SVG */}
        <svg
          viewBox="0 0 200 420"
          className="human-svg"
        >
          {/* SHADOW SILHOUETTE */}
          <g fill="#0f172a">
            <circle cx="100" cy="40" r="28" />
            <rect x="70" y="70" width="60" height="110" rx="30" />
            <rect x="35" y="85" width="25" height="95" rx="12" />
            <rect x="140" y="85" width="25" height="95" rx="12" />
            <rect x="75" y="190" width="20" height="120" rx="10" />
            <rect x="105" y="190" width="20" height="120" rx="10" />
          </g>

          {/* INNER FILL (HABIT PROGRESS) */}
          <circle
            cx="100"
            cy="40"
            r="22"
            fill={getFill(bodyStats.head || 0)}
          />

          <rect
            x="75"
            y="75"
            width="50"
            height="95"
            rx="25"
            fill={getFill(bodyStats.torso || 0)}
          />

          <rect
            x="38"
            y="90"
            width="19"
            height="85"
            rx="10"
            fill={getFill(bodyStats.arms || 0)}
          />
          <rect
            x="143"
            y="90"
            width="19"
            height="85"
            rx="10"
            fill={getFill(bodyStats.arms || 0)}
          />

          <rect
            x="78"
            y="195"
            width="14"
            height="110"
            rx="8"
            fill={getFill(bodyStats.legs || 0)}
          />
          <rect
            x="108"
            y="195"
            width="14"
            height="110"
            rx="8"
            fill={getFill(bodyStats.legs || 0)}
          />
        </svg>

        {/* RIGHT HABITS */}
        <div className="body-label right">
          <span>🛌 Sleep</span>
          <span>🍎 Food</span>
          <span>❤️ Mental</span>
        </div>

      </div>

      <small className="body-note">
        Body fills as habits improve — incomplete habits weaken the system
      </small>
    </div>
  );
};

export default HumanBodyProgress;
