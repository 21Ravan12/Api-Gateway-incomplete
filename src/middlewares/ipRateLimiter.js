const rateLimit = require('express-rate-limit');

// IP bazlı rate limiter
const ipRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 dakika
  max: 50, // Maksimum 50 istek
  keyGenerator: (req) => req.ip, // Kullanıcıların IP adresine göre sınırlama
  message: 'Too many requests from your IP, please try again after 15 minutes.'
});

module.exports = ipRateLimiter;