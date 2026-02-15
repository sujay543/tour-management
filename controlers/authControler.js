const User = require('../models/userModels');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const jwt = require('jsonwebtoken');


exports.signUp = catchAsync(async (req,res,next) => {
    const NewUser = await User.create(req.body);
    const token = jwt.sign({id: NewUser._id},process.env.JWTSECRETKEY,{ expiresIn: process.env.JWTexpire });

    if(!NewUser){ return next(new AppError('user not found',404)) }
    res.status(200).json(
        {
            status: 'success',
            token: token,
            user: NewUser
        }
    )
});

exports.logIn = catchAsync(async (req,res,next) => {
   const {email, password} = req.body;
    //check if email and password exist
    if(!email || !password) { return next(new AppError('email and password required',400)); }
    //check if user exist and passwod is correct
    const user = await User.findOne({email}).select('+password');
    if(!user){ return next(new AppError('user not found',400))}
    const check = await user.checkPassword(password, user.password);
    if(!check){ return next(new AppError('password is invalid',404));}
    //if everything ok send token to client
    const token = jwt.sign({id: user._id},process.env.JWTSECRETKEY,{ expiresIn: process.env.JWTexpire });
    res.status(200).json(
        {
            status: 'success',
            token
        }
    )

});