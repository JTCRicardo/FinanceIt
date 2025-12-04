const mongoose = require('mongoose');
//File used for managing user account info.
const UserSchema = new mongoose.Schema({
  clerkId: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  username: { type: String },
  phone: { type: String, default: '' },
  bio: { type: String, default: '' },
  company: { type: String, default: '' },
  isAdmin: { type: Boolean, default: false },
  adminViewActive: { type: Boolean, default: false}
});

module.exports = mongoose.model('User', UserSchema);
