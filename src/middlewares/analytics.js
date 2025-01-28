const prometheusMiddleware = require('express-prometheus-middleware');

const analyticsMiddleware = prometheusMiddleware({
    metricsPath: '/metrics',
    collectDefaultMetrics: true,
    requestDurationBuckets: [0.1, 0.5, 1, 1.5],
});

module.exports = analyticsMiddleware;