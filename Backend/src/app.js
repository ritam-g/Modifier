const express = require('express');
const cors = require('cors');
const authRoute = require('./routes/auth.route');
const cookieParser = require('cookie-parser');
const songRoute = require('./routes/song.route');
const path = require('path');

const app = express();
// built-in middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// CORS configuration – only call once and keep credentials enabled.  When the
// frontend is deployed to a different origin make sure that origin is added
// to the list below (you can use an environment variable instead of hard‑coding
// so your Render configuration can be changed without editing code).
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  'http://localhost:5174',
  'https://modifier-1.onrender.com',
  process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // allow requests with no origin (e.g. same-origin, mobile apps, curl)
    if (!origin) return callback(null, true);
    if (allowedOrigins.some(allowed => origin.startsWith(allowed) || allowed === origin)) {
      return callback(null, true);
    }
    return callback(new Error('CORS policy: origin not allowed'));
  },
  credentials: true
}));
app.use(cookieParser());
// mount API routes first
app.use('/api/auth', authRoute);
app.use('/api/song', songRoute);
app.get('/api/health', (req, res) => res.send({ status: 'ok' }));

// Diagnosis route (REMOVE AFTER FIX)
app.get('/api/diag', async (req, res) => {
  const diag = {
    db: require('mongoose').connection.readyState === 1 ? 'CONNECTED' : 'NOT CONNECTED',
    env: {
      HAS_MONGO_URI: !!process.env.MONGO_URI,
      HAS_JWT_SECRET: !!process.env.JWT_SECRET,
      HAS_REDIS_HOST: !!process.env.REDIS_HOST,
      PORT: process.env.PORT,
      NODE_ENV: process.env.NODE_ENV
    },
    redis: 'CHECKING...'
  };
  try {
    await require('./config/cache').set('diag_test', Date.now());
    diag.redis = 'CONNECTED';
  } catch (e) {
    diag.redis = 'ERROR: ' + e.message;
  }
  res.json(diag);
});

// Static files and SPA fallback
app.use(express.static(path.join(__dirname, '..', 'public')));

// SPA fallback route should be last and only for non-API GET requests
app.get('*any', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

module.exports = app;
