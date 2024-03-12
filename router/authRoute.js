const express = require('express');
const { signUp, signIn, forgotPassword, resetPassword, logout, getUser } = require('../controller/authController');
const jwtAuth = require('../middleware/jwtAuth');

const authRouter = express.Router();


authRouter.post('/signup', signUp)

authRouter.post('/signin', signIn)
authRouter.post('/forgotpassword', forgotPassword)
authRouter.post('/resetpassword/:token', resetPassword)

authRouter.get('/logout',jwtAuth, logout)
authRouter.get('/user',jwtAuth, getUser)

module.exports = authRouter