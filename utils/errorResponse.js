// utils/errorResponse.js
class ErrorResponse extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true; // This is to distinguish operational errors from programming errors

    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = ErrorResponse;