const User = require('../models/userModels');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const getToken = require('../utils/getToken');
const jwt = require('jsonwebtoken');
const {promisify} = require('util');




exports.signUp = catchAsync(async (req,res,next) => {
    if(!req.body.name||!req.body.email||!req.body.password)
    {
        return next(new AppError('please provide name, password and email',400))
    }
    const NewUser = await User.create({name: req.body.name,
        email: req.body.email,
        password: req.body.password,
         confirmpassword: req.body.confirmpassword,
         passwordChangedAt: req.body.passwordChangedAt,
         role: req.body.role

});
    const token = getToken(NewUser._id);
    NewUser.password = undefined;
    res.status(201).json(
        {
            status: 'success',
            token,
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
    const token = getToken(user._id);
    res.status(200).json(
        {
            status: 'success',
            token
        }
    )

});

exports.protect =catchAsync(async (req,res,next) => {
    //get token and check if it is actually there
    let token;
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer'))
    {
        token = req.headers.authorization.split(' ')[1];

    }
    // console.log(token);
    //verification token
    if(!token){ 
       return  next(new AppError('you are not logged in! please logg in to get access',401));
    }

    const decoded = await promisify(jwt.verify)(token,process.env.JWTSECRETKEY);
    //check if user still exist

    const user = await User.findById(decoded.id);

    if(!user)
    {
      return  next(new AppError('The user belonging the token! does not exist',401));
    }
        //check if user changed the password
    if(user.changePasswordAfter(decoded.iat))
    {
        return next(new AppError('User recently changed the password! please log in again',401));
    }
    req.user = user;
    next();
});

exports.restrictTo = (...roles) => {
    return (req,res,next) => {
        console.log(req.user.role);
        if(!roles.includes(req.user.role))
        {
            return next(new AppError('You do not have permission to use this route',403));
        }
        next();
    }
    
}


exports.forgetPassword = catchAsync(async(req,res,next) => {
    //find and validate the user
    const user = await User.findOne({email: req.body.email});
    if(!user){ return next('not able to find the user',404); }
    //Generate the reset Token
    const resetToken = await user.createPasswordResetToken();
    console.log(resetToken);
    await user.save({ validateBeforeSave: false});

    //send email for reseting password
    

})