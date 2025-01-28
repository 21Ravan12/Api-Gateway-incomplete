const client = require('../cache/redisClient');

const greylistTimeout = 60 * 60 * 2; // 2 hours
const maxRequests = 200; // Max 200 requests before adding IP to greylist

// Ensure Redis client is connected
client.on('error', (err) => console.error('Redis error:', err));
client.on('connect', () => console.log('Connected to Redis'));

// Add IP to greylist
const addIpToGreylist = (ip) => {
  client.sadd('greylist', ip, (err) => {
    if (err) {
      console.error(`Failed to add ${ip} to greylist:`, err);
      return;
    }
    console.log(`${ip} added to greylist.`);
    client.expire(`greylist:${ip}`, greylistTimeout); // Set expiry for greylisted IP
  });
};

// Add IP to whitelist
const addIpToWhitelist = (ip) => {
  client.sadd('whitelist', ip, (err) => {
    if (err) {
      console.error(`Failed to add ${ip} to whitelist:`, err);
      return;
    }
    console.log(`${ip} added to whitelist.`);
  });
};

// Add IP to blacklist
const addIpToBlacklist = (ip) => {
  client.sadd('blacklist', ip, (err) => {
    if (err) {
      console.error(`Failed to add ${ip} to blacklist:`, err);
      return;
    }
    console.log(`${ip} added to blacklist permanently.`);
  });
};

// Check greylist and move IPs to blacklist if necessary
const checkGreylistAndBlacklist = () => {
  client.smembers('greylist', (err, ips) => {
    if (err) {
      console.error('Failed to fetch greylist:', err);
      return;
    }
    ips.forEach((ip) => {
      addIpToBlacklist(ip); // Move greylisted IP to blacklist
      client.srem('greylist', ip, (err) => {
        if (err) {
          console.error(`Failed to remove ${ip} from greylist:`, err);
        }
      });
    });
  });
};

// Track requests and handle greylist/blacklist logic
const trackRequests = (req, res, next) => {
  const ip = req.ip;
  const currentTime = Math.floor(Date.now() / 1000);

  client.get(ip, (err, record) => {
    if (err) {
      console.error(`Failed to fetch request record for ${ip}:`, err);
      return res.status(500).send('Internal server error');
    }

    const requestData = record ? JSON.parse(record) : { count: 0, timestamp: currentTime };

    if (requestData.count >= maxRequests) {
      addIpToGreylist(ip);
      return res.status(429).send('Too many requests - you have been greylisted.');
    }

    requestData.count += 1;

    client.set(
      ip,
      JSON.stringify(requestData),
      'EX',
      60, // Set TTL for tracking key
      (err) => {
        if (err) {
          console.error(`Failed to update request count for ${ip}:`, err);
          return res.status(500).send('Internal server error');
        }
        next();
      }
    );
  });
};

module.exports = {
  trackRequests,
  addIpToGreylist,
  addIpToWhitelist,
  addIpToBlacklist,
  checkGreylistAndBlacklist,
};
