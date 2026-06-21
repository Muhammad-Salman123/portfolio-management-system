const express = require('express');
const Activity = require('../models/Activity');
const router = express.Router();

// Middleware to check if user is logged in
const auth = (req, res, next) => {
  const token = req.header('x-auth-token');
  if (!token) {
    return res.status(401).json({ message: 'No token, access denied' });
  }
  try {
    const jwt = require('jsonwebtoken');
    const decoded = jwt.verify(token, 'my_secret_key_12345');
    req.user = decoded.id;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

// GET all activities for logged-in user
router.get('/', auth, async (req, res) => {
  try {
    const activities = await Activity.find({ user: req.user })
      .sort({ createdAt: -1 })
      .limit(10);
    res.json(activities);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE all activities for logged-in user
router.delete('/clear', auth, async (req, res) => {
  try {
    await Activity.deleteMany({ user: req.user });
    res.json({ message: 'All activities cleared successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;