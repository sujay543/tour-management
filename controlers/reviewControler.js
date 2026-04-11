const Review = require('../models/reviewModel.js');
const AppError = require('../utils/appError.js');
const catchAsync = require('../utils/catchAsync.js');

exports.createReview = catchAsync(async(req,res,next) => {
    const tourId = req.params.id;
    if(!tourId)
    {
        return next(new AppError('please share the tour id',400))
    }
    const {review,ratings} = req.body;
    if(!review || !ratings)
    {
        return next(new AppError('review and ratings cant be empty',400));
    }
    const userId = req.user._id;
    const newReview = await Review.create(
        {
            ratings,
            review,
            tour: tourId,
            user: userId
        }
    )

    res.status(200).json(
        {
            status: 'success',
            message: 'review has been created',
            data: {
                newReview
            }
        }
    )

})

exports.getAllReviews = catchAsync(async(req,res,next) => {
   const reviews = await Review.find();
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