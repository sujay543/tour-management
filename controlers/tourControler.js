
const Tour = require('../models/tourModels.js');
const catchAsync = require('../utils/catchAsync.js');
const appError = require('../utils/appError.js');
const factory = require('./handlerfactory.js');

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
    console.log(queryObject);
    let queryString = JSON.stringify(queryObject);
    queryString = queryString.replace(/\b(gt|gte|lt|lte)\b/g,match => `$${match}`);
    const query = Tour.find(JSON.parse(queryString));

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