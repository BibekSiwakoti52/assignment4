// Custom Error class for handling errors in the application
class AppError extends Error {
  statusCode;
  status;
  isOperational;

  constructor(message, statusCode) {
    super(message);

    this.statusCode = statusCode;
    this.status = statusCode.toString().startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
