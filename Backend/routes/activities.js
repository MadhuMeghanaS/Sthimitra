const express = require('express');
const router = express.Router();
const Activity = require('../models/Activity');
const { protect, optionalAuth } = require('../middleware/auth');

// ─── GET /api/activities ──────────────────────────────────────────────────────
router.get('/', optionalAuth, async (req, res, next) => {
  try {
    const { category, search, difficulty, limit = 20, page = 1 } = req.query;
    const query = { isActive: true };

    if (category && category !== 'All') query.category = category;
    if (difficulty) query.difficulty = difficulty;
    if (search) query.$text = { $search: search };

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [activities, total] = await Promise.all([
      Activity.find(query).sort({ createdAt: 1 }).skip(skip).limit(parseInt(limit)),
      Activity.countDocuments(query),
    ]);

    res.json({
      success: true,
      count: activities.length,
      total,
      totalPages: Math.ceil(total / parseInt(limit)),
      currentPage: parseInt(page),
      activities,
    });
  } catch (err) { next(err); }
});

// ─── GET /api/activities/:id ──────────────────────────────────────────────────
router.get('/:id', optionalAuth, async (req, res, next) => {
  try {
    const activity = await Activity.findById(req.params.id);
    if (!activity) return res.status(404).json({ success: false, message: 'Activity not found.' });
    res.json({ success: true, activity });
  } catch (err) { next(err); }
});

// ─── POST /api/activities (admin) ─────────────────────────────────────────────
router.post('/', protect, async (req, res, next) => {
  try {
    const activity = await Activity.create(req.body);
    res.status(201).json({ success: true, activity });
  } catch (err) { next(err); }
});

// ─── PUT /api/activities/:id (admin) ─────────────────────────────────────────
router.put('/:id', protect, async (req, res, next) => {
  try {
    const activity = await Activity.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!activity) return res.status(404).json({ success: false, message: 'Activity not found.' });
    res.json({ success: true, activity });
  } catch (err) { next(err); }
});

module.exports = router;
