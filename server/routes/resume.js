const express = require('express');
const multer = require('multer');
const path = require('path');
const auth = require('../middlewares/auth');
const {
  uploadResume,
  getResumeAnalysis,
  getUserResumes,
  deleteResume,
  reAnalyzeResume,
  getImprovementTips
} = require('../controllers/resumeController');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/resumes/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'resume-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  // Accept PDF, DOCX, and TXT files
  const allowedTypes = [
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain'
  ];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only PDF, DOCX, and TXT files are allowed.'), false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: fileFilter
});

// Create uploads/resumes directory if it doesn't exist
const fs = require('fs');
const uploadsDir = 'uploads/resumes';
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Routes
// @route   POST /api/resume/upload
// @desc    Upload and analyze resume
// @access  Private
router.post('/upload', auth, upload.single('resume'), uploadResume);

// @route   GET /api/resume/analysis
// @desc    Get current resume analysis
// @access  Private
router.get('/analysis', auth, getResumeAnalysis);

// @route   GET /api/resume/all
// @desc    Get all user's resumes
// @access  Private
router.get('/all', auth, getUserResumes);

// @route   DELETE /api/resume/:id
// @desc    Delete resume
// @access  Private
router.delete('/:id', auth, deleteResume);

// @route   POST /api/resume/:id/reanalyze
// @desc    Re-analyze existing resume
// @access  Private
router.post('/:id/reanalyze', auth, reAnalyzeResume);

// @route   GET /api/resume/tips
// @desc    Get resume improvement tips
// @access  Private
router.get('/tips', auth, getImprovementTips);

module.exports = router;
