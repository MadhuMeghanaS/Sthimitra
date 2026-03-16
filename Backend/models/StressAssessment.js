const mongoose = require('mongoose');

const stressAssessmentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  answers: [{
    questionId: { type: Number, required: true },
    questionText: { type: String },
    answer: { type: Number, required: true, min: 1, max: 4 },
  }],
  totalScore: {
    type: Number,
    required: true,
    min: 0,
  },
  stressLevel: {
    type: String,
    enum: ['Low', 'Moderate', 'High'],
    required: true,
  },
  recommendations: {
    activities: [{ type: String }],
    communities: [{ type: String }],
    therapies: [{ type: String }],
  },
  notes: { type: String },
}, { timestamps: true });

stressAssessmentSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model('StressAssessment', stressAssessmentSchema);
