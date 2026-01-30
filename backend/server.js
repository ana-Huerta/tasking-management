require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./db');
const User = require('./models/User');

const authRoutes = require('./routes/auth');
const usersRoutes = require('./routes/users');
const projectsRoutes = require('./routes/projects');
const tasksRoutes = require('./routes/tasks');
const commentsRoutes = require('./routes/comments');
const historyRoutes = require('./routes/historial');
const notificationsRoutes = require('./routes/notifications');

const app = express();
const PORT = process.env.PORT || 4000;

const SEED_USERS = [
  { username: 'admin', password: 'admin' },
  { username: 'user1', password: 'user1' },
  { username: 'user2', password: 'user2' }
];

async function seedUsers() {
  for (const u of SEED_USERS) {
    const exists = await User.findOne({ username: u.username });
    if (!exists) {
      await User.create(u);
      console.log('Usuario creado:', u.username);
    }
  }
}

app.use(cors({ origin: ['http://localhost:3000', 'http://127.0.0.1:3000'] }));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/projects', projectsRoutes);
app.use('/api/tasks', tasksRoutes);
app.use('/api/comments', commentsRoutes);
app.use('/api/history', historyRoutes);
app.use('/api/notifications', notificationsRoutes);

app.get('/api/health', (req, res) => {
  res.json({ ok: true, message: 'Task Manager API' });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: err.message || 'Error interno del servidor' });
});

(async () => {
  await connectDB();
  await seedUsers();
  app.listen(PORT, () => {
    console.log(`Servidor API en http://localhost:${PORT}`);
  });
})();
