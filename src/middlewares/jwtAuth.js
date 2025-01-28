const jwt = require('jsonwebtoken');

function authenticateJWT(req, res, next) {
  const token = req.header('Authorization')?.split(' ')[1];

  if (!token) {
    return res.status(403).json({ message: 'Access token required.' });
  }

  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Invalid or expired access token.' });
    }

    req.user = decoded; // Kullanıcıyı req objesine ekleyin
    next();
  });
}

module.exports = authenticateJWT;