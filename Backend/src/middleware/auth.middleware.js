const jwt = require('jsonwebtoken');
const blacklistModel = require('../model/blacklist.model');
const redis = require('../config/cache');

async function verifyToken(req, res, next) {

    //!{ id: user._id, email: user.email }
    const token = req.cookies.token
    //NOTE - blacklist token checking
    const blackListToken = await redis.get(token)
    if (blackListToken) return res.status(401).json({ message: ' user is unathorize ' })

    if (!token) return res.status(401).json({
        message: 'token is invalid'
    })


    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
        req.user = decoded; // attach payload to request
        next();
    } catch (err) {
        return res.status(401).json({ message: 'Invalid or expired token' });
    }
}

module.exports = { verifyToken };
