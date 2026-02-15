const User = require('../models/userModels');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.signUp = catchAsync(async (req,res,next) => {
    const NewUser = await User.create(req.body);
    if(!NewUser){ return next(new AppError('user not found',404)) }
    res.status(200).json(
        {
            status: 'success',
            user: NewUser
        }
    )
});
