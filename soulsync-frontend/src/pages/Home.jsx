import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import { ArrowRight, Star, Sparkles, Wind, Brain, Users, ChevronDown, Bot } from 'lucide-react'
import StressAssessment from '../components/StressAssessment'
import ChatbotWidget from '../components/ChatbotWidget'

/* ─── Floating decorative orb ───────────────────────────────────────────────── */
const Orb = ({ className, style, y }) => (
  <motion.div className={`orb pointer-events-none ${className}`} style={{ ...style, y }} />
)

/* ─── Discovery card ─────────────────────────────────────────────────────────── */
const DiscoveryCard = ({ to, icon: Icon, title, desc, tag, tagColor, accent, delay, image }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    whileHover={{ scale: 1.03, y: -8, boxShadow: '0 20px 40px -10px rgba(79,70,229,0.15)' }}
    viewport={{ once: true, margin: '-50px' }}
    transition={{ 
      duration: 0.6, 
      delay,
      scale: { type: 'spring', stiffness: 400, damping: 25 },
      y: { type: 'spring', stiffness: 400, damping: 25 }
    }}
    className="h-full rounded-3xl bg-white border border-slate-100 overflow-hidden flex flex-col shadow-sm"
  >
    <Link to={to} className="group block h-full flex flex-col">
      {/* Visual Header */}
      <div className="relative h-48 overflow-hidden bg-slate-50/50">
        {image ? (
          <>
            <img src={image} alt={title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent opacity-60" />
          </>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-indigo-50/30">
            <motion.div 
              animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
              transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
              className="w-32 h-32 rounded-full blur-3xl"
              style={{ background: `radial-gradient(circle, ${accent}15, transparent 70%)` }}
            />
          </div>
        )}
        <div className="absolute top-4 left-4 w-12 h-12 rounded-xl flex items-center justify-center backdrop-blur-md bg-white/40 border border-white transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3 shadow-sm">
          <Icon size={22} style={{ color: accent }} />
        </div>
        <div className="absolute bottom-4 left-4">
          <span className={`${tagColor} !bg-white/40 backdrop-blur-md !border-white/50`}>{tag}</span>
        </div>
      </div>

      <div className="p-7 flex flex-col flex-grow">
        <h3 className="font-display text-xl font-semibold text-slate-900 mb-2 transition-colors duration-300">
          {title}
        </h3>
        <p className="text-sm text-slate-500 leading-relaxed mb-5 flex-grow">{desc}</p>
        <div className="flex items-center gap-1.5 text-sm font-semibold transition-all group-hover:gap-2.5" style={{ color: accent }}>
          Explore Now <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
        </div>
      </div>
    </Link>
  </motion.div>
)

/* ─── Testimonial ───────────────────────────────────────────────────────────── */
const Testimonial = ({ name, text, stars, delay }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    whileInView={{ opacity: 1, scale: 1 }}
    whileHover={{ y: -5, borderColor: '#C7D2FE' }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay }}
    className="soul-card p-6 border border-slate-200 transition-colors"
  >
    <div className="flex gap-1 mb-3">
      {[...Array(stars)].map((_, i) => <Star key={i} size={13} fill="#F59E0B" style={{ color: '#F59E0B' }} />)}
    </div>
    <p className="text-sm text-slate-600 leading-relaxed mb-4 italic">"{text}"</p>
    <div className="flex items-center gap-2">
      <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-sm"
        style={{ background: 'linear-gradient(135deg, #4F46E5, #3B82F6)' }}>
        {name.charAt(0)}
      </div>
      <span className="text-sm font-semibold text-slate-900">{name}</span>
    </div>
  </motion.div>
)

/* ─── Floating Decorative Bubble ───────────────────────────────────────────── */
const FloatingBubble = ({ size, top, left, right, bottom, color, delay, duration }) => (
  <motion.div
    className="absolute rounded-full pointer-events-none backdrop-blur-2xl shadow-2xl"
    style={{ 
      width: size, height: size, 
      top, left, right, bottom, 
      background: color,
      border: '1px solid rgba(255,255,255,0.4)',
      zIndex: 1 
    }}
    animate={{ 
      y: [0, -30, 0], 
      x: [0, 15, -15, 0]
    }}
    transition={{ repeat: Infinity, duration, delay, ease: "easeInOut" }}
  >
    <div className="absolute inset-0 rounded-full" style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.6) 0%, transparent 100%)' }} />
  </motion.div>
)
export default function Home() {
  const [showAssessment, setShowAssessment] = useState(false)
  const [stats,          setStats]          = useState({ users: 0, activities: 0, communities: 0 })
  const [loadingStats,   setLoadingStats]   = useState(true)

  useEffect(() => {
    window.scrollTo(0, 0)
    const fetchStats = async () => {
      try {
        const { data } = await axios.get('/api/stats')
        if (data.success) {
          setStats(data.stats)
        }
      } catch (err) {
        console.error('Error fetching stats:', err)
      } finally {
        setLoadingStats(false)
      }
    }
    fetchStats()
  }, [])
  
  // Parallax values based on scroll
  const { scrollY } = useScroll()
  const y1 = useTransform(scrollY, [0, 1000], [0, 250])
  const y2 = useTransform(scrollY, [0, 1000], [0, -150])
  const y3 = useTransform(scrollY, [0, 1000], [0, 350])

  // Quotes Auto-Carousel
  const quotes = [
    "Sync your mind, emotions, and lifestyle.",
    "Breathe. You're exactly where you need to be.",
    "Peace begins the moment you take a deep breath.",
    "A journey of a thousand miles begins with a single step.",
  ]
  const [quoteIdx, setQuoteIdx] = useState(0)

  useEffect(() => {
    const i = setInterval(() => {
      setQuoteIdx((prev) => (prev + 1) % quotes.length)
    }, 4500)
    return () => clearInterval(i)
  }, [])

  return (
    <div className="pt-20 overflow-x-hidden">

      {/* ═══════════════════════════════════════════════════════════
          FLAT CINEMATIC FULL-WIDTH HERO SECTION
      ═══════════════════════════════════════════════════════════ */}
      <section className="relative min-h-[95vh] flex flex-col items-center justify-center overflow-hidden bg-slate-50">
        
        {/* Soft Animated Ambient Background Canvas */}
        <div className="absolute inset-0 z-0 pointer-events-none opacity-60">
          <motion.div animate={{ x: [-50, 50, -50], y: [-20, 20, -20] }} transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
            className="absolute -top-32 -left-32 w-[600px] h-[600px] bg-indigo-300 rounded-full blur-[100px] mix-blend-multiply opacity-50" />
          <motion.div animate={{ x: [50, -50, 50], y: [20, -20, 20] }} transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            className="absolute top-1/4 right-[-10%] w-[600px] h-[600px] bg-cyan-300 rounded-full blur-[120px] mix-blend-multiply opacity-50" />
          <motion.div animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }} transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute bottom-0 left-1/3 w-[700px] h-[700px] bg-purple-200 rounded-full blur-[150px] mix-blend-multiply opacity-30" />
        </div>

        {/* Parallax Orbs (Layered on top of ambient canvas) */}
        <Orb y={y1} className="w-[30rem] h-[30rem] -top-32 -left-32 opacity-20" style={{ background: '#4F46E5', filter: 'blur(60px)' }} />
        <Orb y={y2} className="w-[25rem] h-[25rem] top-1/4 right-[-10%] opacity-20" style={{ background: '#3B82F6', filter: 'blur(50px)' }} />
        <Orb y={y3} className="w-[20rem] h-[20rem] bottom-0 left-1/3 opacity-20" style={{ background: '#8B5CF6', filter: 'blur(40px)' }} />

        {/* Breathing abstract blob now acts as an immersive center backdrop behind the text */}
        <motion.div 
          animate={{ 
            scale: [1, 1.05, 1],
            rotate: [0, 5, -5, 0],
            borderRadius: ["40% 60% 55% 45%/50% 40% 60% 50%", "50% 50% 40% 60%/45% 55% 50% 45%", "40% 60% 55% 45%/50% 40% 60% 50%"]
          }}
          transition={{ repeat: Infinity, duration: 12, ease: "easeInOut" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[35rem] h-[35rem] shadow-[0_0_120px_-20px_rgba(79,70,229,0.2)] border border-indigo-50 backdrop-blur-3xl opacity-50 z-0"
          style={{ background: 'linear-gradient(135deg, rgba(79,70,229,0.06), rgba(59,130,246,0.02))' }}
        />

        {/* The massive floating badges spread across the screen */}
        {[
          { emoji: '🧠', label: 'Therapy', top: '15%', left: '5%', delay: '0s', floatDur: 4 },
          { emoji: '💜', label: 'Community', top: '25%', right: '5%', delay: '0.6s', floatDur: 5 },
          { emoji: '🌿', label: 'Activities', bottom: '25%', left: '8%', delay: '1.2s', floatDur: 4.5 },
          { emoji: '✨', label: 'Wellness', bottom: '15%', right: '10%', delay: '1.8s', floatDur: 5.5 },
        ].map(({ emoji, label, delay, floatDur, ...pos }) => (
          <motion.div 
            key={label}
            animate={{ y: [0, -20, 0] }}
            transition={{ repeat: Infinity, duration: floatDur, ease: "easeInOut", delay: parseFloat(delay) }}
            className="absolute hidden lg:flex bg-white/80 backdrop-blur-xl rounded-[1.5rem] px-5 py-4 shadow-xl border border-slate-100 flex items-center gap-3 z-10"
            style={{ ...pos }}>
            <span className="text-2xl">{emoji}</span>
            <p className="text-sm font-black text-slate-800 tracking-wide uppercase">{label}</p>
          </motion.div>
        ))}

        <div className="flex flex-col items-center justify-center text-center max-w-5xl mx-auto px-6 py-24 md:py-32 w-full relative z-20">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex flex-col items-center w-full"
          >
            {/* ── SERIF TYPOGRAPHY (USER REQUESTED ELEGANCE) ── */}
            <h1 className="font-serif font-medium tracking-tight text-slate-900 mb-6 flex flex-col items-center gap-2">
              <span className="text-sm md:text-base font-sans font-extrabold tracking-[0.25em] text-indigo-500 uppercase mb-2">Welcome</span>
              <span className="text-[4.5rem] md:text-[6.5rem] leading-[1] text-slate-800 drop-shadow-sm">
                Sthi<span className="italic text-indigo-500">mitra</span>
              </span>
            </h1>

            {/* Dynamic Rotating Quotes - Styled with elegant italic serif to match the screenshot vibe */}
            <div className="h-10 relative mt-2 md:mt-4 mb-4 md:mb-8 border-b border-indigo-100 pb-10 w-full max-w-2xl flex justify-center">
              <AnimatePresence mode="wait">
                <motion.p
                  key={quoteIdx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                  className="text-2xl md:text-3xl font-serif italic text-slate-600 absolute w-full tracking-wide"
                >
                  "{quotes[quoteIdx]}"
                </motion.p>
              </AnimatePresence>
            </div>

            <p className="text-lg md:text-xl font-sans font-light leading-relaxed text-slate-600 max-w-2xl mt-4 mb-14 mix-blend-multiply text-center">
              A holistic platform designed to help you manage stress, discover healing activities, explore evidence-based therapies, and connect with communities who truly understand.
            </p>

            {/* Revamped central glassmorphic stats */}
            <div className="flex bg-white/70 backdrop-blur-xl rounded-[2rem] border border-white shadow-xl p-2 md:p-3 w-max">
              <div className="flex flex-col items-center justify-center px-6 md:px-10 py-3 border-r border-slate-200/50">
                <div className="text-3xl md:text-4xl font-serif font-medium text-indigo-600 mb-1 drop-shadow-sm">
                  {loadingStats ? '...' : stats.users}
                </div>
                <div className="text-[10px] md:text-xs font-sans font-extrabold text-slate-500 uppercase tracking-widest">Active Users</div>
              </div>
              <div className="flex flex-col items-center justify-center px-6 md:px-10 py-3 border-r border-slate-200/50">
                <div className="text-3xl md:text-4xl font-serif font-medium text-blue-500 mb-1 drop-shadow-sm">
                   {loadingStats ? '...' : stats.activities}
                </div>
                <div className="text-[10px] md:text-xs font-sans font-extrabold text-slate-500 uppercase tracking-widest">Activities</div>
              </div>
              <div className="flex flex-col items-center justify-center px-6 md:px-10 py-3">
                <div className="text-3xl md:text-4xl font-serif font-medium text-slate-800 mb-1 drop-shadow-sm">
                   {loadingStats ? '...' : stats.communities}
                </div>
                <div className="text-[10px] md:text-xs font-sans font-extrabold text-slate-500 uppercase tracking-widest">Communities</div>
              </div>
            </div>

          </motion.div>
        </div>

        {/* Scroll hint pushed to bottom of hero */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1, duration: 1 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex justify-center mt-12"
        >
          <motion.div 
            animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            className="flex flex-col items-center gap-1 text-slate-400"
          >
            <span className="text-xs font-semibold tracking-widest uppercase mb-1">Explore</span>
            <ChevronDown size={18} />
          </motion.div>
        </motion.div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          DISCOVERY SECTION
      ═══════════════════════════════════════════════════════════ */}
      <section className="py-24 px-6 relative z-20 overflow-hidden" style={{ background: 'linear-gradient(180deg, #f8fafc 0%, #eef2ff 100%)' }}>
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden opacity-30">
          <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
            className="absolute top-10 -right-20 w-[400px] h-[400px] bg-blue-300/40 rounded-full blur-[100px]" />
        </div>
        
        <FloatingBubble size="140px" top="5%" left="8%" color="rgba(96,165,250,0.15)" duration={8} delay={0} />
        <FloatingBubble size="90px" bottom="15%" right="10%" color="rgba(129,140,248,0.1)" duration={6} delay={1.5} />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
            className="text-center mb-14"
          >
            <span className="tag-blue mb-3 inline-block">Discover</span>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              Your Wellness Path
            </h2>
            <p className="text-slate-500 max-w-md mx-auto">
              Everything you need to nurture your mental and emotional wellbeing, all in one place.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <DiscoveryCard delay={0.1} to="/activities" icon={Wind} title="Calming Activities"
              image="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=80"
              desc="Explore science-backed activities — meditation, yoga, journaling, breathing exercises — tailored to your stress level."
              tag="8 Activities" tagColor="tag-blue" accent="#3B82F6" />
            <DiscoveryCard delay={0.2} to="/therapy" icon={Brain} title="Therapy Discovery"
              image="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=800&q=80"
              desc="Understand evidence-based therapy methods like CBT, mindfulness, and art therapy. Find events and workshops near you."
              tag="6 Methods" tagColor="tag-lavender" accent="#4F46E5" />
            <DiscoveryCard delay={0.3} to="/communities" icon={Users} title="Support Communities"
              image="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&q=80"
              desc="Join groups built around your specific stressors — work, academia, anxiety, relationships. You are not alone."
              tag="8 Communities" tagColor="tag-mint" accent="#0F172A" />
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          STRESS ASSESSMENT CTA
      ═══════════════════════════════════════════════════════════ */}
      <section className="py-20 px-6 overflow-hidden relative z-20" style={{ background: 'linear-gradient(135deg, #eef2ff 0%, #f0fdf4 100%)' }}>
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden opacity-40">
          <motion.div animate={{ x: [-20, 20, -20] }} transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute top-1/2 -left-32 w-[500px] h-[500px] bg-emerald-200/40 rounded-full blur-[120px]" />
        </div>
        
        <FloatingBubble size="180px" top="-5%" right="-3%" color="rgba(52,211,153,0.15)" duration={9} delay={0.5} />
        <FloatingBubble size="70px" bottom="20%" left="12%" color="rgba(59,130,246,0.12)" duration={5} delay={0.2} />
        
        <div className="max-w-5xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, rotate: -1 }} 
            whileInView={{ opacity: 1, scale: 1, rotate: 0 }} 
            whileHover={{ scale: 1.01 }}
            viewport={{ once: true }} 
            transition={{ duration: 0.8, type: "spring", bounce: 0.3 }}
            className="relative rounded-[2.5rem] overflow-hidden p-10 md:p-14 shadow-2xl"
            style={{ background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)' }}
          >
            <motion.div 
              animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 150, ease: "linear" }}
              className="absolute -top-64 -right-64 w-[40rem] h-[40rem] opacity-[0.04] pointer-events-none"
              style={{ background: 'radial-gradient(circle, #4F46E5 0%, transparent 70%)' }}
            />

            <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
              <div>
                <motion.div 
                  initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} delay={0.3}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-6"
                  style={{ background: 'rgba(79,70,229,0.15)', border: '1px solid rgba(79,70,229,0.25)' }}>
                  <Sparkles size={13} className="text-indigo-400" />
                  <span className="text-xs font-semibold text-indigo-200">Free · 3 minutes</span>
                </motion.div>
                
                <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-5 leading-tight">
                  Ready to Sync<br />Your Soul?
                </h2>
                
                <p className="text-base leading-relaxed mb-8 text-slate-300">
                  Take our 10-question stress assessment. We'll calculate your stress level and give you a personalized set of activities, therapy recommendations, and communities perfectly matched to where you are right now.
                </p>
                
                <div className="flex flex-wrap gap-4">
                  <motion.button 
                    whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                    onClick={() => setShowAssessment(true)}
                    className="bg-indigo-600 hover:bg-indigo-500 text-white px-7 py-3.5 rounded-xl text-sm font-semibold flex items-center gap-2 transition-colors shadow-lg shadow-indigo-500/25">
                    <span>Start Stress Assessment</span>
                    <ArrowRight size={15} />
                  </motion.button>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Link to="/activities"
                      className="px-7 py-3.5 rounded-xl text-sm font-semibold flex items-center gap-2 transition-colors hover:bg-white/10"
                      style={{ border: '1px solid rgba(255,255,255,0.2)', color: 'white' }}>
                      Explore Activities
                    </Link>
                  </motion.div>
                </div>
              </div>

              {/* Stats panel */}
              <div className="grid grid-cols-2 gap-4">
                {[
                  { v: '10', l: 'Questions', icon: '📝' },
                  { v: '3 min', l: 'Duration', icon: '⏱️' },
                  { v: '3', l: 'Stress Levels', icon: '📊' },
                  { v: '∞', l: 'Personalized', icon: '✨' },
                ].map(({ v, l, icon }, i) => (
                  <motion.div 
                    key={l} 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * i, duration: 0.5 }}
                    className="rounded-2xl p-5 text-center bg-white/[0.03] border border-white/10 backdrop-blur-sm transition-colors hover:bg-white/[0.06] hover:border-white/20">
                    <div className="text-3xl mb-2">{icon}</div>
                    <div className="text-2xl font-bold font-display text-white mb-0.5">{v}</div>
                    <div className="text-xs text-indigo-300 font-medium">{l}</div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          MINI CHATBOT SECTION
      ═══════════════════════════════════════════════════════════ */}
      <section className="py-20 px-6 relative z-20 overflow-hidden" style={{ background: 'linear-gradient(180deg, #f0fdf4 0%, #faf5ff 100%)' }}>
        <FloatingBubble size="220px" top="15%" left="-5%" color="rgba(167,139,250,0.12)" duration={11} delay={0} />
        <FloatingBubble size="100px" bottom="10%" right="8%" color="rgba(244,114,182,0.12)" duration={7} delay={1.5} />
        
        <div className="max-w-3xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
            className="text-center mb-10"
          >
            <span className="tag-lavender mb-3 inline-block">AI Companion</span>
            <h2 className="font-display text-4xl font-bold text-slate-900 mb-3">Talk to Sthimitra</h2>
            <p className="text-slate-500">
              Ask anything about your mental wellness. Get instant guidance, activity suggestions,
              and community recommendations — available 24/7.
            </p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2, duration: 0.6 }}>
            <ChatbotWidget />
          </motion.div>

          <div className="text-center mt-6">
            <Link to="/chat"
              className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 hover:text-indigo-800 transition-colors">
              <Bot size={16} /> Open Full AI Chat Experience <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          TESTIMONIALS
      ═══════════════════════════════════════════════════════════ */}
      <section className="py-20 px-6 relative z-20 overflow-hidden" style={{ background: 'linear-gradient(160deg, #faf5ff 0%, #f8fafc 100%)' }}>
        <div className="absolute inset-0 z-0 pointer-events-none opacity-40">
          <motion.div animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }} transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
            className="absolute bottom-10 left-1/4 w-[400px] h-[400px] bg-violet-200/50 rounded-full blur-[100px]" />
        </div>
        
        <FloatingBubble size="160px" top="-8%" left="35%" color="rgba(192,132,252,0.15)" duration={10} delay={0.2} />
        <FloatingBubble size="120px" bottom="5%" left="-2%" color="rgba(129,140,248,0.18)" duration={6} delay={2} />
        <FloatingBubble size="80px" top="40%" right="4%" color="rgba(56,189,248,0.15)" duration={5} delay={1} />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <span className="tag-mint mb-3 inline-block">Stories</span>
            <h2 className="font-display text-4xl font-bold text-slate-900">Real Transformations</h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { 
                name: 'Priya S.', 
                stars: 5, 
                accent: '#818CF8',
                tag: 'Student Resilience',
                text: "Sthimitra helped me find calm during my busiest semester ever. The breathing exercises became my daily ritual and the anxiety community truly saved me." 
              },
              { 
                name: 'Arjun M.', 
                stars: 5, 
                accent: '#60A5FA',
                tag: 'Work-Life Balance',
                text: "The stress assessment was uncannily accurate. Within a week of following the recommendations, I was sleeping better and managing work pressure effectively." 
              },
              { 
                name: 'Kavitha R.', 
                stars: 5, 
                accent: '#334155',
                tag: 'Healing Journey',
                text: "I joined the Depression Support community feeling completely isolated. Three months later I have genuine connections and a set of coping tools that actually work for me." 
              },
            ].map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                whileHover={{ y: -8 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                className="bg-white rounded-[2.5rem] p-8 border border-slate-100 flex flex-col h-full relative overflow-hidden group shadow-sm transition-all"
              >
                {/* Dynamic Bubble/Orb Background */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden origin-center">
                  <motion.div 
                    animate={{ 
                      scale: [1, 1.2, 1], 
                      x: [0, 20, -20, 0], 
                      y: [0, -10, 10, 0],
                      rotate: [0, 90, 180, 270, 360]
                    }}
                    transition={{ repeat: Infinity, duration: 15, ease: "linear" }}
                    className="absolute -top-10 -right-10 w-48 h-48 rounded-full blur-3xl opacity-[0.12]"
                    style={{ background: `radial-gradient(circle, ${t.accent}, transparent 70%)` }}
                  />
                  <motion.div 
                    animate={{ 
                      scale: [1, 1.3, 1], 
                      x: [0, -30, 30, 0], 
                      y: [0, 20, -20, 0] 
                    }}
                    transition={{ repeat: Infinity, duration: 20, ease: "linear", delay: 1 }}
                    className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full blur-3xl opacity-[0.08]"
                    style={{ background: `radial-gradient(circle, ${t.accent}, transparent 70%)` }}
                  />
                </div>
                
                <div className="flex gap-0.5 mb-6 relative z-10">
                  {[...Array(t.stars)].map((_, j) => <Star key={j} size={14} fill="#F59E0B" className="text-amber-400" />)}
                </div>

                <p className="text-lg text-slate-700 leading-relaxed mb-8 italic relative z-10 font-serif">"{t.text}"</p>
                
                <div className="mt-auto flex items-center justify-between relative z-10">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl flex items-center justify-center text-white text-sm font-bold shadow-lg transition-transform group-hover:scale-110 group-hover:rotate-3"
                      style={{ background: `linear-gradient(135deg, ${t.accent}, ${t.accent}aa)` }}>
                      {t.name.charAt(0)}
                    </div>
                    <div>
                      <span className="block font-display font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{t.name}</span>
                      <span className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">{t.tag}</span>
                    </div>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center border border-slate-100 opacity-20 group-hover:opacity-100 transition-opacity">
                    <Sparkles size={14} style={{ color: t.accent }} />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {showAssessment && <StressAssessment onClose={() => setShowAssessment(false)} />}
    </div>
  )
}
