const mongoose = require('mongoose');

const resumeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  filename: {
    type: String,
    required: true
  },
  originalName: {
    type: String,
    required: true
  },
  filePath: {
    type: String,
    required: true
  },
  fileSize: {
    type: Number,
    required: true
  },
  mimeType: {
    type: String,
    required: true
  },
  extractedText: {
    type: String,
    required: true
  },
  analysis: {
    overallScore: {
      type: Number,
      min: 0,
      max: 100
    },
    sections: {
      contactInfo: {
        score: { type: Number, min: 0, max: 100 },
        found: { type: Boolean, default: false },
        suggestions: [String]
      },
      summary: {
        score: { type: Number, min: 0, max: 100 },
        found: { type: Boolean, default: false },
        suggestions: [String]
      },
      experience: {
        score: { type: Number, min: 0, max: 100 },
        found: { type: Boolean, default: false },
        yearsOfExperience: Number,
        suggestions: [String]
      },
      education: {
        score: { type: Number, min: 0, max: 100 },
        found: { type: Boolean, default: false },
        suggestions: [String]
      },
      skills: {
        score: { type: Number, min: 0, max: 100 },
        found: { type: Boolean, default: false },
        extractedSkills: [String],
        suggestions: [String]
      },
      formatting: {
        score: { type: Number, min: 0, max: 100 },
        suggestions: [String]
      }
    },
    keywords: [String],
    recommendations: [String],
    strengths: [String],
    weaknesses: [String],
    atsCompatibility: {
      score: { type: Number, min: 0, max: 100 },
      issues: [String],
      suggestions: [String]
    }
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index for faster queries
resumeSchema.index({ user: 1, isActive: 1 });
resumeSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Resume', resumeSchema);
