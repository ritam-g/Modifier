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
// app.use(
//     cors({
//         origin: "http://localhost:5173",
//         credentials: true,
//     })
// );
app.use(cors())
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '..', 'public')));

// mount API routes first
app.use('/api/auth', authRoute);
app.use('/api/song', songRoute);
app.get('/api/health', (req, res) => res.send({ status: 'ok' }));

// SPA fallback route should be last and only for non-API GET requests
app.use((req, res, next) => {
    if (req.method !== 'GET') return next();
    if (req.path.startsWith('/api')) return next();

    return res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

module.exports = app;
