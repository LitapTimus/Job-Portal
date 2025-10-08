const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const { createApplication } = require('../controllers/appController');

// POST /api/applications - Create an application
router.post('/', auth, createApplication);

// GET /api/applications/my - Get user's applications
router.get('/my', auth, async (req, res) => {
  try {
    const Application = require('../models/Application');
    const applications = await Application.find({ candidate: req.user._id })
      .populate('job')
      .sort({ appliedAt: -1 });
    res.json(applications);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// PATCH /api/applications/:id/status - Update application status (recruiter only)
router.patch('/:id/status', auth, async (req, res) => {
  try {
    if (req.user.role !== 'recruiter') {
      return res.status(403).json({ msg: 'Access denied' });
    }
    
    const Application = require('../models/Application');
    const application = await Application.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status, updatedAt: Date.now() },
      { new: true }
    );
    
    if (!application) {
      return res.status(404).json({ msg: 'Application not found' });
    }
    
    res.json(application);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
