// Importing AppError from utils
const { AppError } = require('../utils');

// Function to handle MongoDB cast errors
const handleDBCastError = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};

// Function to handle duplicate field errors in MongoDB
const handleDBDuplicateFields = (err) => {
  // Extracting the duplicate value from the error message
  const value = err.message.match(/(["'])(?:(?=(\\?))\2.)*?\1/)?.[0];
  const message = `Duplicate Field value: ${value}. Please use another value!`;
  return new AppError(message, 400);
};

// Function to handle MongoDB validation errors
const handleDBValidationError = (err) => {
  // Extracting error messages from validation errors
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid input data. ${errors.join('. ')}`;
  return new AppError(message, 400);
};

// Function to send detailed error response in development environment
const sendDevError = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

// Function to send simplified error response in production environment
const sendProdError = (err, res) => {
  // If error is operational, send simplified error details
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    // If error is unknown, log error details and send generic message
    console.error('ERROR 💥', err);
    res.status(500).json({
      status: 'error',
      message: 'Something went very wrong',
    });
  }
};

// Main error handler middleware
const errorHandler = (err, _req, res, _next) => {
  // Setting status code and status if not already set
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  // Depending on environment, sending appropriate error response
  if (process.env.NODE_ENV === 'development') {
    sendDevError(err, res);
  } else {
    // Handling different types of errors for production environment
    let error = { ...err, name: err.name, message: err.message };

    if (err.name === 'CastError') error = handleDBCastError(error);
    if (err.code === 11000) error = handleDBDuplicateFields(error);
    if (err.name === 'ValidationError') error = handleDBValidationError(error);

    // Sending simplified error response
    sendProdError(error, res);
  }
};

// Exporting the error handler middleware
module.exports = errorHandler;
