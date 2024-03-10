const mongoose = require('mongoose')
const {Schema} = mongoose
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const JWT = require('jsonwebtoken');



const userSchema = new Schema(
    {
      name: {
        type: String,
        require: [true, 'user name is Required'],
        minLength: [5, 'Name must be at least 5 characters'],
        maxLength: [50, 'Name must be less than 50 characters'],
        trim: true,
      },
      email: {
        type: String,
        required: [true, 'user email is required'],
        lowercase: true,
        unique: [true, ' Email already exists'],
      },
      password: {
        type: String,
        select: false,
      },
      forgotPasswordToken: {
        type: String,
      },
      forgotPasswordExpiryDate: {
        type: Date,
      },
    },
    { timestamps: true }
  );

// hashing password  before saving to the database
userSchema.pre('save', async function(next) {
    // if passwrd is not modified then move to the next middleware
    if(!this.isModified('password')) return next();
    //hash the password
    this.password = await bcrypt.hash(this.password, 10);
    return next()
})

// check if these methods are working as expected
userSchema.methods = {
    // method for generating the  jwt token
    jwtToken(){
        return JWT.sign({id: this.id, email: this.email},
        process.env.SECRET,
        {expiresIn: '24h'}
        )  
    },
    // userschema method for generating and return the forgotpassword token
    getForgotPassword() {
        const forgotToken = crypto.randomBytes(20).toString('hex')
        // step - save to database
        this.forgotPasswordToken = crypto.createHash('sha256').update(forgotToken).digest('hex')
        //step 2- forgot pw expiry date
        this.forgotPasswordExpiryDate = Date.now() +20 * 60 * 1000
        // return the token
        return forgotToken
    }
}

const userModel = mongoose.model('user', userSchema)
module.exports = userModel