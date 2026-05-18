const sequelize = require('../config/database');
const Admin = require('./Admin');
const Service = require('./Service');
const Project = require('./Project');
const Gallery = require('./Gallery');
const TeamMember = require('./TeamMember');
const Testimonial = require('./Testimonial');
const Inquiry = require('./Inquiry');
const WebsiteSetting = require('./WebsiteSetting');

// Define associations if necessary
// e.g., Project.belongsTo(Category);

module.exports = {
  sequelize,
  Admin,
  Service,
  Project,
  Gallery,
  TeamMember,
  Testimonial,
  Inquiry,
  WebsiteSetting
};
