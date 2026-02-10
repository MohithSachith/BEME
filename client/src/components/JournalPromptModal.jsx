import React, { useState } from "react";
import "./JournalPromptModal.css";

export default function JournalPromptModal({
  isOpen,
  habit,
  onSave,
  onSkip
}) {
  const [text, setText] = useState("");

  if (!isOpen || !habit) return null;

  const handleSave = () => {
    if (!text.trim()) return;

    onSave({
      habitId: habit._id,
      habitName: habit.name,
      content: text,
      createdAt: new Date().toISOString()
    });

    setText("");
  };

  return (
    <div className="journal-overlay">
      <div className="journal-card">
        <h2>🧠 Habit Reflection</h2>

        <p className="habit-title">
          {habit.icon} {habit.name}
        </p>

        <textarea
          placeholder="How did you feel after doing this habit?"
          value={text}
          onChange={e => setText(e.target.value)}
        />

        <div className="journal-actions">
          <button className="skip" onClick={onSkip}>Skip</button>
          <button className="save" onClick={handleSave}>Save</button>
        </div>
      </div>
    </div>
  );
}
