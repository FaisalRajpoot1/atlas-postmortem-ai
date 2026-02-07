const logger = require('./logger');

function errorHandler(err, req, res, next) {
  logger.error(`Error: ${err.message}`);

  // Handle specific error types
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      error: 'Validation Error',
      message: err.message,
      details: err.details || []
    });
  }

  if (err.message?.includes('API key')) {
    return res.status(503).json({
      error: 'Service Configuration Error',
      message: 'AI service is not properly configured. Please check API keys.'
    });
  }

  if (err.message?.includes('quota')) {
    return res.status(429).json({
      error: 'Rate Limit Exceeded',
      message: 'AI service quota exceeded. Please try again later.'
    });
  }

  // Default error response
  const statusCode = err.statusCode || 500;
  const message = process.env.NODE_ENV === 'production'
    ? 'An unexpected error occurred'
    : err.message;

  res.status(statusCode).json({
    error: 'Server Error',
    message,
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack })
  });
}

function notFoundHandler(req, res) {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.method} ${req.path} not found`
  });
}

module.exports = { errorHandler, notFoundHandler };
