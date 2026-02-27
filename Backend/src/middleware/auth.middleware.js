const jwt = require('jsonwebtoken');

function verifyToken(req, res, next) {

    //!{ id: user._id, email: user.email }
    const token = req.cookies.token
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
