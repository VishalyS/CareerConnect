const express = require('express');
const router = express.Router();
const Job = require('../models/Job');

const mockJobs = [
  { _id: '1', title: 'Senior Frontend Developer', company: 'Tech Corp', location: 'San Francisco, CA', description: 'Looking for experienced React developer', isRemote: false, tags: ['React', 'JavaScript', 'Senior'] },
  { _id: '2', title: 'Full Stack Engineer', company: 'StartupXYZ', location: 'Remote', description: 'Join our fast-growing team', isRemote: true, tags: ['Node.js', 'React', 'Full Stack'] },
  { _id: '3', title: 'Backend Developer', company: 'CloudServices Inc', location: 'Austin, TX', description: 'Build scalable backend systems', isRemote: true, tags: ['Node.js', 'MongoDB', 'Backend'] },
  { _id: '4', title: 'DevOps Engineer', company: 'DataWorks', location: 'New York, NY', description: 'Infrastructure and deployment automation', isRemote: false, tags: ['DevOps', 'Docker', 'Kubernetes'] }
];

// list jobs
router.get('/', async (req, res) => {
  try {
    const jobs = await Job.find().sort('-createdAt').limit(100);
    if (jobs.length === 0) return res.json(mockJobs);
    res.json(jobs);
  } catch (err) {
    res.json(mockJobs);
  }
});

// post job
router.post('/', async (req, res) => {
  const j = new Job(req.body);
  try {
    await j.save();
    res.json(j);
  } catch (err) {
    res.json(req.body);
  }
});

module.exports = router;
