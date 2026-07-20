const { WebsiteSetting } = require('../models');

// GET /api/settings — public, no auth required
const getSettings = async (req, res) => {
  try {
    // Prevent browser / CDN / proxy caching so admin changes appear immediately
    res.set('Cache-Control', 'no-store');

    const settings = await WebsiteSetting.findOne();
    res.json({ success: true, data: settings || {} });
  } catch (error) {
    console.error('getSettings error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// PUT /api/settings — protected, requires admin JWT
const updateSettings = async (req, res) => {
  try {
    let settings = await WebsiteSetting.findOne();
    if (!settings) {
      settings = await WebsiteSetting.create({});
    }

    // Whitelist allowed fields to prevent mass-assignment vulnerabilities
    const ALLOWED_FIELDS = [
      'company_name',
      'phone',
      'email',
      'address',
      'facebook_link',
      'instagram_link',
      'linkedin_link',
      'youtube_link',
      'whatsapp_number',
      'hero_title',
      'hero_subtitle',
      'about_description',
      'footer_text',
      'google_map_embed',
      'seo_meta_title',
      'seo_meta_description',
    ];

    const updateData = {};
    for (const field of ALLOWED_FIELDS) {
      // Only apply field if it was explicitly sent in the request body
      if (Object.prototype.hasOwnProperty.call(req.body, field)) {
        // Treat empty strings as null so the DB stays clean
        updateData[field] = req.body[field] === '' ? null : req.body[field];
      }
    }

    // Handle file uploads (logo, favicon) from multipart/form-data
    if (req.files) {
      if (req.files.logo && req.files.logo.length > 0) {
        updateData.logo = req.files.logo[0].path; // Cloudinary HTTPS URL
      }
      if (req.files.favicon && req.files.favicon.length > 0) {
        updateData.favicon_url = req.files.favicon[0].path; // Cloudinary HTTPS URL
      }
    }

    await settings.update(updateData);

    // Reload to return the freshest values from DB
    await settings.reload();

    // No-store so any GET after this always hits the DB
    res.set('Cache-Control', 'no-store');
    res.json({ success: true, data: settings });
  } catch (error) {
    console.error('updateSettings error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getSettings, updateSettings };
