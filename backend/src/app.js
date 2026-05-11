const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const taskRoutes = require('./routes/tasks');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => res.json({ message: 'Teyzix TaskBoard API running' }));
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal server error' });
});

module.exports = app;
