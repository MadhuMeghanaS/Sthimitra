const express = require('express');
const router = express.Router();
const StressAssessment = require('../models/StressAssessment');
const { protect } = require('../middleware/auth');

// Compute stress level from score
const computeStressLevel = (score) => {
  if (score <= 14) return 'Low';
  if (score <= 24) return 'Moderate';
  return 'High';
};

const recommendationsMap = {
  Low: {
    activities: ['Meditation', 'Nature Walk', 'Journaling'],
    communities: ['Mindfulness Circle', 'Wellness Enthusiasts'],
    therapies: ['Mindfulness Therapy', 'Art Therapy'],
  },
  Moderate: {
    activities: ['Yoga', 'Breathing Exercises', 'Music Relaxation'],
    communities: ['Work Stress', 'Academic Stress'],
    therapies: ['CBT', 'Mindfulness Therapy', 'Group Therapy'],
  },
  High: {
    activities: ['Breathing Exercises', 'Meditation', 'Yoga'],
    communities: ['Anxiety Support', 'Depression Support'],
    therapies: ['CBT', 'Group Therapy', 'Music Therapy'],
  },
};

// ─── GET /api/assessments ─────────────────────────────────────────────────────
router.get('/', protect, async (req, res, next) => {
  try {
    const assessments = await StressAssessment.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .limit(10);
    res.json({ success: true, count: assessments.length, assessments });
  } catch (err) { next(err); }
});

// ─── GET /api/assessments/latest ─────────────────────────────────────────────
router.get('/latest', protect, async (req, res, next) => {
  try {
    const assessment = await StressAssessment.findOne({ user: req.user.id }).sort({ createdAt: -1 });
    res.json({ success: true, assessment });
  } catch (err) { next(err); }
});

// ─── POST /api/assessments ────────────────────────────────────────────────────
router.post('/', protect, async (req, res, next) => {
  try {
    const { answers } = req.body;

    if (!answers || !Array.isArray(answers) || answers.length < 5) {
      return res.status(400).json({ success: false, message: 'Please answer at least 5 questions.' });
    }

    const totalScore = answers.reduce((sum, a) => sum + (a.answer || 0), 0);
    const stressLevel = computeStressLevel(totalScore);
    const recommendations = recommendationsMap[stressLevel];

    const assessment = await StressAssessment.create({
      user: req.user.id,
      answers,
      totalScore,
      stressLevel,
      recommendations,
    });

    res.status(201).json({ success: true, assessment });
  } catch (err) { next(err); }
});

// ─── DELETE /api/assessments/:id ─────────────────────────────────────────────
router.delete('/:id', protect, async (req, res, next) => {
  try {
    const assessment = await StressAssessment.findById(req.params.id);
    if (!assessment) return res.status(404).json({ success: false, message: 'Assessment not found.' });
    if (assessment.user.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized.' });
    }
    await assessment.deleteOne();
    res.json({ success: true, message: 'Assessment deleted.' });
  } catch (err) { next(err); }
});

module.exports = router;
