const mongoose = require('mongoose');

const TrainingSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    provider: String,
    description: String,
    url: String,
    tags: [String],
    durationHours: Number,
  },
  { timestamps: true }
);

module.exports = mongoose.model('Training', TrainingSchema);
