const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true, required: true },
  passwordHash: String,
  role: { type: String, enum: ['candidate','recruiter'], required: true },
  title: String,
  bio: String,
  location: String,
  skills: [String],
  experienceYears: Number,
  resumeUrl: String,
  portfolioLinks: [String],
  companyName: String,
  companyWebsite: String,
  // OAuth fields
  googleId: String,
  avatar: String,
  authProvider: { type: String, enum: ['local', 'google'], default: 'local' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', UserSchema);
