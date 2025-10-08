const Job = require("../models/Job");
const Application = require("../models/Application");

// POST /api/jobs — create job (recruiter only)
exports.createJob = async (req, res) => {
  try {
    if (req.user.role !== "recruiter") {
      return res.status(403).json({ msg: "Access denied" });
    }

    const job = new Job({
      recruiter: req.user._id,
      title: req.body.title,
      description: req.body.description,
      location: req.body.location,
      requiredSkills: req.body.requiredSkills,
      employmentType: req.body.employmentType,
      minExperience: req.body.minExperience,
      salaryRange: req.body.salaryRange
    });

    await job.save();
    res.status(201).json(job);

  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};

// GET /api/jobs — list jobs with filters
exports.getJobs = async (req, res) => {
  try {
    const { skills, location, q, page = 1, limit = 10 } = req.query;
    const filter = {};

    if (skills) {
      const skillsArray = skills.split(",").map(s => s.trim());
      filter.requiredSkills = { $all: skillsArray }; // strict match
    }

    if (location) {
      filter.location = { $regex: location, $options: "i" };
    }

    if (q) {
      filter.title = { $regex: q, $options: "i" };
    }

    const jobs = await Job.find(filter)
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .populate("recruiter", "name email companyName");

    res.json(jobs);

  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};

// GET /api/jobs/:id
exports.getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate("recruiter", "name email companyName");
    if (!job) return res.status(404).json({ msg: "Job not found" });
    res.json(job);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};

// GET /api/jobs/:jobId/applicants
exports.getApplicants = async (req, res) => {
  try {
    const applications = await Application.find({ job: req.params.jobId })
      .populate("candidate", "name email skills");

    res.json(applications);

  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};
