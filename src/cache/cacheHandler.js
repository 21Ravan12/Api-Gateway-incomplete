// /cache/cacheHandler.js
const redis = require('./redisClient');

// Cache kontrolü yapmak için
const fetchFromCache = async (key) => {
  const data = await redis.get(key);
  if (data) {
    console.log('Cache hit');
    return JSON.parse(data); // JSON veriyi tekrar parse et
  }
  return null;
};

// Veriyi cache'e kaydetmek için
const setToCache = async (key, data, ttl = 3600) => {
  await redis.setex(key, ttl, JSON.stringify(data)); // 1 saat cache'le
};

module.exports = {
  fetchFromCache,
  setToCache
};