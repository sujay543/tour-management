const Review = require('../models/reviewModel.js');
const AppError = require('../utils/appError.js');
const catchAsync = require('../utils/catchAsync.js');
const factory = require('./handlerfactory.js');

exports.validateReview =  catchAsync(async(req,res,next) => {
    const {review,ratings} = req.body;
    if(!review || !ratings)
    {
        return next(new AppError('review and ratings cant be empty',400));
    }
    next();

})


exports.createReview = factory.createOne(Review);

exports.getAllReviews = catchAsync(async(req,res,next) => {
    let filter = {};
    if(req.params.tourId) filter = { tour: req.params.tourId }; 
   const reviews = await Review.find(filter);
    res.status(200).json(
        {
            status: 'success',
            length: reviews.length,
            data: {
                reviews
            }
        }
    )

})
exports.getSpecificReview = factory.getOne(Review);
exports.deleteReview = factory.DeleteOne(Review);
exports.updateReview = factory.updateOne(Review);