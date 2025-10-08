const mongoose = require('mongoose');

const ApplicationSchema = new mongoose.Schema({
  job: { type: mongoose.Schema.Types.ObjectId, ref: 'Job' },
  candidate: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  resumeUrl: String,
  coverLetter: String,
  status: { type: String, enum: ['applied','viewed','shortlisted','rejected','hired'], default: 'applied' },
  appliedAt: { type: Date, default: Date.now },
  updatedAt: Date
});

module.exports = mongoose.model('Application', ApplicationSchema);
