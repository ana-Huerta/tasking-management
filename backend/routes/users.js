const express = require('express');
const router = express.Router();
const User = require('../models/User');

// GET
router.get('/', async (req, res) => {
  try {
    const users = await User.find({});
    res.json(users.map(u => u.toJSON()));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST
router.post('/', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !String(username).trim()) {
      return res.status(400).json({ error: 'El nombre de usuario es requerido' });
    }
    if (!password || !String(password).trim()) {
      return res.status(400).json({ error: 'La contraseña es requerida' });
    }
    const u = username.trim();
    const exists = await User.findOne({ username: u });
    if (exists) {
      return res.status(409).json({ error: 'El usuario ya existe' });
    }
    const user = await User.create({ username: u, password: String(password).trim() });
    res.status(201).json(user.toJSON());
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;