const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Kullanıcı şeması
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true, // Gereksiz boşlukları temizler
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true, // Küçük harfe çevirir
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true, // createdAt ve updatedAt alanlarını otomatik ekler
  }
);

// Şifreyi kaydetmeden önce hash'le
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next(); // Şifre değişmemişse işlem yapma
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err); // Hataları ilet
  }
});

// Şifre doğrulama fonksiyonu
userSchema.methods.comparePassword = async function (candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (err) {
    throw new Error('Şifre doğrulama hatası');
  }
};

// Kullanıcı modelini oluştur
const User = mongoose.model('User', userSchema);

module.exports = User;
