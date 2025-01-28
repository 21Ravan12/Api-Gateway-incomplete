const mongoose = require('mongoose');

const refreshTokenSchema = new mongoose.Schema({
  token: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now, expires: '7d' } // 7 gün sonra silinir
});

module.exports = mongoose.model('RefreshToken', refreshTokenSchema);