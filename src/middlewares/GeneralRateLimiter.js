// /middlewares/rateLimiter.js
const rateLimit = require('express-rate-limit');

// 1 dakikada 100 isteğe izin ver
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 dakika
  max: 100, // 100 istek
  message: 'Too many requests from this IP, please try again after a minute'
});

module.exports = limiter;