const express = require('express');
const tourControler = require('../controlers/tourControler.js');
const authController = require('../controlers/authControler.js');
const reviewController = require('../controlers/reviewControler.js');
const reviewRouter = require('./reviewRoutes.js');
const tourRoute = express.Router();

// tourRoute.param('id',tourControler.checkId);
tourRoute.use('/:tourId/reviews',reviewRouter);
tourRoute.route('/top-5-cheap').get(tourControler.aliasTopTour, tourControler.getTour);

tourRoute.route('/').get(authController.protect, tourControler.getTour).post(tourControler.createTour);
tourRoute.route('/:id').get(tourControler.getspecificTour).patch(tourControler.updateTour).delete(authController.protect,authController.restrictTo('admin'),tourControler.deleteTour);

module.exports = tourRoute;