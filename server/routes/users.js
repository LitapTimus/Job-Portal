const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const upload = require('../middlewares/upload');
const User = require('../models/User');

// GET /api/users/me - Get current user profile
router.get('/me', auth, (req, res) => {
  res.json(req.user);
});

// PUT /api/users/me - Update current user profile
router.put('/me', auth, async (req, res) => {
  try {
    const updates = {};
    const allowedFields = [
      'name', 'title', 'bio', 'location', 'skills', 
      'experienceYears', 'portfolioLinks', 'companyName', 'companyWebsite'
    ];
    
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });
    
    const user = await User.findByIdAndUpdate(
      req.user._id,
      updates,
      { new: true }
    ).select('-passwordHash');
    
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// POST /api/users/upload-resume - Upload resume
router.post('/upload-resume', auth, upload.single('resume'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ msg: 'No file uploaded' });
    }
    
    const resumeUrl = `/uploads/${req.file.filename}`;
    await User.findByIdAndUpdate(req.user._id, { resumeUrl });
    
    res.json({ resumeUrl });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// GET /api/users/candidates - Search candidates (recruiter only)
router.get('/candidates', auth, async (req, res) => {
  try {
    if (req.user.role !== 'recruiter') {
      return res.status(403).json({ msg: 'Access denied' });
    }

    const { q, skills, experience } = req.query;
    const filter = { role: 'candidate' };

    // Search by name or title
    if (q) {
      filter.$or = [
        { name: { $regex: q, $options: 'i' } },
        { title: { $regex: q, $options: 'i' } }
      ];
    }

    // Filter by skills
    if (skills) {
      const skillsArray = skills.split(',').map(s => s.trim());
      filter.skills = { $in: skillsArray };
    }

    // Filter by minimum experience
    if (experience) {
      filter.experienceYears = { $gte: parseInt(experience) };
    }

    const candidates = await User.find(filter)
      .select('-passwordHash')
      .sort({ createdAt: -1 })
      .limit(50);

    res.json(candidates);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
