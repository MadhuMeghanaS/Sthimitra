const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  therapy: { type: mongoose.Schema.Types.ObjectId, ref: 'Therapy' },
  date: { type: Date, required: true },
  location: { type: String, required: true },
  isVirtual: { type: Boolean, default: false },
  virtualLink: { type: String },
  totalSpots: { type: Number, required: true },
  registrations: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    registeredAt: { type: Date, default: Date.now },
  }],
  price: { type: Number, default: 0 },
  tags: [{ type: String }],
  isActive: { type: Boolean, default: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

// Virtual for available spots
eventSchema.virtual('availableSpots').get(function () {
  const spots = this.totalSpots || 0;
  const regs = this.registrations || [];
  return spots - regs.length;
});

eventSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Event', eventSchema);
