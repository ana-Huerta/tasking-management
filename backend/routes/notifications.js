const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Notification = require('../models/Notification');

// GET
router.get('/', async (req, res) => {
  try {
    const { userId, unreadOnly } = req.query;
    const filter = {};
    if (userId && mongoose.isValidObjectId(userId)) {
      filter.userId = userId;
    }
    if (unreadOnly === 'true') {
      filter.read = false;
    }
    const notifications = await Notification.find(filter).sort({ createdAt: -1 });
    res.json(notifications.map(n => n.toJSON()));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST
router.post('/', async (req, res) => {
  try {
    const { userId, message, type } = req.body;
    if (!userId || !mongoose.isValidObjectId(userId)) {
      return res.status(400).json({ error: 'userId requerido' });
    }
    if (!message) {
      return res.status(400).json({ error: 'message requerido' });
    }
    const notification = await Notification.create({
      userId,
      message,
      type: type || 'info',
      read: false
    });
    res.status(201).json(notification.toJSON());
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH
router.patch('/read', async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId || !mongoose.isValidObjectId(userId)) {
      return res.status(400).json({ error: 'userId requerido' });
    }
    await Notification.updateMany({ userId, read: false }, { read: true });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
