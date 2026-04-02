 import React, { useState } from 'react'
import { X, MapPin, Calendar, Users, Brain, Palette, Music, Heart, MessageCircle, Sun, CheckCircle, Loader2, Sparkles, ArrowRight, ChevronRight } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import AuthModal from '../components/AuthModal'
import toast from 'react-hot-toast'

// ── Therapy data — same content, updated colors + real Unsplash images ────────
const therapies = [
  { id: 1, name: 'Cognitive Behavioral Therapy', short: 'CBT', icon: Brain, emoji: '🧠',
    color: '#4F46E5',
    image: 'https://images.unsplash.com/photo-1573497620053-ea5300f94f21?w=600&q=80',
    tagline: 'Change your thoughts, change your life',
    explanation: 'CBT is the most extensively researched form of psychotherapy. It works by helping people identify and restructure distorted thought patterns (cognitive distortions) that drive anxiety, depression, and other mental health challenges.',
    helps: ['Anxiety disorders and panic attacks', 'Depression and low mood', 'PTSD and trauma', 'OCD', 'Eating disorders', 'Sleep disorders', 'Phobias'],
    howItWorks: 'A CBT therapist helps you map the connections between your thoughts, feelings, and behaviors. You identify unhelpful thinking patterns, learn to challenge them with evidence, and practice building more balanced responses. Sessions involve structured homework.',
    events: [
      { id: 'cbt-1', title: 'CBT Workshop: Managing Anxiety', date: 'Dec 15, 2024', location: 'Hyderabad Wellness Center', spots: 12 },
      { id: 'cbt-2', title: 'Online CBT Introduction', date: 'Dec 20, 2024', location: 'Virtual (Zoom)', spots: 8 },
    ]},
  { id: 2, name: 'Mindfulness-Based Therapy', short: 'MBSR', icon: Sun, emoji: '☀️',
    color: '#0F172A',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80',
    tagline: 'The present moment is the only place healing happens',
    explanation: 'Mindfulness-Based Stress Reduction (MBSR) and Mindfulness-Based Cognitive Therapy (MBCT) integrate meditation practices into therapeutic frameworks. Both have strong clinical evidence, particularly for stress, chronic pain, and recurrent depression.',
    helps: ['Chronic stress and burnout', 'Recurrent depression', 'Anxiety and worry', 'Chronic pain', 'Emotional dysregulation', 'Addiction recovery'],
    howItWorks: 'An 8-week structured program teaches formal meditation practices (body scan, sitting meditation, mindful movement) and informal mindfulness integrated into daily life. You learn to observe thoughts without reacting automatically to them.',
    events: [
      { id: 'mbsr-1', title: '8-Week MBSR Program', date: 'Jan 5, 2025', location: 'Banjara Hills Yoga Center', spots: 15 },
      { id: 'mbsr-2', title: 'Daily Mindfulness Drop-in', date: 'Every Wednesday', location: 'Gachibowli Community Hall', spots: 20 },
    ]},
  { id: 3, name: 'Art Therapy', short: 'AT', icon: Palette, emoji: '🎨',
    color: '#3B82F6',
    image: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800&q=80',
    tagline: 'Express what words cannot hold',
    explanation: "Art therapy uses creative expression — drawing, painting, collage, sculpture — as a primary therapeutic medium. It's particularly powerful for trauma, processing emotions that are difficult to verbalize, and with children and adolescents.",
    helps: ['Trauma and PTSD', 'Low self-esteem', 'Grief and loss', 'Anxiety and depression', 'Children and teens', 'Autism spectrum'],
    howItWorks: 'You create artwork with guidance from a trained art therapist. The focus is entirely on the process of creation — not skill or output. The therapist helps you explore what emerges in your artwork, building insight and emotional processing.',
    events: [
      { id: 'at-1', title: 'Healing Through Art Workshop', date: 'Dec 18, 2024', location: 'Jubilee Hills Art Studio', spots: 10 },
      { id: 'at-2', title: 'Expressive Arts for Teens', date: 'Dec 22, 2024', location: 'Kondapur Community Center', spots: 8 },
    ]},
  { id: 4, name: 'Music Therapy', short: 'MT', icon: Music, emoji: '🎵',
    color: '#64748B',
    image: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=800&q=80',
    tagline: 'Let rhythm reach where words cannot',
    explanation: 'Music therapy uses evidence-based music interventions to address emotional, cognitive, physiological, and social needs. Research shows measurable reductions in anxiety, pain, and depression, and improvements in quality of life across many populations.',
    helps: ['Anxiety and depression', 'Trauma recovery', 'Neurological conditions', 'Substance use recovery', 'Dementia support', 'Children with special needs'],
    howItWorks: 'Music therapists use receptive (listening), re-creative (playing existing music), compositional, and improvisational methods. No musical experience or talent is required. The therapeutic relationship and the music itself are the instruments of healing.',
    events: [
      { id: 'mt-1', title: 'Sound Bath & Healing Session', date: 'Dec 21, 2024', location: 'Ameerpet Wellness Hub', spots: 25 },
      { id: 'mt-2', title: 'Music for Anxiety Relief', date: 'Jan 8, 2025', location: 'Madhapur Cultural Center', spots: 15 },
    ]},
  { id: 5, name: 'Group Therapy', short: 'GT', icon: Users, emoji: '👥',
    color: '#1E293B',
    image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&q=80',
    tagline: 'Heal in connection, grow together',
    explanation: "Group therapy brings together 5–15 people with similar challenges under a professional therapist's guidance. The group dynamic itself becomes a healing factor — you both give and receive support, gain perspective, and realize you're not alone.",
    helps: ['Social anxiety and isolation', 'Depression', 'Grief groups', 'Addiction recovery', 'Work stress', 'Relationship difficulties'],
    howItWorks: 'A trained therapist facilitates structured discussion, helps manage group dynamics, and guides the group toward insight. Members practice communication and vulnerability in a controlled, safe environment that mirrors real-world relationships.',
    events: [
      { id: 'gt-1', title: 'Work Stress Support Group', date: 'Every Monday', location: 'Hitech City Counseling Center', spots: 10 },
      { id: 'gt-2', title: 'Anxiety Peer Support Circle', date: 'Every Thursday', location: 'Virtual (Google Meet)', spots: 12 },
    ]},
  { id: 6, name: 'Acceptance & Commitment Therapy', short: 'ACT', icon: Heart, emoji: '💜',
    color: '#4F46E5',
    image: 'https://images.unsplash.com/photo-1447452001602-7090c7ab2db3?w=600&q=80',
    tagline: 'Accept, commit, live by your values',
    explanation: 'ACT is a mindfulness-based behavioral therapy that focuses on psychological flexibility — the ability to be present with difficult thoughts and feelings without being ruled by them, while committing to actions that move you toward your values.',
    helps: ['Anxiety and chronic worry', 'Depression', 'Chronic pain', 'Perfectionism and self-criticism', 'Work-life challenges', 'Life transitions'],
    howItWorks: 'ACT uses six core processes: defusion (unhooking from thoughts), acceptance (making room for difficult feelings), present-moment awareness, observing self, values clarification, and committed action. Metaphors and exercises build psychological flexibility.',
    events: [
      { id: 'act-1', title: 'ACT for Stress Relief', date: 'Jan 12, 2025', location: 'Secunderabad Therapy Center', spots: 12 },
      { id: 'act-2', title: 'Values & Wellbeing Workshop', date: 'Dec 28, 2024', location: 'Begumpet Wellness Institute', spots: 15 },
    ]},
]

// ── Modal — same layout, updated colors + photo header like prototype ─────────
function TherapyModal({ t, onClose }) {
  const { user, refreshUser } = useAuth()
  const [showAuth,    setShowAuth]    = useState(false)
  const [registering, setRegistering] = useState(null)

  const [localRegistered, setLocalRegistered] = useState(() => {
    const titles = new Set((user?.registeredEvents || []).map(e => e.title || e.name || e))
    return new Set(t.events.filter(ev => titles.has(ev.title)).map(ev => ev.id))
  })

  const handleRegister = async (ev) => {
    if (!user) { setShowAuth(true); return }
    const alreadyRegistered = localRegistered.has(ev.id)
    setLocalRegistered(prev => {
      const next = new Set(prev)
      alreadyRegistered ? next.delete(ev.id) : next.add(ev.id)
      return next
    })
    setRegistering(ev.id)
    try {
      await axios.post('/api/therapy-events/register', {
        eventId: ev.id, eventTitle: ev.title,
        eventDate: ev.date, eventLocation: ev.location,
        therapyName: t.name, action: alreadyRegistered ? 'cancel' : 'register',
      })
      toast.success(alreadyRegistered ? 'Registration cancelled' : `Registered for "${ev.title}"! ✅`)
      await refreshUser()
    } catch {
      const key    = `soulsync_events_${user._id || user.id}`
      const stored = JSON.parse(localStorage.getItem(key) || '[]')
      if (alreadyRegistered) {
        localStorage.setItem(key, JSON.stringify(stored.filter(e => e.id !== ev.id)))
      } else {
        stored.push({ id: ev.id, title: ev.title, date: ev.date, location: ev.location, therapyName: t.name })
        localStorage.setItem(key, JSON.stringify(stored))
      }
      toast.success(alreadyRegistered ? 'Registration cancelled' : `Registered for "${ev.title}"! ✅`)
    } finally {
      setRegistering(null)
    }
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center modal-overlay"
      onClick={e => e.target === e.currentTarget && onClose()}>
      <motion.div 
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className="bg-white rounded-2xl shadow-soul-hover w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">

        {/* Photo Header with Themed Overlays — as requested */}
        <div className="relative h-64 rounded-t-2xl overflow-hidden border-b border-slate-100/50">
          <img src={t.image} alt={t.name} className="w-full h-full object-cover relative z-0" />
          
          {/* Immersive themed overlays */}
          <div className="absolute inset-0 z-1 opacity-40 pointer-events-none"
            style={{ 
              background: `radial-gradient(circle at 70% 30%, ${t.color}, transparent 60%), 
                           radial-gradient(circle at 20% 80%, ${t.color}aa, transparent 50%)` 
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
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center backdrop-blur-xl bg-white/20 border border-white/40 shadow-xl ring-4 ring-white/10"
                style={{ color: t.color }}>
                <t.icon size={30} />
              </div>
              <div>
                <h2 className="font-display text-3xl md:text-4xl font-bold text-white drop-shadow-md tracking-tight leading-none mb-1">{t.name}</h2>
                <p className="text-[10px] uppercase font-black tracking-widest text-white/90 px-3 py-1 rounded-lg backdrop-blur-md bg-white/10 border border-white/20 inline-block">
                  {t.tagline}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-8">
          <p className="text-sm leading-relaxed mb-8 text-slate-600 font-light">{t.explanation}</p>

          <div className="mb-8">
            <h3 className="font-display font-bold text-lg mb-5 text-slate-900">Key Benefits</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {t.helps.map((h, i) => (
                <div key={i} className="flex items-center gap-3 p-3.5 rounded-2xl border transition-all hover:shadow-md group"
                  style={{ background: `${t.color}08`, borderColor: `${t.color}20` }}>
                  <div className="w-6 h-6 rounded-lg flex items-center justify-center text-white shadow-sm transition-transform group-hover:scale-110"
                    style={{ background: t.color }}>
                    <CheckCircle size={14} />
                  </div>
                  <span className="text-xs font-semibold text-slate-700">{h}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="p-6 rounded-3xl mb-8 border border-slate-100 relative overflow-hidden"
            style={{ background: 'linear-gradient(135deg, #F8FAFC 0%, #F1F5F9 100%)' }}>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center backdrop-blur-md bg-white border border-slate-200 shadow-sm">
                  <Calendar size={20} style={{ color: t.color }} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Session Details</h4>
                  <p className="text-xs text-slate-500">60 Minutes • Personal Session</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Investment:</span>
                <span className="text-xl font-display font-black" style={{ color: t.color }}>$75 <span className="text-xs font-medium text-slate-400">/ session</span></span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-display font-semibold mb-3 flex items-center gap-2" style={{ color: '#0F172A' }}>
              <Calendar size={14} style={{ color: t.color }} /> Events & Workshops Near You
            </h3>
            {!user && (
              <p className="text-xs mb-3" style={{ color: '#64748B' }}>
                <button onClick={() => setShowAuth(true)} className="font-semibold hover:underline" style={{ color: '#4F46E5' }}>Sign in</button> to register for events.
              </p>
            )}
            <div className="space-y-3">
              {t.events.map(ev => {
                const isReg = localRegistered.has(ev.id)
                const isBusy = registering === ev.id
                return (
                  <div key={ev.id} className={`p-4 rounded-xl border transition-all ${
                    isReg
                      ? 'border-primary bg-primary-pale'
                      : 'border-soul-border hover:border-primary'
                  }`}
                    style={{
                      '--primary': '#4F46E5',
                      borderColor: isReg ? '#4F46E5' : '#D8F3DC',
                      background: isReg ? '#EEF2FF' : 'white',
                    }}>
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm font-semibold" style={{ color: '#1A2E1A' }}>{ev.title}</p>
                        <div className="flex items-center gap-3 mt-1.5">
                          <span className="flex items-center gap-1 text-xs" style={{ color: '#4A6741' }}>
                            <Calendar size={11} /> {ev.date}
                          </span>
                          <span className="flex items-center gap-1 text-xs" style={{ color: '#4A6741' }}>
                            <MapPin size={11} /> {ev.location}
                          </span>
                        </div>
                      </div>
                      <span className="tag-mint whitespace-nowrap">{ev.spots} spots</span>
                    </div>
                    <button onClick={() => handleRegister(ev)} disabled={isBusy}
                      className={`mt-3 flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-lg transition-all disabled:opacity-60 ${
                        isReg
                          ? 'bg-white border text-soul-muted hover:text-red-500 hover:border-red-200'
                          : 'text-white hover:opacity-90'
                      }`}
                      style={!isReg ? { background: t.color } : { borderColor: '#E2E8F0', color: '#64748B' }}>
                      {isBusy ? <><Loader2 size={12} className="animate-spin" /> Updating...</>
                        : isReg ? '✓ Registered — Click to cancel'
                        : 'Register Free'}
                    </button>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </motion.div>
      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
    </motion.div>
  )
}

// ── Page — same layout, cards now have photo on top ──────────────────────────
export default function Therapy() {
  const [selected, setSelected] = useState(null)

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  }

  const cardVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 260, damping: 20 } }
  }

  return (
    <div className="pt-28 pb-20 min-h-screen" style={{ background: '#F8FAF8' }}>
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="max-w-7xl mx-auto px-6 mb-10"
      >
        <span className="tag-lavender mb-4 inline-block">Therapy Discovery</span>
        <h1 className="font-serif italic text-6xl md:text-7xl text-slate-900 mb-6 drop-shadow-sm">
          Explore Healing <span className="text-indigo-600">Therapies</span>
        </h1>
        <p className="max-w-xl text-lg font-light leading-relaxed text-slate-600 mb-8">
          Evidence-based therapy methods with real science behind them. Find what resonates with your unique journey.
        </p>
      </motion.div>

      {/* Featured banner */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="max-w-7xl mx-auto px-6 mb-10"
      >
        <div className="rounded-2xl overflow-hidden p-8 md:p-10 relative shadow-lg"
          style={{ background: 'linear-gradient(135deg, #0F172A, #1E293B)' }}>
          <div className="absolute top-0 right-0 w-64 h-full opacity-[0.03] flex items-center justify-center text-[10rem]">🧠</div>
          <div className="relative z-10 max-w-lg">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold mb-4"
              style={{ background: 'rgba(79,70,229,0.15)', color: '#A5B4FC', border: '1px solid rgba(79,70,229,0.25)' }}>
              Most Evidence-Backed
            </span>
            <h2 className="font-display text-3xl font-bold text-white mb-3">Cognitive Behavioral Therapy</h2>
            <p className="text-sm leading-relaxed mb-6" style={{ color: '#E2E8F0' }}>
              CBT has more clinical research than any other psychotherapy. Proven effective for anxiety, depression, trauma, OCD, and dozens of other conditions. Find sessions and workshops near you.
            </p>
            <button onClick={() => setSelected(therapies[0])}
              className="btn-soul px-6 py-3 rounded-xl text-sm shadow-indigo-500/20 shadow-lg"><span>Learn About CBT →</span></button>
          </div>
        </div>
      </motion.div>

      {/* Cards grid */}
      <div className="max-w-7xl mx-auto px-6">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
        >
            {therapies.map(t => {
              const Icon = t.icon
              return (
                <motion.div 
                  key={t.id} 
                  variants={cardVariants}
                  whileHover={{ y: -8, scale: 1.02 }}
                  onClick={() => setSelected(t)}
                  className="rounded-3xl overflow-hidden relative shadow-sm hover:shadow-xl transition-all duration-500 border border-slate-100 flex flex-col bg-white group cursor-pointer"
                >
                  {/* Photo Header */}
                  <div className="relative h-48 overflow-hidden">
                    <img src={t.image} alt={t.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent" />
                    
                    {/* Duration/Short Tag */}
                    <div className="absolute top-4 right-4 px-3 py-1 rounded-full text-[10px] font-bold text-white shadow-lg backdrop-blur-md bg-white/20 border border-white/30 uppercase tracking-widest">
                      {t.short}
                    </div>

                    <div className="absolute top-4 left-4 w-11 h-11 rounded-2xl flex items-center justify-center backdrop-blur-md bg-white/30 border border-white/40 text-white shadow-sm transition-transform group-hover:rotate-6">
                      <Icon size={22} />
                    </div>
                  </div>

                  {/* Description Area with Colorful Background */}
                  <div className="p-7 flex flex-col flex-1 transition-colors duration-500"
                    style={{ background: `${t.color}08` /* 5% opacity for thematic tint */ }}>
                    <h3 className="font-display font-bold text-xl text-slate-900 mb-1.5 group-hover:text-indigo-600 transition-colors uppercase tracking-tight">{t.name}</h3>
                    <p className="text-[11px] italic font-semibold mb-4 flex items-center gap-1.5" style={{ color: t.color }}>
                      <Sparkles size={11} /> {t.tagline}
                    </p>
                    <p className="text-slate-500 text-xs leading-relaxed mb-6 flex-1 line-clamp-3 font-light">{t.explanation}</p>
                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-100/50">
                      <div className="flex items-center gap-1.5 text-[10px] font-extrabold text-indigo-600 opacity-0 group-hover:opacity-100 transition-all transform translate-x-1 group-hover:translate-x-0 uppercase tracking-widest">
                        Explore Method <ChevronRight size={14} />
                      </div>
                      <div className="w-6 h-6 rounded-full flex items-center justify-center bg-white border border-slate-100 shadow-sm opacity-50 group-hover:opacity-100 transition-opacity">
                        <ArrowRight size={10} className="text-slate-400 group-hover:text-indigo-500" />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )
            })}
        </motion.div>
      </div>

      <AnimatePresence>
        {selected && <TherapyModal t={selected} onClose={() => setSelected(null)} />}
      </AnimatePresence>
    </div>
  )
}