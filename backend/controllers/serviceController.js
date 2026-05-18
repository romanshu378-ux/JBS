const { Service } = require('../models');
const path = require('path');
const fs = require('fs');

const getServices = async (req, res) => {
  try {
    const services = await Service.findAll();
    res.json({ success: true, data: services });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const parseFeatures = (features) => {
  if (!features) return [];
  if (Array.isArray(features)) return features;
  try { return JSON.parse(features); } catch (e) {
    return features.split(',').map((f) => f.trim()).filter(Boolean);
  }
};

const createService = async (req, res) => {
  try {
    const { title, description, icon, features } = req.body;
    let image = null;
    if (req.file) image = `/uploads/${req.file.filename}`;

    const service = await Service.create({
      title, description, icon, image,
      features: parseFeatures(features)
    });
    res.status(201).json({ success: true, data: service });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateService = async (req, res) => {
  try {
    const service = await Service.findByPk(req.params.id);
    if (!service) return res.status(404).json({ success: false, message: 'Service not found' });

    const { title, description, icon, features } = req.body;
    let image = service.image;
    if (req.file) image = `/uploads/${req.file.filename}`;

    await service.update({
      title: title || service.title,
      description: description || service.description,
      icon: icon !== undefined ? icon : service.icon,
      image,
      features: features !== undefined ? parseFeatures(features) : service.features
    });

    res.json({ success: true, data: service });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteService = async (req, res) => {
  try {
    const service = await Service.findByPk(req.params.id);
    if (!service) return res.status(404).json({ success: false, message: 'Service not found' });

    await service.destroy();
    res.json({ success: true, message: 'Service removed' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getServices, createService, updateService, deleteService };
