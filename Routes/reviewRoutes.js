const reviewController = require('../controlers/reviewControler.js');
const authController = require('../controlers/authControler.js');
const express = require('express');
const reviewRouter = express.Router({ mergeParams: true });


reviewRouter.route('/')
.get(authController.protect,reviewController.getAllReviews)
.post(authController.protect, authController.restrictTo('user'),reviewController.createReview);

module.exports = reviewRouter;
