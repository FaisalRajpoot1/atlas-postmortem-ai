const rateLimit = require('express-rate-limit');

// General API rate limiter
const rateLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 20, // 20 requests per minute
  message: {
    error: 'Rate Limit Exceeded',
    message: 'Too many requests. Please try again in a minute.',
    retryAfter: 60
  },
  standardHeaders: true,
  legacyHeaders: false
});

// Stricter limiter for AI analysis endpoint
const analysisRateLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 10, // 10 analysis requests per minute (Gemini free tier: 15 RPM)
  message: {
    error: 'Rate Limit Exceeded',
    message: 'Too many analysis requests. Please wait before generating another post-mortem.',
    retryAfter: 60
  },
  standardHeaders: true,
  legacyHeaders: false
});

module.exports = { rateLimiter, analysisRateLimiter };
