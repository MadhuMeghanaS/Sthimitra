const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const Community = require('../models/Community');
const { protect, optionalAuth } = require('../middleware/auth');

// ─── GET /api/posts?community=:id ─────────────────────────────────────────────
router.get('/', optionalAuth, async (req, res, next) => {
  try {
    const { community, page = 1, limit = 20, sort = 'new' } = req.query;
    if (!community) return res.status(400).json({ success: false, message: 'Community ID required.' });

    const sortOptions = {
      new: { createdAt: -1 },
      top: { upvoteCount: -1 },
      hot: { commentCount: -1, createdAt: -1 },
    };

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const posts = await Post.find({ community, isActive: true })
      .populate('author', 'name avatar')
      .sort(sortOptions[sort] || sortOptions.new)
      .skip(skip)
      .limit(parseInt(limit));

    // Add upvoted status
    const postsWithStatus = posts.map(p => {
      const obj = p.toObject();
      obj.upvoteCount = p.upvotes.length;
      obj.commentCount = p.comments.length;
      if (req.user) obj.isUpvoted = p.upvotes.includes(req.user.id);
      return obj;
    });

    res.json({ success: true, count: posts.length, posts: postsWithStatus });
  } catch (err) { next(err); }
});

// ─── POST /api/posts ──────────────────────────────────────────────────────────
router.post('/', protect, async (req, res, next) => {
  try {
    const { title, content, community, tags } = req.body;
    if (!title || !content || !community) {
      return res.status(400).json({ success: false, message: 'Title, content, and community are required.' });
    }

    // Check if user is member of the community
    const comm = await Community.findById(community);
    if (!comm) return res.status(404).json({ success: false, message: 'Community not found.' });

    const post = await Post.create({
      title, content, community, author: req.user.id,
      tags: tags || [],
    });

    await post.populate('author', 'name avatar');
    const obj = post.toObject();
    obj.upvoteCount = 0;
    obj.commentCount = 0;
    obj.isUpvoted = false;

    res.status(201).json({ success: true, post: obj });
  } catch (err) { next(err); }
});

// ─── POST /api/posts/:id/upvote ───────────────────────────────────────────────
router.post('/:id/upvote', protect, async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ success: false, message: 'Post not found.' });

    const isUpvoted = post.upvotes.includes(req.user.id);
    if (isUpvoted) {
      post.upvotes = post.upvotes.filter(u => u.toString() !== req.user.id);
    } else {
      post.upvotes.push(req.user.id);
    }

    await post.save();
    res.json({ success: true, upvoted: !isUpvoted, upvoteCount: post.upvotes.length });
  } catch (err) { next(err); }
});

// ─── POST /api/posts/:id/comment ─────────────────────────────────────────────
router.post('/:id/comment', protect, async (req, res, next) => {
  try {
    const { content } = req.body;
    if (!content) return res.status(400).json({ success: false, message: 'Comment content required.' });

    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ success: false, message: 'Post not found.' });

    post.comments.push({ user: req.user.id, content });
    await post.save();
    await post.populate('comments.user', 'name avatar');

    const newComment = post.comments[post.comments.length - 1];
    res.status(201).json({ success: true, comment: newComment });
  } catch (err) { next(err); }
});

// ─── DELETE /api/posts/:id ────────────────────────────────────────────────────
router.delete('/:id', protect, async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ success: false, message: 'Post not found.' });
    if (post.author.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this post.' });
    }

    post.isActive = false;
    await post.save();
    res.json({ success: true, message: 'Post deleted.' });
  } catch (err) { next(err); }
});

module.exports = router;
