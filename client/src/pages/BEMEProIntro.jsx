import React from "react";
import "./BEMEProIntro.css";

export default function BEMEProIntro({ onActivate, onBack }) {
  return (
    <div className="bemepro-wrapper">

      {/* HEADER */}
      <header className="bemepro-header">
        <button className="bemepro-back" onClick={onBack}>← Exit</button>
        <h1>BEME<span>.PRO</span></h1>
        <p className="bemepro-tagline">
          Commitment Mode · System Enforced
        </p>
      </header>

      {/* CORE MESSAGE */}
      <section className="bemepro-core">
        <h2>This is not habit tracking.</h2>
        <p>
          This is <strong>behavior enforcement</strong>.
          Once activated, habits are bound to time.
          Miss the alarm → system marks failure.
        </p>
      </section>

      {/* RULES */}
      <section className="bemepro-rules">
        <div className="rule">⏰ Alarm-bound habits only</div>
        <div className="rule">❌ No manual ticking</div>
        <div className="rule">⚠️ Miss = auto-fail</div>
        <div className="rule">📊 Analytics based on adherence</div>
      </section>

      {/* CTA */}
      <div className="bemepro-action">
        <button className="activate-btn" onClick={onActivate}>
          ACTIVATE COMMITMENT MODE
        </button>
      </div>

      {/* FOOTER NOTE */}
      <p className="bemepro-warning">
        This mode is strict by design.
      </p>

    </div>
  );
}
