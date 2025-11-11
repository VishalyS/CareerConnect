const express = require('express');
const router = express.Router();
const Mentor = require('../models/Mentor');

const mockMentors = [
  { _id: '1', user: { _id: 'u1', name: 'Thamizh Thilaga', email: 'thamizh@example.com' }, expertise: ['React', 'JavaScript', 'Frontend'], bio: 'Senior Frontend Engineer with 8 years experience', availability: 'Weekends', rating: 4.8 },
  { _id: '2', user: { _id: 'u2', name: 'Shanmuga Priya', email: 'shanmuga@example.com' }, expertise: ['Node.js', 'MongoDB', 'Backend'], bio: 'Full Stack Developer passionate about mentoring', availability: 'Evenings', rating: 4.6 },
  { _id: '3', user: { _id: 'u3', name: 'Vishaly', email: 'vishaly@example.com' }, expertise: ['Career Strategy', 'Leadership', 'Soft Skills'], bio: 'Career coach with 10+ years in tech leadership', availability: 'Flexible', rating: 4.9 },
  { _id: '4', user: { _id: 'u4', name: 'Gowri Thangam', email: 'gowri@example.com' }, expertise: ['UI/UX Design', 'Product Strategy', 'User Research'], bio: 'Design leader focused on user-centric solutions', availability: 'Flexible', rating: 4.7 }
];

// list mentors
router.get('/', async (req, res) => {
  try {
    const mentors = await Mentor.find().populate('user', 'name email');
    if (mentors.length === 0) return res.json(mockMentors);
    res.json(mentors);
  } catch (err) {
    res.json(mockMentors);
  }
});

// create mentor profile
router.post('/', async (req, res) => {
  const m = new Mentor(req.body);
  try {
    await m.save();
    res.json(m);
  } catch (err) {
    res.json(req.body);
  }
});

module.exports = router;
