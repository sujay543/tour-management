const express = require('express');
const tourControler = require('../controlers/tourControler.js');
const authControl = require('../controlers/authControler.js');

const tourRoute = express.Router();

// tourRoute.param('id',tourControler.checkId);

tourRoute.route('/top-5-cheap').get(tourControler.aliasTopTour, tourControler.getTour);

tourRoute.route('/').get(authControl.protect, tourControler.getTour).post(tourControler.createTour);
tourRoute.route('/:id').get(tourControler.getspecificTour).patch(tourControler.updateTour).delete(tourControler.deleteTour);

module.exports = tourRoute;