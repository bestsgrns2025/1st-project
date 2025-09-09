const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const Image = require('../models/Image'); // To populate image details

// @route   GET /api/projects
// @desc    Get all projects
// @access  Public
router.get('/', async (req, res) => {
  try {
    const projects = await Project.find().populate('images'); // Populate image details
    res.json(projects);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST /api/projects
// @desc    Create a new project
// @access  Private (e.g., admin only) - For simplicity, no auth implemented yet
router.post('/', async (req, res) => {
  const { title, category, description, imageIds, tech, liveUrl, githubUrl, featured } = req.body;

  try {
    const newProject = new Project({
      title,
      category,
      description,
      images: imageIds, // Expects an array of Image ObjectIDs
      tech,
      liveUrl,
      githubUrl,
      featured
    });

    const project = await newProject.save();
    res.json(project);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT /api/projects/:id
// @desc    Update a project
// @access  Private
router.put('/:id', async (req, res) => {
  const { title, category, description, imageIds, tech, liveUrl, githubUrl, featured } = req.body;

  try {
    let project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ msg: 'Project not found' });
    }

    project.title = title || project.title;
    project.category = category || project.category;
    project.description = description || project.description;
    project.images = imageIds || project.images;
    project.tech = tech || project.tech;
    project.liveUrl = liveUrl || project.liveUrl;
    project.githubUrl = githubUrl || project.githubUrl;
    project.featured = featured !== undefined ? featured : project.featured;

    await project.save();
    res.json(project);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE /api/projects/:id
// @desc    Delete a project
// @access  Private
router.delete('/:id', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ msg: 'Project not found' });
    }

    await Project.deleteOne({ _id: req.params.id }); // Use deleteOne for Mongoose 6+
    res.json({ msg: 'Project removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;