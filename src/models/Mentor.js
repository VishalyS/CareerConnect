const mongoose = require('mongoose');

const MentorSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    expertise: [String],
    bio: String,
    availability: String,
    rating: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Mentor', MentorSchema);
