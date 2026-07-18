const { Service, ServiceCategory, ServiceFeature, InstallationProcess, Industry, Benefit, FAQ } = require('../models');

const getServices = async (req, res) => {
  try {
    const services = await Service.findAll({
      include: [
        { model: ServiceCategory, as: 'category' }
      ],
      order: [['displayOrder', 'ASC']]
    });
    res.json({ success: true, data: services });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getServiceBySlug = async (req, res) => {
  try {
    const service = await Service.findOne({
      where: { slug: req.params.slug },
      include: [
        { model: ServiceCategory, as: 'category' },
        { model: ServiceFeature, as: 'features' },
        { model: InstallationProcess, as: 'process' },
        { model: Industry, as: 'industries' },
        { model: Benefit, as: 'benefits' },
        { model: FAQ, as: 'faqs' }
      ],
      order: [
        [{ model: InstallationProcess, as: 'process' }, 'stepNumber', 'ASC']
      ]
    });

    if (!service) return res.status(404).json({ success: false, message: 'Service not found' });
    res.json({ success: true, data: service });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const createService = async (req, res) => {
  try {
    const data = req.body;
    if (req.files) {
      if (req.files.heroImage) data.heroImage = `/uploads/${req.files.heroImage[0].filename}`;
      if (req.files.thumbnail) data.thumbnail = `/uploads/${req.files.thumbnail[0].filename}`;
    }
    const service = await Service.create(data);
    res.status(201).json({ success: true, data: service });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateService = async (req, res) => {
  try {
    const service = await Service.findByPk(req.params.id);
    if (!service) return res.status(404).json({ success: false, message: 'Service not found' });

    const data = req.body;
    if (req.files) {
      if (req.files.heroImage) data.heroImage = `/uploads/${req.files.heroImage[0].filename}`;
      if (req.files.thumbnail) data.thumbnail = `/uploads/${req.files.thumbnail[0].filename}`;
    }

    await service.update(data);
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

module.exports = { getServices, getServiceBySlug, createService, updateService, deleteService };
