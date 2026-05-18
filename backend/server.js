const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');
const sequelize = require('./config/database');

// Load env vars
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ==========================
// CREATE UPLOADS FOLDER
// ==========================

const uploadsPath = path.join(process.cwd(), 'uploads');

if (!fs.existsSync(uploadsPath)) {
  fs.mkdirSync(uploadsPath, { recursive: true });
}

// ==========================
// STATIC UPLOADS FOLDER
// ==========================

app.use('/uploads', express.static(uploadsPath));

// ==========================
// IMPORT ROUTES
// ==========================

const authRoutes = require('./routes/authRoutes');
const serviceRoutes = require('./routes/serviceRoutes');
const projectRoutes = require('./routes/projectRoutes');
const galleryRoutes = require('./routes/galleryRoutes');
const teamRoutes = require('./routes/teamRoutes');
const testimonialRoutes = require('./routes/testimonialRoutes');
const inquiryRoutes = require('./routes/inquiryRoutes');
const settingRoutes = require('./routes/settingRoutes');

// ==========================
// API ROUTES
// ==========================

app.use('/api/auth', authRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/team', teamRoutes);
app.use('/api/testimonials', testimonialRoutes);
app.use('/api/inquiries', inquiryRoutes);
app.use('/api/settings', settingRoutes);

// ==========================
// HEALTH CHECK
// ==========================

app.get('/', (req, res) => {
  res.send('Backend Running Successfully 🚀');
});

// ==========================
// ERROR HANDLER
// ==========================

app.use((err, req, res, next) => {

  console.error(err.stack);

  res.status(500).json({
    success: false,
    message: err.message || 'Server Error',
  });

});

// ==========================
// PORT
// ==========================

const PORT = process.env.PORT || 5000;

// ==========================
// START SERVER
// ==========================

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

    // SYNC DATABASE

    await sequelize.sync();

    console.log('All models synchronized successfully.');

    // SEED DATABASE

    const seedDatabase = require('./seeders/seed');

    await seedDatabase();

    // START SERVER

    app.listen(PORT, () => {

      console.log(`Server running on port ${PORT}`);

    });

  } catch (error) {

    console.error('Unable to connect to the database:', error);

    process.exit(1);

  }

};

startServer();