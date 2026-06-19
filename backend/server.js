const express = require('express');
const mongoose = require('mongoose');
const app = express();

app.use(express.json());
app.use(require('cors')());

console.log('Attempting to connect to MongoDB...');
mongoose.connect('mongodb://localhost:27017/portfolioDB')
  .then(() => console.log('Connected to MongoDB successfully!'))
  .catch((err) => console.log('MongoDB connection error:', err.message));

app.use('/uploads', express.static('uploads'));

app.use('/api/auth', require('./routes/auth'));
app.use('/api/skills', require('./routes/skills'));
app.use('/api/projects', require('./routes/projects'));
app.use('/api/profile', require('./routes/profile'));  // ← THIS LINE IS IMPORTANT

app.get('/', (req, res) => {
  res.send('Server is running with MongoDB!');
});

app.listen(5000, () => {
  console.log('Server running on http://localhost:5000');
});