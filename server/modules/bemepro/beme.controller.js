const BemeTask = require("./beme.model");
const BemeJournal = require("./bemeJournal.model");

// CREATE BEME.PRO TASK
exports.createTask = async (req, res) => {
  try {
    const { title, reason, startTime, windowMinutes, difficulty } = req.body;

    if (!title || !reason || !startTime || !windowMinutes) {
      return res.status(400).json({ message: "All fields required" });
    }

    const start = new Date(startTime);
    const end = new Date(start.getTime() + windowMinutes * 60000 - 5 * 60000);

    const task = await BemeTask.create({
      userId: req.user.id,
      title,
      reason,
      startTime: start,
      endTime: end,
      windowMinutes,
      difficulty,
    });

    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET ACTIVE TASK (AUTO FAIL CHECK)
exports.getActiveTask = async (req, res) => {
  try {
    const task = await BemeTask.findOne({
      userId: req.user.id,
      status: "pending",
    });

    if (!task) return res.json(null);

    if (new Date() > task.endTime) {
      task.status = "failed";
      await task.save();
    }

    res.json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// COMPLETE TASK (STRICT)
exports.completeTask = async (req, res) => {
  try {
    const task = await BemeTask.findById(req.params.id);

    if (!task) return res.status(404).json({ message: "Task not found" });
    if (task.userId.toString() !== req.user.id)
      return res.status(403).json({ message: "Unauthorized" });

    const now = new Date();

    if (now < task.startTime || now > task.endTime) {
      return res.status(400).json({ message: "Outside time window" });
    }

    if (task.status !== "pending") {
      return res.status(400).json({ message: "Task already locked" });
    }

    task.status = "completed";
    task.completedAt = now;
    await task.save();

    res.json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// SAVE JOURNAL (ONLY AFTER COMPLETION)
exports.saveJournal = async (req, res) => {
  try {
    const { taskId, reflectionText, emotionScore } = req.body;

    const task = await BemeTask.findById(taskId);
    if (!task || task.status !== "completed") {
      return res.status(400).json({ message: "Task not completed" });
    }

    const journal = await BemeJournal.create({
      taskId,
      reflectionText,
      emotionScore,
    });

    res.status(201).json(journal);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
