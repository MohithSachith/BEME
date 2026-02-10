import React from 'react';
import './BehaviorEngineRow.css';

/**
 * BehaviorEngineRow
 * ------------------
 * Read-only intelligence layer.
 * Displays system judgement & predictive pressure.
 */
const BehaviorEngineRow = ({ engine }) => {
  // Safe fallback
  if (!engine) {
    return (
      <div className="engine-row glass">
        <div className="engine-card neutral">
          <h4>SYSTEM ENGINE</h4>
          <p>Initializing intelligence layer…</p>
          <small>Awaiting system data</small>
        </div>
      </div>
    );
  }

  const {
    temporalStatus = 'EVALUATING',
    gravity = 0,
    unstableHabits = [],
    consequences = [],
    memoryReplay = null,
    gravityTrend = 'stable' // ↑ ↓ → (optional future input)
  } = engine;

  /* ---------- SYSTEM SEVERITY ---------- */
  const systemSeverity =
    temporalStatus === 'BROKEN' || gravity > 75
      ? 'danger'
      : temporalStatus === 'FRAGMENTED' || gravity > 45
      ? 'warn'
      : 'ok';

  return (
    <div className={`engine-row glass severity-${systemSeverity}`}>

      {/* SYSTEM STATUS BAR */}
      <div className="engine-system-banner">
        <span className={`dot ${systemSeverity}`} />
        <strong>SYSTEM STATE:</strong>
        <span className={`state ${systemSeverity}`}>
          {systemSeverity === 'ok'
            ? 'STABLE'
            : systemSeverity === 'warn'
            ? 'UNDER LOAD'
            : 'CRITICAL'}
        </span>
      </div>

      {/* TEMPORAL PROOF */}
      <div className="engine-card">
        <h4>TEMPORAL PROOF</h4>
        <strong className={
          temporalStatus === 'VERIFIED'
            ? 'ok'
            : temporalStatus === 'BROKEN'
            ? 'danger'
            : 'warn'
        }>
          {temporalStatus}
        </strong>
        <small>Today’s integrity check</small>
      </div>

      {/* BEHAVIORAL GRAVITY */}
      <div className="engine-card">
        <h4>BEHAVIORAL GRAVITY</h4>
        <strong className={
          gravity > 70 ? 'danger' : gravity > 40 ? 'warn' : 'ok'
        }>
          {gravity}/100 {gravityTrend === 'up' ? '↑' : gravityTrend === 'down' ? '↓' : '→'}
        </strong>
        <small>Accumulated behavioral pressure</small>
      </div>

      {/* HABIT ENTROPY */}
      <div className="engine-card">
        <h4>HABIT ENTROPY</h4>
        <strong className={unstableHabits.length ? 'warn' : 'ok'}>
          {unstableHabits.length}
        </strong>
        <small>
          {unstableHabits.length
            ? unstableHabits.slice(0, 2).join(', ') +
              (unstableHabits.length > 2 ? ' +' : '')
            : 'All paths stable'}
        </small>
      </div>

      {/* DELAYED CONSEQUENCE */}
      <div className="engine-card">
        <h4>DELAYED IMPACT</h4>
        <strong className={consequences.length ? 'warn' : 'ok'}>
          {consequences.length}
        </strong>
        <small>
          {consequences.length
            ? 'Future difficulty adjusted'
            : 'No scheduled impact'}
        </small>
      </div>

      {/* SYSTEM MEMORY */}
      <div className="engine-card">
        <h4>SYSTEM MEMORY</h4>
        <p className="memory-text">
          {memoryReplay
            ? `"${memoryReplay}"`
            : 'No comparable past pattern'}
        </p>
        <small>Historical correlation</small>
      </div>

    </div>
  );
};

export default BehaviorEngineRow;
