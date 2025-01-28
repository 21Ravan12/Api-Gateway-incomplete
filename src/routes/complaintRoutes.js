const express = require('express');
const router = express.Router();
const { addIpToWhitelist, addIpToBlacklist } = require('../services/ipTrackingService');

const processComplaint = (ip, complaintMessage) => {
  // Adminlerin şikayetleri incelemesi için log
  console.log(`Complaint received from IP: ${ip}, Message: ${complaintMessage}`);

  // Adminler şikayeti inceledikten sonra:
  // Eğer admin IP'yi whitelist'e almak isterse:
  addIpToWhitelist(ip);
  // Adminin kararı ile işlem yapılır.
};

router.post('/complain', (req, res) => {
  const { ip, message } = req.body;

  if (!ip || !message) {
    return res.status(400).json({ error: "IP address and complaint message are required." });
  }

  try {
    processComplaint(ip, message);
    res.status(200).send("Your complaint has been submitted.");
  } catch (error) {
    console.error("Error processing complaint:", error);
    res.status(500).send("An error occurred while processing your complaint.");
  }
});

module.exports = router;
