const { ServiceCategory } = require('../models');

const getCategories = async (req, res) => {
  try {
    const categories = await ServiceCategory.findAll();
    res.json({ success: true, data: categories });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const createCategory = async (req, res) => {
  try {
    const data = req.body;
    if (req.file) data.image = `/uploads/${req.file.filename}`;
    const category = await ServiceCategory.create(data);
    res.status(201).json({ success: true, data: category });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateCategory = async (req, res) => {
  try {
    const category = await ServiceCategory.findByPk(req.params.id);
    if (!category) return res.status(404).json({ success: false, message: 'Category not found' });
    const data = req.body;
    if (req.file) data.image = `/uploads/${req.file.filename}`;
    await category.update(data);
    res.json({ success: true, data: category });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const category = await ServiceCategory.findByPk(req.params.id);
    if (!category) return res.status(404).json({ success: false, message: 'Category not found' });
    await category.destroy();
    res.json({ success: true, message: 'Category removed' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getCategories, createCategory, updateCategory, deleteCategory };
