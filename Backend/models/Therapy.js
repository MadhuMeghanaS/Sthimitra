const mongoose = require('mongoose');

const therapySchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  short: { type: String, required: true, uppercase: true },
  emoji: { type: String, default: '🧠' },
  tagline: { type: String },
  explanation: { type: String, required: true },
  helps: [{ type: String }],
  howItWorks: { type: String },
  color: { type: String, default: '#22c55e' },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('Therapy', therapySchema);
