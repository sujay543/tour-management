
const Tour = require('../models/tourModels.js');
const catchAsync = require('../utils/catchAsync.js');
const appError = require('../utils/appError.js');
const factory = require('./handlerfactory.js');
const ApiFeatures = require('./../utils/apiFeatures.js');
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


    const features = new ApiFeatures(Tour.find(), req.query)
        .filter()
        .sorting()
        .fields()
        .paging();


    //Execute the query
    const tours = await features.query;

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

exports.getTourStats = catchAsync(async (req,res) => {
    const stats = await Tour.aggregate([
        {
            $match : { ratingAverage: { $gte: 3 } }
        },{
            $group: {
                _id: { $toUpper: '$difficulty'},
                numTours: { $sum: 1},
                numRatings: { $sum: '$ratingsQuantity'},
                avgRatings: { $avg: '$ratingAverage'},
                avgPrice: { $avg: '$price'},
                minPrice: { $min: '$price'},
                maxPrice: { $max: '$price'},

            }
        },
        {
            $sort: { avgPrice: 1 }
        },
        {
            $match: { _id: { $ne: 'EASY' }}
        }
    ])
    
    res.status(200).json(
        {
            status: 'success',
            data: {
                stats
            }
        }
    )
});