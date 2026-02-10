import { useState } from "react";
import axios from "../utils/axios";
import { useNavigate } from "react-router-dom";

export default function BemeCreate() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [reason, setReason] = useState("");
  const [startTime, setStartTime] = useState("");
  const [windowMinutes, setWindowMinutes] = useState(30);
  const [difficulty, setDifficulty] = useState("medium");
  const [loading, setLoading] = useState(false);

  const submitTask = async () => {
    if (!title || !reason || !startTime || !windowMinutes) {
      alert("All fields required");
      return;
    }

    try {
      setLoading(true);

      await axios.post("/api/bemepro", {
        title,
        reason,
        startTime,
        windowMinutes,
        difficulty,
      });

      navigate("/bemepro");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to create task");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="beme-create">
      <h2>Commit to Discipline</h2>

      <label>Task Name</label>
      <input
        type="text"
        placeholder="What must be done"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <label>Why must I do this?</label>
      <textarea
        placeholder="Psychological commitment"
        value={reason}
        onChange={(e) => setReason(e.target.value)}
      />

      <label>Start Time</label>
      <input
        type="datetime-local"
        value={startTime}
        onChange={(e) => setStartTime(e.target.value)}
      />

      <label>Window (minutes)</label>
      <input
        type="number"
        min="10"
        value={windowMinutes}
        onChange={(e) => setWindowMinutes(e.target.value)}
      />

      <label>Difficulty</label>
      <select
        value={difficulty}
        onChange={(e) => setDifficulty(e.target.value)}
      >
        <option value="easy">Easy</option>
        <option value="medium">Medium</option>
        <option value="hard">Hard</option>
      </select>

      <button disabled={loading} onClick={submitTask}>
        {loading ? "Committing..." : "COMMIT"}
      </button>
    </div>
  );
}
