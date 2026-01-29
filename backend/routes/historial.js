const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const HistoryEntry = require('../models/Historial');

// GET
router.get('/', async (req, res) => {
  try {
    const { taskId } = req.query;
    const filter = {};
    if (taskId && mongoose.isValidObjectId(taskId)) {
      filter.taskId = taskId;
    }
    const history = await HistoryEntry.find(filter).sort({ timestamp: -1 }).limit(100);
    res.json(history.map(h => h.toJSON()));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST
router.post('/', async (req, res) => {
  try {
    const { taskId, userId, action, oldValue, newValue } = req.body;
    if (!taskId || !mongoose.isValidObjectId(taskId)) {
      return res.status(400).json({ error: 'taskId requerido' });
    }
    if (!userId || !mongoose.isValidObjectId(userId)) {
      return res.status(400).json({ error: 'userId requerido' });
    }
    if (!action) {
      return res.status(400).json({ error: 'action requerido' });
    }
    const entry = await HistoryEntry.create({
      taskId,
      userId,
      action,
      oldValue: oldValue ?? '',
      newValue: newValue ?? ''
    });
    res.status(201).json(entry.toJSON());
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
