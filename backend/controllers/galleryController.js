const { Gallery } = require('../models');

const getGallery = async (req, res) => {
  try {
    const gallery = await Gallery.findAll({ order: [['createdAt', 'DESC']] });
    res.json({ success: true, data: gallery });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const createGallery = async (req, res) => {
  try {
    const { title, category } = req.body;
    let image = null;
    if (req.file) {
      image = `/uploads/${req.file.filename}`;
    }

    if (!image) {
      return res.status(400).json({ success: false, message: 'Image is required' });
    }

    const gallery = await Gallery.create({ title, category, image });
    res.status(201).json({ success: true, data: gallery });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateGallery = async (req, res) => {
  try {
    const gallery = await Gallery.findByPk(req.params.id);
    if (!gallery) return res.status(404).json({ success: false, message: 'Image not found' });

    const { title, category } = req.body;
    let image = gallery.image;

    if (req.file) {
      image = `/uploads/${req.file.filename}`;
    }

    await gallery.update({
      title: title || gallery.title,
      category: category || gallery.category,
      image,
    });

    res.json({ success: true, data: gallery });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteGallery = async (req, res) => {
  try {
    const gallery = await Gallery.findByPk(req.params.id);
    if (!gallery) return res.status(404).json({ success: false, message: 'Image not found' });

    await gallery.destroy();
    res.json({ success: true, message: 'Image removed' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getGallery, createGallery, updateGallery, deleteGallery };
