const express = require('express');
const Skill = require('../models/Skill');
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

// GET all skills for logged-in user
router.get('/', auth, async (req, res) => {
  try {
    const skills = await Skill.find({ user: req.user });
    res.json(skills);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ADD a skill
router.post('/', auth, async (req, res) => {
  try {
    const { name, level } = req.body;
    const skill = new Skill({
      user: req.user,
      name: name,
      level: level || 'Intermediate'
    });
    await skill.save();
    res.status(201).json(skill);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// UPDATE a skill
router.put('/:id', auth, async (req, res) => {
  try {
    const { name, level } = req.body;
    const skill = await Skill.findOneAndUpdate(
      { _id: req.params.id, user: req.user },
      { name, level },
      { new: true }
    );
    if (!skill) {
      return res.status(404).json({ message: 'Skill not found' });
    }
    res.json(skill);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE a skill
router.delete('/:id', auth, async (req, res) => {
  try {
    const skill = await Skill.findOneAndDelete({
      _id: req.params.id,
      user: req.user
    });
    if (!skill) {
      return res.status(404).json({ message: 'Skill not found' });
    }
    res.json({ message: 'Skill deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;