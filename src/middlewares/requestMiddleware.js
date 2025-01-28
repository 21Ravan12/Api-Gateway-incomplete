// middleware/requestMiddleware.js
const { trackRequests } = require('../services/ipTrackingService');

// Bu middleware, her istekle birlikte çalışacak
module.exports = trackRequests;