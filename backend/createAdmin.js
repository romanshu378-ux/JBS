const { Admin } = require('./models');
const sequelize = require('./config/database');
const bcrypt = require('bcryptjs');

const createDefaultAdmin = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connected...');

    // Sync models
    await sequelize.sync();

    await Admin.destroy({
  where: {
    username: [
      'admin',
      'admin@jbs.com',
      'jayshreeram@btp.com'
    ]
  }
});

    const username = 'admin@jankiballabhservices.in';

    // Hash password
    const hashedPassword = await bcrypt.hash('Sharma@2025', 12);

    // Check existing admin
    const existingAdmin = await Admin.findOne({
      where: { username },
    });

    if (existingAdmin) {
      // Update password
      existingAdmin.password = hashedPassword;

      await existingAdmin.save();

      console.log('Admin password updated successfully.');
    } else {
      // Create new admin
      await Admin.create({
        username,
        password: hashedPassword,
      });

      console.log(
        `Admin created successfully with username: ${username}`
      );
    }

    process.exit(0);

  } catch (error) {
    console.error('Error creating admin:', error);

    process.exit(1);
  }
};

createDefaultAdmin();