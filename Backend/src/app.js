const express = require('express');
const cors = require('cors');
const authRoute = require('./routes/auth.route');

const app = express();

// built-in middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// mount auth routes under versioned API path
app.use('/api/auth', authRoute);

// health check
app.get('/api/health', (req, res) => res.send({ status: 'ok' }));

module.exports = app;