const mongoose = require('mongoose');

const communitySchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, unique: true },
  emoji: { type: String, default: '💚' },
  description: { type: String, required: true },
  color: { type: String, default: '#22c55e' },
  members: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  memberCount: { type: Number, default: 0 },
  rules: [{ type: String }],
  isActive: { type: Boolean, default: true },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
}, { timestamps: true });

// Virtual for post count
communitySchema.virtual('postCount', {
  ref: 'Post',
  localField: '_id',
  foreignField: 'community',
  count: true,
});

module.exports = mongoose.model('Community', communitySchema);
