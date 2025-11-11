const express = require('express');
const router = express.Router();
const Training = require('../models/Training');

const mockTraining = [
  { _id: '1', title: 'Advanced JavaScript', provider: 'Udemy', description: 'Master modern JS concepts', durationHours: 25, tags: ['javascript', 'web-dev'] },
  { _id: '2', title: 'React Fundamentals', provider: 'freeCodeCamp', description: 'Build UIs with React', durationHours: 30, tags: ['react', 'frontend'] },
  { _id: '3', title: 'Node.js & Express', provider: 'Pluralsight', description: 'Backend development with Node', durationHours: 20, tags: ['nodejs', 'backend'] },
  { _id: '4', title: 'Database Design', provider: 'LinkedIn Learning', description: 'SQL and NoSQL databases', durationHours: 15, tags: ['database', 'mongodb'] }
];

// public list
router.get('/', async (req, res) => {
  try {
    const items = await Training.find().sort('-createdAt').limit(50);
    if (items.length === 0) return res.json(mockTraining);
    res.json(items);
  } catch (err) {
    res.json(mockTraining);
  }
});

// create (admin/maintainer in future)
router.post('/', async (req, res) => {
  const t = new Training(req.body);
  try {
    await t.save();
    res.json(t);
  } catch (err) {
    res.json(req.body);
  }
});

module.exports = router;
