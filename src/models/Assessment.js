const mongoose = require('mongoose');

const AssessmentSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    scores: { type: Map, of: Number },
    summary: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model('Assessment', AssessmentSchema);
