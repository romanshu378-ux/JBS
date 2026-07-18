const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');
const sequelize = require('./config/database');

// LOAD ENV
dotenv.config();

const app = express();

// ===============================
// MIDDLEWARE
// ===============================

const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');

app.use(helmet({
  crossOriginResourcePolicy: false,
}));

app.use(compression());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 100, 
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api', limiter);

app.use(cors());

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

// ===============================
// UPLOADS FOLDER SETUP
// ===============================

const uploadsPath = path.join(__dirname, 'uploads');

// Create uploads folder automatically
if (!fs.existsSync(uploadsPath)) {

  fs.mkdirSync(uploadsPath, { recursive: true });

}

// Static access
app.use('/uploads', express.static(uploadsPath));

// ===============================
// ROUTES
// ===============================

const authRoutes = require('./routes/authRoutes');
const serviceRoutes = require('./routes/serviceRoutes');
const projectRoutes = require('./routes/projectRoutes');
const galleryRoutes = require('./routes/galleryRoutes');
const teamRoutes = require('./routes/teamRoutes');
const testimonialRoutes = require('./routes/testimonialRoutes');
const inquiryRoutes = require('./routes/inquiryRoutes');
const settingRoutes = require('./routes/settingRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');

// ===============================
// API ROUTES
// ===============================

app.use('/api/auth', authRoutes);

app.use('/api/services', serviceRoutes);

app.use('/api/projects', projectRoutes);

app.use('/api/gallery', galleryRoutes);

app.use('/api/team', teamRoutes);

app.use('/api/testimonials', testimonialRoutes);

app.use('/api/inquiries', inquiryRoutes);

app.use('/api/settings', settingRoutes);

app.use('/api/dashboard', dashboardRoutes);

// ===============================
// TEST ROUTE
// ===============================

app.get('/', (req, res) => {

  res.send('Backend Running Successfully 🚀');

});

// ===============================
// ERROR HANDLER
// ===============================

app.use((err, req, res, next) => {

  console.error(err.stack);

  res.status(500).json({

    success: false,

    message: err.message || 'Server Error',

  });

});

// ===============================
// PORT
// ===============================

const PORT = process.env.PORT || 5000;

// ===============================
// START SERVER
// ===============================

const startServer = async () => {

  try {

    // MYSQL CONNECTION TEST

    const mysql = require('mysql2/promise');

    const connection = await mysql.createConnection({

      host: process.env.DB_HOST,

      user: process.env.DB_USER,

      password: process.env.DB_PASSWORD,

      port: process.env.DB_PORT,

      ssl: {

        minVersion: 'TLSv1.2',

        rejectUnauthorized: false,

      },

    });

    await connection.end();

    console.log('Database connection successful.');

    // SEQUELIZE CONNECT

    await sequelize.authenticate();

    console.log('MySQL connected via Sequelize.');

    // DATABASE SYNC

    await sequelize.sync();

    console.log('All models synchronized successfully.');

    // SEED DATABASE

    const seedDatabase = require('./seeders/seed');

    await seedDatabase();

    // START EXPRESS SERVER

    app.listen(PORT, () => {

      console.log(`Server running on port ${PORT}`);

    });

  } catch (error) {

    console.error('Unable to connect to the database:', error);

    process.exit(1);

  }

};

startServer();