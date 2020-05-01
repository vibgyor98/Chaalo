const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controller/errorController');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

//Global Middlewares
//set security HTTP Headers
app.use(helmet());

//Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

//Rate Limiter middleware for limit request from same API
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many request from one IP, please try again in an hour!',
});
app.use('/api', limiter);

//Body Parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));

//Data Sanitization against NoSQL query inject
app.use(mongoSanitize());

//Data Sanitization againt xss
app.use(xss());

//prevent parameter pollution
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsQuantity',
      'ratingsAverage',
      'maxGroupSize',
      'difficulty',
      'price',
    ],
  })
);

//Serving static files
app.use(express.static(`${__dirname}/public`));

//Mounting Routers
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

//Handle invalid URL
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

//Error Handler
app.use(globalErrorHandler);

module.exports = app;
