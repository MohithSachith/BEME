import React, { useEffect, useState } from "react";
import "./HumanFillProgress.css";

const HumanFillProgress = ({
  data = {
    overall: 0,
    legs: 0,
    core: 0,
    chest: 0,
    head: 0,
    previous: null
  }
}) => {
  const [level, setLevel] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => setLevel(data.overall), 300);
    return () => clearTimeout(t);
  }, [data.overall]);

  const H = 500;
  const fillHeight = (H * level) / 100;
  const glow = level >= 70;

  return (
    <div className={`human-fill-wrapper ${glow ? "glow" : ""}`}>

      <h4 className="human-title">SYSTEM BODY STATUS</h4>

      <div className="human-compare">

        {/* CURRENT BODY */}
        <HumanBody
          label="Current"
          fillHeight={fillHeight}
          segments={data}
        />

        {/* PREVIOUS BODY */}
        {typeof data.previous === "number" && (
  <HumanBody
    label="Previous"
    fillHeight={(H * data.previous) / 100}
    faded
  />
)}

      </div>

      <p className="human-score">{level}% Overall Integrity</p>
    </div>
  );
};

export default HumanFillProgress;

/* ================= SUB COMPONENT ================= */

const HumanBody = ({ fillHeight, segments, faded }) => {
  return (
    <svg
      className={`human-svg ${faded ? "faded" : ""}`}
      viewBox="0 0 300 500"
    >
      <defs>
        {/* COLOR ZONES */}
        <linearGradient id="liquid-gradient" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor="#dc2626" />
          <stop offset="35%" stopColor="#facc15" />
          <stop offset="70%" stopColor="#22c55e" />
        </linearGradient>

        {/* BODY CLIP */}
        <clipPath id="male-clip">
          <path
            id="male-body"
            d="
              M150 20
              C132 20 120 32 120 48
              C120 64 132 78 150 78
              C168 78 180 64 180 48
              C180 32 168 20 150 20
              Z
              M95 90
              C75 120 70 160 72 220
              L78 360
              C82 420 95 460 110 480
              L135 480
              L135 330
              L165 330
              L165 480
              L190 480
              C205 460 218 420 222 360
              L228 220
              C230 160 225 120 205 90
              C195 80 105 80 95 90
              Z
            "
          />
        </clipPath>
      </defs>

      {/* LIQUID */}
      <rect
        x="0"
        y={500 - fillHeight}
        width="300"
        height={fillHeight}
        fill="url(#liquid-gradient)"
        clipPath="url(#male-clip)"
        className="human-liquid wave"
      />

      {/* OUTLINE */}
      <use
        href="#male-body"
        fill="none"
        stroke="rgba(199,210,254,0.9)"
        strokeWidth="2"
      />
    </svg>
  );
};
