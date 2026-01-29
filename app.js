require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const authRoutes = require('./backend/routes/auth');
const usersRoutes = require('./backend/routes/users');
const projectsRoutes = require('./backend/routes/projects');
const tasksRoutes = require('./backend/routes/tasks');
const commentsRoutes = require('./backend/routes/comments');
const historyRoutes = require('./backend/routes/historial');
const notificationsRoutes = require('./backend/routes/notifications');

const app = express();
const PORT = process.env.PORT || 4000;

connectDB();

app.use(cors({ origin: ['http://localhost:3000', 'http://127.0.0.1:3000'] }));
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/users', usersRoutes);
app.use('/projects', projectsRoutes);
app.use('/tasks', tasksRoutes);
app.use('/comments', commentsRoutes);
app.use('/history', historyRoutes);
app.use('/notifications', notificationsRoutes);

app.get('/health', (req, res) => {
  res.json({ ok: true, message: 'Task Manager API' });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: err.message || 'Error interno del servidor' });
});

app.listen(PORT, () => {
  console.log(`Servidor API en http://localhost:${PORT}`);
});
