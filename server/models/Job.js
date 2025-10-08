const mongoose = require('mongoose');

const JobSchema = new mongoose.Schema({
  recruiter: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  title: String,
  description: String,
  requiredSkills: [String],
  location: String,
  employmentType: String,
  minExperience: Number,
  salaryRange: { min: Number, max: Number },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

JobSchema.index({ title: 'text', description: 'text', requiredSkills: 'text' });
module.exports = mongoose.model('Job', JobSchema);
