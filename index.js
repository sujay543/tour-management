
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

app.all(/.*/,(req,res,next) => {
  // res.status(404).json({
  //   status: 'Failed',
  //   message: `Can't find this ${req.originalUrl}`
  // })

  const err  = new Error(`Can't find this ${req.originalUrl} in this server`);
  err.statusCode = 404;
  err.status = 'failed';
  next(err);
})


app.use((err,req,res,next) => 
{
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';
  res.status(err.statusCode).json(
    {
      status: err.status,
      message: err.message
    }
  )
})

module.exports = app;

