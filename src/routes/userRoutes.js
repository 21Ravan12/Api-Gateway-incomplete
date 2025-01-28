const express = require('express');
const router = express.Router();
const { generateTokens } = require('../utils/jwtHelper');
const { authenticateUser } = require('../utils/authHelper');
const RefreshToken = require('../models/RefreshToken');
const User = require('../models/User');


router.post('/signup', async (req, res) => {
  const { username, password, email } = req.body;

  try {
    // Kullanıcı adı kontrolü
    const existingUserByUsername = await User.findOne({ username });
    if (existingUserByUsername) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    // Email kontrolü
    const existingUserByEmail = await User.findOne({ email });
    if (existingUserByEmail) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    // Yeni kullanıcı oluştur
    const newUser = new User({ username, password, email });
    await newUser.save();

    const { accessToken, refreshToken } = generateTokens(newUser);

    await RefreshToken.create({ token: refreshToken, userId: newUser._id });

    res.status(201).json({ message: 'User created successfully', accessToken, refreshToken });
  } catch (error) {
    console.error('Error during sign up:', error);
    res.status(500).json({ error: 'Error creating user', details: error.message });
  }
});


// Login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  const user = await authenticateUser(username, password);
  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const { accessToken, refreshToken } = generateTokens(user);

  await RefreshToken.create({ token: refreshToken, userId: user._id });

  res.json({ accessToken, refreshToken });
});

// Refresh Token
router.post('/refresh', async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(403).json({ message: 'Refresh token required.' });
  }

  const tokenExists = await RefreshToken.findOne({ token: refreshToken });
  if (!tokenExists) {
    return res.status(401).json({ message: 'Invalid refresh token.' });
  }

  jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Invalid or expired refresh token.' });
    }

    const { accessToken } = generateTokens(decoded);
    res.json({ accessToken });
  });
});

// Logout
router.post('/logout', async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(403).json({ message: 'Refresh token required.' });
  }

  await RefreshToken.deleteOne({ token: refreshToken });
  res.status(200).json({ message: 'Logged out successfully.' });
});

module.exports = router;
