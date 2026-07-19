const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const InstallationProcess = sequelize.define('InstallationProcess', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  serviceId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  stepNumber: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  }
}, {
  timestamps: false,
});

module.exports = InstallationProcess;
