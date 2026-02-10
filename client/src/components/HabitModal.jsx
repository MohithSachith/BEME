import React, { useState, useEffect } from "react";
import "./HabitModal.css";

/**
 * HabitModal
 * ----------
 * Used for BOTH:
 * 1) Add New Habit
 * 2) Edit Existing Habit
 *
 * This version ADDS BEME.PRO (4th column)
 * WITHOUT breaking existing features.
 */

const HabitModal = ({
  isOpen,
  onClose,
  onSave,
  onDelete,
  initialData = null
}) => {
  const [form, setForm] = useState({
    name: "",
    description: "",
    phase: "morning",
    icon: "📝",
    goal: "Once daily",

    // 🔒 BEME.PRO (4th Column)
    alarmBinding: {
      enabled: false,
      time: "",
      windowMinutes: 30,
      strict: true
    }
  });

  /* ---------- POPULATE ON EDIT ---------- */
  useEffect(() => {
    if (initialData) {
      setForm({
        name: initialData.name || "",
        description: initialData.description || "",
        phase: initialData.phase || "morning",
        icon: initialData.icon || "📝",
        goal: initialData.goal || "Once daily",

        alarmBinding: {
          enabled: initialData.alarmBinding?.enabled || false,
          time: initialData.alarmBinding?.time || "",
          windowMinutes:
            initialData.alarmBinding?.windowMinutes || 30,
          strict:
            initialData.alarmBinding?.strict ?? true
        }
      });
    }
  }, [initialData]);

  if (!isOpen) return null;

  const handleChange = (key, value) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (!form.name.trim()) return;
    onSave(form);
  };

  return (
    <div className="habit-modal-overlay">
      <div className="habit-modal-card animate-scale">

        {/* ---------- HEADER ---------- */}
        <div className="habit-modal-header">
          <h2>{initialData ? "Edit Habit" : "Add New Habit"}</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        {/* ---------- FORM ---------- */}
        <form className="habit-form" onSubmit={handleSubmit}>

          <label>Habit Name</label>
          <input
            type="text"
            placeholder="e.g. Drink water"
            value={form.name}
            onChange={e => handleChange("name", e.target.value)}
            required
          />

          <label>Description</label>
          <textarea
            placeholder="Optional description..."
            value={form.description}
            onChange={e =>
              handleChange("description", e.target.value)
            }
          />

          <div className="form-row">
            <div>
              <label>Icon</label>
              <select
                value={form.icon}
                onChange={e =>
                  handleChange("icon", e.target.value)
                }
              >
                <option>📝</option>
                <option>💧</option>
                <option>🏃</option>
                <option>📚</option>
                <option>💤</option>
                <option>🧠</option>
              </select>
            </div>

            <div>
              <label>Phase</label>
              <select
                value={form.phase}
                onChange={e =>
                  handleChange("phase", e.target.value)
                }
              >
                <option value="morning">☀️ Morning</option>
                <option value="afternoon">🌤️ Afternoon</option>
                <option value="night">🌙 Night</option>
              </select>
            </div>
          </div>

          <label>Goal</label>
          <select
            value={form.goal}
            onChange={e =>
              handleChange("goal", e.target.value)
            }
          >
            <option>Once daily</option>
            <option>Twice daily</option>
            <option>Weekly</option>
          </select>

          {/* ===============================
              BEME.PRO (4th COLUMN)
          ================================ */}
          <div className="beme-section">
            <h4>🔒 BEME.PRO Discipline</h4>

            <label className="toggle-row">
              <input
                type="checkbox"
                checked={form.alarmBinding.enabled}
                onChange={e =>
                  handleChange("alarmBinding", {
                    ...form.alarmBinding,
                    enabled: e.target.checked
                  })
                }
              />
              Enforce Alarm-Based Habit
            </label>

            {form.alarmBinding.enabled && (
              <>
                <label>Alarm Time</label>
                <input
                  type="time"
                  value={form.alarmBinding.time}
                  onChange={e =>
                    handleChange("alarmBinding", {
                      ...form.alarmBinding,
                      time: e.target.value
                    })
                  }
                />

                <label>Grace Window (minutes)</label>
                <input
                  type="number"
                  min="5"
                  max="120"
                  value={form.alarmBinding.windowMinutes}
                  onChange={e =>
                    handleChange("alarmBinding", {
                      ...form.alarmBinding,
                      windowMinutes: +e.target.value
                    })
                  }
                />

                <p className="beme-warning">
                  ❌ Not completed in window → auto-fail
                </p>
              </>
            )}
          </div>

          {/* ---------- FOOTER ---------- */}
          <div className="habit-modal-footer">
            {initialData && (
              <button
                type="button"
                className="btn-delete"
                onClick={onDelete}
              >
                🗑 Delete
              </button>
            )}

            <div className="footer-actions">
              <button
                type="button"
                className="btn-cancel"
                onClick={onClose}
              >
                Cancel
              </button>
              <button type="submit" className="btn-save">
                {initialData ? "Save Changes" : "Create Habit"}
              </button>
            </div>
          </div>

        </form>
      </div>
    </div>
  );
};

export default HabitModal;
