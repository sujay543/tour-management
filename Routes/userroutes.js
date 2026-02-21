const express = require('express');
const userControl = require('../controlers/userControler.js');
const authControl = require('../controlers/authControler.js')
const userRoute = express.Router();

userRoute.route('/signUp').post(authControl.signUp);
userRoute.route('/login').post(authControl.logIn);
userRoute.route('/forgetPassword').post(authControl.forgetPassword);
userRoute.route('/resetPassword/:token').patch(authControl.resetPassword);

userRoute.route('/').get(userControl.getAllUser).post(userControl.createUser);
userRoute.route('/:id').get(userControl.getOneUser).patch(userControl.updateUser).delete(userControl.deleteUser);


module.exports = userRoute;