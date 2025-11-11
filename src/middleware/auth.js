const User = require('../models/User');

// Minimal auth for basic projects:
// Accept a simple `x-user-id` header (or userId in body/query) identifying the user.
// This avoids JWTs and sessions and keeps the backend simple for learning/demo purposes.
module.exports = async function auth(req, res, next) {
  const userId = req.header('x-user-id') || req.body.userId || req.query.userId;
  if (!userId) return res.status(401).json({ message: 'No user id provided in x-user-id header' });
  try {
    const user = await User.findById(userId).select('-password');
    if (!user) return res.status(401).json({ message: 'User not found' });
    req.user = user;
    next();
  } catch (err) {
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
};
