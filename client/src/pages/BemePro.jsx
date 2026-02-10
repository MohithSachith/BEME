import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../utils/axios";
import { stopBemeAlarm } from "../utils/bemeAlarm";
import "../styles/beme.css";

export default function BemePro() {
  const navigate = useNavigate();

  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reflection, setReflection] = useState("");
  const [emotion, setEmotion] = useState(5);
  const [, forceTick] = useState(0); // for live timer

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

  // live timer refresh
  useEffect(() => {
    const i = setInterval(() => forceTick(t => t + 1), 1000);
    return () => clearInterval(i);
  }, []);

  // stop alarm if failed
  useEffect(() => {
    if (task?.status === "failed") {
      stopBemeAlarm();
    }
  }, [task]);

  const completeTask = async () => {
    try {
      await axios.post(`/api/bemepro/${task._id}/complete`);
      stopBemeAlarm();
      fetchActiveTask();
    } catch (err) {
      alert(err.response?.data?.message || "Cannot complete");
    }
  };

  const saveJournal = async () => {
    try {
      await axios.post("/api/bemepro/journal", {
        taskId: task._id,
        reflectionText: reflection,
        emotionScore: emotion,
      });
      alert("Saved & Locked");
      fetchActiveTask();
    } catch {
      alert("Journal save failed");
    }
  };

  if (loading) return <div className="beme">Loading...</div>;

  // 🟦 NO TASK
  if (!task) {
    return (
      <div className="beme">
        <h1>BEME.PRO</h1>
        <p>No active discipline task</p>
        <button onClick={() => navigate("/bemepro/create")}>
          COMMIT TO TASK
        </button>
      </div>
    );
  }

  // 🟥 FAILED
  if (task.status === "failed") {
    return (
      <div className="beme failed">
        <h1>FAILED</h1>
        <p>You missed the discipline window.</p>
      </div>
    );
  }

  // 🟩 COMPLETED
  if (task.status === "completed") {
    return (
      <div className="beme completed">
        <h1>COMPLETED</h1>

        <textarea
          placeholder="How did you feel after doing this?"
          value={reflection}
          onChange={(e) => setReflection(e.target.value)}
        />

        <label>Emotion: {emotion}/10</label>
        <input
          type="range"
          min="1"
          max="10"
          value={emotion}
          onChange={(e) => setEmotion(e.target.value)}
        />

        <button onClick={saveJournal}>SAVE & LOCK</button>
      </div>
    );
  }

  // 🔥 DO NOW / WAITING
  const now = new Date();
  const start = new Date(task.startTime);
  const end = new Date(task.endTime);
  const isActive = now >= start && now <= end;

  const remainingMs = end - now;
  const min = Math.max(0, Math.floor(remainingMs / 60000));
  const sec = Math.max(0, Math.floor((remainingMs % 60000) / 1000));

  return (
    <div className="beme">
      <h1>{isActive ? "DO NOW" : "WAITING"}</h1>

      <h2>{task.title}</h2>
      <p className="time">
        {start.toLocaleTimeString()} – {end.toLocaleTimeString()}
      </p>

      {isActive && (
        <p className="countdown">
          ⏳ {min}m {sec}s remaining
        </p>
      )}

      {isActive ? (
        <button className="danger" onClick={completeTask}>
          COMPLETE
        </button>
      ) : (
        <p>Waiting for alarm…</p>
      )}
    </div>
  );
}
