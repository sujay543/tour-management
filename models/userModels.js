const mongoose = require('mongoose');
const validator = require('validator');
const crypto = require('crypto');
const bcrypt = require('bcrypt');


const userSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: [true,'name cannot be empty']
        },
        email: {
            type: String,
            lowercase: true,
            unique: true,
            required: [true,'email is required'],
            validate: [validator.isEmail,'please provide your email']
        },
        password: {
            type: String,
            required: [true,'password cannot be empty'],
            select: false
        },
        role: {
            type: String,
            enum: ['user','admin'],
            default: 'user'
        },
        confirmpassword: {
            type: String,
            required: true,
            validate: {
                validator: function(el){
                return el === this.password
                },
            message: 'password are not same'
              }
        },
         passwordChangedAt: Date,
         passwordResetToken: String,
         passwordResetDate: Date
    },
    {
        timestamps: true
    }
)

userSchema.pre('save', async function(){
    if(!this.isModified('password')){ return }
    this.password = await bcrypt.hash(this.password,12);
    this.confirmpassword = undefined;
})

userSchema.methods.checkPassword = async function(password,correctpassword)
{
    return await bcrypt.compare(password,correctpassword);
}

userSchema.methods.changePasswordAfter = function(JwttimeStamp)
{
    if(this.passwordChangedAt)
    {
        const changedTimeStamp = this.passwordChangedAt.getTime()/1000;
        return JwttimeStamp < changedTimeStamp;
    }

    return false;
}

userSchema.methods.createPasswordResetToken = async function()
{
    const resetToken = crypto.randomBytes(32).toString('hex');
    this.passwordResetToken = crypto.createHash('SHA-256').update(resetToken).digest('hex');
    this.passwordResetDate = Date.now() + 10 * 60 * 1000;
    return resetToken;
}

const user = mongoose.model('User',userSchema);

module.exports = user;