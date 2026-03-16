const express = require('express');
const router = express.Router();
const Community = require('../models/Community');
const User = require('../models/User');
const { protect, optionalAuth } = require('../middleware/auth');

// ─── GET /api/communities ─────────────────────────────────────────────────────
router.get('/', optionalAuth, async (req, res, next) => {
  try {
    const { search } = req.query;
    const query = { isActive: true };
    if (search) query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
    ];

    const communities = await Community.find(query)
      .populate('createdBy', 'name')
      .sort({ memberCount: -1 });

    // Add joined status if user is logged in
    const communitiesWithStatus = communities.map(c => {
      const obj = c.toObject();
      if (req.user) {
        obj.isJoined = c.members.some(m => m.toString() === req.user.id);
      }
      obj.members = undefined; // Don't expose full member list
      return obj;
    });

    res.json({ success: true, count: communities.length, communities: communitiesWithStatus });
  } catch (err) { next(err); }
});

// ─── GET /api/communities/:id ─────────────────────────────────────────────────
router.get('/:id', optionalAuth, async (req, res, next) => {
  try {
    const community = await Community.findById(req.params.id).populate('createdBy', 'name');
    if (!community) return res.status(404).json({ success: false, message: 'Community not found.' });
    const obj = community.toObject();
    if (req.user) obj.isJoined = community.members.some(m => m.toString() === req.user.id);
    obj.members = undefined;
    res.json({ success: true, community: obj });
  } catch (err) { next(err); }
});

// ─── POST /api/communities/:id/join ──────────────────────────────────────────
router.post('/:id/join', protect, async (req, res, next) => {
  try {
    const community = await Community.findById(req.params.id);
    if (!community) return res.status(404).json({ success: false, message: 'Community not found.' });

    const isJoined = community.members.includes(req.user.id);

    if (isJoined) {
      // Leave community
      community.members = community.members.filter(m => m.toString() !== req.user.id);
      community.memberCount = Math.max(0, community.memberCount - 1);
      await User.findByIdAndUpdate(req.user.id, { $pull: { joinedCommunities: community._id } });
    } else {
      // Join community
      community.members.push(req.user.id);
      community.memberCount += 1;
      await User.findByIdAndUpdate(req.user.id, { $addToSet: { joinedCommunities: community._id } });
    }

    await community.save();
    res.json({
      success: true,
      joined: !isJoined,
      memberCount: community.memberCount,
      message: !isJoined ? `Joined ${community.name}!` : `Left ${community.name}.`,
    });
  } catch (err) { next(err); }
});

// ─── POST /api/communities (admin/user) ───────────────────────────────────────
router.post('/', protect, async (req, res, next) => {
  try {
    const community = await Community.create({ ...req.body, createdBy: req.user.id });
    res.status(201).json({ success: true, community });
  } catch (err) { next(err); }
});

module.exports = router;

// POST /api/communities/join-by-name — join/leave by community name (for local data)
router.post('/join-by-name', protect, async (req, res, next) => {
  try {
    const { name, emoji, description, memberCount, color, action } = req.body;
    if (!name) return res.status(400).json({ success: false, message: 'Community name required.' });

    let community = await Community.findOne({ name });
    if (!community) {
      // Create it from local data so it can be tracked
      community = await Community.create({
        name,
        emoji:       emoji       || '💬',
        description: description || '',
        memberCount: memberCount || 0,
        color:       color       || '#5DADE2',
      });
    }

    const userId   = req.user.id;
    const isJoined = community.members.map(m => m.toString()).includes(userId);

    if (action === 'leave' || isJoined) {
      community.members    = community.members.filter(m => m.toString() !== userId);
      community.memberCount = Math.max(0, (community.memberCount || 1) - 1);
      await community.save();
      await User.findByIdAndUpdate(userId, { $pull: { joinedCommunities: community._id } });
      return res.json({ success: true, joined: false, memberCount: community.memberCount, message: `Left "${name}".` });
    } else {
      community.members.push(userId);
      community.memberCount = (community.memberCount || 0) + 1;
      await community.save();
      await User.findByIdAndUpdate(userId, { $addToSet: { joinedCommunities: community._id } });
      return res.json({ success: true, joined: true, memberCount: community.memberCount, message: `Joined "${name}"!` });
    }
  } catch (err) { next(err); }
});
