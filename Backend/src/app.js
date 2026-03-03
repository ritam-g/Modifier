const express = require('express');
const cors = require('cors');
const authRoute = require('./routes/auth.route');
const cookieParser = require('cookie-parser');
const songRoute = require('./routes/song.route');
const app = express();
// built-in middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
    cors({
        origin: "http://localhost:5173",
        credentials: true,
    })
);
app.use(cookieParser())

// mount auth routes under versioned API path
app.use('/api/auth', authRoute);

//song making route
app.use('/api/song',songRoute)
// health check
app.get('/api/health', (req, res) => res.send({ status: 'ok' }));

module.exports = app;