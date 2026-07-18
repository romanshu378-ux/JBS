const { Admin, WebsiteSetting } = require('../models');

const seedDatabase = async () => {
  try {
    // Seed Admin
    const adminCount = await Admin.count();
    if (adminCount === 0) {
      await Admin.create({
        username: 'jayshreeram@btp.com',
        password: 'Sharma@2024', // This will be hashed by the model hook
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
  } catch (error) {
    console.error('Error seeding database:', error);
  }
};

module.exports = seedDatabase;
