const express = require('express');
const userControl = require('../controlers/userControler.js');
const authControl = require('../controlers/authControler.js')
const userRoute = express.Router();

// Public routes
userRoute.post('/signUp', authControl.signUp);
userRoute.post('/login', authControl.logIn);
userRoute.post('/forgetPassword', authControl.forgetPassword);
userRoute.patch('/resetPassword/:token', authControl.resetPassword);

// Protect all routes after this
userRoute.use(authControl.protect);

// User routes
userRoute.patch('/updatePassword', authControl.updatePassword);
userRoute.patch('/updateMe', userControl.updateMe);
userRoute.get('/me', userControl.getMe);

// Admin routes
userRoute.use(authControl.restrictTo('admin'));

userRoute.route('/')
    .get(userControl.getAllUser)
    .post(userControl.createUser);

userRoute.route('/:id')
    .get(userControl.getOneUser)
    .patch(userControl.updateUser)
    .delete(userControl.deleteUser);

module.exports = userRoute;