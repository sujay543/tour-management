
const Tour = require('../models/tourModels.js');
const catchAsync = require('../utils/catchAsync.js');
const appError = require('../utils/appError.js');

exports.aliasTopTour = (req,res,next) => {
    req.query.limit = '5';
    req.query.sort = '-ratingsAverage,price';
    req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
    next();
}


exports.checkBody = (req,res,next) => {
    if(!req.body.name){
        return res.status(400).json(
            {
                status: 'failed',
                message: 'please include name'
            }
    )}
    next();
}




exports.getTour = async (req,res) =>{ 

    // //BUILD  the query
    const queryObject = {...req.query};
    const excludedfield = ['sort','page','field','limit'];
    excludedfield.forEach(el => delete queryObject[el]);
    const query = Tour.find(queryObject);

    //Execute the query
    const tours = await query;

    //send response
    res.status(200).json({
        status: 'success',
        results: tours.length,
        body: {
            tours
        }
    })
}






exports.createTour = catchAsync(async (req,res,next) =>{
    const newTour = await Tour.create(req.body);
    res.status(201).json({
        status: "success",
        data: newTour
    }) 
})

exports.getspecificTour = catchAsync(async (req,res,next) =>{
    const newTour = await Tour.findById(req.params.id);
    if(!newTour)
    {
        return next(new appError('No tour found with that Id'),404);
    }
    res.status(201).json(
        {
        status: "success",
        data: newTour
        }
    )
})

exports.updateTour = catchAsync(async (req,res) =>{
    const updatedTour = await Tour.findByIdAndUpdate(req.params.id,req.body,{
        new: true,
        runValidators: true
    });
    if(!updatedTour)
    {
        return next(new appError('No tour found with that Id'),404);
    }
    res.status(201).json(
        {
            status: 'success',
            data: updatedTour
        }
    );
})

exports.deleteTour = catchAsync(async (req,res)=>{  
      const newTour = await Tour.findByIdAndDelete(req.params.id);
      if(!newTour)
      { 
        return next(new appError('No tour found with that Id'),404);
      }
      res.status(200).send('success');
});

exports.getTourStats = async (req,res) => {
    try{
    const status = Tour.aggregate([
        {
            $match : { ratingAverage: { $gte: 4.5 } }
        }
    ])


    }catch(err)
    {
        res.status(404).json(
        {
            status: "failed",
        })
    }
}