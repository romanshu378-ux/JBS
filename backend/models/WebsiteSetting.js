const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const WebsiteSetting = sequelize.define('WebsiteSetting', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  company_name: { type: DataTypes.STRING, allowNull: true },
  phone: { type: DataTypes.STRING, allowNull: true },
  email: { type: DataTypes.STRING, allowNull: true },
  address: { type: DataTypes.STRING, allowNull: true },
  facebook_link: { type: DataTypes.STRING, allowNull: true },
  instagram_link: { type: DataTypes.STRING, allowNull: true },
  linkedin_link: { type: DataTypes.STRING, allowNull: true },
  youtube_link: { type: DataTypes.STRING, allowNull: true },
  whatsapp_number: { type: DataTypes.STRING, allowNull: true },
  hero_title: { type: DataTypes.STRING, allowNull: true },
  hero_subtitle: { type: DataTypes.STRING, allowNull: true },
  footer_text: { type: DataTypes.TEXT, allowNull: true },
  google_map_embed: { type: DataTypes.TEXT, allowNull: true },
  logo: { type: DataTypes.STRING, allowNull: true },
  favicon_url: { type: DataTypes.STRING, allowNull: true },
  seo_meta_title: { type: DataTypes.STRING, allowNull: true },
  seo_meta_description: { type: DataTypes.TEXT, allowNull: true },
}, {
  timestamps: true,
});

module.exports = WebsiteSetting;
