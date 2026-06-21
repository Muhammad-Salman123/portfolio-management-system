const express = require('express');
const Project = require('../models/Project');
const Activity = require('../models/Activity');
const multer = require('multer');
const path = require('path');
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

// Configure multer for project images
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function(req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'project-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpg') {
    cb(null, true);
  } else {
    cb(new Error('Only JPEG and PNG images are allowed'), false);
  }
};

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: fileFilter
});

// GET all projects for logged-in user
router.get('/', auth, async (req, res) => {
  try {
    const projects = await Project.find({ user: req.user });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ADD a project with image upload
router.post('/', auth, upload.single('image'), async (req, res) => {
  try {
    const { title, description, githubLink, liveLink, category } = req.body;
    const imageUrl = req.file ? `http://localhost:5000/uploads/${req.file.filename}` : '';

    const project = new Project({
      user: req.user,
      title: title,
      description: description || '',
      githubLink: githubLink || '',
      liveLink: liveLink || '',
      category: category || 'Web Development',
      image: imageUrl
    });
    await project.save();
    
    // Log activity
    const activity = new Activity({
      user: req.user,
      action: 'Added Project',
      details: `Added project: ${title}`
    });
    await activity.save();
    
    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// UPDATE a project with image upload
router.put('/:id', auth, upload.single('image'), async (req, res) => {
  try {
    const { title, description, githubLink, liveLink, category } = req.body;
    const updateData = { title, description, githubLink, liveLink, category };

    if (req.file) {
      updateData.image = `http://localhost:5000/uploads/${req.file.filename}`;
    }

    const project = await Project.findOneAndUpdate(
      { _id: req.params.id, user: req.user },
      updateData,
      { new: true }
    );
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    // Log activity
    const activity = new Activity({
      user: req.user,
      action: 'Updated Project',
      details: `Updated project: ${title}`
    });
    await activity.save();
    
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
    
    // Log activity
    const activity = new Activity({
      user: req.user,
      action: 'Deleted Project',
      details: `Deleted project: ${project.title}`
    });
    await activity.save();
    
    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;