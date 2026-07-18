const { ServiceFeature, InstallationProcess, Industry, Benefit, FAQ } = require('../models');

const buildCrud = (Model) => ({
  getAll: async (req, res) => {
    try {
      const where = req.query.serviceId ? { serviceId: req.query.serviceId } : {};
      const data = await Model.findAll({ where });
      res.json({ success: true, data });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  create: async (req, res) => {
    try {
      const data = await Model.create(req.body);
      res.status(201).json({ success: true, data });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  update: async (req, res) => {
    try {
      const item = await Model.findByPk(req.params.id);
      if (!item) return res.status(404).json({ success: false, message: 'Not found' });
      await item.update(req.body);
      res.json({ success: true, data: item });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  remove: async (req, res) => {
    try {
      const item = await Model.findByPk(req.params.id);
      if (!item) return res.status(404).json({ success: false, message: 'Not found' });
      await item.destroy();
      res.json({ success: true, message: 'Removed successfully' });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
});

module.exports = {
  feature: buildCrud(ServiceFeature),
  process: buildCrud(InstallationProcess),
  industry: buildCrud(Industry),
  benefit: buildCrud(Benefit),
  faq: buildCrud(FAQ)
};
