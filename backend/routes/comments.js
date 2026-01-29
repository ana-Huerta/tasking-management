const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Comment = require('../models/Comment');

// GET
router.get('/', async (req, res) => {
  try {
    const { taskId } = req.query;
    const filter = taskId && mongoose.isValidObjectId(taskId) ? { taskId } : {};
    const comments = await Comment.find(filter).sort({ createdAt: 1 });
    res.json(comments.map(c => c.toJSON()));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST
router.post('/', async (req, res) => {
  try {
    const { taskId, userId, commentText } = req.body;
    if (!taskId || !mongoose.isValidObjectId(taskId)) {
      return res.status(400).json({ error: 'ID de tarea requerido' });
    }
    if (!userId || !mongoose.isValidObjectId(userId)) {
      return res.status(400).json({ error: 'ID de usuario requerido' });
    }
    if (!commentText || !commentText.trim()) {
      return res.status(400).json({ error: 'El comentario no puede estar vacío' });
    }
    const comment = await Comment.create({
      taskId,
      userId,
      commentText: commentText.trim()
    });
    res.status(201).json(comment.toJSON());
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
