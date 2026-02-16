const User = require('../models/userModels');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const getToken = require('../utils/getToken');




exports.signUp = catchAsync(async (req,res,next) => {
    if(!req.body.name||!req.body.email||!req.body.password)
    {
        return next(new AppError('please provide name, password and email',400))
    }
    const NewUser = await User.create({name: req.body.name,
        email: req.body.email,
        password: req.body.password,
         confirmpassword: req.body.confirmpassword
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

    //verification token


    //check if user still exist


    //check if user changed the password
    next();
});