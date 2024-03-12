const express = require('express');
const { signUp, signIn, forgotPassword, resetPassword } = require('../controller/authController');
const authRouter = express.Router();

authRouter.post('/signup', signUp)

authRouter.post('/signin', signIn)
authRouter.post('/forgotpassword', forgotPassword)
authRouter.post('/resetpassword/:token', resetPassword)

module.exports = authRouter