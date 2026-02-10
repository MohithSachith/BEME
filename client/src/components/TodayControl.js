import React from 'react';

const TodayControl = ({ 
  habits, todayIndex, handleToggle, alarmTime, 
  isAlarmSet, quickNote, setQuickNote, isUnifiedMode 
}) => {
  // logic to find the core habit for the terminal view
  const criticalHabit = habits.find(h => h.isCore) || habits[0];

  return (
    <aside className={`today-control-center ${isUnifiedMode ? 'unified-prome' : ''}`}>
      <div className="command-header">proME // {isUnifiedMode ? 'UNIFIED EXECUTION' : 'CONTROL'}</div>

      <section className="exec-section">
        <div className="section-tag">⏰ 01 // TEMPORAL SIGNAL</div>
        <div className="exec-card glass">
          <div className="exec-time">{alarmTime || "06:00"} AM</div>
          <div className={`status-pill ${isAlarmSet ? 'pending' : 'none'}`}>
            {isAlarmSet ? 'SIGNAL LIVE' : 'NO SIGNAL'}
          </div>
        </div>
      </section>

      <section className="exec-section">
        <div className="section-tag">🔴 02 // BEHAVIORAL VERDICT</div>
        <div className="exec-card highlight">
          <h3 className="exec-habit-title">{criticalHabit?.name || "Target: Wake Up"}</h3>
          <div className="exec-button-group">
            <button className="btn-done" onClick={() => handleToggle(criticalHabit._id, todayIndex, 1)}>✅ DONE</button>
            <button className="btn-fail" onClick={() => handleToggle(criticalHabit._id, todayIndex, 2)}>❌ FAIL</button>
          </div>
        </div>
      </section>

      <section className="exec-section">
        <div className="section-tag">📝 03 // NEURAL FRICTION LOG</div>
        <div className="exec-card glass">
          <textarea 
            className="mini-log-input" 
            placeholder="Describe the friction..."
            value={quickNote}
            onChange={(e) => setQuickNote(e.target.value)}
          />
        </div>
      </section>
    </aside>
  );
};

// CRITICAL: Must be default export
export default TodayControl;