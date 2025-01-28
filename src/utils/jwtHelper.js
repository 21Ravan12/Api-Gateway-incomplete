const jwt = require('jsonwebtoken');

function generateTokens(user) {
  const accessToken = jwt.sign(
    { id: user.id, username: user.username }, // Kullanıcı verileri
    process.env.JWT_SECRET_KEY,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY } // 15 dakika
  );

  const refreshToken = jwt.sign(
    { id: user.id, username: user.username },
    process.env.JWT_REFRESH_SECRET_KEY,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRY } // 7 gün
  );

  return { accessToken, refreshToken };
}

module.exports = { generateTokens };