const AppError = require('./../utils/appError');

// cast err in DB
const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
};

//duplicte fields in db
const handleDuplicateFieldsDB = (err) => {
  const value = err.errmsg.match(/(["'])(?:(?=(\\?))\2.)*?\1/)[0];
  const message = `Duplicate field value: ${value}. Please use another value!`;
  return new AppError(message, 400);
};

// validation in db
const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((ele) => ele.message);
  const message = `Invalid input data. ${errors.join('. ')}`;
  return new AppError(message, 400);
};

//jwt errs
const handleJWTError = () =>
  new AppError('Invalid token. Please log in again', 401);
const handleJWTExpErr = () =>
  new AppError('your token has expired, please login again', 401);

//send error report while in development
const sendErrorDev = (err, req, res) => {
  //a) API
  if (req.originalUrl.startsWith('/api')) {
    res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    });
  }
  //b) Rendered Website
  console.error('ERROR ', err);
  return res.status(err.statusCode).render('error', {
    title: 'Something went wrong!!!',
    msg: err.message,
  });
};

//send error report while in Production
const sendErrorProd = (err, req, res) => {
  //a) API
  if (req.originalUrl.startsWith('/api')) {
    //a)i) Operational, trusted err: send msg to client
    if (err.isOperational) {
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
    }
    //a)ii) pragramming err: don't leak to client
    console.error('ERROR ', err);
    return res.status(500).json({
      status: 'error',
      message: 'Something went very wrong !!!',
    });
  }
  //b) Rendered Website
  //b)i) Operational, trusted err: send msg to client
  if (err.isOperational) {
    console.log(err);
    return res.status(err.statusCode).render('error', {
      title: 'Something went wrong !!!',
      msg: err.message,
    });
  }
  //b)ii) pragramming err: don't leak to client
  console.error('ERROR ', err);
  return res.status(err.statusCode).render('error', {
    title: 'Something went wrong !!!',
    msg: 'Please try again later.',
  });
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, req, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err };
    error.message = err.message;

    if (error.name === 'CastError') error = handleCastErrorDB(error);
    if (error.code === 11000) error = handleDuplicateFieldsDB(error);
    if (error.name === 'ValidationError')
      error = handleValidationErrorDB(error);
    if (error.name === 'JsonWebTokenError') error = handleJWTError();
    if (error.name === 'TokenExpiredError') error = handleJWTExpErr();
    sendErrorProd(error, req, res);
  }
};
