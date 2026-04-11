const reviewController = require('../controlers/reviewControler.js');
const authController = require('../controlers/authControler.js');
const express = require('express');
const reviewRouter = express.Router();

reviewRouter.route('/:id').post(authController.protect,reviewController.createReview);
reviewRouter.route('/').get(authController.protect,reviewController.getAllReviews);
module.exports = reviewRouter;
