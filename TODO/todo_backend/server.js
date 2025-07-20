const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const TodoModel = require('./models/Todo');
require('dotenv').config(); // Load environment variables from .env

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection (updated)
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

// Routes

// Add a new todo
app.post('/add', async (req, res) => {
  try {
    const { task } = req.body;
    const result = await TodoModel.create({ task });
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to add todo' });
  }
});

// Get all todos
app.get('/get', async (req, res) => {
  try {
    const todos = await TodoModel.find();
    res.json(todos);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch todos' });
  }
});

// Mark todo as done
app.put('/edit/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await TodoModel.findByIdAndUpdate(id, { done: true }, { new: true });
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to mark as done' });
  }
});

// Update task name
app.put('/update/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { task } = req.body;
    const result = await TodoModel.findByIdAndUpdate(id, { task }, { new: true });
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update task' });
  }
});

// Delete todo
app.delete('/delete/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await TodoModel.findByIdAndDelete(id);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete task' });
  }
});

// start todo
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server listening on port: ${PORT}`);
});
