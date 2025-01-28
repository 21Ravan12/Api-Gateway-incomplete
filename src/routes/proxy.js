const express = require('express');
const axios = require('axios');
const router = express.Router();
const routes = require('../../config/routes');

// Proxy endpoint
router.all('/:service/*', async (req, res) => {
  const serviceURL = routes[req.params.service];
  if (!serviceURL) {
    return res.status(404).json({ error: 'Service not found' });
  }

  const path = req.params[0]; // /:service/* ile eşleşen path
  try {
    const response = await axios({
      method: req.method,
      url: `${serviceURL}/${path}`, // Backtick kullanımı
      data: req.body,
      headers: { ...req.headers, host: undefined }, // Host header'ını temizleme (bazı proxy istekleri için gereklidir)
    });
    res.status(response.status).json(response.data);
  } catch (error) {
    res.status(error.response?.status || 500).json(
      error.response?.data || { error: 'Internal Server Error' }
    );
  }
});

module.exports = router;
