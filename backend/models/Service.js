const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Service = sequelize.define('Service', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  icon: {
    type: DataTypes.STRING, // Store icon class name (like 'FaTools') or path
    allowNull: true,
  },
  image: {
    type: DataTypes.STRING, // Image URL/path
    allowNull: true,
  },
  features: {
    type: DataTypes.JSON, // Store an array of features
    allowNull: true,
  }
}, {
  timestamps: true,
});

module.exports = Service;
