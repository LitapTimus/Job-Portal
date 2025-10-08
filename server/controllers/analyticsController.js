const Job = require('../models/Job');
const Application = require('../models/Application');

// GET /api/analytics/recruiter - Get recruiter analytics
exports.getRecruiterAnalytics = async (req, res) => {
  try {
    if (req.user.role !== 'recruiter') {
      return res.status(403).json({ msg: 'Access denied' });
    }

    // Get all jobs posted by recruiter
    const jobs = await Job.find({ recruiter: req.user._id });
    const jobIds = jobs.map(job => job._id);

    // Get all applications for those jobs
    const applications = await Application.find({ job: { $in: jobIds } });

    // Calculate statistics
    const totalJobs = jobs.length;
    const activeJobs = jobs.filter(job => job.isActive).length;
    const totalApplications = applications.length;

    // Applications by status
    const applicationsByStatus = {
      applied: applications.filter(app => app.status === 'applied').length,
      viewed: applications.filter(app => app.status === 'viewed').length,
      shortlisted: applications.filter(app => app.status === 'shortlisted').length,
      rejected: applications.filter(app => app.status === 'rejected').length,
      hired: applications.filter(app => app.status === 'hired').length
    };

    // Recent applications
    const recentApplications = await Application.find({ job: { $in: jobIds } })
      .populate('candidate', 'name email')
      .populate('job', 'title')
      .sort({ appliedAt: -1 })
      .limit(10);

    res.json({
      totalJobs,
      activeJobs,
      totalApplications,
      applicationsByStatus,
      recentApplications
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};

// GET /api/analytics/candidate - Get candidate analytics
exports.getCandidateAnalytics = async (req, res) => {
  try {
    if (req.user.role !== 'candidate') {
      return res.status(403).json({ msg: 'Access denied' });
    }

    // Get all applications by candidate
    const applications = await Application.find({ candidate: req.user._id })
      .populate('job', 'title location');

    const totalApplications = applications.length;

    // Applications by status
    const applicationsByStatus = {
      applied: applications.filter(app => app.status === 'applied').length,
      viewed: applications.filter(app => app.status === 'viewed').length,
      shortlisted: applications.filter(app => app.status === 'shortlisted').length,
      rejected: applications.filter(app => app.status === 'rejected').length,
      hired: applications.filter(app => app.status === 'hired').length
    };

    // Recent applications
    const recentApplications = applications
      .sort((a, b) => b.appliedAt - a.appliedAt)
      .slice(0, 10);

    res.json({
      totalApplications,
      applicationsByStatus,
      recentApplications
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};
