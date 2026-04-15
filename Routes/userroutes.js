const express = require('express');
const userControl = require('../controlers/userControler.js');
const authControl = require('../controlers/authControler.js')
const userRoute = express.Router();

userRoute.route('/signUp').post(authControl.signUp);
userRoute.route('/login').post(authControl.logIn);
userRoute.route('/forgetPassword').post(authControl.forgetPassword);
userRoute.route('/resetPassword/:token').patch(authControl.resetPassword);
userRoute.route('/updatePassword').patch(authControl.protect,authControl.updatePassword);

userRoute.route('/updateMe').patch(authControl.protect,userControl.updateMe);
userRoute.route('/me').get(authControl.protect,userControl.getMe);
userRoute.route('/').get(userControl.getAllUser).post(userControl.createUser);
userRoute.route('/:id').get(userControl.getOneUser).patch(userControl.updateUser).delete(authControl.protect,userControl.deleteUser);

module.exports = userRoute;