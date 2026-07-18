const jwt = require('jsonwebtoken');
const { Admin } = require('../models');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '12h',
  });
};

const loginAdmin = async (req, res) => {
  const { username, password } = req.body;

  try {
    const admin = await Admin.findOne({
      where: { username },
    });

    if (admin && (await admin.matchPassword(password))) {
      res.json({
        success: true,
        _id: admin.id,
        username: admin.username,
        token: generateToken(admin.id),
      });
    } else {
      res.status(401).json({
        success: false,
        message: 'Invalid username or password',
      });
    }

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getAdminProfile = async (req, res) => {
  res.json({
    success: true,
    admin: req.admin,
  });
};

const setupAdmin = async (req, res) => {
  try {

    const existingAdmin = await Admin.findOne({
      where: { username: 'jayshreeram@btp.com' },
    });

    if (existingAdmin) {
      existingAdmin.password = 'Sharma@2024';
      await existingAdmin.save();

      return res.json({
        success: true,
        message: 'Admin already existed, password updated.',
      });
    }

    const admin = await Admin.create({
      username: 'jayshreeram@btp.com',
      password: 'Sharma@2024',
    });

    res.json({
      success: true,
      message: 'Default admin created successfully',
      admin: admin.username,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  loginAdmin,
  getAdminProfile,
  setupAdmin,
};