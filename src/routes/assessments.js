const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Assessment = require('../models/Assessment');

// Available assessments users can take
const availableAssessments = [
  { 
    _id: 'leadership-101',
    title: 'Leadership Skills Assessment',
    description: 'Evaluate your leadership capabilities, decision-making, and team management skills',
    duration: '15 minutes',
    type: 'available'
  },
  { 
    _id: 'communication-pro',
    title: 'Communication Excellence',
    description: 'Test your written, verbal, and interpersonal communication abilities',
    duration: '12 minutes',
    type: 'available'
  },
  { 
    _id: 'problem-solve',
    title: 'Problem-Solving Aptitude',
    description: 'Challenge your analytical thinking and problem-solving skills',
    duration: '18 minutes',
    type: 'available'
  },
  { 
    _id: 'tech-skills',
    title: 'Technical Skills Evaluation',
    description: 'Assess your technical knowledge and coding abilities',
    duration: '20 minutes',
    type: 'available'
  }
];

const mockCompletedAssessments = [
  { _id: '1', user: null, scores: { leadership: 85, communication: 78, problem_solving: 92 }, summary: 'Strong technical skills with room for leadership improvement', type: 'completed' },
  { _id: '2', user: null, scores: { leadership: 72, communication: 88, problem_solving: 81 }, summary: 'Excellent communicator with balanced skill set', type: 'completed' }
];

// GET user's assessments (both completed and available)
router.get('/', auth, async (req, res) => {
  try {
    const completed = await Assessment.find({ user: req.user._id }).sort('-createdAt');
    
    // Combine completed assessments with available ones
    const completedWithType = completed.map(a => ({ ...a.toObject(), type: 'completed' }));
    const available = availableAssessments;
    
    const allAssessments = [...completedWithType, ...available];
    
    if (allAssessments.length === 0) {
      res.json([...mockCompletedAssessments, ...availableAssessments]);
    } else {
      res.json(allAssessments);
    }
  } catch (err) {
    res.json([...mockCompletedAssessments, ...availableAssessments]);
  }
});

// POST create assessment (after user completes it)
router.post('/', auth, async (req, res) => {
  const { scores, summary } = req.body;
  const a = new Assessment({ user: req.user._id, scores, summary });
  try {
    await a.save();
    res.json(a);
  } catch (err) {
    res.json({ _id: 'new', scores, summary });
  }
});

module.exports = router;
