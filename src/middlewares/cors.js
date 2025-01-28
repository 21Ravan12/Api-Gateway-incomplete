// CORS middleware
const cors = require('cors');

const corsOptions = {
  origin: ['*'], // İzin verilen originler
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // İzin verilen HTTP metodları
  allowedHeaders: ['Content-Type', 'Authorization'], // İzin verilen headers
  credentials: true // Kimlik doğrulama içeren istekler için
};

module.exports = corsOptions;
