const express = require('express');
const router = express.Router();
const { optionalAuth } = require('../middleware/auth');

// Fallback responses when OpenAI is not configured
const fallbackResponses = {
  anxious: "Feeling anxious is challenging, but you're not alone. Try box breathing: inhale for 4 counts, hold for 4, exhale for 4. Our Breathing Exercises and Meditation activities can help. Consider joining the Anxiety Support community to connect with others who understand.",
  stressed: "Stress can feel overwhelming, but small steps make a big difference. Try a short nature walk, practice progressive relaxation, or explore our Yoga activity. The Work Stress and Academic Stress communities offer peer support.",
  sad: "It's okay to feel sad — your feelings are valid. Journaling can help process emotions, and Art Therapy is wonderful for expression. Our Depression Support community is a compassionate space where you can share and heal.",
  sleep: "Poor sleep deeply affects mental health. Try our Music Relaxation activity before bed, practice a short meditation, and reduce screen time in the evening. Mindfulness Therapy has strong evidence for improving sleep quality.",
  calm: "Here are some wonderful ways to find calm: 5-minute breathing exercises, mindfulness meditation, a gentle yoga session, or journaling your thoughts. Our Mindfulness Circle community is a peaceful space to connect.",
  default: "I'm here to support your wellness journey! I can suggest calming activities, therapy options, and supportive communities. Tell me more about how you're feeling — whether it's stress, anxiety, sleep issues, or anything else.",
};

const getKeyword = (message) => {
  const lower = message.toLowerCase();
  if (lower.match(/anxi|panic|fear|worry/)) return 'anxious';
  if (lower.match(/stress|overwhelm|pressure|burnout/)) return 'stressed';
  if (lower.match(/sad|depress|unhappy|lonely|hopeless/)) return 'sad';
  if (lower.match(/sleep|insomnia|tired|exhaust/)) return 'sleep';
  if (lower.match(/calm|relax|peace|breath|mindful/)) return 'calm';
  return 'default';
};

// ─── POST /api/chat ───────────────────────────────────────────────────────────
router.post('/', optionalAuth, async (req, res, next) => {
  try {
    const { message, history = [] } = req.body;
    if (!message?.trim()) {
      return res.status(400).json({ success: false, message: 'Message is required.' });
    }

    // Try OpenAI if configured
    if (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'sk-your-openai-api-key-here') {
      try {
        const OpenAI = require('openai');
        const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

        const systemPrompt = `You are SoulSync's compassionate AI wellness companion. Your role is to:
- Listen with empathy to users' emotional concerns
- Provide evidence-based mental wellness advice
- Suggest relevant activities (meditation, yoga, journaling, breathing exercises, nature walks, music relaxation)
- Recommend appropriate therapy types (CBT, mindfulness therapy, art therapy, music therapy, group therapy)
- Encourage users to join supportive communities based on their needs
- Always remind users to seek professional help for serious mental health concerns
- Keep responses concise (3-4 sentences max), warm, and non-judgmental
- Never diagnose or replace professional mental health care
- Always end with one actionable suggestion`;

        const messages = [
          { role: 'system', content: systemPrompt },
          ...history.slice(-6).map(h => ({ role: h.from === 'user' ? 'user' : 'assistant', content: h.text })),
          { role: 'user', content: message },
        ];

        const completion = await openai.chat.completions.create({
          model: 'gpt-3.5-turbo',
          messages,
          max_tokens: 250,
          temperature: 0.7,
        });

        const reply = completion.choices[0].message.content;
        return res.json({ success: true, reply, source: 'ai' });
      } catch (aiErr) {
        console.error('OpenAI error, using fallback:', aiErr.message);
      }
    }

    // Fallback response
    const keyword = getKeyword(message);
    const reply = fallbackResponses[keyword];
    res.json({ success: true, reply, source: 'fallback' });
  } catch (err) { next(err); }
});

module.exports = router;
