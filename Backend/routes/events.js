const express = require('express');
const router = express.Router();
const Event = require('../models/Event');
const User = require('../models/User');
const { protect, optionalAuth } = require('../middleware/auth');

// ─── GET /api/events ──────────────────────────────────────────────────────────
router.get('/', optionalAuth, async (req, res, next) => {
  try {
    const { therapy, upcoming, page = 1, limit = 12 } = req.query;
    const query = { isActive: true };
    if (therapy) query.therapy = therapy;
    if (upcoming === 'true') query.date = { $gte: new Date() };

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const events = await Event.find(query)
      .populate('therapy', 'name short color')
      .sort({ date: 1 })
      .skip(skip)
      .limit(parseInt(limit));

    const eventsWithStatus = events.map(e => {
      const obj = e.toObject();
      obj.availableSpots = e.totalSpots - e.registrations.length;
      obj.isRegistered = req.user
        ? e.registrations.some(r => r.user.toString() === req.user.id)
        : false;
      obj.registrations = undefined;
      return obj;
    });

    res.json({ success: true, count: events.length, events: eventsWithStatus });
  } catch (err) { next(err); }
});

// ─── GET /api/events/:id ──────────────────────────────────────────────────────
router.get('/:id', optionalAuth, async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id).populate('therapy', 'name short color');
    if (!event) return res.status(404).json({ success: false, message: 'Event not found.' });
    const obj = event.toObject();
    obj.availableSpots = event.totalSpots - event.registrations.length;
    obj.isRegistered = req.user
      ? event.registrations.some(r => r.user.toString() === req.user.id)
      : false;
    obj.registrations = undefined;
    res.json({ success: true, event: obj });
  } catch (err) { next(err); }
});

// ─── POST /api/events/:id/register ───────────────────────────────────────────
router.post('/:id/register', protect, async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ success: false, message: 'Event not found.' });

    const isRegistered = event.registrations.some(r => r.user.toString() === req.user.id);
    if (isRegistered) {
      event.registrations = event.registrations.filter(r => r.user.toString() !== req.user.id);
      await User.findByIdAndUpdate(req.user.id, { $pull: { registeredEvents: event._id } });
    } else {
      const available = event.totalSpots - event.registrations.length;
      if (available <= 0) {
        return res.status(400).json({ success: false, message: 'No spots available.' });
      }
      event.registrations.push({ user: req.user.id });
      await User.findByIdAndUpdate(req.user.id, { $addToSet: { registeredEvents: event._id } });
    }

    await event.save();
    res.json({
      success: true,
      registered: !isRegistered,
      availableSpots: event.totalSpots - event.registrations.length,
      message: !isRegistered ? 'Registered successfully!' : 'Registration cancelled.',
    });
  } catch (err) { next(err); }
});

// ─── POST /api/events (admin) ─────────────────────────────────────────────────
router.post('/', protect, async (req, res, next) => {
  try {
    const event = await Event.create({ ...req.body, createdBy: req.user.id });
    res.status(201).json({ success: true, event });
  } catch (err) { next(err); }
});

module.exports = router;
