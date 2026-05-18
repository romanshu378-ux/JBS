const { Project } = require('../models');

const getProjects = async (req, res) => {
  try {
    const projects = await Project.findAll();
    res.json({ success: true, data: projects });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const createProject = async (req, res) => {
  try {
    const { title, category, description, client, completionDate } = req.body;
    let image = null;
    if (req.file) {
      image = `/uploads/${req.file.filename}`;
    }

    const project = await Project.create({
      title,
      category,
      description,
      client,
      completionDate,
      image
    });
    res.status(201).json({ success: true, data: project });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateProject = async (req, res) => {
  try {
    const project = await Project.findByPk(req.params.id);
    if (!project) return res.status(404).json({ success: false, message: 'Project not found' });

    const { title, category, description, client, completionDate } = req.body;
    let image = project.image;

    if (req.file) {
      image = `/uploads/${req.file.filename}`;
    }

    await project.update({
      title: title || project.title,
      category: category || project.category,
      description: description || project.description,
      client: client || project.client,
      completionDate: completionDate || project.completionDate,
      image
    });

    res.json({ success: true, data: project });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteProject = async (req, res) => {
  try {
    const project = await Project.findByPk(req.params.id);
    if (!project) return res.status(404).json({ success: false, message: 'Project not found' });

    await project.destroy();
    res.json({ success: true, message: 'Project removed' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getProjects, createProject, updateProject, deleteProject };
