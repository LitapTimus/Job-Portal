const Resume = require('../models/Resume');
const resumeAnalyzer = require('../services/resumeAnalyzer');
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');
const fs = require('fs').promises;
const path = require('path');

// Upload and analyze resume
const uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ msg: 'No file uploaded' });
    }

    const { filename, originalname, path: filePath, size, mimetype } = req.file;

    // Extract text from file
    let extractedText = '';
    try {
      if (mimetype === 'application/pdf') {
        const dataBuffer = await fs.readFile(filePath);
        const pdfData = await pdfParse(dataBuffer);
        extractedText = pdfData.text;
      } else if (mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        const result = await mammoth.extractRawText({ path: filePath });
        extractedText = result.value;
      } else {
        // For .txt files or other text formats
        extractedText = await fs.readFile(filePath, 'utf8');
      }
    } catch (extractError) {
      console.error('Text extraction error:', extractError);
      return res.status(400).json({ msg: 'Failed to extract text from file' });
    }

    if (!extractedText.trim()) {
      return res.status(400).json({ msg: 'No text content found in the file' });
    }

    // Analyze the resume
    const analysis = await resumeAnalyzer.analyzeResume(extractedText);

    // Deactivate previous resumes for this user
    await Resume.updateMany(
      { user: req.user.id, isActive: true },
      { isActive: false }
    );

    // Save resume and analysis to database
    const resume = new Resume({
      user: req.user.id,
      filename,
      originalName: originalname,
      filePath,
      fileSize: size,
      mimeType: mimetype,
      extractedText,
      analysis,
      isActive: true
    });

    await resume.save();

    res.json({
      msg: 'Resume uploaded and analyzed successfully',
      resume: {
        id: resume._id,
        originalName: resume.originalName,
        uploadedAt: resume.createdAt,
        analysis: resume.analysis
      }
    });

  } catch (error) {
    console.error('Resume upload error:', error);
    res.status(500).json({ msg: 'Server error during resume upload' });
  }
};

// Get user's resume analysis
const getResumeAnalysis = async (req, res) => {
  try {
    const resume = await Resume.findOne({ 
      user: req.user.id, 
      isActive: true 
    }).select('-extractedText -filePath');

    if (!resume) {
      return res.status(404).json({ msg: 'No resume found' });
    }

    res.json(resume);
  } catch (error) {
    console.error('Get resume analysis error:', error);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Get all user's resumes
const getUserResumes = async (req, res) => {
  try {
    const resumes = await Resume.find({ user: req.user.id })
      .select('-extractedText -filePath')
      .sort({ createdAt: -1 });

    res.json(resumes);
  } catch (error) {
    console.error('Get user resumes error:', error);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Delete resume
const deleteResume = async (req, res) => {
  try {
    const resume = await Resume.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!resume) {
      return res.status(404).json({ msg: 'Resume not found' });
    }

    // Delete file from filesystem
    try {
      await fs.unlink(resume.filePath);
    } catch (fileError) {
      console.error('File deletion error:', fileError);
      // Continue with database deletion even if file deletion fails
    }

    await Resume.findByIdAndDelete(req.params.id);

    res.json({ msg: 'Resume deleted successfully' });
  } catch (error) {
    console.error('Delete resume error:', error);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Re-analyze existing resume
const reAnalyzeResume = async (req, res) => {
  try {
    const resume = await Resume.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!resume) {
      return res.status(404).json({ msg: 'Resume not found' });
    }

    // Re-analyze the resume
    const analysis = await resumeAnalyzer.analyzeResume(resume.extractedText);

    // Update the analysis
    resume.analysis = analysis;
    await resume.save();

    res.json({
      msg: 'Resume re-analyzed successfully',
      analysis: resume.analysis
    });
  } catch (error) {
    console.error('Re-analyze resume error:', error);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Get resume improvement tips
const getImprovementTips = async (req, res) => {
  try {
    const resume = await Resume.findOne({
      user: req.user.id,
      isActive: true
    });

    if (!resume) {
      return res.status(404).json({ msg: 'No active resume found' });
    }

    const { analysis } = resume;
    const tips = [];

    // Generate specific tips based on analysis
    Object.entries(analysis.sections).forEach(([section, data]) => {
      if (data.suggestions && data.suggestions.length > 0) {
        tips.push({
          section: section.charAt(0).toUpperCase() + section.slice(1),
          score: data.score,
          suggestions: data.suggestions
        });
      }
    });

    // Add ATS compatibility tips
    if (analysis.atsCompatibility && analysis.atsCompatibility.suggestions) {
      tips.push({
        section: 'ATS Compatibility',
        score: analysis.atsCompatibility.score,
        suggestions: analysis.atsCompatibility.suggestions
      });
    }

    res.json({
      overallScore: analysis.overallScore,
      tips,
      recommendations: analysis.recommendations,
      strengths: analysis.strengths,
      weaknesses: analysis.weaknesses
    });
  } catch (error) {
    console.error('Get improvement tips error:', error);
    res.status(500).json({ msg: 'Server error' });
  }
};

module.exports = {
  uploadResume,
  getResumeAnalysis,
  getUserResumes,
  deleteResume,
  reAnalyzeResume,
  getImprovementTips
};
