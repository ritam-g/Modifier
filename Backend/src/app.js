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
  'https://modifier.onrender.com',
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

// Static files and SPA fallback
app.use(express.static(path.join(__dirname, '..', 'public')));

// SPA fallback route should be last and only for non-API GET requests
app.get('*any', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

module.exports = app;
