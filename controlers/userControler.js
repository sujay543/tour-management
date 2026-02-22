const User = require('../models/userModels');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const user = require('../models/userModels');


const filterObj = (object,...allowedfields) => 
{
  const newObj = {};
  Object.keys(object).forEach(el => {
    if(allowedfields.includes(el)){ newObj[el] = object[el] };
  })
  return newObj;
}


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

exports.updateMe = catchAsync(async(req,res,next) => {
    //create error if user tries to update his password
    if(req.body.password || req.body.confirmpassword) { return next(new AppError('This is not the right place to update password',401)); }
    
    //filtered out unwanted field names that are not allowed to be updated
    const filteredBody = filterObj(req.body,'name','email');

    const Updateduser = await User.findByIdAndUpdate(req.user.id,filteredBody,{
        new: true,
        runValidators: true
    });


    res.status(201).json(
        {
            status: 'success',
            message: "user has been updated",
            Updateduser
        }
    )
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