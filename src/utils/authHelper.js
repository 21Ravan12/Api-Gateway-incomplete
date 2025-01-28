const bcrypt = require('bcrypt');
const User = require('../models/User');

async function authenticateUser(username, password) {
  const user = await User.findOne({ username });
  if (!user) {
    return null;
  }
  const isMatch = await bcrypt.compare(password, user.password);
  return isMatch ? user : null;
}

module.exports = { authenticateUser };
