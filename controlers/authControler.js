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
