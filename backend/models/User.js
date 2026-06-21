const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profileImage: { type: String, default: '' },
  personalInfo: {
    phone: { type: String, default: '' },
    location: { type: String, default: '' },
    title: { type: String, default: '' }
  },
  about: {
    bio: { type: String, default: '' },
    introduction: { type: String, default: '' }
  },
  contact: {
    email: { type: String, default: '' },
    phone: { type: String, default: '' },
    github: { type: String, default: '' },
    linkedin: { type: String, default: '' },
    twitter: { type: String, default: '' }
  }
});

// Remove the pre('save') middleware - handle hashing in the route instead
module.exports = mongoose.model('User', UserSchema);