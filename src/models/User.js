const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['user', 'mentor', 'admin'], default: 'user' },
    profile: {
      headline: String,
      location: String,
      skills: [String],
      bio: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', UserSchema);
