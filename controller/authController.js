const userModel = require('../model/userSchema')
const bcrypt = require('bcrypt')

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

module.exports = {signUp}