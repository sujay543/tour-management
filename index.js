
const express = require('express');
const morgan = require('morgan');
const tourRoute = require('./Routes/tourroutes.js');
const userRoute = require('./Routes/userroutes.js');
const app = express();
app.use(express.json());

if(process.env.NODE_ENV === 'development'){
  app.use(morgan('dev'));
}


app.use((req,res,next) => {
    req.currentDate = new Date().toISOString();
    next();
})


app.use('/api/v1/tours',tourRoute);
app.use('/api/v1/users',userRoute);

module.exports = app;

