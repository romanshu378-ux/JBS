const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Industry = sequelize.define('Industry', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  serviceId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  icon: {
    type: DataTypes.STRING,
    allowNull: true,
  }
}, {
  timestamps: false,
});

module.exports = Industry;
