const express = require('express');
// const userModel = require('../model/user.model'); // not used here
const { userRegiestrationController, userLoginController, getMeController, logOutController } = require('../controller/auth.controller');
const { verifyToken } = require('../middleware/auth.middleware');

const authRoute = express.Router()

/**
 * create user (registration)
 */
authRoute.post('/register', userRegiestrationController)

/**
 * login existing user
 */
authRoute.post('/login', userLoginController)
/**
 * getting  user details
 */
authRoute.get('/get-me', verifyToken, getMeController)
/**
 *  user logout
 */
authRoute.get('/logout', verifyToken, logOutController)

module.exports = authRoute


