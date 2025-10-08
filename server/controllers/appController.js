const Application = require("../models/Application");
const Job = require("../models/Job");

// POST /api/applications — create application
exports.createApplication = async (req, res) => {
  try {
    const { jobId } = req.body;

    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ msg: "Job not found" });

    const exists = await Application.findOne({
      job: jobId,
      candidate: req.user._id
    });
    if (exists) return res.status(400).json({ msg: "Already applied" });

    const application = new Application({
      job: jobId,
      candidate: req.user._id,
      coverLetter: req.body.coverLetter || ""
    });

    await application.save();
    res.status(201).json(application);

  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};
