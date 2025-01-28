const rateLimit = require('express-rate-limit');

// Daha katı bir rate limiter: 1 dakikada 10 isteğe izin ver
const strictLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 dakika
  max: 10, // Maksimum 10 istek
  message: 'Too many requests for this route, please try again later.'
});

module.exports = strictLimiter;