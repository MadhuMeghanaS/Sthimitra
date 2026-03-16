import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Star, Sparkles, Wind, Brain, Users, ChevronDown, Bot } from 'lucide-react'
import StressAssessment from '../components/StressAssessment'
import ChatbotWidget from '../components/ChatbotWidget'

// ─── Floating decorative orb ─────────────────────────────────────────────────
const Orb = ({ className, style }) => (
  <div className={`orb pointer-events-none ${className}`} style={style} />
)

// ─── Stat pill ────────────────────────────────────────────────────────────────
const Stat = ({ value, label }) => (
  <div className="text-center px-4">
    <div className="font-display text-3xl font-bold gradient-text">{value}</div>
    <div className="text-xs text-soul-muted mt-0.5 font-medium">{label}</div>
  </div>
)

// ─── Discovery card ───────────────────────────────────────────────────────────
const DiscoveryCard = ({ to, icon: Icon, title, desc, tag, tagColor, accent }) => (
  <Link to={to} className="soul-card group p-7 block relative overflow-hidden">
    <div className="absolute top-0 right-0 w-32 h-32 rounded-bl-[3rem] opacity-5 transition-opacity group-hover:opacity-10"
      style={{ background: accent }} />
    <div className="w-13 h-13 w-14 h-14 rounded-xl flex items-center justify-center mb-5 shadow-soul"
      style={{ background: `${accent}18`, border: `1px solid ${accent}30` }}>
      <Icon size={24} style={{ color: accent }} />
    </div>
    <span className={tagColor}>{tag}</span>
    <h3 className="font-display text-xl font-semibold text-soul-text mt-2 mb-2">{title}</h3>
    <p className="text-sm text-soul-muted leading-relaxed mb-5">{desc}</p>
    <div className="flex items-center gap-1.5 text-sm font-semibold transition-all group-hover:gap-2.5" style={{ color: accent }}>
      Explore <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
    </div>
  </Link>
)

// ─── Testimonial ─────────────────────────────────────────────────────────────
const Testimonial = ({ name, text, stars }) => (
  <div className="soul-card p-6">
    <div className="flex gap-1 mb-3">
      {[...Array(stars)].map((_, i) => <Star key={i} size={13} fill="#F39C12" style={{ color: '#F39C12' }} />)}
    </div>
    <p className="text-sm text-soul-muted leading-relaxed mb-4 italic">"{text}"</p>
    <div className="flex items-center gap-2">
      <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
        style={{ background: 'linear-gradient(135deg, #5DADE2, #A29BFE)' }}>
        {name.charAt(0)}
      </div>
      <span className="text-sm font-semibold text-soul-text">{name}</span>
    </div>
  </div>
)

export default function Home() {
  const [showAssessment, setShowAssessment] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setTimeout(() => setMounted(true), 80) }, [])

  return (
    <div className="pt-20 overflow-x-hidden">

      {/* ═══════════════════════════════════════════════════════════
          HERO SECTION — clean, no action buttons in hero itself
      ═══════════════════════════════════════════════════════════ */}
      <section className="relative min-h-screen flex items-center" style={{ background: 'linear-gradient(160deg, #EBF5FB 0%, #F4F7FB 40%, #F3F2FF 100%)' }}>
        <Orb className="orb-blue w-96 h-96 -top-20 -left-20 animate-float" />
        <Orb className="orb-lavender w-80 h-80 top-1/4 right-0 animate-float-slow" />
        <Orb className="orb-mint w-64 h-64 bottom-10 left-1/3 animate-float" style={{ animationDelay: '3s' }} />

        <div className="max-w-7xl mx-auto px-6 py-24 w-full relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

            {/* Left — text */}
            <div className={`transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-blue mb-6">
                <Sparkles size={13} style={{ color: '#5DADE2' }} />
                <span className="text-xs font-semibold text-blue-dark">Your emotional wellness platform</span>
              </div>

              <h1 className="font-display font-bold leading-tight mb-5" style={{ fontSize: 'clamp(3rem, 6vw, 5.5rem)', color: '#2C3E50' }}>
                Soul
                <span className="gradient-text">Sync</span>
              </h1>

              <p className="text-xl font-display italic mb-4" style={{ color: '#5DADE2' }}>
                "Sync your mind, emotions, and lifestyle."
              </p>

              <p className="text-base leading-relaxed mb-10 max-w-md" style={{ color: '#7F8C8D' }}>
                A holistic platform designed to help you manage stress, discover healing activities, explore evidence-based therapies, and connect with communities who truly understand.
              </p>

              {/* Stats row */}
              <div className="flex items-center gap-2 flex-wrap">
                <Stat value="12K+" label="Active Users" />
                <div className="w-px h-10 bg-soul-border" />
                <Stat value="50+" label="Activities" />
                <div className="w-px h-10 bg-soul-border" />
                <Stat value="20+" label="Communities" />
                <div className="w-px h-10 bg-soul-border" />
                <Stat value="6" label="Therapy Types" />
              </div>
            </div>

            {/* Right — visual */}
            <div className={`relative transition-all duration-700 delay-300 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <div className="relative w-full aspect-square max-w-sm mx-auto lg:max-w-md">
                {/* Central blob */}
                <div className="absolute inset-8 rounded-[40%_60%_55%_45%/50%_40%_60%_50%] flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg, rgba(93,173,226,0.2), rgba(162,155,254,0.2))' }}>
                  <div className="text-center p-6">
                    <div className="text-6xl mb-3">🧘</div>
                    <p className="font-display text-lg font-semibold text-soul-text">Find Your Balance</p>
                    <p className="text-xs text-soul-muted mt-1">One breath at a time</p>
                  </div>
                </div>

                {/* Floating badges */}
                {[
                  { emoji: '🧠', label: 'Therapy', top: '6%', left: '2%', delay: '0s' },
                  { emoji: '💜', label: 'Community', top: '6%', right: '2%', delay: '0.6s' },
                  { emoji: '🌿', label: 'Activities', bottom: '8%', left: '2%', delay: '1.2s' },
                  { emoji: '✨', label: 'Wellness', bottom: '8%', right: '2%', delay: '1.8s' },
                ].map(({ emoji, label, delay, ...pos }) => (
                  <div key={label} className="absolute glass rounded-xl px-3 py-2 shadow-soul animate-float"
                    style={{ ...pos, animationDelay: delay }}>
                    <span className="text-xl">{emoji}</span>
                    <p className="text-xs font-semibold text-soul-text">{label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Scroll hint */}
          <div className="flex justify-center mt-12">
            <div className="flex flex-col items-center gap-1 text-soul-muted animate-bounce-soft">
              <span className="text-xs font-medium">Explore</span>
              <ChevronDown size={18} />
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          DISCOVERY SECTION — 3 cards linking to main pages
      ═══════════════════════════════════════════════════════════ */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <span className="tag-blue mb-3 inline-block">Discover</span>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-soul-text mb-4">
              Your Wellness Path
            </h2>
            <p className="text-soul-muted max-w-md mx-auto">
              Everything you need to nurture your mental and emotional wellbeing, all in one place.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <DiscoveryCard to="/activities" icon={Wind} title="Calming Activities"
              desc="Explore science-backed activities — meditation, yoga, journaling, breathing exercises — tailored to your stress level."
              tag="8 Activities" tagColor="tag-blue" accent="#5DADE2" />
            <DiscoveryCard to="/therapy" icon={Brain} title="Therapy Discovery"
              desc="Understand evidence-based therapy methods like CBT, mindfulness, and art therapy. Find events and workshops near you."
              tag="6 Methods" tagColor="tag-lavender" accent="#A29BFE" />
            <DiscoveryCard to="/communities" icon={Users} title="Support Communities"
              desc="Join groups built around your specific stressors — work, academia, anxiety, relationships. You are not alone."
              tag="8 Communities" tagColor="tag-mint" accent="#55E6C1" />
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          STRESS ASSESSMENT CTA — "Ready to Sync Your Soul?"
      ═══════════════════════════════════════════════════════════ */}
      <section className="py-20 px-6" style={{ background: 'linear-gradient(160deg, #EBF5FB 0%, #F3F2FF 100%)' }}>
        <div className="max-w-5xl mx-auto">
          <div className="relative rounded-3xl overflow-hidden p-10 md:p-14"
            style={{ background: 'linear-gradient(135deg, #1A252F 0%, #2C3E50 100%)' }}>
            <Orb className="orb-blue w-64 h-64 -top-16 -right-16 opacity-30 animate-float" />
            <Orb className="orb-lavender w-48 h-48 bottom-0 left-0 opacity-20 animate-float-slow" />

            <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-5"
                  style={{ background: 'rgba(93,173,226,0.15)', border: '1px solid rgba(93,173,226,0.25)' }}>
                  <Sparkles size={13} style={{ color: '#5DADE2' }} />
                  <span className="text-xs font-semibold" style={{ color: '#AED6F1' }}>Free · 3 minutes</span>
                </div>
                <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">
                  Ready to Sync<br />Your Soul?
                </h2>
                <p className="text-sm leading-relaxed mb-6" style={{ color: '#AED6F1' }}>
                  Take our 10-question stress assessment. We'll calculate your stress level and give you a personalized set of activities, therapy recommendations, and communities perfectly matched to where you are right now.
                </p>
                <div className="flex flex-wrap gap-3">
                  <button onClick={() => setShowAssessment(true)}
                    className="btn-soul px-7 py-3.5 rounded-xl text-sm flex items-center gap-2">
                    <span>Start Stress Assessment</span>
                    <ArrowRight size={15} className="relative z-10" />
                  </button>
                  <Link to="/activities"
                    className="px-7 py-3.5 rounded-xl text-sm font-semibold flex items-center gap-2 transition-all hover:bg-white/10"
                    style={{ border: '2px solid rgba(255,255,255,0.2)', color: 'white' }}>
                    Explore Activities
                  </Link>
                </div>
              </div>

              {/* Stats panel */}
              <div className="grid grid-cols-2 gap-3">
                {[
                  { v: '10', l: 'Questions', icon: '📝' },
                  { v: '3 min', l: 'Duration', icon: '⏱️' },
                  { v: '3', l: 'Stress Levels', icon: '📊' },
                  { v: '∞', l: 'Personalized Tips', icon: '✨' },
                ].map(({ v, l, icon }) => (
                  <div key={l} className="rounded-xl p-4 text-center"
                    style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}>
                    <div className="text-2xl mb-1">{icon}</div>
                    <div className="text-xl font-bold font-display text-white">{v}</div>
                    <div className="text-xs" style={{ color: '#AED6F1' }}>{l}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          MINI CHATBOT SECTION — collapsible widget + link to full page
      ═══════════════════════════════════════════════════════════ */}
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <span className="tag-lavender mb-3 inline-block">AI Companion</span>
            <h2 className="font-display text-4xl font-bold text-soul-text mb-3">Talk to SoulSync</h2>
            <p className="text-soul-muted">
              Ask anything about your mental wellness. Get instant guidance, activity suggestions,
              and community recommendations — available 24/7.
            </p>
          </div>

          <ChatbotWidget />

          <div className="text-center mt-6">
            <Link to="/chat"
              className="inline-flex items-center gap-2 text-sm font-semibold text-blue-calm hover:text-blue-dark transition-colors">
              <Bot size={16} /> Open Full AI Chat Experience <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          TESTIMONIALS
      ═══════════════════════════════════════════════════════════ */}
      <section className="py-20 px-6" style={{ background: 'linear-gradient(160deg, #F4F7FB, #F3F2FF)' }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <span className="tag-mint mb-3 inline-block">Stories</span>
            <h2 className="font-display text-4xl font-bold text-soul-text">Real Transformations</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              { name: 'Priya S.', stars: 5, text: "SoulSync helped me find calm during my busiest semester ever. The breathing exercises became my daily ritual and the anxiety community truly saved me." },
              { name: 'Arjun M.', stars: 5, text: "The stress assessment was uncannily accurate. Within a week of following the recommendations, I was sleeping better and managing work pressure so much more effectively." },
              { name: 'Kavitha R.', stars: 5, text: "I joined the Depression Support community feeling completely isolated. Three months later I have genuine connections and a set of coping tools that actually work for me." },
            ].map((t, i) => <Testimonial key={i} {...t} />)}
          </div>
        </div>
      </section>

      {showAssessment && <StressAssessment onClose={() => setShowAssessment(false)} />}
    </div>
  )
}
