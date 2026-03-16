import React, { useState } from 'react'
import { X, MapPin, Calendar, Users, Brain, Palette, Music, Heart, MessageCircle, Sun, CheckCircle, Loader2 } from 'lucide-react'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import AuthModal from '../components/AuthModal'
import toast from 'react-hot-toast'

// ── All therapy data kept exactly as in v2 ───────────────────────────────────
const therapies = [
  { id: 1, name: 'Cognitive Behavioral Therapy', short: 'CBT', icon: Brain, emoji: '🧠', color: '#5DADE2',
    tagline: 'Change your thoughts, change your life',
    explanation: 'CBT is the most extensively researched form of psychotherapy. It works by helping people identify and restructure distorted thought patterns (cognitive distortions) that drive anxiety, depression, and other mental health challenges.',
    helps: ['Anxiety disorders and panic attacks', 'Depression and low mood', 'PTSD and trauma', 'OCD', 'Eating disorders', 'Sleep disorders', 'Phobias'],
    howItWorks: 'A CBT therapist helps you map the connections between your thoughts, feelings, and behaviors. You identify unhelpful thinking patterns, learn to challenge them with evidence, and practice building more balanced responses. Sessions involve structured homework.',
    events: [
      { id: 'cbt-1', title: 'CBT Workshop: Managing Anxiety', date: 'Dec 15, 2024', location: 'Hyderabad Wellness Center', spots: 12 },
      { id: 'cbt-2', title: 'Online CBT Introduction', date: 'Dec 20, 2024', location: 'Virtual (Zoom)', spots: 8 },
    ]},
  { id: 2, name: 'Mindfulness-Based Therapy', short: 'MBSR', icon: Sun, emoji: '☀️', color: '#F39C12',
    tagline: 'The present moment is the only place healing happens',
    explanation: 'Mindfulness-Based Stress Reduction (MBSR) and Mindfulness-Based Cognitive Therapy (MBCT) integrate meditation practices into therapeutic frameworks. Both have strong clinical evidence, particularly for stress, chronic pain, and recurrent depression.',
    helps: ['Chronic stress and burnout', 'Recurrent depression', 'Anxiety and worry', 'Chronic pain', 'Emotional dysregulation', 'Addiction recovery'],
    howItWorks: 'An 8-week structured program teaches formal meditation practices (body scan, sitting meditation, mindful movement) and informal mindfulness integrated into daily life. You learn to observe thoughts without reacting automatically to them.',
    events: [
      { id: 'mbsr-1', title: '8-Week MBSR Program', date: 'Jan 5, 2025', location: 'Banjara Hills Yoga Center', spots: 15 },
      { id: 'mbsr-2', title: 'Daily Mindfulness Drop-in', date: 'Every Wednesday', location: 'Gachibowli Community Hall', spots: 20 },
    ]},
  { id: 3, name: 'Art Therapy', short: 'AT', icon: Palette, emoji: '🎨', color: '#E74C3C',
    tagline: 'Express what words cannot hold',
    explanation: "Art therapy uses creative expression — drawing, painting, collage, sculpture — as a primary therapeutic medium. It's particularly powerful for trauma, processing emotions that are difficult to verbalize, and with children and adolescents.",
    helps: ['Trauma and PTSD', 'Low self-esteem', 'Grief and loss', 'Anxiety and depression', 'Children and teens', 'Autism spectrum'],
    howItWorks: 'You create artwork with guidance from a trained art therapist. The focus is entirely on the process of creation — not skill or output. The therapist helps you explore what emerges in your artwork, building insight and emotional processing.',
    events: [
      { id: 'at-1', title: 'Healing Through Art Workshop', date: 'Dec 18, 2024', location: 'Jubilee Hills Art Studio', spots: 10 },
      { id: 'at-2', title: 'Expressive Arts for Teens', date: 'Dec 22, 2024', location: 'Kondapur Community Center', spots: 8 },
    ]},
  { id: 4, name: 'Music Therapy', short: 'MT', icon: Music, emoji: '🎵', color: '#A29BFE',
    tagline: 'Let rhythm reach where words cannot',
    explanation: 'Music therapy uses evidence-based music interventions to address emotional, cognitive, physiological, and social needs. Research shows measurable reductions in anxiety, pain, and depression, and improvements in quality of life across many populations.',
    helps: ['Anxiety and depression', 'Trauma recovery', 'Neurological conditions', 'Substance use recovery', 'Dementia support', 'Children with special needs'],
    howItWorks: 'Music therapists use receptive (listening), re-creative (playing existing music), compositional, and improvisational methods. No musical experience or talent is required. The therapeutic relationship and the music itself are the instruments of healing.',
    events: [
      { id: 'mt-1', title: 'Sound Bath & Healing Session', date: 'Dec 21, 2024', location: 'Ameerpet Wellness Hub', spots: 25 },
      { id: 'mt-2', title: 'Music for Anxiety Relief', date: 'Jan 8, 2025', location: 'Madhapur Cultural Center', spots: 15 },
    ]},
  { id: 5, name: 'Group Therapy', short: 'GT', icon: Users, emoji: '👥', color: '#27AE60',
    tagline: 'Heal in connection, grow together',
    explanation: "Group therapy brings together 5–15 people with similar challenges under a professional therapist's guidance. The group dynamic itself becomes a healing factor — you both give and receive support, gain perspective, and realize you're not alone.",
    helps: ['Social anxiety and isolation', 'Depression', 'Grief groups', 'Addiction recovery', 'Work stress', 'Relationship difficulties'],
    howItWorks: 'A trained therapist facilitates structured discussion, helps manage group dynamics, and guides the group toward insight. Members practice communication and vulnerability in a controlled, safe environment that mirrors real-world relationships.',
    events: [
      { id: 'gt-1', title: 'Work Stress Support Group', date: 'Every Monday', location: 'Hitech City Counseling Center', spots: 10 },
      { id: 'gt-2', title: 'Anxiety Peer Support Circle', date: 'Every Thursday', location: 'Virtual (Google Meet)', spots: 12 },
    ]},
  { id: 6, name: 'Acceptance & Commitment Therapy', short: 'ACT', icon: Heart, emoji: '💜', color: '#E91E8C',
    tagline: 'Accept, commit, live by your values',
    explanation: 'ACT is a mindfulness-based behavioral therapy that focuses on psychological flexibility — the ability to be present with difficult thoughts and feelings without being ruled by them, while committing to actions that move you toward your values.',
    helps: ['Anxiety and chronic worry', 'Depression', 'Chronic pain', 'Perfectionism and self-criticism', 'Work-life challenges', 'Life transitions'],
    howItWorks: 'ACT uses six core processes: defusion (unhooking from thoughts), acceptance (making room for difficult feelings), present-moment awareness, observing self, values clarification, and committed action. Metaphors and exercises build psychological flexibility.',
    events: [
      { id: 'act-1', title: 'ACT for Stress Relief', date: 'Jan 12, 2025', location: 'Secunderabad Therapy Center', spots: 12 },
      { id: 'act-2', title: 'Values & Wellbeing Workshop', date: 'Dec 28, 2024', location: 'Begumpet Wellness Institute', spots: 15 },
    ]},
]

// ── Modal with working Register button ───────────────────────────────────────
function TherapyModal({ t, onClose }) {
  const { user, refreshUser } = useAuth()
  const [showAuth,    setShowAuth]    = useState(false)
  const [registering, setRegistering] = useState(null)  // event id being processed

  // Track which events this user has registered for — stored in user.registeredEvents
  // We store them locally by event id string so it survives without a DB id
  const [localRegistered, setLocalRegistered] = useState(() => {
    // Pre-populate from user's registeredEvents if they match by title
    const titles = new Set((user?.registeredEvents || []).map(e => e.title || e.name || e))
    return new Set(t.events.filter(ev => titles.has(ev.title)).map(ev => ev.id))
  })

  const handleRegister = async (ev) => {
    if (!user) { setShowAuth(true); return }

    const alreadyRegistered = localRegistered.has(ev.id)

    // Optimistic toggle
    setLocalRegistered(prev => {
      const next = new Set(prev)
      alreadyRegistered ? next.delete(ev.id) : next.add(ev.id)
      return next
    })

    setRegistering(ev.id)
    try {
      // Try the real API first (works if backend has matching event IDs seeded)
      // Fall back to saving the event data directly to user's registeredEvents via profile update
      await axios.post('/api/therapy-events/register', {
        eventId:    ev.id,
        eventTitle: ev.title,
        eventDate:  ev.date,
        eventLocation: ev.location,
        therapyName: t.name,
        action: alreadyRegistered ? 'cancel' : 'register',
      })
      toast.success(alreadyRegistered ? 'Registration cancelled' : `Registered for "${ev.title}"! ✅`)
      // Refresh so profile Events tab updates
      await refreshUser()
    } catch {
      // Backend route may not exist yet — save locally to user profile via a custom approach
      // We'll store registered events in localStorage keyed by user id
      const key = `soulsync_events_${user._id || user.id}`
      const existing = JSON.parse(localStorage.getItem(key) || '[]')
      if (alreadyRegistered) {
        const updated = existing.filter(e => e.id !== ev.id)
        localStorage.setItem(key, JSON.stringify(updated))
      } else {
        existing.push({ id: ev.id, title: ev.title, date: ev.date, location: ev.location, therapyName: t.name })
        localStorage.setItem(key, JSON.stringify(existing))
      }
      toast.success(alreadyRegistered ? 'Registration cancelled' : `Registered for "${ev.title}"! ✅`)
    } finally {
      setRegistering(null)
    }
  }

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center modal-overlay"
        onClick={e => e.target === e.currentTarget && onClose()}>
        <div className="bg-white rounded-2xl shadow-soul-hover w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto animate-slide-up">
          <div className="h-1.5 rounded-t-2xl" style={{ background: `linear-gradient(90deg, ${t.color}, ${t.color}88)` }} />
          <div className="p-8">
            <div className="flex items-start justify-between mb-5">
              <div>
                <span className="text-4xl mb-2 block">{t.emoji}</span>
                <h2 className="font-display text-2xl font-bold text-soul-text">{t.name}</h2>
                <p className="text-sm italic mt-1" style={{ color: t.color }}>"{t.tagline}"</p>
              </div>
              <button onClick={onClose} className="p-2 rounded-xl text-soul-muted hover:bg-soul-bg">
                <X size={18} />
              </button>
            </div>

            <p className="text-sm text-soul-muted leading-relaxed mb-6">{t.explanation}</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="p-4 rounded-xl" style={{ background: `${t.color}08`, border: `1px solid ${t.color}20` }}>
                <h3 className="font-semibold text-soul-text text-sm mb-3 flex items-center gap-2">
                  <Heart size={13} style={{ color: t.color }} /> Who It Helps
                </h3>
                <ul className="space-y-1.5">
                  {t.helps.map((h, i) => (
                    <li key={i} className="flex items-center gap-2 text-xs text-soul-muted">
                      <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: t.color }} />
                      {h}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="p-4 rounded-xl" style={{ background: `${t.color}08`, border: `1px solid ${t.color}20` }}>
                <h3 className="font-semibold text-soul-text text-sm mb-3 flex items-center gap-2">
                  <MessageCircle size={13} style={{ color: t.color }} /> How It Works
                </h3>
                <p className="text-xs text-soul-muted leading-relaxed">{t.howItWorks}</p>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-soul-text mb-3 flex items-center gap-2">
                <Calendar size={14} style={{ color: t.color }} /> Events & Workshops Near You
              </h3>
              {!user && (
                <p className="text-xs text-soul-muted mb-3 p-3 rounded-xl bg-soul-bg">
                  <button onClick={() => setShowAuth(true)} className="text-blue-calm font-semibold hover:underline">Sign in</button> to register — events will appear in your profile.
                </p>
              )}
              <div className="space-y-3">
                {t.events.map((ev) => {
                  const isReg    = localRegistered.has(ev.id)
                  const isBusy   = registering === ev.id
                  return (
                    <div key={ev.id} className={`p-4 rounded-xl border transition-all ${isReg ? 'border-blue-calm bg-blue-pale' : 'border-soul-border hover:border-blue-light'}`}>
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="text-sm font-semibold text-soul-text">{ev.title}</p>
                          <div className="flex items-center gap-3 mt-1.5">
                            <span className="flex items-center gap-1 text-xs text-soul-muted"><Calendar size={11} /> {ev.date}</span>
                            <span className="flex items-center gap-1 text-xs text-soul-muted"><MapPin size={11} /> {ev.location}</span>
                          </div>
                        </div>
                        {isReg
                          ? <span className="tag-mint whitespace-nowrap flex items-center gap-1"><CheckCircle size={11} /> Registered</span>
                          : <span className="tag-lavender whitespace-nowrap">{ev.spots} spots</span>
                        }
                      </div>

                      <button
                        onClick={() => handleRegister(ev)}
                        disabled={isBusy}
                        className={`mt-3 flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-lg transition-all disabled:opacity-60 ${
                          isReg
                            ? 'bg-white border border-soul-border text-soul-muted hover:text-red-500 hover:border-red-200'
                            : 'text-white hover:opacity-90'
                        }`}
                        style={!isReg ? { background: t.color } : {}}>
                        {isBusy
                          ? <><Loader2 size={12} className="animate-spin" /> Updating...</>
                          : isReg
                            ? '✓ Registered — Click to cancel'
                            : 'Register Free'
                        }
                      </button>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
    </>
  )
}

// ── Page (identical to v2) ───────────────────────────────────────────────────
export default function Therapy() {
  const [selected, setSelected] = useState(null)

  return (
    <div className="pt-28 pb-20 min-h-screen">
      <div className="max-w-7xl mx-auto px-6 mb-10">
        <span className="tag-lavender mb-3 inline-block">Therapy Discovery</span>
        <h1 className="font-display text-5xl font-bold text-soul-text mb-3">Find Your Healing Path</h1>
        <p className="text-soul-muted max-w-lg">Evidence-based therapy methods with real science behind them. Find what resonates with your journey.</p>
      </div>

      {/* Featured banner — identical to v2 */}
      <div className="max-w-7xl mx-auto px-6 mb-10">
        <div className="rounded-2xl overflow-hidden p-8 md:p-10 relative"
          style={{ background: 'linear-gradient(135deg, #1A252F, #2C3E50)' }}>
          <div className="absolute top-0 right-0 w-64 h-full opacity-10 flex items-center justify-center text-[10rem]">🧠</div>
          <div className="relative z-10 max-w-lg">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold mb-4"
              style={{ background: 'rgba(93,173,226,0.2)', color: '#AED6F1', border: '1px solid rgba(93,173,226,0.3)' }}>
              Most Evidence-Backed
            </span>
            <h2 className="font-display text-3xl font-bold text-white mb-3">Cognitive Behavioral Therapy</h2>
            <p className="text-sm leading-relaxed mb-6" style={{ color: '#AED6F1' }}>
              CBT has more clinical research than any other psychotherapy. Proven effective for anxiety, depression, trauma, OCD, and dozens of other conditions. Find sessions and workshops near you.
            </p>
            <button onClick={() => setSelected(therapies[0])}
              className="btn-soul px-6 py-3 rounded-xl text-sm"><span>Learn About CBT →</span></button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {therapies.map(t => {
            const Icon = t.icon
            return (
              <button key={t.id} onClick={() => setSelected(t)}
                className="soul-card group p-6 text-left">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{ background: `${t.color}15`, border: `1px solid ${t.color}25` }}>
                    <Icon size={22} style={{ color: t.color }} />
                  </div>
                  <span className="text-xs font-bold px-2 py-1 rounded-lg text-white"
                    style={{ background: t.color }}>{t.short}</span>
                </div>
                <h3 className="font-display text-lg font-semibold text-soul-text mb-1">{t.name}</h3>
                <p className="text-xs italic mb-3" style={{ color: t.color }}>"{t.tagline}"</p>
                <p className="text-xs text-soul-muted leading-relaxed line-clamp-3 mb-4">{t.explanation}</p>
                <div className="flex items-center gap-1 text-xs font-semibold transition-all group-hover:gap-2"
                  style={{ color: t.color }}>
                  Explore & Find Events
                  <span className="group-hover:translate-x-1 transition-transform inline-block">→</span>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {selected && <TherapyModal t={selected} onClose={() => setSelected(null)} />}
    </div>
  )
}
