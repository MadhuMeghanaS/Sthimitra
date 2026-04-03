const mongoose = require('mongoose');
require('dotenv').config();

const User = require('./models/User');
const Community = require('./models/Community');
const Activity = require('./models/Activity');
const Therapy = require('./models/Therapy');
const Event = require('./models/Event');
const Post = require('./models/Post');

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB for seeding...');

    // Clear existing data (optional, but good for a fresh start)
    await Promise.all([
      User.deleteMany({ email: 'team@soulsync.com' }),
      Community.deleteMany({}),
      Activity.deleteMany({}),
      Therapy.deleteMany({}),
      Event.deleteMany({}),
      Post.deleteMany({}),
    ]);

    // 1. Create a System User (Author for initial posts)
    const systemUser = await User.create({
      name: 'Sthimitra Team',
      email: 'team@soulsync.com',
      password: 'password123', // Doesn't matter, won't be used for login
      avatar: 'S',
      role: 'admin',
    });

    // 2. Seed Communities
    const communities = [
      { name: 'Academic Stress',    emoji: '📚', memberCount: 85, color: '#4F46E5', description: 'For students navigating exams, deadlines, and academic pressure. Share strategies and find encouragement.' },
      { name: 'Work Stress',        emoji: '💼', memberCount: 92, color: '#0F172A', description: 'Support for workplace burnout, difficult managers, toxic environments, and career anxiety.' },
      { name: 'Relationship Stress',emoji: '💔', memberCount: 64, color: '#EF4444', description: 'Navigate the complexities of love, family bonds, and interpersonal struggles with compassion.' },
      { name: 'Anxiety Support',    emoji: '🌊', memberCount: 98, color: '#3B82F6', description: 'A safe, non-judgmental space for those living with anxiety disorders and panic attacks.' },
      { name: 'Depression Support', emoji: '🌱', memberCount: 76, color: '#10B981', description: 'Compassionate community for people dealing with depression and persistent low mood.' },
      { name: 'Career Pressure',    emoji: '🎯', memberCount: 61, color: '#F59E0B', description: 'For those feeling lost, pressured, or overwhelmed with career decisions and job searching.' },
      { name: 'Mindfulness Circle', emoji: '🧘', memberCount: 88, color: '#06B6D4', description: 'Share meditation tips, mindfulness journeys, and peaceful daily reflections.' },
      { name: 'Parenting Stress',   emoji: '👨‍👩‍👧', memberCount: 67, color: '#EC4899', description: 'For parents navigating the joys and very real challenges of raising children.' },
    ];

    const createdCommunities = await Community.insertMany(communities);
    console.log(`✅ Seeded ${createdCommunities.length} communities.`);

    // 3. Seed Activities
    const activitiesData = [
      { name: 'Meditation', emoji: '🧘', category: 'Mindfulness', duration: '10–30 min', difficulty: 'Beginner',
        color: '#4F46E5', image: 'https://images.unsplash.com/photo-1545389336-cf090694435e?w=600&q=80',
        shortDesc: 'Train your attention, find stillness, and cultivate inner peace.',
        description: 'Meditation is the practice of training your mind to redirect thoughts and develop awareness. Regular practice leads to measurable improvements in stress, anxiety, focus, and emotional wellbeing.',
        benefits: ['Reduces cortisol by up to 20%', 'Improves emotional regulation', 'Enhances focus and attention', 'Promotes better sleep quality', 'Increases self-awareness'],
        steps: ['Find a quiet, comfortable seated position', 'Set a gentle timer (start with 5 minutes)', 'Close your eyes and take 3 deep breaths', 'Focus on the sensation of breathing — the rise and fall', 'When thoughts arise, simply notice them and return to breath', 'Gradually extend sessions to 10–20 minutes'] },
      { name: 'Yoga', emoji: '🧘‍♀️', category: 'Movement', duration: '30–60 min', difficulty: 'Beginner to Intermediate',
        color: '#0F172A', image: 'https://images.unsplash.com/photo-1599447421416-3414500d18a5?w=600&q=80',
        shortDesc: 'Unite body and mind through intentional movement and breath.',
        description: "Yoga combines physical postures, breathing techniques, and mindfulness into a holistic practice. It's one of the most comprehensively studied wellness interventions available.",
        benefits: ['Reduces stress hormones significantly', 'Improves flexibility and strength', 'Enhances mind-body connection', 'Promotes better posture', 'Supports healthy sleep cycles'],
        steps: ['Begin with 3 minutes of deep breathing seated', 'Move through gentle cat-cow stretches to warm up', 'Flow through 5 rounds of sun salutation', 'Hold warrior I and II for 5 breaths each side', "Rest in child's pose between challenging sequences", 'Close with 5 minutes of savasana (corpse pose)'] },
      { name: 'Breathing Exercises', emoji: '💨', category: 'Breathwork', duration: '5–15 min', difficulty: 'Beginner',
        color: '#3B82F6', image: 'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=600&q=80',
        shortDesc: 'Regulate your nervous system in seconds with conscious breath.',
        description: 'Controlled breathing exercises directly activate the parasympathetic nervous system, creating an immediate calm response. Different techniques serve different needs — from instant anxiety relief to sustained energy.',
        benefits: ['Activates calm response instantly', 'Lowers heart rate and blood pressure', 'Reduces anxiety symptoms rapidly', 'Improves focus and clarity', 'Improves emotional regulation'],
        steps: ['Sit upright or lie comfortably', 'Box Breathing: Inhale through nose for 4 counts', 'Hold the breath for 4 counts', 'Exhale through mouth for 4 counts', 'Hold empty for 4 counts', 'Repeat 4–6 cycles, twice daily for best results'] },
      { name: 'Journaling', emoji: '📓', category: 'Reflection', duration: '10–20 min', difficulty: 'Beginner',
        color: '#64748B', image: 'https://images.unsplash.com/photo-1517842645767-c639042777db?w=600&q=80',
        shortDesc: 'Process emotions, gain clarity, and track your growth in writing.',
        description: 'Expressive writing and journaling have strong research support for reducing psychological distress. Writing externalizes the mental load, helping you process and make sense of overwhelming experiences.',
        benefits: ['Reduces psychological distress measurably', 'Clarifies muddled thoughts and feelings', 'Identifies recurring stress patterns', 'Boosts problem-solving ability', 'Builds self-awareness over time'],
        steps: ['Choose a consistent time — morning or before bed works well', 'Write freely for 10 minutes without editing or judgment', 'Try prompts: "Right now I feel..." or "What\'s weighing on me is..."', 'Explore not just events, but your emotional response to them', 'Note 3 things you\'re genuinely grateful for', 'Review old entries monthly to track growth'] },
      { name: 'Nature Walk', emoji: '🌿', category: 'Movement', duration: '20–45 min', difficulty: 'Beginner',
        color: '#0F172A', image: 'https://images.unsplash.com/photo-1473448912268-2022ce9509d8?w=600&q=80',
        shortDesc: 'Reset your nervous system with green spaces and fresh air.',
        description: 'Spending time in natural environments (especially green spaces) has demonstrated effects on reducing cortisol, lowering rumination, and improving mood. Even urban parks provide measurable benefit.',
        benefits: ['Reduces cortisol levels by measurable amounts', 'Lowers prefrontal cortex rumination', 'Boosts mood via natural light and serotonin', 'Improves vitamin D levels', 'Provides gentle physical exercise'],
        steps: ['Choose any green space — park, trail, garden, waterfront', 'Leave your phone on silent or at home if possible', 'Walk at a comfortable, unhurried pace', 'Engage all senses: notice sounds, smells, textures', 'Avoid planning or problem-solving — just observe', 'Try to do this for at least 20 minutes, 3x per week'] },
      { name: 'Music Relaxation', emoji: '🎵', category: 'Sensory', duration: '20–60 min', difficulty: 'Beginner',
        color: '#4F46E5', image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&q=80',
        shortDesc: 'Let healing frequencies calm your nervous system deeply.',
        description: 'Music therapy has extensive research support for reducing anxiety, lowering blood pressure, and improving mood. Even passive listening at the right tempo can shift physiological stress markers within minutes.',
        benefits: ['Lowers heart rate and blood pressure', 'Reduces anxiety markers measurably', 'Improves sleep onset and quality', 'Elevates mood and reduces pain perception', 'Enhances focus during creative work'],
        steps: ['Create a playlist of 60–80 BPM music (matches resting heart rate)', 'Find a comfortable lying or seated position', 'Use headphones for maximum immersion', 'Close your eyes and let the music fill your attention', 'Allow thoughts to arise and pass without attachment', 'For sleep: binaural beats or delta wave music works well'] },
      { name: 'Progressive Relaxation', emoji: '💆', category: 'Mindfulness', duration: '15–25 min', difficulty: 'Beginner',
        color: '#64748B', image: 'https://images.unsplash.com/photo-1600508774634-4e11d34730e2?w=600&q=80',
        shortDesc: 'Systematically release physical tension stored in your body.',
        description: "Progressive Muscle Relaxation (PMR) involves deliberately tensing and then releasing muscle groups throughout the body. It's one of the most effective techniques for releasing physical stress and improving sleep.",
        benefits: ['Deep physical tension release', 'Significantly improves sleep quality', 'Reduces anxiety and panic symptoms', 'Teaches body-awareness skills', 'Highly effective for headache relief'],
        steps: ['Lie down in a quiet, comfortable space', 'Start with feet: tense all foot muscles tightly for 5 seconds', 'Release completely and notice the contrast of relaxation', 'Move through calves, thighs, abdomen, hands, arms, shoulders', 'Tense each group for 5s, release for 20s', 'End with face and scalp, then breathe slowly for 2 minutes'] },
      { name: 'Gratitude Practice', emoji: '🌸', category: 'Reflection', duration: '5–10 min', difficulty: 'Beginner',
        color: '#0F172A', image: 'https://images.unsplash.com/photo-1490730141103-6cac27aaab94?w=600&q=80',
        shortDesc: 'Rewire your brain toward positivity through daily appreciation.',
        description: 'Gratitude practice has robust neuroscientific support. Regular gratitude journaling activates brain regions associated with reward and social bonding, and counteracts the negativity bias built into our nervous system.',
        benefits: ['Increases positive emotion baseline', 'Improves relationships and social connection', 'Builds psychological resilience', 'Reduces depressive symptoms over time', 'Improves sleep when practiced at bedtime'],
        steps: ['Each morning or evening, write exactly 3 things you\'re grateful for', 'Be specific rather than general (not "family" but "my sister calling just to chat")', 'Include at least one unexpected or surprising good thing', 'Explain *why* each thing matters to you', 'Notice one small positive thing during the day intentionally', 'Once weekly: write a gratitude letter to someone (send it optional)'] },
    ];

    const createdActivities = await Activity.insertMany(activitiesData);
    console.log(`✅ Seeded ${createdActivities.length} activities.`);

    // 4. Seed Therapies
    const therapiesData = [
      { name: 'Cognitive Behavioral Therapy', short: 'CBT', emoji: '🧠',
        color: '#4F46E5',
        image: 'https://images.unsplash.com/photo-1573497620053-ea5300f94f21?w=600&q=80',
        price: 850,
        duration: '60 Minutes',
        tagline: 'Change your thoughts, change your life',
        explanation: 'CBT is the most extensively researched form of psychotherapy. It works by helping people identify and restructure distorted thought patterns (cognitive distortions) that drive anxiety, depression, and other mental health challenges.',
        helps: ['Anxiety disorders and panic attacks', 'Depression and low mood', 'PTSD and trauma', 'OCD', 'Eating disorders', 'Sleep disorders', 'Phobias'],
        howItWorks: 'A CBT therapist helps you map the connections between your thoughts, feelings, and behaviors. You identify unhelpful thinking patterns, learn to challenge them with evidence, and practice building more balanced responses. Sessions involve structured homework.',
      },
      { name: 'Mindfulness-Based Therapy', short: 'MBSR', emoji: '☀️',
        color: '#0F172A',
        image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80',
        price: 950,
        duration: '90 Minutes',
        tagline: 'The present moment is the only place healing happens',
        explanation: 'Mindfulness-Based Stress Reduction (MBSR) and Mindfulness-Based Cognitive Therapy (MBCT) integrate meditation practices into therapeutic frameworks. Both have strong clinical evidence, particularly for stress, chronic pain, and recurrent depression.',
        helps: ['Chronic stress and burnout', 'Recurrent depression', 'Anxiety and worry', 'Chronic pain', 'Emotional dysregulation', 'Addiction recovery'],
        howItWorks: 'An 8-week structured program teaches formal meditation practices (body scan, sitting meditation, mindful movement) and informal mindfulness integrated into daily life. You learn to observe thoughts without reacting automatically to them.',
      },
      { name: 'Art Therapy', short: 'AT', emoji: '🎨',
        color: '#3B82F6',
        image: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800&q=80',
        price: 650,
        duration: '60 Minutes',
        tagline: 'Express what words cannot hold',
        explanation: "Art therapy uses creative expression — drawing, painting, collage, sculpture — as a primary therapeutic medium. It's particularly powerful for trauma, processing emotions that are difficult to verbalize, and with children and adolescents.",
        helps: ['Trauma and PTSD', 'Low self-esteem', 'Grief and loss', 'Anxiety and depression', 'Children and teens', 'Autism spectrum'],
        howItWorks: 'You create artwork with guidance from a trained art therapist. The focus is entirely on the process of creation — not skill or output. The therapist helps you explore what emerges in your artwork, building insight and emotional processing.',
      },
      { name: 'Music Therapy', short: 'MT', emoji: '🎵',
        color: '#64748B',
        image: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=800&q=80',
        price: 550,
        duration: '60 Minutes',
        tagline: 'Let rhythm reach where words cannot',
        explanation: 'Music therapy uses evidence-based music interventions to address emotional, cognitive, physiological, and social needs. Research shows measurable reductions in anxiety, pain, and depression, and improvements in quality of life across many populations.',
        helps: ['Anxiety and depression', 'Trauma recovery', 'Neurological conditions', 'Substance use recovery', 'Dementia support', 'Children with special needs'],
        howItWorks: 'Music therapists use receptive (listening), re-creative (playing existing music), compositional, and improvisational methods. No musical experience or talent is required. The therapeutic relationship and the music itself are the instruments of healing.',
      },
      { name: 'Group Therapy', short: 'GT', emoji: '👥',
        color: '#1E293B',
        image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&q=80',
        price: 600,
        duration: '90 Minutes',
        tagline: 'Heal in connection, grow together',
        explanation: "Group therapy brings together 5–15 people with similar challenges under a professional therapist's guidance. The group dynamic itself becomes a healing factor — you both give and receive support, gain perspective, and realize you're not alone.",
        helps: ['Social anxiety and isolation', 'Depression', 'Grief groups', 'Addiction recovery', 'Work stress', 'Relationship difficulties'],
        howItWorks: 'A trained therapist facilitates structured discussion, helps manage group dynamics, and guides the group toward insight. Members practice communication and vulnerability in a controlled, safe environment that mirrors real-world relationships.',
      },
      { name: 'Acceptance & Commitment Therapy', short: 'ACT', emoji: '💜',
        color: '#4F46E5',
        image: 'https://images.unsplash.com/photo-1447452001602-7090c7ab2db3?w=600&q=80',
        price: 750,
        duration: '60 Minutes',
        tagline: 'Accept, commit, live by your values',
        explanation: 'ACT is a mindfulness-based behavioral therapy that focuses on psychological flexibility — the ability to be present with difficult thoughts and feelings without being ruled by them, while committing to actions that move you toward your values.',
        helps: ['Anxiety and chronic worry', 'Depression', 'Chronic pain', 'Perfectionism and self-criticism', 'Work-life challenges', 'Life transitions'],
        howItWorks: 'ACT uses six core processes: defusion (unhooking from thoughts), acceptance (making room for difficult feelings), present-moment awareness, observing self, values clarification, and committed action. Metaphors and exercises build psychological flexibility.',
      },
    ];

    const createdTherapies = await Therapy.insertMany(therapiesData);
    console.log(`✅ Seeded ${createdTherapies.length} therapies.`);

    // 5. Seed Events
    const eventsData = [
      { therapy: createdTherapies[0]._id, title: 'CBT Workshop: Managing Anxiety', date: new Date('2026-05-15'), location: 'Hyderabad Wellness Center', totalSpots: 12, description: 'Learn practical CBT tools for anxiety.' },
      { therapy: createdTherapies[0]._id, title: 'Online CBT Introduction', date: new Date('2026-05-20'), location: 'Virtual (Zoom)', totalSpots: 8, description: 'A gentle introduction to CBT principles.' },
      { therapy: createdTherapies[1]._id, title: '8-Week MBSR Program', date: new Date('2026-06-05'), location: 'Banjara Hills Yoga Center', totalSpots: 15, description: 'Comprehensive mindfulness training.' },
      { therapy: createdTherapies[2]._id, title: 'Healing Through Art Workshop', date: new Date('2026-05-18'), location: 'Jubilee Hills Art Studio', totalSpots: 10, description: 'Process emotions through painting.' },
      { therapy: createdTherapies[3]._id, title: 'Sound Bath & Healing Session', date: new Date('2026-05-21'), location: 'Ameerpet Wellness Hub', totalSpots: 25, description: 'Deep relaxation through sound.' },
      { therapy: createdTherapies[4]._id, title: 'Work Stress Support Group', date: new Date('2026-05-25'), location: 'Hitech City Counseling Center', totalSpots: 10, description: 'A safe space for career challenges.' },
      { therapy: createdTherapies[5]._id, title: 'ACT for Stress Relief', date: new Date('2026-06-12'), location: 'Secunderabad Therapy Center', totalSpots: 12, description: 'Acceptance and commitment techniques.' },
    ];

    const createdEvents = await Event.insertMany(eventsData);
    console.log(`✅ Seeded ${createdEvents.length} events.`);

    // 6. Seed Sample Posts
    const postsData = [
      {
        title: 'Finals are destroying me — any tips?',
        content: "I have 4 exams in 3 days and can't focus at all. My mind goes blank the moment I open a textbook. Has anyone found study break strategies that actually help reset focus?",
        author: systemUser._id,
        community: createdCommunities[0]._id,
        isPinned: false,
      },
      {
        title: 'How I survived my toughest semester — what actually worked',
        content: "After nearly failing out last year, I discovered that studying in 25-minute focused blocks with 5-minute movement breaks changed everything. The Pomodoro technique isn't just productivity advice — it genuinely prevents the mental fatigue that makes studying feel impossible.",
        author: systemUser._id,
        community: createdCommunities[0]._id,
        isPinned: true,
      },
      {
        title: 'My manager makes me feel worthless',
        content: "Nothing I do is ever good enough. I work late, deliver on time, get positive client feedback — and still get picked apart in every 1:1. I dread going to work every day. Has anyone dealt with a relentlessly hypercritical boss and come through it?",
        author: systemUser._id,
        community: createdCommunities[1]._id,
        isPinned: false,
      },
      {
        title: 'Had a panic attack in public for the first time',
        content: "It happened in a grocery store. Heart racing, couldn't breathe, felt like I was dying. I managed to get outside but I'm terrified it'll happen again. Does the fear of it happening again eventually get better?",
        author: systemUser._id,
        community: createdCommunities[3]._id,
        isPinned: false,
      },
    ];

    await Post.insertMany(postsData);
    console.log(`✅ Seeded sample posts.`);

    console.log('🌟 Seeding complete!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding failed:', err);
    process.exit(1);
  }
};

seedData();
