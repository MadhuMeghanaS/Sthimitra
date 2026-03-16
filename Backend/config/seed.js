const mongoose = require('mongoose');
require('dotenv').config();

const Activity = require('../models/Activity');
const Therapy = require('../models/Therapy');
const Community = require('../models/Community');
const Event = require('../models/Event');
const User = require('../models/User');

const activities = [
  {
    name: 'Meditation', emoji: '🧘', category: 'Mindfulness',
    shortDesc: 'Quiet your mind and find inner peace through focused awareness.',
    description: 'Meditation is a practice where an individual uses a technique — such as mindfulness — to train attention and awareness, achieving a mentally clear and emotionally calm state.',
    benefits: ['Reduces anxiety and stress', 'Improves emotional health', 'Enhances self-awareness', 'Lengthens attention span', 'May reduce age-related memory loss'],
    steps: ['Find a quiet comfortable place to sit', 'Close your eyes and take 3 deep breaths', 'Focus on your breathing — the rise and fall of your chest', 'When your mind wanders, gently bring focus back to breath', 'Start with 5 minutes and gradually increase duration'],
    duration: '10–30 minutes', difficulty: 'Beginner', color: '#22c55e', tags: ['stress', 'anxiety', 'sleep', 'focus'],
  },
  {
    name: 'Yoga', emoji: '🌊', category: 'Movement',
    shortDesc: 'Unite body and mind through gentle movement and breath.',
    description: 'Yoga is an ancient practice combining physical postures, breathing exercises, and meditation. Regular practice improves flexibility, strength, and mental clarity.',
    benefits: ['Increases flexibility and strength', 'Reduces stress hormones', 'Improves posture and balance', 'Boosts mood and energy', 'Promotes better sleep'],
    steps: ['Start in mountain pose (Tadasana) — stand tall', 'Move into child\'s pose to warm up', 'Flow through sun salutation (5 rounds)', 'Hold warrior poses for 5 breaths each side', 'End with savasana (corpse pose) for 5 minutes'],
    duration: '30–60 minutes', difficulty: 'Beginner to Intermediate', color: '#10b981', tags: ['flexibility', 'strength', 'stress', 'sleep'],
  },
  {
    name: 'Breathing Exercises', emoji: '💨', category: 'Breathwork',
    shortDesc: 'Activate your calm response with conscious breathing techniques.',
    description: 'Controlled breathing exercises stimulate the parasympathetic nervous system, reducing the fight-or-flight response and promoting relaxation almost instantly.',
    benefits: ['Instant stress relief', 'Lowers blood pressure', 'Reduces anxiety symptoms', 'Improves focus and clarity', 'Better emotional regulation'],
    steps: ['Sit comfortably with your back straight', 'Try Box Breathing: Inhale for 4 counts', 'Hold for 4 counts', 'Exhale for 4 counts', 'Hold for 4 counts — repeat 4 times'],
    duration: '5–15 minutes', difficulty: 'Beginner', color: '#059669', tags: ['anxiety', 'panic', 'stress', 'focus'],
  },
  {
    name: 'Journaling', emoji: '📓', category: 'Reflection',
    shortDesc: 'Process your thoughts and emotions through the power of writing.',
    description: 'Journaling is a therapeutic writing practice that helps you process emotions, gain clarity, track patterns in your thoughts, and develop greater self-awareness.',
    benefits: ['Clarifies thoughts and feelings', 'Reduces mental clutter', 'Tracks personal growth', 'Helps manage anxiety', 'Boosts creativity'],
    steps: ['Choose a quiet time daily (morning or evening)', 'Write freely without judgment for 10 minutes', 'Use prompts like "Today I feel..." or "I\'m grateful for..."', 'Reflect on challenges and what you learned', 'End with 3 things you\'re grateful for'],
    duration: '10–20 minutes', difficulty: 'Beginner', color: '#16a34a', tags: ['reflection', 'anxiety', 'depression', 'clarity'],
  },
  {
    name: 'Nature Walk', emoji: '🌿', category: 'Movement',
    shortDesc: 'Reconnect with the earth and reset your nervous system outdoors.',
    description: 'Spending time in nature has profound effects on mental health. Even a 20-minute walk in a green space can significantly reduce cortisol levels and improve mood.',
    benefits: ['Reduces cortisol levels', 'Improves mood naturally', 'Boosts vitamin D', 'Clears mental fatigue', 'Encourages mindfulness'],
    steps: ['Choose a park, trail, or green area nearby', 'Leave your phone on silent or at home', 'Walk slowly and notice your surroundings', 'Engage your senses: sounds, smells, textures', 'Practice gratitude for the natural world'],
    duration: '20–45 minutes', difficulty: 'Beginner', color: '#15803d', tags: ['stress', 'mood', 'energy', 'mindfulness'],
  },
  {
    name: 'Music Relaxation', emoji: '🎵', category: 'Sensory',
    shortDesc: 'Let healing frequencies soothe your mind and ease tension.',
    description: 'Music therapy leverages the emotional and physiological power of music to reduce stress, manage pain, and improve mood. Even passive listening can be deeply therapeutic.',
    benefits: ['Lowers heart rate and blood pressure', 'Reduces anxiety', 'Improves sleep quality', 'Elevates mood', 'Enhances focus'],
    steps: ['Create a playlist of calming music (lo-fi, classical, nature sounds)', 'Find a comfortable lying or sitting position', 'Put on headphones for full immersion', 'Close your eyes and focus on the music', 'Let thoughts flow without attachment'],
    duration: '20–60 minutes', difficulty: 'Beginner', color: '#4ade80', tags: ['sleep', 'anxiety', 'mood', 'relaxation'],
  },
  {
    name: 'Progressive Relaxation', emoji: '💆', category: 'Mindfulness',
    shortDesc: 'Release tension muscle by muscle for deep physical calm.',
    description: 'Progressive Muscle Relaxation involves systematically tensing and releasing muscle groups to achieve deep physical relaxation and reduce stress.',
    benefits: ['Deep physical relaxation', 'Reduces muscle tension', 'Helps with insomnia', 'Lowers anxiety', 'Improves body awareness'],
    steps: ['Lie down in a comfortable position', 'Start with your feet — tense for 5 seconds', 'Release and notice the relaxation sensation', 'Move up through calves, thighs, abdomen, arms', 'End with face muscles, then breathe deeply'],
    duration: '15–20 minutes', difficulty: 'Beginner', color: '#22c55e', tags: ['sleep', 'tension', 'anxiety', 'relaxation'],
  },
  {
    name: 'Gratitude Practice', emoji: '🌸', category: 'Reflection',
    shortDesc: 'Rewire your brain toward positivity through daily appreciation.',
    description: 'A gratitude practice trains your brain to notice positive aspects of life, counteracting the negativity bias and building resilience against stress and depression.',
    benefits: ['Increases positive emotions', 'Improves relationships', 'Builds resilience', 'Better sleep quality', 'Reduces envy and resentment'],
    steps: ['Each morning write 3 things you\'re grateful for', 'Be specific — not just "family" but why they matter', 'Notice one unexpected good thing each day', 'Express gratitude to someone once a week', 'Reflect on challenges as growth opportunities'],
    duration: '5–10 minutes', difficulty: 'Beginner', color: '#10b981', tags: ['positivity', 'depression', 'resilience', 'mood'],
  },
];

const therapies = [
  {
    name: 'Cognitive Behavioral Therapy', short: 'CBT', emoji: '🧠',
    tagline: 'Change your thoughts, change your life',
    explanation: 'CBT is a structured, goal-oriented psychotherapy that helps people identify and change negative thought patterns and behaviors. It is one of the most evidence-based therapies available today.',
    helps: ['Depression and anxiety disorders', 'PTSD and trauma', 'Eating disorders', 'OCD', 'Phobias', 'Sleep disorders'],
    howItWorks: 'CBT works by helping you identify distorted thinking patterns, challenge them with evidence, and replace them with more balanced thoughts. Sessions typically involve homework exercises and practical skill-building.',
    color: '#22c55e',
  },
  {
    name: 'Mindfulness-Based Therapy', short: 'MBT', emoji: '☀️',
    tagline: 'Presence is the greatest gift',
    explanation: 'Mindfulness-Based Therapy integrates mindfulness meditation into therapeutic practices. MBSR and MBCT have strong clinical evidence for reducing stress and preventing depression relapse.',
    helps: ['Chronic stress and burnout', 'Recurrent depression', 'Anxiety disorders', 'Chronic pain', 'Emotional regulation'],
    howItWorks: 'Mindfulness therapy teaches you to observe thoughts and feelings without judgment. Through regular practice, you develop awareness of the present moment, reducing rumination and emotional reactivity.',
    color: '#10b981',
  },
  {
    name: 'Art Therapy', short: 'AT', emoji: '🎨',
    tagline: 'Express what words cannot say',
    explanation: 'Art therapy uses creative expression — drawing, painting, collage — as a therapeutic tool. It allows people to communicate emotions that are difficult to verbalize and can be particularly powerful for trauma.',
    helps: ['Trauma and PTSD', 'Low self-esteem', 'Anxiety and depression', 'Grief and loss', 'Children and teens'],
    howItWorks: 'In art therapy sessions, you create artwork with guidance from a trained therapist. The focus is not on artistic skill but on the process of creation and what it reveals about your inner world.',
    color: '#059669',
  },
  {
    name: 'Music Therapy', short: 'MT', emoji: '🎵',
    tagline: 'Let rhythm heal your heart',
    explanation: 'Music therapy uses music interventions to address emotional, cognitive, and social needs. Research shows it can significantly reduce anxiety, depression, and pain while improving quality of life.',
    helps: ['Anxiety and depression', 'Neurological conditions', 'Substance use recovery', 'Dementia support', 'Children with special needs'],
    howItWorks: 'Music therapists may use receptive (listening), re-creative (playing), compositional, or improvisational methods. No musical experience is needed.',
    color: '#16a34a',
  },
  {
    name: 'Group Therapy', short: 'GT', emoji: '👥',
    tagline: 'Heal together, grow together',
    explanation: 'Group therapy brings together individuals with similar challenges to share experiences and support each other under a therapist\'s guidance. Many people find unique healing through the group dynamic.',
    helps: ['Social anxiety', 'Depression and isolation', 'Grief groups', 'Addiction recovery', 'Trauma survivors'],
    howItWorks: 'In group therapy (usually 5–15 people), participants share experiences and provide mutual support. The therapist guides discussion and facilitates insight.',
    color: '#15803d',
  },
  {
    name: 'Acceptance & Commitment Therapy', short: 'ACT', emoji: '💚',
    tagline: 'Accept, commit, thrive',
    explanation: 'ACT focuses on accepting difficult emotions rather than fighting them, while committing to actions that align with your values.',
    helps: ['Anxiety and worry', 'Depression', 'Chronic pain', 'Stress management', 'Work-life challenges'],
    howItWorks: 'ACT uses metaphors, mindfulness, and values clarification to help you accept what is out of your control and commit to meaningful action toward psychological flexibility.',
    color: '#4ade80',
  },
];

const communities = [
  { name: 'Academic Stress', emoji: '📚', memberCount: 2340, color: '#22c55e', description: 'For students navigating exams, deadlines, and academic pressure. Share strategies and find support.' },
  { name: 'Work Stress', emoji: '💼', memberCount: 3150, color: '#10b981', description: 'Support for workplace burnout, toxic environments, and career anxiety. You are not alone.' },
  { name: 'Relationship Stress', emoji: '💔', memberCount: 1870, color: '#059669', description: 'Navigate the complexities of love, family, and interpersonal struggles with compassion.' },
  { name: 'Anxiety Support', emoji: '🌊', memberCount: 4200, color: '#16a34a', description: 'A safe space for those living with anxiety disorders and panic attacks. Breathe — we are here.' },
  { name: 'Depression Support', emoji: '🌱', memberCount: 3600, color: '#15803d', description: 'Compassionate community for people dealing with depression and low mood. Healing together.' },
  { name: 'Career Pressure', emoji: '🎯', memberCount: 1540, color: '#4ade80', description: 'For those feeling lost, pressured, or overwhelmed with career decisions and job stress.' },
  { name: 'Mindfulness Circle', emoji: '🧘', memberCount: 2800, color: '#22c55e', description: 'Share meditation tips, mindfulness journeys, and calm daily reflections.' },
  { name: 'Parenting Stress', emoji: '👨‍👩‍👧', memberCount: 1200, color: '#10b981', description: 'For parents navigating the beautiful, challenging journey of raising children.' },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI );
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await Promise.all([
      Activity.deleteMany({}),
      Therapy.deleteMany({}),
      Community.deleteMany({}),
      Event.deleteMany({}),
    ]);
    console.log('🗑️  Cleared existing data');

    // Seed activities
    const createdActivities = await Activity.insertMany(activities);
    console.log(`🌿 Seeded ${createdActivities.length} activities`);

    // Seed therapies
    const createdTherapies = await Therapy.insertMany(therapies);
    console.log(`🧠 Seeded ${createdTherapies.length} therapies`);

    // Seed communities
    const createdCommunities = await Community.insertMany(communities);
    console.log(`👥 Seeded ${createdCommunities.length} communities`);

    // Seed events
    const now = new Date();
    const events = [
      { title: 'CBT Workshop: Managing Anxiety', description: 'A hands-on workshop exploring CBT techniques for anxiety management.', therapy: createdTherapies[0]._id, date: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000), location: 'Hyderabad Wellness Center, Banjara Hills', totalSpots: 12, tags: ['anxiety', 'cbt'] },
      { title: 'Online CBT Group Session', description: 'Virtual CBT group session focused on workplace stress.', therapy: createdTherapies[0]._id, date: new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000), location: 'Virtual (Zoom)', isVirtual: true, totalSpots: 8, tags: ['online', 'stress'] },
      { title: '8-Week MBSR Program', description: 'The classic Mindfulness-Based Stress Reduction program by Jon Kabat-Zinn.', therapy: createdTherapies[1]._id, date: new Date(now.getTime() + 10 * 24 * 60 * 60 * 1000), location: 'Banjara Hills Yoga Center', totalSpots: 15, tags: ['mindfulness', 'stress'] },
      { title: 'Sound Bath & Healing Session', description: 'Immersive sound bath using Tibetan bowls and gongs for deep relaxation.', therapy: createdTherapies[3]._id, date: new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000), location: 'Ameerpet Wellness Hub', totalSpots: 25, tags: ['music', 'relaxation'] },
      { title: 'Healing Through Art Workshop', description: 'Expressive art therapy session — no artistic experience needed.', therapy: createdTherapies[2]._id, date: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000), location: 'Jubilee Hills Art Studio', totalSpots: 10, tags: ['art', 'creative'] },
      { title: 'Work Stress Support Group', description: 'Weekly peer support group for professionals dealing with workplace stress.', therapy: createdTherapies[4]._id, date: new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000), location: 'Hitech City Counseling Center', totalSpots: 10, tags: ['work', 'group'] },
      { title: 'Anxiety Peer Support Circle', description: 'Safe virtual space to share anxiety experiences and coping strategies.', therapy: createdTherapies[4]._id, date: new Date(now.getTime() + 4 * 24 * 60 * 60 * 1000), location: 'Virtual (Google Meet)', isVirtual: true, totalSpots: 12, tags: ['anxiety', 'online'] },
      { title: 'ACT for Stress Relief', description: 'Introduction to Acceptance and Commitment Therapy techniques.', therapy: createdTherapies[5]._id, date: new Date(now.getTime() + 12 * 24 * 60 * 60 * 1000), location: 'Secunderabad Therapy Center', totalSpots: 12, tags: ['act', 'stress'] },
    ];

    const createdEvents = await Event.insertMany(events);
    console.log(`📅 Seeded ${createdEvents.length} events`);

    console.log('\n🎉 Database seeded successfully!');
    console.log('─────────────────────────────────');
    console.log(`Activities : ${createdActivities.length}`);
    console.log(`Therapies  : ${createdTherapies.length}`);
    console.log(`Communities: ${createdCommunities.length}`);
    console.log(`Events     : ${createdEvents.length}`);
    console.log('─────────────────────────────────');

    process.exit(0);
  } catch (err) {
    console.error('❌ Seed error:', err);
    process.exit(1);
  }
}

seed();
