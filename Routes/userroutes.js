const express = require('express');
const userControl = require('../controlers/userControler.js');

const userRoute = express.Router();

userRoute.route('/').get(userControl.getAllUser).post(userControl.createUser);
userRoute.route('/:id').get(userControl.getOneUser).patch(userControl.updateUser).delete(userControl.deleteUser);

module.exports = userRoute;