const { Admin, WebsiteSetting, ServiceCategory, Service, ServiceFeature, InstallationProcess, Industry, Benefit, FAQ } = require('../models');

const seedDatabase = async () => {
  try {
    // Seed Admin
    const adminCount = await Admin.count();
    if (adminCount === 0) {
      await Admin.create({
        username: 'jayshreeram@btp.com',
        password: 'Sharma@2024',
      });
      console.log('Admin user seeded');
    }

    // Seed Website Settings
    const settingsCount = await WebsiteSetting.count();
    if (settingsCount === 0) {
      await WebsiteSetting.create({
        company_name: 'Janki Ballabh Services',
        phone: '+91 1234567890',
        email: 'info@jankiballabh.com',
        address: '123 Main Street, City, Country',
        hero_title: 'Welcome to Janki Ballabh Services',
        hero_subtitle: 'Your trusted partner in industrial solutions',
        footer_text: '© 2026 Janki Ballabh Services. All rights reserved.',
      });
      console.log('Website settings seeded');
    }

    // Seed EV Charger Service
    const categoryCount = await ServiceCategory.count();
    if (categoryCount === 0) {
      const category = await ServiceCategory.create({
        title: 'EV Charging Solutions',
        slug: 'ev-charging-solutions',
        description: 'Complete EV charging infrastructure solutions.',
        icon: 'BatteryCharging'
      });
      console.log('Service Category seeded');

      const service = await Service.create({
        categoryId: category.id,
        title: 'EV Charger Installation & Commissioning',
        slug: 'ev-charger-installation-commissioning',
        shortDescription: 'We provide complete EV charging infrastructure solutions including AC & DC charger installation, commissioning, electrical work, civil work, testing, configuration, and annual maintenance services.',
        description: 'Professional Installation, Commissioning & Maintenance Services for Residential, Commercial & Industrial EV Charging Stations.',
        image: null,
        displayOrder: 1,
        featured: true,
        status: true,
        seoTitle: 'EV Charger Installation Services | Janki Ballabh Services',
        seoDescription: 'Professional EV Charger Installation, Commissioning, Electrical Work, Civil Work, Testing, OCPP Configuration, AMC & Maintenance Services across India.',
        seoKeywords: 'EV Charger Installation, EV Charging Station, DC Fast Charger, AC Charger, EV Infrastructure, EV Commissioning, EV Maintenance, OCPP, Commercial EV Charger, Industrial EV Charging'
      });
      console.log('Service seeded');

      const features = [
        'AC Charger Installation',
        'DC Fast Charger Installation',
        'Site Survey',
        'Electrical Wiring',
        'Cable Laying',
        'LT Panel Installation',
        'Earthing',
        'Civil Work',
        'Commissioning',
        'OCPP Configuration',
        'AMC',
        'Preventive Maintenance'
      ];
      for (const feature of features) {
        await ServiceFeature.create({ serviceId: service.id, title: feature, icon: 'CheckCircle2' });
      }

      const steps = [
        { stepNumber: 1, title: 'Site Survey', description: 'Free site survey' },
        { stepNumber: 2, title: 'Load Assessment', description: 'Technical inspection' },
        { stepNumber: 3, title: 'Proposal', description: 'Proposal & BOQ' },
        { stepNumber: 4, title: 'Electrical Work', description: 'Wiring and panels' },
        { stepNumber: 5, title: 'Civil Work', description: 'Foundation and trenches' },
        { stepNumber: 6, title: 'Installation', description: 'EV Charger Installation' },
        { stepNumber: 7, title: 'Testing', description: 'Testing & Certification' },
        { stepNumber: 8, title: 'Commissioning', description: 'Network configuration' },
        { stepNumber: 9, title: 'Handover', description: 'Customer training' }
      ];
      for (const step of steps) {
        await InstallationProcess.create({ serviceId: service.id, ...step });
      }

      const industries = ['Residential', 'Commercial', 'Hotels', 'Hospitals', 'Petrol Pumps', 'Fleet Operators', 'Industrial Plants', 'Government Projects'];
      for (const industry of industries) {
        await Industry.create({ serviceId: service.id, title: industry, icon: 'Building2' });
      }

      const benefits = [
        { title: 'Professional Team', icon: 'HardHat' },
        { title: 'Certified Engineers', icon: 'ShieldCheck' },
        { title: 'Fast Installation', icon: 'Zap' },
        { title: 'Safety Standards', icon: 'ShieldCheck' },
        { title: 'Quality Assurance', icon: 'CheckCircle2' },
        { title: 'Warranty Support', icon: 'Wrench' },
        { title: 'AMC Available', icon: 'Settings' },
        { title: '24x7 Support', icon: 'Phone' }
      ];
      for (const benefit of benefits) {
        await Benefit.create({ serviceId: service.id, ...benefit });
      }
      
      console.log('EV Charger Relational Data seeded');
    }
  } catch (error) {
    console.error('Error seeding database:', error);
  }
};

module.exports = seedDatabase;
