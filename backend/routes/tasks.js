const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Task = require('../models/Task');
const HistoryEntry = require('../models/HistoryEntry');
const Notification = require('../models/Notification');

const toObjectId = (v) => {
  if (v == null || v === '' || v === '0' || v === 0) return null;
  if (mongoose.isValidObjectId(v)) return v;
  return null;
};

// GET /api/tasks
router.get('/', async (req, res) => {
  try {
    const tasks = await Task.find({}).sort({ createdAt: -1 });
    res.json(tasks.map(t => t.toJSON()));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/tasks
router.post('/', async (req, res) => {
  try {
    const body = req.body;
    const taskData = {
      title: body.title?.trim() || '',
      description: body.description || '',
      status: body.status || 'Pendiente',
      priority: body.priority || 'Media',
      projectId: toObjectId(body.projectId),
      assignedTo: toObjectId(body.assignedTo),
      dueDate: body.dueDate || '',
      estimatedHours: Number(body.estimatedHours) || 0,
      actualHours: Number(body.actualHours) || 0,
      createdBy: toObjectId(body.createdBy)
    };
    if (!taskData.title) {
      return res.status(400).json({ error: 'El título es requerido' });
    }
    if (!taskData.createdBy) {
      return res.status(400).json({ error: 'createdBy es requerido' });
    }
    const task = await Task.create(taskData);
    const json = task.toJSON();

    await HistoryEntry.create({
      taskId: task._id,
      userId: taskData.createdBy,
      action: 'CREATED',
      oldValue: '',
      newValue: taskData.title
    });

    if (taskData.assignedTo) {
      await Notification.create({
        userId: taskData.assignedTo,
        message: 'Nueva tarea asignada: ' + taskData.title,
        type: 'task_assigned'
      });
    }

    res.status(201).json(json);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/tasks/:id
router.put('/:id', async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ error: 'ID inválido' });
    }
    const body = req.body;
    const oldTask = await Task.findById(req.params.id);
    if (!oldTask) {
      return res.status(404).json({ error: 'Tarea no encontrado' });
    }

    const taskData = {
      title: body.title?.trim() ?? oldTask.title,
      description: body.description ?? oldTask.description,
      status: body.status ?? oldTask.status,
      priority: body.priority ?? oldTask.priority,
      projectId: body.projectId !== undefined ? toObjectId(body.projectId) : oldTask.projectId,
      assignedTo: body.assignedTo !== undefined ? toObjectId(body.assignedTo) : oldTask.assignedTo,
      dueDate: body.dueDate ?? oldTask.dueDate,
      estimatedHours: Number(body.estimatedHours) ?? oldTask.estimatedHours,
      actualHours: Number(body.actualHours) ?? oldTask.actualHours,
      createdBy: oldTask.createdBy,
      createdAt: oldTask.createdAt
    };

    if (oldTask.status !== taskData.status) {
      await HistoryEntry.create({
        taskId: oldTask._id,
        userId: body.userId ? toObjectId(body.userId) : oldTask.createdBy,
        action: 'STATUS_CHANGED',
        oldValue: oldTask.status,
        newValue: taskData.status
      });
    }
    if (oldTask.title !== taskData.title) {
      await HistoryEntry.create({
        taskId: oldTask._id,
        userId: body.userId ? toObjectId(body.userId) : oldTask.createdBy,
        action: 'TITLE_CHANGED',
        oldValue: oldTask.title,
        newValue: taskData.title
      });
    }

    const task = await Task.findByIdAndUpdate(req.params.id, taskData, { new: true, runValidators: true });
    if (taskData.assignedTo) {
      await Notification.create({
        userId: taskData.assignedTo,
        message: 'Tarea actualizada: ' + taskData.title,
        type: 'task_updated'
      });
    }

    res.json(task.toJSON());
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/tasks/:id
router.delete('/:id', async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ error: 'ID inválido' });
    }
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ error: 'Tarea no encontrada' });
    }
    const userId = req.query.userId ? toObjectId(req.query.userId) : task.createdBy;
    await HistoryEntry.create({
      taskId: task._id,
      userId: userId || task.createdBy,
      action: 'DELETED',
      oldValue: task.title,
      newValue: ''
    });
    await Task.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
