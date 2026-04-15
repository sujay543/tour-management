const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const Tour = require('../models/tourModels');

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

exports.createOne = Model => catchAsync(async (req,res,next) =>{
    const document = await Model.create(req.body);
    res.status(201).json({
        status: "success",
        data: document
    }) 
})

exports.getOne = (Model,popOptions) => catchAsync(async (req,res,next) =>{
    //const tour = await Tour.findById(req.params.id).populate('reviews');

    let query = Model.findById(req.params.id);
    if(popOptions) { query = query.populate(popOptions); }
    const doc = await query;
    if(!doc)
    {
        return next(new AppError('no document found with that Id',404));
    }
    res.status(200).json(
        {
        status: "success",
        data: doc
        }
    )
})