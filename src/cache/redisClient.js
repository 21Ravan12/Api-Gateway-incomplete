// /cache/redisClient.js
const Redis = require('ioredis');
const redis = new Redis(); // Varsayılan Redis sunucuya bağlanır

redis.on('connect', () => {
  console.log('Connected to Redis');
});

module.exports = redis;