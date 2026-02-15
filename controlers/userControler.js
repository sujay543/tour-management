const User = require('../models/userModels');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.getAllUser = catchAsync(async (req,res,next) =>{
     const users =  await User.find();

     if(!users){ return next(new AppError('users not found',404))}

    //send response
    res.status(200).json({
        status: 'success',
        results: users.length,
        body: {
            users
        }
    })
})

exports.createUser= (req,res) =>{
    res.status(404).send("this  not implemented yet");
}

exports.getOneUser = (req,res) =>{
    res.status(404).send("this  not implemented yet");
}

exports.updateUser = (req,res) =>{
    res.status(404).send("this  not implemented yet");
}
exports.deleteUser = (req,res) =>{
    res.status(404).send("this  not implemented yet");
}