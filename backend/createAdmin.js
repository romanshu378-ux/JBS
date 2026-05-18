const { Admin } = require('./models');
const sequelize = require('./config/database');

const createDefaultAdmin = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connected...');

    // Make sure models are synced
    await sequelize.sync();

    const username = 'admin@jbs.com';
    const password = 'admin123';

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ where: { username } });

    if (existingAdmin) {
      console.log(`Admin with username '${username}' already exists.`);
      // Update password just in case
      existingAdmin.password = password;
      await existingAdmin.save();
      console.log('Password has been updated to the requested password.');
    } else {
      await Admin.create({
        username,
        password,
      });
      console.log(`Admin created successfully with username: ${username}`);
    }

    process.exit(0);
  } catch (error) {
    console.error('Error creating admin:', error);
    process.exit(1);
  }
};

createDefaultAdmin();
