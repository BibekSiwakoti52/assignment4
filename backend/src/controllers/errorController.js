const { AppError } = require('../utils');

const handleDBCastError = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};

const handleDBDuplicateFields = (err) => {
  console.log('ERR', err);
  const value = err.message.match(/(["'])(?:(?=(\\?))\2.)*?\1/)?.[0];
  const message = `Duplicate Field value: ${value}. Please use another value!`;
  return new AppError(message, 400);
};

const handleDBValidationError = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);

  const message = `Invalid input data. ${errors.join('. ')}`;
  return new AppError(message, 400);
};

const sendDevError = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendProdError = (err, res) => {
  // If the error is operational, send error details to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
    // If the error is unknown, don't leak error details
  } else {
    console.error('ERROR 💥', err);
    res.status(500).json({
      status: 'error',
      message: 'Something went very wrong',
    });
  }
};

// error handler must have 4 parameters
const errorHandler = (err, _req, res, _next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendDevError(err, res);
  } else {
    let error = { ...err, name: err.name, message: err.message };

    if (err.name === 'CastError') error = handleDBCastError(error);
    if (err.code === 11000) error = handleDBDuplicateFields(error);
    if (err.name === 'ValidationError') error = handleDBValidationError(error);

    sendProdError(error, res);
  }
};

module.exports = errorHandler;
