import React, { useState } from 'react'
import { X, Clock, Heart, ChevronRight, Search, BookmarkPlus, BookmarkCheck, Loader2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import AuthModal from '../components/AuthModal'
import toast from 'react-hot-toast'

// ── Activity data — same as before, colors updated to green theme ─────────────
const activities = [
  { id: 1, name: 'Meditation', emoji: '🧘', category: 'Mindfulness', duration: '10–30 min', difficulty: 'Beginner',
    color: '#4F46E5', image: 'https://images.unsplash.com/photo-1545389336-cf090694435e?w=600&q=80',
    shortDesc: 'Train your attention, find stillness, and cultivate inner peace.',
    description: 'Meditation is the practice of training your mind to redirect thoughts and develop awareness. Regular practice leads to measurable improvements in stress, anxiety, focus, and emotional wellbeing.',
    benefits: ['Reduces cortisol by up to 20%', 'Improves emotional regulation', 'Enhances focus and attention', 'Promotes better sleep quality', 'Increases self-awareness'],
    steps: ['Find a quiet, comfortable seated position', 'Set a gentle timer (start with 5 minutes)', 'Close your eyes and take 3 deep breaths', 'Focus on the sensation of breathing — the rise and fall', 'When thoughts arise, simply notice them and return to breath', 'Gradually extend sessions to 10–20 minutes'] },
  { id: 2, name: 'Yoga', emoji: '🧘‍♀️', category: 'Movement', duration: '30–60 min', difficulty: 'Beginner–Inter',
    color: '#0F172A', image: 'https://images.unsplash.com/photo-1599447421416-3414500d18a5?w=600&q=80',
    shortDesc: 'Unite body and mind through intentional movement and breath.',
    description: "Yoga combines physical postures, breathing techniques, and mindfulness into a holistic practice. It's one of the most comprehensively studied wellness interventions available.",
    benefits: ['Reduces stress hormones significantly', 'Improves flexibility and strength', 'Enhances mind-body connection', 'Promotes better posture', 'Supports healthy sleep cycles'],
    steps: ['Begin with 3 minutes of deep breathing seated', 'Move through gentle cat-cow stretches to warm up', 'Flow through 5 rounds of sun salutation', 'Hold warrior I and II for 5 breaths each side', "Rest in child's pose between challenging sequences", 'Close with 5 minutes of savasana (corpse pose)'] },
  { id: 3, name: 'Breathing Exercises', emoji: '💨', category: 'Breathwork', duration: '5–15 min', difficulty: 'Beginner',
    color: '#3B82F6', image: 'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=600&q=80',
    shortDesc: 'Regulate your nervous system in seconds with conscious breath.',
    description: 'Controlled breathing exercises directly activate the parasympathetic nervous system, creating an immediate calm response. Different techniques serve different needs — from instant anxiety relief to sustained energy.',
    benefits: ['Activates calm response instantly', 'Lowers heart rate and blood pressure', 'Reduces anxiety symptoms rapidly', 'Improves focus and clarity', 'Improves emotional regulation'],
    steps: ['Sit upright or lie comfortably', 'Box Breathing: Inhale through nose for 4 counts', 'Hold the breath for 4 counts', 'Exhale through mouth for 4 counts', 'Hold empty for 4 counts', 'Repeat 4–6 cycles, twice daily for best results'] },
  { id: 4, name: 'Journaling', emoji: '📓', category: 'Reflection', duration: '10–20 min', difficulty: 'Beginner',
    color: '#64748B', image: 'https://images.unsplash.com/photo-1517842645767-c639042777db?w=600&q=80',
    shortDesc: 'Process emotions, gain clarity, and track your growth in writing.',
    description: 'Expressive writing and journaling have strong research support for reducing psychological distress. Writing externalizes the mental load, helping you process and make sense of overwhelming experiences.',
    benefits: ['Reduces psychological distress measurably', 'Clarifies muddled thoughts and feelings', 'Identifies recurring stress patterns', 'Boosts problem-solving ability', 'Builds self-awareness over time'],
    steps: ['Choose a consistent time — morning or before bed works well', 'Write freely for 10 minutes without editing or judgment', 'Try prompts: "Right now I feel..." or "What\'s weighing on me is..."', 'Explore not just events, but your emotional response to them', 'Note 3 things you\'re genuinely grateful for', 'Review old entries monthly to track growth'] },
  { id: 5, name: 'Nature Walk', emoji: '🌿', category: 'Movement', duration: '20–45 min', difficulty: 'Beginner',
    color: '#0F172A', image: 'https://images.unsplash.com/photo-1473448912268-2022ce9509d8?w=600&q=80',
    shortDesc: 'Reset your nervous system with green spaces and fresh air.',
    description: 'Spending time in natural environments (especially green spaces) has demonstrated effects on reducing cortisol, lowering rumination, and improving mood. Even urban parks provide measurable benefit.',
    benefits: ['Reduces cortisol levels by measurable amounts', 'Lowers prefrontal cortex rumination', 'Boosts mood via natural light and serotonin', 'Improves vitamin D levels', 'Provides gentle physical exercise'],
    steps: ['Choose any green space — park, trail, garden, waterfront', 'Leave your phone on silent or at home if possible', 'Walk at a comfortable, unhurried pace', 'Engage all senses: notice sounds, smells, textures', 'Avoid planning or problem-solving — just observe', 'Try to do this for at least 20 minutes, 3x per week'] },
  { id: 6, name: 'Music Relaxation', emoji: '🎵', category: 'Sensory', duration: '20–60 min', difficulty: 'Beginner',
    color: '#4F46E5', image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&q=80',
    shortDesc: 'Let healing frequencies calm your nervous system deeply.',
    description: 'Music therapy has extensive research support for reducing anxiety, lowering blood pressure, and improving mood. Even passive listening at the right tempo can shift physiological stress markers within minutes.',
    benefits: ['Lowers heart rate and blood pressure', 'Reduces anxiety markers measurably', 'Improves sleep onset and quality', 'Elevates mood and reduces pain perception', 'Enhances focus during creative work'],
    steps: ['Create a playlist of 60–80 BPM music (matches resting heart rate)', 'Find a comfortable lying or seated position', 'Use headphones for maximum immersion', 'Close your eyes and let the music fill your attention', 'Allow thoughts to arise and pass without attachment', 'For sleep: binaural beats or delta wave music works well'] },
  { id: 7, name: 'Progressive Relaxation', emoji: '💆', category: 'Mindfulness', duration: '15–25 min', difficulty: 'Beginner',
    color: '#64748B', image: 'https://images.unsplash.com/photo-1600508774634-4e11d34730e2?w=600&q=80',
    shortDesc: 'Systematically release physical tension stored in your body.',
    description: "Progressive Muscle Relaxation (PMR) involves deliberately tensing and then releasing muscle groups throughout the body. It's one of the most effective techniques for releasing physical stress and improving sleep.",
    benefits: ['Deep physical tension release', 'Significantly improves sleep quality', 'Reduces anxiety and panic symptoms', 'Teaches body-awareness skills', 'Highly effective for headache relief'],
    steps: ['Lie down in a quiet, comfortable space', 'Start with feet: tense all foot muscles tightly for 5 seconds', 'Release completely and notice the contrast of relaxation', 'Move through calves, thighs, abdomen, hands, arms, shoulders', 'Tense each group for 5s, release for 20s', 'End with face and scalp, then breathe slowly for 2 minutes'] },
  { id: 8, name: 'Gratitude Practice', emoji: '🌸', category: 'Reflection', duration: '5–10 min', difficulty: 'Beginner',
    color: '#0F172A', image: 'https://images.unsplash.com/photo-1490730141103-6cac27aaab94?w=600&q=80',
    shortDesc: 'Rewire your brain toward positivity through daily appreciation.',
    description: 'Gratitude practice has robust neuroscientific support. Regular gratitude journaling activates brain regions associated with reward and social bonding, and counteracts the negativity bias built into our nervous system.',
    benefits: ['Increases positive emotion baseline', 'Improves relationships and social connection', 'Builds psychological resilience', 'Reduces depressive symptoms over time', 'Improves sleep when practiced at bedtime'],
    steps: ['Each morning or evening, write exactly 3 things you\'re grateful for', 'Be specific rather than general (not "family" but "my sister calling just to chat")', 'Include at least one unexpected or surprising good thing', 'Explain *why* each thing matters to you', 'Notice one small positive thing during the day intentionally', 'Once weekly: write a gratitude letter to someone (send it optional)'] },
]

const categories = ['All', 'Mindfulness', 'Movement', 'Breathwork', 'Reflection', 'Sensory']

// ── Detail modal — same layout, updated colors + circular icon header ─────────
function DetailModal({ a, onClose, isSaved, onToggleSave, saving }) {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center modal-overlay"
      onClick={e => e.target === e.currentTarget && onClose()}>
      <motion.div 
        initial={{ y: 50, opacity: 0, scale: 0.95 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 20, opacity: 0, scale: 0.95 }}
        className="bg-white rounded-2xl shadow-soul-hover w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
        {/* Photo Header with Themed Overlays — as requested */}
        <div className="relative h-64 rounded-t-2xl overflow-hidden border-b border-slate-100/50">
          <img src={a.image} alt={a.name} className="w-full h-full object-cover relative z-0" />
          
          {/* Immersive themed overlays */}
          <div className="absolute inset-0 z-1 opacity-40 pointer-events-none"
            style={{ 
              background: `radial-gradient(circle at 70% 30%, ${a.color}, transparent 60%), 
                           radial-gradient(circle at 20% 80%, ${a.color}aa, transparent 50%)` 
            }} 
          />
          <div className="absolute inset-0 z-2"
            style={{ background: 'linear-gradient(to top, rgba(15,23,42,0.9) 0%, rgba(15,23,42,0.3) 60%, transparent 100%)' }} />

          <button onClick={onClose}
            className="absolute top-5 right-5 w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center shadow-lg border border-white/30 z-30 hover:scale-110 transition-transform">
            <X size={18} className="text-white" />
          </button>
          
          <div className="absolute bottom-6 left-8 z-10">
            <div className="flex items-center gap-4 mb-3">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shadow-xl backdrop-blur-xl bg-white/20 border border-white/40 ring-4 ring-white/10">
                {a.emoji}
              </div>
              <div>
                <h2 className="font-display text-3xl md:text-4xl font-bold text-white drop-shadow-md tracking-tight leading-none mb-1">{a.name}</h2>
                <div className="flex gap-2">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-white/90 px-2.5 py-1 rounded-lg backdrop-blur-md bg-white/10 border border-white/20">
                    {a.category}
                  </span>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-white/90 px-2.5 py-1 rounded-lg backdrop-blur-md bg-white/10 border border-white/20">
                    {a.difficulty}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6">
          {/* Save button */}
          <div className="flex justify-end mb-4">
            <button onClick={onToggleSave} disabled={saving}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-all disabled:opacity-50 ${
                isSaved
                  ? 'bg-primary-pale text-primary-dark border-accent-pale'
                  : 'bg-white text-soul-muted border-soul-border hover:border-primary hover:text-primary'
              }`}
            >
              {saving
                ? <Loader2 size={13} className="animate-spin" />
                : isSaved
                  ? <><BookmarkCheck size={13} /> Saved</>
                  : <><BookmarkPlus size={13} /> Save</>
              }
            </button>
          </div>

          <div className="flex items-center gap-2 px-4 py-3 rounded-xl mb-5"
            style={{ background: `${a.color}12`, border: `1px solid ${a.color}30` }}>
            <Clock size={15} style={{ color: a.color }} />
            <span className="text-sm font-semibold" style={{ color: '#1A2E1A' }}>Suggested duration: {a.duration}</span>
          </div>

          <p className="text-sm leading-relaxed mb-6 text-slate-600 font-light">{a.description}</p>

          <div className="mb-6">
            <h3 className="font-display font-semibold mb-3 flex items-center gap-2" style={{ color: '#1A2E1A' }}>
              <Heart size={15} style={{ color: a.color }} /> Key Benefits
            </h3>
            <ul className="space-y-2">
              {a.benefits.map((b, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-slate-600" >
                  <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ background: a.color }} />
                  {b}
                </li>
              ))}
            </ul>
          </div>

          <div className="mb-8">
            <h3 className="font-display font-bold text-lg mb-5 flex items-center gap-2.5 text-slate-900">
              How to Practice
            </h3>
            <ol className="space-y-5">
              {a.steps.map((s, i) => (
                <li key={i} className="flex gap-4 text-sm group text-slate-600">
                  <span className="flex-shrink-0 w-8 h-8 rounded-full text-white text-xs flex items-center justify-center font-extrabold shadow-lg transition-transform group-hover:scale-110 group-hover:rotate-6"
                    style={{ background: `linear-gradient(135deg, ${a.color}, ${a.color}dd)` }}>{i + 1}</span>
                  <span className="pt-1.5 leading-relaxed font-medium">{s}</span>
                </li>
              ))}
            </ol>
          </div>

          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-4 rounded-2xl font-bold text-white shadow-xl transition-all flex items-center justify-center gap-2"
            style={{ background: `linear-gradient(135deg, ${a.color}, ${a.color}dd)` }}>
            Start Activity <ChevronRight size={18} />
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  )
}

// ── Page ─────────────────────────────────────────────────────────────────────
export default function Activities() {
  const { user, refreshUser } = useAuth()
  const [selected,  setSelected]  = useState(null)
  const [cat,       setCat]       = useState('All')
  const [search,    setSearch]    = useState('')
  const [saving,    setSaving]    = useState(false)
  const [showAuth,  setShowAuth]  = useState(false)

  const savedNames = new Set(
    (user?.savedActivities || []).map(a => (typeof a === 'object' ? a.name : a))
  )

  const filtered = activities.filter(a => {
    const matchCat    = cat === 'All' || a.category === cat
    const matchSearch = a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.shortDesc.toLowerCase().includes(search.toLowerCase())
    return matchCat && matchSearch
  })

  const handleToggleSave = async (activity) => {
    if (!user) { setShowAuth(true); return }
    setSaving(true)
    const isSaved = savedNames.has(activity.name)
    try {
      await axios.post('/api/users/save-activity-by-name', {
        name: activity.name, emoji: activity.emoji,
        category: activity.category, shortDesc: activity.shortDesc,
        duration: activity.duration, color: activity.color,
      })
      toast.success(isSaved ? `Removed "${activity.name}"` : `"${activity.name}" saved! 🔖`)
      await refreshUser()
    } catch {
      const key    = `soulsync_saved_${user._id || user.id}`
      const stored = JSON.parse(localStorage.getItem(key) || '[]')
      if (isSaved) {
        localStorage.setItem(key, JSON.stringify(stored.filter(a => a.name !== activity.name)))
      } else {
        stored.push({ name: activity.name, emoji: activity.emoji, category: activity.category })
        localStorage.setItem(key, JSON.stringify(stored))
      }
      toast.success(isSaved ? `Removed "${activity.name}"` : `"${activity.name}" saved! 🔖`)
      await refreshUser()
    } finally {
      setSaving(false)
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08 }
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: 'spring', stiffness: 260, damping: 20 }
    }
  }

  return (
    <div className="pt-28 pb-20 min-h-screen" style={{ background: '#F8FAF8' }}>
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-7xl mx-auto px-6 mb-10"
      >
        <span className="tag-blue mb-4 inline-block">Wellness Activities</span>
        <h1 className="font-serif italic text-6xl md:text-7xl text-slate-900 mb-6 drop-shadow-sm">
          Stress Relief <span className="text-indigo-600">Activities</span>
        </h1>
        <p className="max-w-xl text-lg font-light leading-relaxed text-slate-600 mb-8">
          Simple ways to feel better and quiet your mind. Explore science-backed ways to find your inner peace.
        </p>
        {user && (
          <p className="text-sm mb-5">
            <span className="font-semibold" style={{ color: '#00C896' }}>{savedNames.size} saved</span>
            <span style={{ color: '#4A6741' }}> — visible in your Profile → Saved tab</span>
          </p>
        )}

        <div className="relative max-w-sm mb-5">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: '#4A6741' }} />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search activities..."
            className="soul-input pl-10 text-sm" />
        </div>

        <div className="flex flex-wrap gap-2">
          {categories.map(c => (
            <button key={c} onClick={() => setCat(c)}
              className={`px-5 py-2.5 rounded-2xl text-sm font-bold transition-all ${
                cat === c ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20 scale-105' : 'bg-white border border-slate-200 text-slate-600 hover:border-indigo-300 hover:text-indigo-600'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-6">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
        >
          {filtered.map((a, idx) => {
            const isSaved = savedNames.has(a.name)
            return (
              <motion.div 
                key={a.id} 
                variants={itemVariants}
                whileHover={{ y: -8, scale: 1.02 }}
                className="rounded-3xl overflow-hidden relative shadow-sm hover:shadow-xl transition-all duration-500 border border-slate-100 flex flex-col bg-white group cursor-pointer"
                onClick={() => setSelected(a)}
              >
                {/* Visual Header */}
                <div className="relative h-48 overflow-hidden">
                  <img src={a.image} alt={a.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent" />
                  
                  {/* Saved badge */}
                  {isSaved && (
                    <div className="absolute top-4 right-4 z-10 w-8 h-8 rounded-xl flex items-center justify-center shadow-lg backdrop-blur-md bg-white/20 border border-white/30"
                      style={{ color: '#FCD34D' }}>
                      <BookmarkCheck size={16} fill="currentColor" />
                    </div>
                  )}

                  <div className="absolute top-4 left-4 w-10 h-10 rounded-xl flex items-center justify-center backdrop-blur-md bg-white/30 border border-white/40 text-white shadow-sm transition-transform group-hover:rotate-6">
                    <span className="text-xl">{a.emoji}</span>
                  </div>
                </div>

                {/* Content area with category-based colorful background */}
                <div className="p-6 flex flex-col flex-1 transition-colors duration-500"
                  style={{ background: `${a.color}08` /* 5% opacity for a soft tint */ }}>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full border"
                      style={{ color: a.color, borderColor: `${a.color}30`, background: `${a.color}15` }}>
                      {a.category}
                    </span>
                    <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-bold uppercase tracking-tighter">
                      <Clock size={11} className="text-slate-300" /> {a.duration}
                    </div>
                  </div>
                  <h3 className="font-display font-bold text-xl text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors">{a.name}</h3>
                  <p className="text-slate-500 text-xs leading-relaxed mb-6 flex-1 line-clamp-2">{a.shortDesc}</p>
                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-100/50">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">{a.difficulty}</span>
                    <div className="flex items-center gap-1.5 text-[10px] font-extrabold text-indigo-600 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0 uppercase tracking-widest">
                      Start <ChevronRight size={14} />
                    </div>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </motion.div>
        {filtered.length === 0 && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            className="text-center py-20"
          >
            <div className="text-5xl mb-4">🔍</div>
            <p style={{ color: '#4A6741' }}>No activities match your search.</p>
          </motion.div>
        )}
      </div>

      <AnimatePresence>
        {selected && (
          <DetailModal
            a={selected}
            onClose={() => setSelected(null)}
            isSaved={savedNames.has(selected.name)}
            onToggleSave={() => handleToggleSave(selected)}
            saving={saving}
          />
        )}
      </AnimatePresence>
      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
    </div>
  )
}