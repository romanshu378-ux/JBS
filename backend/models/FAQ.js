const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const FAQ = sequelize.define('FAQ', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  serviceId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  question: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  answer: {
    type: DataTypes.TEXT,
    allowNull: false,
  }
}, {
  timestamps: false,
});

module.exports = FAQ;
