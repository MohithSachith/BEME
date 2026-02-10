const express = require('express');
const router = express.Router();
const Habit = require('../models/Habit');

/* ======================================================
   GET HABITS + GRAPH DATA (CALENDAR CONTROLLED)
====================================================== */
router.get('/:month', async (req, res) => {
  try {
    const habits = await Habit.find({ month: req.params.month });

    const [year, month] = req.params.month.split('-');
    const daysInMonth = new Date(year, month, 0).getDate();

    const graphData = [];

    for (let i = 0; i < daysInMonth; i++) {
      let ticks = 0;
      habits.forEach(h => {
        if (h.entries[i] === 1) ticks++;
      });

      graphData.push({
        day: i + 1,
        value: habits.length
          ? Math.round((ticks / habits.length) * 100)
          : 0
      });
    }

    res.json({ habits, graphData });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* ======================================================
   TOGGLE HABIT CELL (✓ ✕ ⬜)
====================================================== */
router.patch('/update', async (req, res) => {
  const { habitId, dayIndex, status } = req.body;

  try {
    const habit = await Habit.findById(habitId);
    habit.entries[dayIndex] = status;
    await habit.save();
    res.json(habit);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

/* ======================================================
   ADD NEW HABIT
====================================================== */
router.post('/add', async (req, res) => {
  try {
    const habit = new Habit({
      name: req.body.name,
      description: req.body.description || '',
      icon: req.body.icon || '📝',
      goal: req.body.goal || 'Once daily',
      month: req.body.month,
      phase: req.body.phase || 'morning'
    });

    const newHabit = await habit.save();
    res.status(201).json(newHabit);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

/* ======================================================
   EDIT HABIT (MODAL SAVE FIX)
====================================================== */
router.patch('/edit', async (req, res) => {
  const { id, name, phase, icon, goal, description } = req.body;

  try {
    const habit = await Habit.findById(id);
    if (!habit) return res.status(404).json({ message: 'Habit not found' });

    habit.name = name;
    habit.phase = phase;
    habit.icon = icon;
    habit.goal = goal;
    habit.description = description;

    await habit.save();
    res.json(habit);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* ======================================================
   DELETE HABIT
====================================================== */
router.delete('/delete/:id', async (req, res) => {
  try {
    await Habit.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
