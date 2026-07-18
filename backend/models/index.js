const sequelize = require('../config/database');
const Admin = require('./Admin');
const ServiceCategory = require('./ServiceCategory');
const Service = require('./Service');
const ServiceFeature = require('./ServiceFeature');
const InstallationProcess = require('./InstallationProcess');
const Industry = require('./Industry');
const Benefit = require('./Benefit');
const FAQ = require('./FAQ');
const Project = require('./Project');
const Gallery = require('./Gallery');
const TeamMember = require('./TeamMember');
const Testimonial = require('./Testimonial');
const Inquiry = require('./Inquiry');
const WebsiteSetting = require('./WebsiteSetting');

// Associations
ServiceCategory.hasMany(Service, { foreignKey: 'categoryId', as: 'services', onDelete: 'CASCADE' });
Service.belongsTo(ServiceCategory, { foreignKey: 'categoryId', as: 'category' });

Service.hasMany(ServiceFeature, { foreignKey: 'serviceId', as: 'features', onDelete: 'CASCADE' });
ServiceFeature.belongsTo(Service, { foreignKey: 'serviceId' });

Service.hasMany(InstallationProcess, { foreignKey: 'serviceId', as: 'process', onDelete: 'CASCADE' });
InstallationProcess.belongsTo(Service, { foreignKey: 'serviceId' });

Service.hasMany(Industry, { foreignKey: 'serviceId', as: 'industries', onDelete: 'CASCADE' });
Industry.belongsTo(Service, { foreignKey: 'serviceId' });

Service.hasMany(Benefit, { foreignKey: 'serviceId', as: 'benefits', onDelete: 'CASCADE' });
Benefit.belongsTo(Service, { foreignKey: 'serviceId' });

Service.hasMany(FAQ, { foreignKey: 'serviceId', as: 'faqs', onDelete: 'CASCADE' });
FAQ.belongsTo(Service, { foreignKey: 'serviceId' });

module.exports = {
  sequelize,
  Admin,
  ServiceCategory,
  Service,
  ServiceFeature,
  InstallationProcess,
  Industry,
  Benefit,
  FAQ,
  Project,
  Gallery,
  TeamMember,
  Testimonial,
  Inquiry,
  WebsiteSetting
};
