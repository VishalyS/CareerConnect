const mongoose = require('mongoose');

const JobSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    company: String,
    location: String,
    description: String,
    url: String,
    tags: [String],
    postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    isRemote: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Job', JobSchema);
