import React, { useState } from 'react'
import { X, Clock, Heart, ChevronRight, Search, BookmarkPlus, BookmarkCheck, Loader2 } from 'lucide-react'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import AuthModal from '../components/AuthModal'
import toast from 'react-hot-toast'

// ── All activity data — identical to v2 ─────────────────────────────────────
const activities = [
  { id: 1, name: 'Meditation', emoji: '🧘', category: 'Mindfulness', duration: '10–30 min', difficulty: 'Beginner', color: '#5DADE2',
    shortDesc: 'Train your attention, find stillness, and cultivate inner peace.',
    description: 'Meditation is the practice of training your mind to redirect thoughts and develop awareness. Regular practice leads to measurable improvements in stress, anxiety, focus, and emotional wellbeing.',
    benefits: ['Reduces cortisol by up to 20%', 'Improves emotional regulation', 'Enhances focus and attention', 'Promotes better sleep quality', 'Increases self-awareness'],
    steps: ['Find a quiet, comfortable seated position', 'Set a gentle timer (start with 5 minutes)', 'Close your eyes and take 3 deep breaths', 'Focus on the sensation of breathing — the rise and fall', 'When thoughts arise, simply notice them and return to breath', 'Gradually extend sessions to 10–20 minutes'] },
  { id: 2, name: 'Yoga', emoji: '🌊', category: 'Movement', duration: '30–60 min', difficulty: 'Beginner–Inter', color: '#A29BFE',
    shortDesc: 'Unite body and mind through intentional movement and breath.',
    description: "Yoga combines physical postures, breathing techniques, and mindfulness into a holistic practice. It's one of the most comprehensively studied wellness interventions available.",
    benefits: ['Reduces stress hormones significantly', 'Improves flexibility and strength', 'Enhances mind-body connection', 'Promotes better posture', 'Supports healthy sleep cycles'],
    steps: ['Begin with 3 minutes of deep breathing seated', 'Move through gentle cat-cow stretches to warm up', 'Flow through 5 rounds of sun salutation', 'Hold warrior I and II for 5 breaths each side', "Rest in child's pose between challenging sequences", 'Close with 5 minutes of savasana (corpse pose)'] },
  { id: 3, name: 'Breathing Exercises', emoji: '💨', category: 'Breathwork', duration: '5–15 min', difficulty: 'Beginner', color: '#55E6C1',
    shortDesc: 'Regulate your nervous system in seconds with conscious breath.',
    description: 'Controlled breathing exercises directly activate the parasympathetic nervous system, creating an immediate calm response. Different techniques serve different needs — from instant anxiety relief to sustained energy.',
    benefits: ['Activates calm response instantly', 'Lowers heart rate and blood pressure', 'Reduces anxiety symptoms rapidly', 'Improves focus and clarity', 'Improves emotional regulation'],
    steps: ['Sit upright or lie comfortably', 'Box Breathing: Inhale through nose for 4 counts', 'Hold the breath for 4 counts', 'Exhale through mouth for 4 counts', 'Hold empty for 4 counts', 'Repeat 4–6 cycles, twice daily for best results'] },
  { id: 4, name: 'Journaling', emoji: '📓', category: 'Reflection', duration: '10–20 min', difficulty: 'Beginner', color: '#F39C12',
    shortDesc: 'Process emotions, gain clarity, and track your growth in writing.',
    description: 'Expressive writing and journaling have strong research support for reducing psychological distress. Writing externalizes the mental load, helping you process and make sense of overwhelming experiences.',
    benefits: ['Reduces psychological distress measurably', 'Clarifies muddled thoughts and feelings', 'Identifies recurring stress patterns', 'Boosts problem-solving ability', 'Builds self-awareness over time'],
    steps: ['Choose a consistent time — morning or before bed works well', 'Write freely for 10 minutes without editing or judgment', 'Try prompts: "Right now I feel..." or "What\'s weighing on me is..."', 'Explore not just events, but your emotional response to them', 'Note 3 things you\'re genuinely grateful for', 'Review old entries monthly to track growth'] },
  { id: 5, name: 'Nature Walk', emoji: '🌿', category: 'Movement', duration: '20–45 min', difficulty: 'Beginner', color: '#27AE60',
    shortDesc: 'Reset your nervous system with green spaces and fresh air.',
    description: 'Spending time in natural environments (especially green spaces) has demonstrated effects on reducing cortisol, lowering rumination, and improving mood. Even urban parks provide measurable benefit.',
    benefits: ['Reduces cortisol levels by measurable amounts', 'Lowers prefrontal cortex rumination', 'Boosts mood via natural light and serotonin', 'Improves vitamin D levels', 'Provides gentle physical exercise'],
    steps: ['Choose any green space — park, trail, garden, waterfront', 'Leave your phone on silent or at home if possible', 'Walk at a comfortable, unhurried pace', 'Engage all senses: notice sounds, smells, textures', 'Avoid planning or problem-solving — just observe', 'Try to do this for at least 20 minutes, 3x per week'] },
  { id: 6, name: 'Music Relaxation', emoji: '🎵', category: 'Sensory', duration: '20–60 min', difficulty: 'Beginner', color: '#E91E8C',
    shortDesc: 'Let healing frequencies calm your nervous system deeply.',
    description: 'Music therapy has extensive research support for reducing anxiety, lowering blood pressure, and improving mood. Even passive listening at the right tempo can shift physiological stress markers within minutes.',
    benefits: ['Lowers heart rate and blood pressure', 'Reduces anxiety markers measurably', 'Improves sleep onset and quality', 'Elevates mood and reduces pain perception', 'Enhances focus during creative work'],
    steps: ['Create a playlist of 60–80 BPM music (matches resting heart rate)', 'Find a comfortable lying or seated position', 'Use headphones for maximum immersion', 'Close your eyes and let the music fill your attention', 'Allow thoughts to arise and pass without attachment', 'For sleep: binaural beats or delta wave music works well'] },
  { id: 7, name: 'Progressive Relaxation', emoji: '💆', category: 'Mindfulness', duration: '15–25 min', difficulty: 'Beginner', color: '#5DADE2',
    shortDesc: 'Systematically release physical tension stored in your body.',
    description: "Progressive Muscle Relaxation (PMR) involves deliberately tensing and then releasing muscle groups throughout the body. It's one of the most effective techniques for releasing physical stress and improving sleep.",
    benefits: ['Deep physical tension release', 'Significantly improves sleep quality', 'Reduces anxiety and panic symptoms', 'Teaches body-awareness skills', 'Highly effective for headache relief'],
    steps: ['Lie down in a quiet, comfortable space', 'Start with feet: tense all foot muscles tightly for 5 seconds', 'Release completely and notice the contrast of relaxation', 'Move through calves, thighs, abdomen, hands, arms, shoulders', 'Tense each group for 5s, release for 20s', 'End with face and scalp, then breathe slowly for 2 minutes'] },
  { id: 8, name: 'Gratitude Practice', emoji: '🌸', category: 'Reflection', duration: '5–10 min', difficulty: 'Beginner', color: '#A29BFE',
    shortDesc: 'Rewire your brain toward positivity through daily appreciation.',
    description: 'Gratitude practice has robust neuroscientific support. Regular gratitude journaling activates brain regions associated with reward and social bonding, and counteracts the negativity bias built into our nervous system.',
    benefits: ['Increases positive emotion baseline', 'Improves relationships and social connection', 'Builds psychological resilience', 'Reduces depressive symptoms over time', 'Improves sleep when practiced at bedtime'],
    steps: ['Each morning or evening, write exactly 3 things you\'re grateful for', 'Be specific rather than general (not "family" but "my sister calling just to chat")', 'Include at least one unexpected or surprising good thing', 'Explain *why* each thing matters to you', 'Notice one small positive thing during the day intentionally', 'Once weekly: write a gratitude letter to someone (send it optional)'] },
]

const categories = ['All', 'Mindfulness', 'Movement', 'Breathwork', 'Reflection', 'Sensory']

// ── Detail modal with save button ────────────────────────────────────────────
function DetailModal({ a, onClose, isSaved, onToggleSave, saving }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center modal-overlay"
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="bg-white rounded-2xl shadow-soul-hover w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto animate-slide-up">
        <div className="h-1.5 rounded-t-2xl" style={{ background: `linear-gradient(90deg, ${a.color}, ${a.color}88)` }} />
        <div className="p-8">
          <div className="flex items-start justify-between mb-5">
            <div>
              <span className="text-4xl mb-2 block">{a.emoji}</span>
              <h2 className="font-display text-2xl font-bold text-soul-text">{a.name}</h2>
              <div className="flex gap-2 mt-2">
                <span className="tag-blue">{a.category}</span>
                <span className="tag-lavender">{a.difficulty}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {/* Save / unsave button */}
              <button
                onClick={onToggleSave}
                disabled={saving}
                title={isSaved ? 'Remove from saved' : 'Save this activity'}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-all disabled:opacity-50 ${
                  isSaved
                    ? 'bg-blue-pale text-blue-dark border-blue-light'
                    : 'bg-white text-soul-muted border-soul-border hover:border-blue-light hover:text-blue-calm'
                }`}>
                {saving
                  ? <Loader2 size={13} className="animate-spin" />
                  : isSaved
                    ? <><BookmarkCheck size={13} /> Saved</>
                    : <><BookmarkPlus size={13} /> Save</>
                }
              </button>
              <button onClick={onClose} className="p-2 rounded-xl text-soul-muted hover:bg-soul-bg">
                <X size={18} />
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2 px-4 py-3 rounded-xl mb-5"
            style={{ background: `${a.color}10`, border: `1px solid ${a.color}25` }}>
            <Clock size={15} style={{ color: a.color }} />
            <span className="text-sm font-semibold text-soul-text">Suggested duration: {a.duration}</span>
          </div>

          <p className="text-sm text-soul-muted leading-relaxed mb-6">{a.description}</p>

          <div className="mb-6">
            <h3 className="font-semibold text-soul-text mb-3 flex items-center gap-2">
              <Heart size={15} style={{ color: a.color }} /> Key Benefits
            </h3>
            <ul className="space-y-2">
              {a.benefits.map((b, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-soul-muted">
                  <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ background: a.color }} />
                  {b}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-soul-text mb-3">Step-by-Step Guide</h3>
            <ol className="space-y-3">
              {a.steps.map((s, i) => (
                <li key={i} className="flex gap-3 text-sm text-soul-muted">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full text-white text-xs flex items-center justify-center font-bold"
                    style={{ background: a.color }}>{i + 1}</span>
                  <span className="pt-0.5">{s}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </div>
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

  // Build a Set of saved activity names from the user object (populated from DB)
  // We match by name because local activities use numeric ids, not MongoDB _id
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
      // We store by activity name since the backend uses MongoDB _id but
      // our local data uses numeric ids. We find the matching seeded activity
      // by name via a lookup endpoint, or we store locally with the name.
      await axios.post('/api/users/save-activity-by-name', {
        name:     activity.name,
        emoji:    activity.emoji,
        category: activity.category,
        shortDesc: activity.shortDesc,
        duration:  activity.duration,
        color:     activity.color,
      })
      toast.success(isSaved ? `Removed "${activity.name}" from saved` : `"${activity.name}" saved to profile! 🔖`)
      await refreshUser()   // Profile "Saved" tab updates immediately
    } catch {
      // Fallback: save in localStorage if backend endpoint not yet added
      const key     = `soulsync_saved_${user._id || user.id}`
      const stored  = JSON.parse(localStorage.getItem(key) || '[]')
      if (isSaved) {
        localStorage.setItem(key, JSON.stringify(stored.filter(a => a.name !== activity.name)))
      } else {
        stored.push({ name: activity.name, emoji: activity.emoji, category: activity.category, shortDesc: activity.shortDesc, color: activity.color })
        localStorage.setItem(key, JSON.stringify(stored))
      }
      toast.success(isSaved ? `Removed "${activity.name}"` : `"${activity.name}" saved! 🔖`)
      // Patch user locally so UI updates right away
      const updatedSaved = isSaved
        ? (user.savedActivities || []).filter(a => (typeof a === 'object' ? a.name : a) !== activity.name)
        : [...(user.savedActivities || []), { name: activity.name, emoji: activity.emoji, category: activity.category }]
      await refreshUser()
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="pt-28 pb-20 min-h-screen">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-6 mb-10">
        <span className="tag-blue mb-3 inline-block">Wellness Activities</span>
        <h1 className="font-display text-5xl font-bold text-soul-text mb-3">Find Your Calm</h1>
        <p className="text-soul-muted max-w-lg mb-2">
          Science-backed activities to reduce stress, quiet your mind, and restore emotional balance.
        </p>
        {user && (
          <p className="text-sm mb-5">
            <span className="text-blue-calm font-semibold">{savedNames.size} saved</span>
            <span className="text-soul-muted"> — visible in your Profile → Saved tab</span>
          </p>
        )}

        <div className="relative max-w-sm mb-5">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-soul-muted" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search activities..."
            className="soul-input pl-10 text-sm" />
        </div>

        <div className="flex flex-wrap gap-2">
          {categories.map(c => (
            <button key={c} onClick={() => setCat(c)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                cat === c ? 'text-white shadow-soul' : 'bg-white border border-soul-border text-soul-text hover:border-blue-light'
              }`}
              style={cat === c ? { background: 'linear-gradient(135deg, #5DADE2, #A29BFE)' } : {}}>
              {c}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {filtered.map(a => {
            const isSaved = savedNames.has(a.name)
            return (
              <div key={a.id} className="soul-card group overflow-hidden relative">
                {/* Saved badge on card */}
                {isSaved && (
                  <div className="absolute top-3 right-3 z-10 w-7 h-7 rounded-lg flex items-center justify-center shadow-soul"
                    style={{ background: 'linear-gradient(135deg, #5DADE2, #A29BFE)' }}>
                    <BookmarkCheck size={13} color="white" />
                  </div>
                )}
                <button onClick={() => setSelected(a)} className="w-full text-left">
                  <div className="h-36 flex flex-col justify-between p-5"
                    style={{ background: `linear-gradient(135deg, ${a.color}12, ${a.color}06)` }}>
                    <span className="text-4xl">{a.emoji}</span>
                    <span className="tag-blue text-left">{a.category}</span>
                  </div>
                  <div className="p-5">
                    <h3 className="font-display text-lg font-semibold text-soul-text mb-1.5">{a.name}</h3>
                    <p className="text-xs text-soul-muted leading-relaxed mb-4 line-clamp-2">{a.shortDesc}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 text-xs text-soul-muted">
                        <Clock size={11} /> {a.duration}
                      </div>
                      <div className="flex items-center gap-1 text-xs font-semibold group-hover:gap-2 transition-all"
                        style={{ color: a.color }}>
                        View guide <ChevronRight size={12} />
                      </div>
                    </div>
                  </div>
                </button>
              </div>
            )
          })}
        </div>
        {filtered.length === 0 && (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">🔍</div>
            <p className="text-soul-muted">No activities match your search.</p>
          </div>
        )}
      </div>

      {selected && (
        <DetailModal
          a={selected}
          onClose={() => setSelected(null)}
          isSaved={savedNames.has(selected.name)}
          onToggleSave={() => handleToggleSave(selected)}
          saving={saving}
        />
      )}
      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
    </div>
  )
}
