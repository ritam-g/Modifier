const express = require('express');
// const userModel = require('../model/user.model'); // not used here
const { userRegiestrationController, userLoginController } = require('../controller/auth.controller');

const authRoute = express.Router()

/**
 * create user (registration)
 */
authRoute.post('/register', userRegiestrationController)

/**
 * login existing user
 */
authRoute.post('/login', userLoginController)

module.exports = authRoute


