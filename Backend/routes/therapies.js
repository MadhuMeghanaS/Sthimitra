const express = require('express');
const router = express.Router();
const Therapy = require('../models/Therapy');
const Event = require('../models/Event');
const { protect, optionalAuth } = require('../middleware/auth');

// ─── GET /api/therapies ───────────────────────────────────────────────────────
router.get('/', optionalAuth, async (req, res, next) => {
  try {
    const therapies = await Therapy.find({ isActive: true }).sort({ createdAt: 1 });
    res.json({ success: true, count: therapies.length, therapies });
  } catch (err) { next(err); }
});

// ─── GET /api/therapies/:id ───────────────────────────────────────────────────
router.get('/:id', optionalAuth, async (req, res, next) => {
  try {
    const therapy = await Therapy.findById(req.params.id);
    if (!therapy) return res.status(404).json({ success: false, message: 'Therapy not found.' });

    // Get upcoming events for this therapy
    const events = await Event.find({
      therapy: req.params.id,
      date: { $gte: new Date() },
      isActive: true,
    }).sort({ date: 1 }).limit(5);

    res.json({ success: true, therapy, events });
  } catch (err) { next(err); }
});

// ─── POST /api/therapies (admin) ──────────────────────────────────────────────
router.post('/', protect, async (req, res, next) => {
  try {
    const therapy = await Therapy.create(req.body);
    res.status(201).json({ success: true, therapy });
  } catch (err) { next(err); }
});

module.exports = router;
