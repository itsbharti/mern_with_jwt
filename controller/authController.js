const userModel = require('../model/userSchema')
const bcrypt = require('bcrypt')
// const cookie = require('cookie-parser')
const crypto = require('crypto')
const emailValidator = require('email-validator')

/* 
@signup 
@route - /api/auth/signup
@method- post
@access public
@description- sign up a user
@body - name, email, password, confirmPassword
@return user object */

const signUp = async (req, res) => {
    const {name, email, password, confirmPassword} = req.body
    // every field is required
    if(!name || !email || !password || !confirmPassword) {
        return res.status(400).json({
            success:false,
            message:'All fields are required to be filled'
        })
    }

    // validate email use npm package email-validator
    const validEmail = emailValidator.validate(email)
    if(!validEmail) {
        return res.status(400).json({
            success:false,
            message:'Invalid email'
        })
    }

    try{
        //send pw not matched err if password is not equal to confirmpassword
        if(password !== confirmPassword) {
            return res.status(400).json({
                success:false, 
                message:'password not match'
            })
        }
        const userInfo = new userModel(req.body)
        // save the user to the database
        const result = await userInfo.save()
        return res.status(200).json({
            success:true,
            message:'User Created Successfully',
            data: result
        })
    }catch{
        // send err msg user is already exist 
        if(error.code === 11000) {
            return res.status(400).json({
                success:false,
                message: 'Email already registered'
            })
        }
        return res.status(500).json({
            success: false,
            message: error.message,
        })

    }

}
///////////////////////////////////////////////////////////////////
/*
@SignIn
@route - /api/auth/signIn
@method - post
@description - verify user and send cookie with jwt token
@body - email, password
@return - user object , cookie
*/

const signIn = async (req, res, next) => {
    const {email, password} = req.body
    // send response with error message if email or password is missing
    if(!email || !password){
        return res.status(400).json({
            success: false,
            message:'Email and password is required'
        })
    }

    try{
        // check user is exist or not
        const user = await userModel
        .findOne({email}).select('+password')

        // if user is null or the pw is not match with then send err msg
        if(!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({
                success:false,
                message:'Invalid email or password'
            })
        }
        // send the user object with jwt token in cookie
        const token = user.jwtToken()
        user.password = undefined
        const cookieOption = {
            expire: new Date(Date.now() + 24 * 60 * 60 * 1000),
            httpOnly: true, // cookie is not accesible by client 
        }
        res.cookie('token', token, cookieOption)
        res.status(200).json({
            success:true,
            data:user
        })
    }catch (error){
        res.status(500).json({
            success:false,
            message: error.message
        })
    }
}


module.exports = {signUp, signIn}