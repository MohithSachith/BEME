import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../utils/axios";

export default function BemePro() {
  const navigate = useNavigate();

  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reflection, setReflection] = useState("");
  const [emotion, setEmotion] = useState(5);
  const [, forceTick] = useState(0); // for live timer refresh

  // fetch active task
  const fetchActiveTask = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/bemepro/active");
      setTask(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActiveTask();
  }, []);

  // 🔁 refresh UI every second (timer update)
  useEffect(() => {
    const interval = setInterval(() => {
      forceTick((t) => t + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // complete task
  const completeTask = async () => {
    try {
      await axios.post(`/api/bemepro/${task._id}/complete`);
      fetchActiveTask();
    } catch (err) {
      alert(err.response?.data?.message || "Cannot complete");
    }
  };

  // save journal
  const saveJournal = async () => {
    try {
      await axios.post("/api/bemepro/journal", {
        taskId: task._id,
        reflectionText: reflection,
        emotionScore: emotion,
      });
      alert("Saved & Locked");
      fetchActiveTask();
    } catch (err) {
      alert("Journal save failed");
    }
  };

  if (loading) return <p>Loading...</p>;

  // 🟦 NO TASK
  if (!task) {
    return (
      <div className="beme">
        <h2>BEME.PRO</h2>
        <p>No active discipline task</p>
        <button onClick={() => navigate("/bemepro/create")}>
          Create Task
        </button>
      </div>
    );
  }

  // 🟥 FAILED
  if (task.status === "failed") {
    return (
      <div className="beme">
        <h2>FAILED</h2>
        <p>You missed the discipline window.</p>
      </div>
    );
  }

  // 🟩 COMPLETED → REFLECTION
  if (task.status === "completed") {
    return (
      <div className="beme">
        <h2>COMPLETED</h2>

        <textarea
          placeholder="How did you feel after doing this?"
          value={reflection}
          onChange={(e) => setReflection(e.target.value)}
        />

        <label>Emotion Score: {emotion}</label>
        <input
          type="range"
          min="1"
          max="10"
          value={emotion}
          onChange={(e) => setEmotion(e.target.value)}
        />

        <button onClick={saveJournal}>Save & Lock</button>
      </div>
    );
  }

  // 🔥 DO NOW / WAITING
  const now = new Date();
  const start = new Date(task.startTime);
  const end = new Date(task.endTime);
  const isActive = now >= start && now <= end;

  const remainingMs = end - now;
  const remainingMin = Math.max(0, Math.floor(remainingMs / 60000));
  const remainingSec = Math.max(0, Math.floor((remainingMs % 60000) / 1000));

  return (
    <div className="beme">
      <h2>{isActive ? "DO NOW" : "WAITING"}</h2>

      <p><b>{task.title}</b></p>
      <p>
        {start.toLocaleTimeString()} – {end.toLocaleTimeString()}
      </p>

      {isActive && (
        <p>
          ⏳ Time left: {remainingMin}m {remainingSec}s
        </p>
      )}

      {isActive ? (
        <button onClick={completeTask}>COMPLETE</button>
      ) : (
        <p>Waiting for alarm…</p>
      )}
    </div>
  );
}
