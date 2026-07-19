const { WebsiteSetting } = require('../models');

const getSettings = async (req, res) => {
  try {
    const settings = await WebsiteSetting.findOne();
    res.json({ success: true, data: settings || {} });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateSettings = async (req, res) => {
  try {
    let settings = await WebsiteSetting.findOne();
    if (!settings) {
       settings = await WebsiteSetting.create({});
    }

    const updateData = { ...req.body };
    
    // Handle file uploads (logo, favicon) if they exist
    if (req.files) {
        if (req.files.logo && req.files.logo.length > 0) {
            updateData.logo = `/uploads/${req.files.logo[0].filename}`;
        }
        if (req.files.favicon && req.files.favicon.length > 0) {
            updateData.favicon_url = `/uploads/${req.files.favicon[0].filename}`;
        }
    }

    await settings.update(updateData);

    res.json({ success: true, data: settings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getSettings, updateSettings };
