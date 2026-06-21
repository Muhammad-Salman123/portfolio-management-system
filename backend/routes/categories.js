const express = require('express');
const Category = require('../models/Category');
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

// GET all categories
router.get('/', auth, async (req, res) => {
  try {
    const categories = await Category.find({ user: req.user });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ADD a category
router.post('/', auth, async (req, res) => {
  try {
    const { name, description } = req.body;
    const category = new Category({
      user: req.user,
      name: name,
      description: description || ''
    });
    await category.save();

    // Log activity
    const activity = new Activity({
      user: req.user,
      action: 'Added Category',
      details: `Added category: ${name}`
    });
    await activity.save();

    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// UPDATE a category
router.put('/:id', auth, async (req, res) => {
  try {
    const { name, description } = req.body;
    const category = await Category.findOneAndUpdate(
      { _id: req.params.id, user: req.user },
      { name, description },
      { new: true }
    );
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    // Log activity
    const activity = new Activity({
      user: req.user,
      action: 'Updated Category',
      details: `Updated category: ${name}`
    });
    await activity.save();

    res.json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE a category
router.delete('/:id', auth, async (req, res) => {
  try {
    const category = await Category.findOneAndDelete({
      _id: req.params.id,
      user: req.user
    });
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    // Log activity
    const activity = new Activity({
      user: req.user,
      action: 'Deleted Category',
      details: `Deleted category: ${category.name}`
    });
    await activity.save();

    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;