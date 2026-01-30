require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

const USERS = [
  { username: 'admin', password: 'admin' },
  { username: 'user1', password: 'user1' },
  { username: 'user2', password: 'user2' }
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB conectado');

    for (const u of USERS) {
      const exists = await User.findOne({ username: u.username });
      if (!exists) {
        await User.create(u);
        console.log('Usuario creado:', u.username);
      } else {
        console.log('Usuario ya existe:', u.username);
      }
    }

    console.log('Seed completado.');
  } catch (err) {
    console.error('Error en seed:', err.message);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

seed();
