const reviewController = require('../controlers/reviewControler.js');
const authController = require('../controlers/authControler.js');
const express = require('express');
const reviewRouter = express.Router({ mergeParams: true });

reviewRouter.use(authController.protect);

reviewRouter.route('/')
.get(authController.protect,reviewController.getAllReviews)
.post(authController.protect, authController.restrictTo('user'),reviewController.validateReview,reviewController.createReview);
reviewRouter.route('/:id').get(reviewController.getSpecificReview).patch(reviewController.updateReview).delete(authController.protect,authController.restrictTo('admin'),reviewController.deleteReview);

module.exports = reviewRouter;
