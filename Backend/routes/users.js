const express = require('express');
const router  = express.Router();
const User    = require('../models/User');
const Activity  = require('../models/Activity');
const Community = require('../models/Community');
const Event     = require('../models/Event');
const { protect } = require('../middleware/auth');

// GET /api/users/profile  — full populated profile
router.get('/profile', protect, async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id)
      .populate('savedActivities',   'name emoji category shortDesc duration color')
      .populate('joinedCommunities', 'name emoji memberCount description color')
      .populate('registeredEvents',  'title date location isVirtual');

    if (!user) return res.status(404).json({ success: false, message: 'User not found.' });
    res.json({ success: true, user });
  } catch (err) { next(err); }
});

// PUT /api/users/profile
router.put('/profile', protect, async (req, res, next) => {
  try {
    const { name, bio, avatar } = req.body;
    const update = {};
    if (name  !== undefined) update.name   = name.trim();
    if (bio   !== undefined) update.bio    = bio;
    if (avatar !== undefined) update.avatar = avatar;

    const user = await User.findByIdAndUpdate(req.user.id, update, { new: true, runValidators: true })
      .populate('savedActivities',   'name emoji category shortDesc')
      .populate('joinedCommunities', 'name emoji memberCount description')
      .populate('registeredEvents',  'title date location');

    res.json({ success: true, user });
  } catch (err) { next(err); }
});

// POST /api/users/save-activity/:id  — toggle save/unsave
router.post('/save-activity/:id', protect, async (req, res, next) => {
  try {
    const user       = await User.findById(req.user.id);
    const activityId = req.params.id;
    const isSaved    = user.savedActivities.map(id => id.toString()).includes(activityId);

    if (isSaved) {
      user.savedActivities = user.savedActivities.filter(id => id.toString() !== activityId);
    } else {
      user.savedActivities.push(activityId);
    }
    await user.save();

    res.json({
      success: true,
      saved:   !isSaved,
      message: !isSaved ? 'Activity saved to your profile!' : 'Activity removed from saved.',
    });
  } catch (err) { next(err); }
});

// DELETE /api/users/account
router.delete('/account', protect, async (req, res, next) => {
  try {
    await User.findByIdAndUpdate(req.user.id, { isActive: false });
    res.json({ success: true, message: 'Account deactivated.' });
  } catch (err) { next(err); }
});

module.exports = router;

// POST /api/users/save-activity-by-name — save activity by name (for local data activities)
router.post('/save-activity-by-name', protect, async (req, res, next) => {
  try {
    const { name, emoji, category, shortDesc, duration, color } = req.body;
    if (!name) return res.status(400).json({ success: false, message: 'Activity name required.' });

    const user = await User.findById(req.user.id);

    // Check if already saved by name (activities stored as plain objects in savedActivities)
    const alreadySaved = user.savedActivities.some(a => {
      if (typeof a === 'object' && a.name) return a.name === name;
      return false;
    });

    if (alreadySaved) {
      // Remove it
      user.savedActivities = user.savedActivities.filter(a => {
        if (typeof a === 'object' && a.name) return a.name !== name;
        return true;
      });
      await user.save();
      return res.json({ success: true, saved: false, message: `Removed "${name}" from saved.` });
    } else {
      // For activities not in DB, store a simple subdocument
      // We need to push as ObjectId if Activity model exists, else skip
      const Activity = require('../models/Activity');
      let actDoc = await Activity.findOne({ name });
      if (!actDoc) {
        // Create it so it can be referenced
        actDoc = await Activity.create({ name, emoji: emoji || '🌿', category: category || 'Mindfulness', shortDesc: shortDesc || '', duration: duration || '15 min', color: color || '#5DADE2', description: shortDesc || name, benefits: [], steps: [] });
      }
      if (!user.savedActivities.map(id => id.toString()).includes(actDoc._id.toString())) {
        user.savedActivities.push(actDoc._id);
      }
      await user.save();
      return res.json({ success: true, saved: true, message: `"${name}" saved to your profile!` });
    }
  } catch (err) { next(err); }
});
