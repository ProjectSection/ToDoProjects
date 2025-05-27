const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const uri = "mongodb+srv://sammyabutazil:Crespo10!@todolist.4ghnpxx.mongodb.net/?retryWrites=true&w=majority&appName=ToDoList";

const app = express();
const PORT = 5000; // Ensure this matches your frontend's API requests

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.set('strictQuery', false); // To avoid deprecation warnings in Mongoose 7
mongoose.connect('mongodb+srv://sammyabutazil:Crespo10!@todolist.4ghnpxx.mongodb.net/?retryWrites=true&w=majority&appName=ToDoList', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Welcome Route
app.get('/', (req, res) => {
  res.send('Welcome to the To-Do API');
});

// To-Do Schema
const todoSchema = new mongoose.Schema({
  task: String,
  completed: Boolean,
});

const Todo = mongoose.model('Todo', todoSchema);

// Get all todos
app.get('/api/tasks', async (req, res) => {
  try {
    const todos = await Todo.find();
    res.json(todos);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add a new todo
app.post('/api/tasks', async (req, res) => {
  const newTodo = new Todo({
    task: req.body.title,
    completed: false,
  });
  try {
    const savedTodo = await newTodo.save();
    res.status(201).json(savedTodo);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update a todo
app.put('/api/tasks/:id', async (req, res) => {
  try {
    const updatedTodo = await Todo.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedTodo);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a todo
app.delete('/api/tasks/:id', async (req, res) => {
  try {
    await Todo.findByIdAndDelete(req.params.id);
    res.json({ message: 'Todo deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
