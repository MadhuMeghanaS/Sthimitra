 import React, { useState } from 'react'
import { X, MapPin, Calendar, Users, Brain, Palette, Music, Heart, MessageCircle, Sun, CheckCircle, Loader2, Sparkles, ArrowRight, ChevronRight } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import AuthModal from '../components/AuthModal'
import toast from 'react-hot-toast'

// ── Therapy data — same content, updated colors + real Unsplash images ────────
// ── Therapy data removed — now fetched from API ──────────────────────────
const iconMap = {
  'Brain': Brain, 'Sun': Sun, 'Palette': Palette, 'Music': Music, 'Users': Users, 'Heart': Heart,
  'CBT': Brain, 'MBSR': Sun, 'AT': Palette, 'MT': Music, 'GT': Users, 'ACT': Heart
};

// ── Modal — same layout, updated colors + photo header like prototype ─────────
function TherapyModal({ t, onClose, events = [], setEvents }) {
  const { user, refreshUser } = useAuth()
  const [showAuth,    setShowAuth]    = useState(false)
  const [registering, setRegistering] = useState(null)

  const therapyEvents = events.filter(e => e.therapy === t._id || (e.therapy && e.therapy._id === t._id))

  const [localRegistered, setLocalRegistered] = useState(() => {
    const ids = new Set((user?.registeredEvents || []).map(e => e._id || e.id || e))
    return new Set(therapyEvents.filter(ev => ids.has(ev._id)).map(ev => ev._id))
  })

  // Re-sync if user changes
  React.useEffect(() => {
    const ids = new Set((user?.registeredEvents || []).map(e => e._id || e.id || e))
    setLocalRegistered(new Set(therapyEvents.filter(ev => ids.has(ev._id)).map(ev => ev._id)))
  }, [user, therapyEvents])

  const handleRegister = async (ev) => {
    if (!user) { setShowAuth(true); return }
    const alreadyRegistered = localRegistered.has(ev._id)
    setRegistering(ev._id)
    try {
      const { data } = await axios.post(`/api/events/${ev._id}/register`)
      if (data.success) {
        setLocalRegistered(prev => {
          const next = new Set(prev)
          data.registered ? next.add(ev._id) : next.delete(ev._id)
          return next
        })
        if (setEvents) {
          setEvents(prev => prev.map(e => e._id === ev._id ? { ...e, availableSpots: data.availableSpots } : e));
        }
        toast.success(data.message)
        await refreshUser()
      }
    } catch (err) {
      toast.error('Failed to update registration.')
    } finally {
      setRegistering(null)
    }
  }

  const Icon = iconMap[t.short] || Brain

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
                <Icon size={30} />
              </div>
              <div>
                <h2 className="font-display text-3xl md:text-4xl font-bold text-white drop-shadow-md tracking-tight leading-none mb-1">{t.name}</h2>
                <p className="text-[10px] uppercase font-black tracking-widest text-white/90 px-3 py-1 rounded-lg backdrop-blur-md bg-white/10 border border-white/20 inline-block truncate max-w-[250px]">
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
                  <p className="text-sm font-bold text-slate-900">Session Details</p>
                  <p className="text-xs text-slate-500">{t.duration} • Personal Session</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Investment:</span>
                <span className="text-xl font-display font-black" style={{ color: t.color }}>₹{t.price} <span className="text-xs font-medium text-slate-400">/ session</span></span>
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
            <div className="grid grid-cols-1 gap-4">
              {therapyEvents.length === 0 ? (
                <div className="text-center py-10 px-6 rounded-3xl border border-dashed border-slate-200 bg-slate-50/50">
                  <Sparkles size={32} className="mx-auto text-slate-300 mb-3" />
                  <p className="text-sm text-slate-500 font-medium italic">No upcoming workshops for this therapy currently.</p>
                </div>
              ) : therapyEvents.map(ev => {
                const isReg = localRegistered.has(ev._id)
                const isBusy = registering === ev._id
                const spotsLeft = ev.availableSpots;
                
                return (
                  <motion.div 
                    key={ev._id} 
                    layout
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`group relative p-5 rounded-[2rem] border transition-all duration-300 ${
                      isReg
                        ? 'border-indigo-600 bg-indigo-50/50 shadow-md ring-1 ring-indigo-500/10'
                        : 'border-slate-100 bg-white hover:border-indigo-200 hover:shadow-xl hover:-translate-y-1'
                    }`}
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                           <span className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-sm">{ev.isVirtual ? '🌐' : '📍'}</span>
                           <h4 className="font-display font-bold text-slate-900 group-hover:text-indigo-600 transition-colors uppercase tracking-tight text-sm">
                             {ev.title}
                           </h4>
                        </div>
                        
                        <div className="flex flex-wrap items-center gap-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-10">
                          <span className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1 rounded-lg">
                            <Calendar size={12} className="text-indigo-500" /> {new Date(ev.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                          </span>
                          <span className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1 rounded-lg">
                            <MapPin size={12} className="text-indigo-500" /> {ev.location}
                          </span>
                        </div>
                      </div>

                      <div className="flex md:flex-col items-center md:items-end justify-between md:justify-center gap-3">
                        <div className="flex flex-col items-end">
                           <span className={`text-[10px] font-black uppercase tracking-[0.1em] px-3 py-1 rounded-full border ${
                             ev.availableSpots < 5 ? 'bg-red-50 text-red-500 border-red-100 animate-pulse' : 'bg-emerald-50 text-emerald-600 border-emerald-100'
                           }`}>
                             {spotsLeft} SPOTS LEFT
                           </span>
                        </div>

                        <motion.button 
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleRegister(ev)} 
                          disabled={isBusy}
                          className={`flex items-center justify-center gap-2 px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg ${
                            isReg
                              ? 'bg-red-50 text-red-500 hover:bg-red-500 hover:text-white shadow-red-200'
                              : 'text-white shadow-indigo-200'
                          }`}
                          style={!isReg ? { background: t.color || '#4F46E5' } : {}}>
                          {isBusy ? (
                            <><Loader2 size={12} className="animate-spin" /> ...</>
                          ) : (
                            <>
                              {isReg ? '✓ Registered' : 'Register Now'}
                              {!isReg && <ChevronRight size={12} />}
                            </>
                          )}
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
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
  const [therapies, setTherapies] = React.useState([])
  const [events,    setEvents]    = React.useState([])
  const [loading,   setLoading]   = React.useState(true)
  const [selected,  setSelected]  = React.useState(null)

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const [tRes, eRes] = await Promise.all([
          axios.get('/api/therapies'),
          axios.get('/api/events?upcoming=true')
        ]);
        if (tRes.data.success) setTherapies(tRes.data.therapies);
        if (eRes.data.success) setEvents(eRes.data.events);
      } catch (err) {
        console.error('Error fetching therapy data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

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
            <button onClick={() => setSelected(therapies.find(t => t.short === 'CBT') || therapies[0])}
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
            {loading ? (
              [1,2,3].map(n => (
                <div key={n} className="h-80 rounded-3xl bg-white/40 animate-pulse border border-slate-100" />
              ))
            ) : therapies.map(t => {
              const Icon = iconMap[t.short] || Brain
              return (
                <motion.div 
                   key={t._id} 
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
                    <h3 className="font-display font-bold text-xl text-slate-900 mb-1.5 group-hover:text-indigo-600 transition-colors uppercase tracking-tight text-[15px]">{t.name}</h3>
                    <p className="text-[11px] italic font-semibold mb-4 flex items-center gap-1.5" style={{ color: t.color }}>
                      <Sparkles size={11} /> {t.tagline}
                    </p>
                    <p className="text-slate-500 text-[10px] leading-relaxed mb-6 flex-1 line-clamp-3 font-light">{t.explanation}</p>
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
        {selected && (
          <TherapyModal 
            t={selected} 
            onClose={() => setSelected(null)} 
            events={events}
            setEvents={setEvents}
          />
        )}
      </AnimatePresence>
    </div>
  )
}