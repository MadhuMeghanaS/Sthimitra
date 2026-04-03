const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Activity = require('../models/Activity');
const Community = require('../models/Community');

router.get('/', async (req, res) => {
  try {
    const [userCount, activityCount, communityCount] = await Promise.all([
      User.countDocuments(),
      Activity.countDocuments(),
      Community.countDocuments(),
    ]);

    res.json({
      success: true,
      stats: {
        users: userCount,
        activities: activityCount,
        communities: communityCount,
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

module.exports = router;
