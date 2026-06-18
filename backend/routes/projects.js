const express = require('express');
const Project = require('../models/Project');
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

// GET all projects for logged-in user
router.get('/', auth, async (req, res) => {
  try {
    const projects = await Project.find({ user: req.user });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ADD a project
router.post('/', auth, async (req, res) => {
  try {
    const { title, description, githubLink, liveLink } = req.body;
    const project = new Project({
      user: req.user,
      title: title,
      description: description || '',
      githubLink: githubLink || '',
      liveLink: liveLink || ''
    });
    await project.save();
    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// UPDATE a project
router.put('/:id', auth, async (req, res) => {
  try {
    const { title, description, githubLink, liveLink } = req.body;
    const project = await Project.findOneAndUpdate(
      { _id: req.params.id, user: req.user },
      { title, description, githubLink, liveLink },
      { new: true }
    );
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    res.json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE a project
router.delete('/:id', auth, async (req, res) => {
  try {
    const project = await Project.findOneAndDelete({
      _id: req.params.id,
      user: req.user
    });
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;