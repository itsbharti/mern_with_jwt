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
            message: error.message
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

////////////////////
/* 
@FORGOTPASSWORD
@route- /api/auth/forgotpassword
@method- post
@description- get the token for forgot passwrd
@returns - forgotPassword Token
*/

const forgotPassword = async(req, res, next) =>  {
    const email = req.body.email
    // return response with err msg if the email is missing
    if(!email) {
        return res.status(400).json({
            success:false,
            message:'Email is required'
        })
    }

    try{
        // retrieve user using given email
        const user = await userModel.findOne({email})
        // ifuser is not found then send the err msg
        if(!user){
            return res.status(400).json({
                success: false,
                message:'Email not found'
            })
        }

        // create reset token
        const forgotPasswordToken = user.getForgotPasswordToken()
        await user.save()
        res.status(200).json({
            success:true,
            data: forgotPasswordToken,
        })
    }catch(error){
        res.status(500).json({
            success:false,
            message: error.message,
        })
    }
}

/////////////////////
/* 
@RESETPASSWORD
@route - /api/auth/resetpassword/:token
@method- post
@description - update password
@return - user objcet
*/

const resetPassword = async(req, res, next) => {
    const {token} = req.params
    const { password, confirmPassword } = req.body
    res.send(req.params.token)

    // return error message if password or confirmPassword is missing
    if (!password || !confirmPassword) {
        return res.status(400).json({
         success: false,
         message: 'password and confirmPassword is required😬',
    })
    }

    // return err msg if password and cnfrmpassword are not matched
    if(password !== confirmPassword){
        return res.status(400).json({
            success:false,
            message:'password and confirm Password does not match ❌'
        })
    }

    const hashToken = crypto.createHash('sha256').update(token).digest('hex')

    try{
        const user = await userModel.findOne({
            forgotPasswordToken: hashToken,
            forgotPasswordExpiryDate: {
                $gt: new Date() //forgotPasswordExpiryDate() shouldd be less than current date
            }
        })

        // return the msg if the user is not found
        if(!user) {
            return res.status(400).json({
                success: false,
                message:'Invalid Token or token is expired☹️'
            })
        }

        user.password = password
        await user.save()

        return res.status(200).json({
            success:true,
            message:'Successfully reset the password'
        })
    }catch(error){
        return res.status(400).json({
            success:false,
            message: error.message
        })
    }
  
}

///////////////////////////////
/* 
@LOGOUT
@route - /api/auth/logout
@method - Get
@description - remove the token form cookie
@returns - logout message and cookie without token
*/

const logout = async (req, res, next) => {
    try{
        const cookieOption ={
            expires: new Date(), // current expiry date
            httpOnly:true 
        };

        // return response with cookie without token
        res.cookie("token", null, cookieOption);
        res.status(200).json({
            success:true,
            message: "Logged Out"
        });
    }catch(error){
        res.status(400).json({
            success: false,
            message: error.message
        })

    }
}
/* 
@GETUSER
@route - /api/auth/getUSer
@method - Get
@description - recover user data frm mongoDB if user is valid(jwt auth)
@returns - user object
 */
const getUser = async(req, res, next)=> {
    const userId = req.user.id;
    try{
        const user = await userModel.findById(userId)
        return res.status(200).json({
            success:true,
            data:user
        });
    } catch(error){
        return res.status(400).json({
            success: false,
            message: error.message
        })
    }
}

module.exports = {signUp, signIn, forgotPassword, resetPassword, logout, getUser}