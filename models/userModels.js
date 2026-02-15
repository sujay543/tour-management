const mongoose = require('mongoose');
const validator = require('validator');

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
            require: [true,'password cannot be empty']
        },
        confirmapassword: {
            type: String,
            required: true,
        }
    },
    {
        timestamp: true
    }
)

const user = mongoose.model('User',userSchema);

module.exports = user;