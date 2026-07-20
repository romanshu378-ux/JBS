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
// SECURITY MIDDLEWARE
// ===============================

const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');

// Explicitly remove X-Powered-By to not leak Express info
app.disable('x-powered-by');

// Helmet: security headers suite
app.use(
  helmet({
    // Allow cross-origin resources (needed for Render-hosted uploads)
    crossOriginResourcePolicy: { policy: 'cross-origin' },

    // Content Security Policy — backend API responses; not a browser app so permissive
    contentSecurityPolicy: false,

    // HSTS — enforce HTTPS on Render
    strictTransportSecurity: {
      maxAge: 63072000,
      includeSubDomains: true,
      preload: true,
    },

    // Prevent MIME-type sniffing
    noSniff: true,

    // Prevent clickjacking
    frameguard: { action: 'deny' },

    // Hide server details
    hidePoweredBy: true,

    // Referrer policy
    referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
  })
);

// Compression: Brotli-first, Gzip fallback (threshold: 1KB)
app.use(compression({ threshold: 1024 }));

// ── Rate Limiters ─────────────────────────────────────────────────────────────

// General API limiter: 100 requests per 15 minutes
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests. Please try again later.' },
});

// Strict limiter for auth routes: 10 requests per 15 minutes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many authentication attempts. Please try again later.' },
});

app.use('/api', limiter);

// ── CORS ───────────────────────────────────────────────────────────────────────
const ALLOWED_ORIGINS = [
  'https://jankiballabh.com',
  'https://www.jankiballabh.com',
  // Allow Vercel preview deployments
  /\.vercel\.app$/,
  // Allow localhost for local development
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:3000',
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, curl, Postman)
      if (!origin) return callback(null, true);

      const allowed = ALLOWED_ORIGINS.some((o) =>
        o instanceof RegExp ? o.test(origin) : o === origin
      );

      if (allowed) {
        callback(null, true);
      } else {
        callback(new Error(`CORS: Origin '${origin}' not allowed`));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.use(express.json({ limit: '10mb' }));

app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ===============================
// UPLOADS FOLDER SETUP
// ===============================

const uploadsPath = path.join(__dirname, 'uploads');

// Create uploads folder automatically
if (!fs.existsSync(uploadsPath)) {

  fs.mkdirSync(uploadsPath, { recursive: true });

}

// Static access with cache-control (1 year for images)
app.use('/uploads', express.static(uploadsPath, {
  maxAge: '1y',
  setHeaders: (res, path) => {
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
  }
}));

// ===============================
// ROUTES
// ===============================

const authRoutes = require('./routes/authRoutes');
const serviceRoutes = require('./routes/serviceRoutes');
const serviceCategoryRoutes = require('./routes/serviceCategoryRoutes');
const { featureRoutes, processRoutes, industryRoutes, benefitRoutes, faqRoutes } = require('./routes/serviceRelationsRoutes');
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

app.use('/api/auth', authLimiter, authRoutes);

app.use('/api/services', serviceRoutes);
app.use('/api/service-categories', serviceCategoryRoutes);
app.use('/api/features', featureRoutes);
app.use('/api/process', processRoutes);
app.use('/api/industries', industryRoutes);
app.use('/api/benefits', benefitRoutes);
app.use('/api/faqs', faqRoutes);

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

    if (process.env.NODE_ENV !== 'production') {
      console.log('Database connection successful.');
    }

    // SEQUELIZE CONNECT

    await sequelize.authenticate();

    if (process.env.NODE_ENV !== 'production') {
      console.log('MySQL connected via Sequelize.');
    }

    // DATABASE SYNC

    await sequelize.sync();

    if (process.env.NODE_ENV !== 'production') {
      console.log('All models synchronized successfully.');
    }

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