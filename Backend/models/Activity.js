const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  emoji: { type: String, default: '🌿' },
  category: {
    type: String,
    enum: ['Mindfulness', 'Movement', 'Breathwork', 'Reflection', 'Sensory', 'Other'],
    required: true,
  },
  shortDesc: { type: String, required: true, maxlength: 120 },
  description: { type: String, required: true },
  benefits: [{ type: String }],
  steps: [{ type: String }],
  duration: { type: String, default: '15–30 minutes' },
  difficulty: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced', 'Beginner to Intermediate'],
    default: 'Beginner',
  },
  image: { type: String },
  color: { type: String, default: '#22c55e' },
  tags: [{ type: String, lowercase: true }],
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

activitySchema.index({ name: 'text', shortDesc: 'text', tags: 'text' });

module.exports = mongoose.model('Activity', activitySchema);
