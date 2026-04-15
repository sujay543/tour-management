const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.DeleteOne = Model => catchAsync(async (req,res,next)=>{  
      const document = await Model.findByIdAndDelete(req.params.id);
      if(!document)
      { 
        return next(new AppError('No document found with that Id'),404);
      }
     res.status(204).json({
    status: 'success',
    data: null
    });
});


exports.updateOne = Model => catchAsync(async (req,res,next) =>{
    const document = await Model.findByIdAndUpdate(req.params.id,req.body,{
        new: true,
        runValidators: true
    });
    if(!document)
    {
        return next(new AppError('No document found with that Id'),404);
    }
    res.status(201).json(
        {
            status: 'success',
            data: document
        }
    );
})