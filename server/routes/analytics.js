const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const { getRecruiterAnalytics, getCandidateAnalytics } = require('../controllers/analyticsController');

// GET /api/analytics/recruiter - Get recruiter analytics
router.get('/recruiter', auth, getRecruiterAnalytics);

// GET /api/analytics/candidate - Get candidate analytics
router.get('/candidate', auth, getCandidateAnalytics);

module.exports = router;
