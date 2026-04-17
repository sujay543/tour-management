
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

class ApiFeatures
{
    constructor(query,queryString)
    {
        this.query = query;
        this.queryString = queryString;
    }

    filter()
    {
          // //BUILD  the query
        const queryObject = {...this.queryString};
        const excludedfield = ['sort','page','fields','limit'];
        excludedfield.forEach(el => delete queryObject[el]);
        
        //advance filtering
        let queryString = JSON.stringify(queryObject);
        queryString = queryString.replace(/\b(gt|gte|lt|lte)\b/g,match => `$${match}`);
        this.query = this.query.find(JSON.parse(queryString));
        return this;
    }

    sorting()
    {
        //sorting 
    if(this.queryString.sort)
    { 
        const sortBy = this.queryString.sort.split(',').join(' ');
        this.query = this.query.sort(sortBy);
    }else{
       this.query =  this.query.sort('-createdAt');
    }
    return this;
    }

    fields()
    {
        //field
    if(this.queryString.fields)
    {
        const includefield = this.queryString.fields.split(',').join(' ');
        this.query = this.query.select(includefield);
    }else{
        this.query = this.query.select('-__v');
    }
    return this;
    }

    paging()
    {
          //pagination
    const page = Number(this.queryString.page) || 1;
    const limit = Number(this.queryString.limit) || 100;
    const skip = (page-1) * limit;
    
    this.query = this.query.skip(skip).limit(limit);
    return this;
    }
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