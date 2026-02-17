const express = require('express');
const morgan = require('morgan');
const globalErrorHandler = require('./controlers/errorControler.js');
const AppError = require('./utils/appError.js');
const tourRoute = require('./Routes/tourroutes.js');
const userRoute = require('./Routes/userroutes.js');
const app = express();
app.use(express.json());

if(process.env.NODE_ENV === 'development'){
  app.use(morgan('dev'));
}


app.use((req,res,next) => {
    req.currentDate = new Date().toISOString();
    console.log(req.headers);
    next();
})


app.use('/api/v1/tours',tourRoute);
app.use('/api/v1/users',userRoute);

app.all(/.*/,(req,res,next) => {
  next(new AppError(`Can't find this ${req.originalUrl} in this server`));
})


app.use(globalErrorHandler);

module.exports = app;

