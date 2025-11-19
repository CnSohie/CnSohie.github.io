const Project = require('../models/Project');

const getProjects = async (req, res) => {
  const projects = await Project.find().populate('user', 'username email');
  res.json(projects);
};

const getProjectById = async (req, res) => {
  const project = await Project.findById(req.params.id).populate('user', 'username email');

  if (!project) {
    res.status(404);
    throw new Error('Project not found');
  }

  res.json(project);
};

const createProject = async (req, res) => {
  const data = { ...req.body, user: req.user._id };
  const project = await Project.create(data);
  res.status(201).json(project);
};

const updateProject = async (req, res) => {
  const project = await Project.findById(req.params.id);

  if (!project) {
    res.status(404);
    throw new Error('Project not found');
  }

  Object.assign(project, req.body);
  const updated = await project.save();
  res.json(updated);
};

const deleteProject = async (req, res) => {
  const project = await Project.findById(req.params.id);

  if (!project) {
    res.status(404);
    throw new Error('Project not found');
  }

  await project.deleteOne();
  res.status(204).send();
};

module.exports = {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject
};
