const User = require('../models/userModels');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const getToken = require('../utils/getToken');
const jwt = require('jsonwebtoken');
const sendMail = require('.././utils/email');
const {promisify} = require('util');
const crypto = require('crypto');




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
    console.log(user);
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
    const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${resetToken}`;
    console.log(resetUrl);
    const message = `Forgot your password? Submit a PATCH request with your new password and
    passwordConfirm to: ${resetUrl}.\n If you did not forgot your password please ignore this email`

    console.log(user);
    try{
        // to: options.email,
        //     subject: options.subject,
        //     text: options.text

    await sendMail(
    {
        email: user.email,
        subject: 'Your password reset token (Valid for 10 min)',
        text: message
    })

    res.status(200).json(
        {
            status: 'success',
            message: 'Token sent to email'
        })
    }catch(err)
    {
        user.passwordResetToken = undefined;
        user.passwordResetDate = undefined;
        user.save();
        console.log(err);
        return next(new AppError('There was an error sending the email. Try again later!',500));

    }
})

exports.resetPassword = catchAsync(async (req,res,next) => {
    //Get User based on the token
    //69359a2df90c07eb7b8e9807cd5a18ea78e4fdb75062ff215aa4d44ec04b6a7e console.log(req.params.token);
    const hashedToken = crypto
  .createHash("sha256")
  .update(req.params.token)
  .digest("hex");
  console.log(hashedToken);

  const user = await User.findOne({  passwordResetToken: hashedToken, passwordResetExpires: { $gt: Date.now()} } );
  console.log(user);

  if(!user) { return next(new AppError('Token is invlaid or expired',404)) }
//  19153e43b1eee1b1a6bf66d57e6fa31a80a9014282a32290f402371e7da470c6
  user.password = req.body.password;
  user.confirmpassword = req.body.confirmpassword;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    user.save();
    res.status(201).json(
        {
            status: 'success',
            message: "password successfully updated"
        }
    )

})

exports.updatePassword = async(req,res,next) => {
    //get user from the collection
    const user = await User.findById(req.user.id).select('+password');
    console.log(user);
    const isMatch = await user.checkPassword(req.body.password,user.password);
    if(!isMatch){ return next(new AppError('Incorrect current password',401)); }
    //check if posted current password is correct
    if(req.body.newPassword != req.body.confirmPassword)
    {
        return next(new AppError('password not match',404));
    }

    const oldOne = await user.checkPassword(req.body.newPassword,user.password);

    if(oldOne){ return next('Old password cannot be taken as new',401)};
    //If so update password
    user.password = req.body.newPassword;
    user.confirmpassword = req.body.confirmPassword;

    await user.save({validateBeforeSave: false});
    const token = getToken(user.id);
    //Log user in, send jwt
    res.status(201).json(
        {
            status: 'success',
            token
        }
    )
}