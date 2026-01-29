const express = require('express');
const router = express.Router();
const User = require('../models/User');

// POST
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: 'Usuario y contraseña requeridos' });
    }
    const user = await User.findOne({ username, password });
    if (!user) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }
    const userObj = user.toJSON();
    res.json(userObj);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;