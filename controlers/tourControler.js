
const Tour = require('../models/tourModels.js');
const catchAsync = require('../utils/catchAsync.js');
const appError = require('../utils/appError.js');
const factory = require('./handlerfactory.js');
const { default: mongoose } = require('mongoose');
const AppError = require('../utils/appError.js');

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
    const excludedfield = ['sort','page','fields','limit'];
    excludedfield.forEach(el => delete queryObject[el]);
    
    //advance filtering
    let queryString = JSON.stringify(queryObject);
    queryString = queryString.replace(/\b(gt|gte|lt|lte)\b/g,match => `$${match}`);
    let query = Tour.find(JSON.parse(queryString));
    //sorting 
    if(req.query.sort)
    { 
        const sortBy = req.query.sort.split(',').join(' ');
        query = query.sort(sortBy);
    }else{
       query =  query.sort('-createdAt');
    }
    //field
    if(req.query.fields)
    {
        const includefield = req.query.fields.split(',').join(' ');
        query = query.select(includefield);
    }else{
        query = query.select('-__v');
    }

    //pagination
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 100;
    const skip = (page-1) * limit;

    if(req.query.page)
    {
        const countDocument = Tour.countDocuments();
        if(skip > countDocument)
        {
            return next(new AppError('page does not exist'));
        }
    }

    query = query.skip(skip).limit(limit);
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






exports.createTour = factory.createOne(Tour);

exports.getspecificTour = factory.getOne(Tour,"reviews");

exports.updateTour = factory.updateOne(Tour);

exports.deleteTour = factory.DeleteOne(Tour);

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