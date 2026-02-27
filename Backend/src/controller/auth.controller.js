const userModel = require("../model/user.model")
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const blacklistModel = require("../model/blacklist.model")

// hash password helper
async function hashPassword(password) {
    const salt = await bcrypt.genSalt(10)
    return bcrypt.hash(password, salt)
}

async function userRegiestrationController(req, res) {
    try {
        const { username, password, email } = req.body

        // basic payload validation
        if (!username || !password || !email) {
            return res.status(400).json({ message: 'username, email and password are required' })
        }

        const userExiest = await userModel.findOne({
            $or: [{ email }, { username }]
        })
        if (userExiest) {
            return res.status(409).json({
                message: 'please choose a different email or username'
            })
        }

        const hashed = await hashPassword(password)
        const user = await userModel.create({
            email,
            password: hashed,
            username
        })
        return res.status(201).json({
            message: 'registration success',
            user: { id: user._id, email: user.email, username: user.username }
        })

    } catch (err) {
        console.error(err)
        return res.status(500).json({
            message: 'something went wrong'
        })
    }
}
/**
 * user login controller 
 */
async function userLoginController(req, res) {
    try {
        const { email, password } = req.body
        if (!email || !password) {
            return res.status(400).json({ message: 'email and password are required' })
        }

        const user = await userModel.findOne({ email }).select("+password")
        if (!user) {
            return res.status(401).json({ message: 'invalid credentials' })
        }

        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return res.status(401).json({ message: 'invalid credentials' })
        }

        // generate JWT
        const payload = { id: user._id, email: user.email }
        const token = jwt.sign(payload, process.env.JWT_SECRET || 'secret', { expiresIn: '1h' })
        res.cookie('token', token)
        return res.status(200).json({
            message: 'login successful',
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        })
    } catch (err) {
        console.error(err)
        return res.status(500).json({ message: 'something went wrong' })
    }
}
/**
 * 
 * user details controller
 */
async function getMeController(req, res) {
    try {
        const user = await userModel.findById(req.user.id)
        if (!user) {
            return res.status(401).json({
                message: 'invalid token'
            })
        }
        return res.status(200).json({
            message: 'user is authorize to get acess',
            user
        })
    } catch (err) {
        console.log(err);

        return res.status(404).json({
            message: 'something went worng '
        })
    }
}
/**
 * 
 * user logout controller
 */
async function logOutController(req, res) {
    try {
        const token = req.cookies.token
        res.clearCookie("token")
        await blacklistModel.create({
            token
        })
        return res.status(200).json({
            message:'logout sucessfully '
        })
    } catch (err) {
        console.log(err);
        return res.status(404).json({
            message: 'somtign went wrong '
        })

    }
}
module.exports = {logOutController, userRegiestrationController, userLoginController, getMeController }