const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const { createJob, getJobs, getJobById, getApplicants } = require('../controllers/jobController');

// POST /api/jobs - Create a job (recruiter only)
router.post('/', auth, createJob);

// GET /api/jobs - Get all jobs with filters
router.get('/', getJobs);

// GET /api/jobs/:id - Get job by ID
router.get('/:id', getJobById);

// GET /api/jobs/:jobId/applicants - Get applicants for a job
router.get('/:jobId/applicants', auth, getApplicants);

module.exports = router;
