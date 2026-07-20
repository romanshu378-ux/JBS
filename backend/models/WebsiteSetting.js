const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const WebsiteSetting = sequelize.define('WebsiteSetting', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  // ── Company Details ───────────────────────────────────────────
  company_name:         { type: DataTypes.STRING,  allowNull: true },
  about_description:    { type: DataTypes.TEXT,    allowNull: true },

  // ── Contact Information ───────────────────────────────────────
  phone:                { type: DataTypes.STRING,  allowNull: true },
  email:                { type: DataTypes.STRING,  allowNull: true },
  address:              { type: DataTypes.STRING,  allowNull: true },

  // ── Social Links ─────────────────────────────────────────────
  facebook_link:        { type: DataTypes.STRING,  allowNull: true },
  instagram_link:       { type: DataTypes.STRING,  allowNull: true },
  linkedin_link:        { type: DataTypes.STRING,  allowNull: true },
  youtube_link:         { type: DataTypes.STRING,  allowNull: true },
  whatsapp_number:      { type: DataTypes.STRING,  allowNull: true },

  // ── Homepage Hero ─────────────────────────────────────────────
  hero_title:           { type: DataTypes.STRING,  allowNull: true },
  hero_subtitle:        { type: DataTypes.TEXT,    allowNull: true },

  // ── Footer ───────────────────────────────────────────────────
  footer_text:          { type: DataTypes.TEXT,    allowNull: true },

  // ── Embeds ───────────────────────────────────────────────────
  google_map_embed:     { type: DataTypes.TEXT,    allowNull: true },

  // ── Branding ─────────────────────────────────────────────────
  logo:                 { type: DataTypes.STRING,  allowNull: true },
  favicon_url:          { type: DataTypes.STRING,  allowNull: true },

  // ── SEO ──────────────────────────────────────────────────────
  seo_meta_title:       { type: DataTypes.STRING,  allowNull: true },
  seo_meta_description: { type: DataTypes.TEXT,    allowNull: true },
}, {
  timestamps: true,
});

module.exports = WebsiteSetting;
