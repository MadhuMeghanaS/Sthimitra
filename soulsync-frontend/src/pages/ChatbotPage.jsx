import React, { useState, useRef, useEffect } from 'react'
import { Send, Bot, Sparkles, RefreshCw, ExternalLink, Lightbulb, Loader2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const getBotReply = (msg) => {
  const m = msg.toLowerCase()
  if (m.match(/anxi|panic|fear|worry|anxious/))
    return {
      text: "I can hear that anxiety is weighing on you. Let's try something right now — box breathing:\n\n🫁 Inhale for 4 counts\n⏸ Hold for 4 counts\n💨 Exhale for 4 counts\n⏸ Hold for 4 counts\n\nRepeat this 4 times. It directly activates your parasympathetic nervous system, which is your body's natural off-switch for the stress response.\n\nFor ongoing support, Cognitive Behavioral Therapy (CBT) is the gold-standard treatment for anxiety and our Anxiety Support community is a very active, compassionate space.",
      chips: ['Tell me about CBT', 'Show me breathing exercises', 'Anxiety Support community'],
      resources: [{ label: 'Breathing Exercises', path: '/activities' }, { label: 'Anxiety Support', path: '/communities' }]
    }

  if (m.match(/stress|overwhelm|pressure|burnout/))
    return {
      text: "Stress is your body's signal that something needs attention. That's actually useful information — not a flaw in you.\n\nHere are three immediate things that work:\n\n🌿 A 20-minute nature walk reduces cortisol more than most other interventions\n🧘 A 10-minute meditation session can shift your entire nervous system state\n📓 Writing in a journal for 15 minutes externalizes the mental load\n\nFor sustained stress management, progressive relaxation and mindfulness therapy have strong scientific backing.",
      chips: ['Meditation techniques', 'Work stress community', 'Mindfulness therapy'],
      resources: [{ label: 'Activities', path: '/activities' }, { label: 'Therapy', path: '/therapy' }]
    }

  if (m.match(/sad|depress|low mood|hopeless|empty|numb/))
    return {
      text: "Thank you for trusting me with this. Low mood and depression deserve real, compassionate attention.\n\nSome evidence-based starting points:\n\n🎨 Art therapy is remarkable for processing emotions that words can't hold\n📓 Journaling — even just 5 minutes of stream-of-consciousness — can create relief\n👥 Group therapy and peer support communities reduce the isolation that makes depression worse\n\nPlease also know that professional support makes a meaningful difference. If your mood has been consistently low for more than two weeks, connecting with a therapist is genuinely important.",
      chips: ['Art therapy explained', 'Depression support community', 'Group therapy'],
      resources: [{ label: 'Therapy Discovery', path: '/therapy' }, { label: 'Communities', path: '/communities' }]
    }

  if (m.match(/sleep|insomnia|can't sleep|tired|exhaust/))
    return {
      text: "Sleep struggles cascade into everything else — mood, focus, stress tolerance. You're right to address this.\n\nA research-backed sleep routine:\n\n🎵 Music relaxation or brown noise 30 minutes before bed\n💆 Progressive muscle relaxation (tense and release muscle groups)\n📵 No screens 45 minutes before sleep — blue light suppresses melatonin\n🧘 A short body-scan meditation lying in bed\n\nCBT for Insomnia (CBT-I) is actually more effective than sleep medication in the long term.",
      chips: ['CBT for insomnia', 'Progressive relaxation', 'Music relaxation activity'],
      resources: [{ label: 'Activities', path: '/activities' }, { label: 'Therapy', path: '/therapy' }]
    }

  if (m.match(/focus|concentrat|distract|adhd|attention/))
    return {
      text: "Focus difficulties often signal mental fatigue, anxiety, or an overloaded nervous system — not a personal failing.\n\nEvidence-based strategies:\n\n⏱ Pomodoro technique: 25 minutes focused, 5 minute break, repeat 4x then take 30 minutes\n🧘 Even 8 minutes of meditation daily measurably improves attention after 2 weeks\n📓 Brain dumps: write everything in your head onto paper before starting work\n🚶 Physical movement before cognitively demanding tasks boosts prefrontal cortex activity\n\nCBT can also address the thought patterns that interrupt sustained focus.",
      chips: ['Meditation for focus', 'CBT therapy', 'Journaling technique'],
      resources: [{ label: 'Activities', path: '/activities' }, { label: 'Therapy', path: '/therapy' }]
    }

  if (m.match(/relation|partner|family|friend|lonely|isolat/))
    return {
      text: "Relationship stress is uniquely painful because it touches our core human need for connection.\n\nSome approaches that help:\n\n📓 Journaling about your feelings before difficult conversations (clarifies your needs)\n👥 Group therapy creates perspective — hearing others' relationship struggles normalizes your own\n🧠 CBT helps identify communication patterns that create conflict\n💜 The Relationship Stress community has people who genuinely understand\n\nRemember: seeking support is a sign of emotional intelligence, not weakness.",
      chips: ['Group therapy', 'Relationship stress community', 'Journaling'],
      resources: [{ label: 'Communities', path: '/communities' }, { label: 'Therapy', path: '/therapy' }]
    }

  if (m.match(/work|job|career|boss|colleague|office/))
    return {
      text: "Work stress is one of the most common and underaddressed mental health challenges today.\n\nImmediate strategies:\n\n⏸ Set a hard stop time — research shows working beyond 8-9 hours actually reduces productivity\n🌿 Take a real lunch break away from your desk every single day\n💨 Desk breathing: 4-7-8 breathing (inhale 4, hold 7, exhale 8) takes 90 seconds\n\nOur Work Stress community (3,000+ members) discusses everything from toxic workplaces to burnout recovery. You're not alone in this.",
      chips: ['Work stress community', 'Burnout recovery', 'Breathing exercises'],
      resources: [{ label: 'Communities', path: '/communities' }, { label: 'Activities', path: '/activities' }]
    }

  if (m.match(/calm|relax|peace|breathe|unwind/))
    return {
      text: "Here are the most effective calming techniques, ranked by speed:\n\n⚡ Fastest (90 seconds): Physiological sigh — double inhale through nose, long exhale through mouth\n🔵 Quick (5 min): Box breathing 4-4-4-4\n🌊 Medium (10 min): Guided body scan meditation\n🧘 Deep (20-30 min): Yoga nidra or full yoga session\n\nFor regular calm maintenance, a daily mindfulness practice of even 10 minutes creates structural changes in the brain's stress response centers over 8 weeks.",
      chips: ['Breathing exercises', 'Meditation guide', 'Yoga activity'],
      resources: [{ label: 'All Activities', path: '/activities' }]
    }

  return {
    text: "Hello! I'm your Sthimitra wellness companion 💙 I'm here to provide personalized mental wellness guidance.\n\nYou can tell me about:\n• How you're feeling emotionally\n• Stress or anxiety you're experiencing\n• Sleep difficulties\n• Focus or concentration problems\n• Relationship or work stress\n\nI'll suggest evidence-based activities, explain therapy approaches, and point you toward supportive communities. What's on your mind?",
    chips: ['I feel anxious', 'I feel stressed', 'I can\'t sleep', 'I need to focus', 'I need to relax'],
    resources: []
  }
}

const prompts = [
  "I've been feeling really anxious lately",
  "How do I manage work burnout?",
  "I can't seem to sleep well",
  "What is CBT therapy?",
  "I feel overwhelmed and can't focus",
  "How do I calm down quickly?",
  "I've been feeling lonely and isolated",
  "What activities help with depression?",
]

export default function ChatbotPage() {
  const [msgs, setMsgs] = useState([
    {
      from: 'bot',
      text: "Hello! I'm your Sthimitra wellness companion 💙\n\nI'm trained to provide thoughtful, evidence-based mental wellness guidance. Share how you're feeling — whether it's stress, anxiety, low mood, sleep issues, or anything else — and I'll give you personalized recommendations.\n\nWhat would you like to explore today?",
      chips: ['I feel anxious', 'I feel stressed', "I can't sleep", 'I need to relax', 'I feel low'],
    }
  ])
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const endRef = useRef(null)
  const inputRef = useRef(null)
  const scrollRef = useRef(null)

  useEffect(() => { 
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [msgs, typing])

  const send = async (text) => {
    const msg = text || input.trim()
    if (!msg) return
    setMsgs(p => [...p, { from: 'user', text: msg }])
    setInput('')
    setTyping(true)

    try {
      const localMatch = getBotReply(msg)
      let botText = localMatch.text
      
      const apiKey = import.meta.env.VITE_GROQ_API_KEY
      if (apiKey) {
        const sysPrompt = "You are Sthimitra Assistant, a compassionate mental wellness AI companion. Provide a brief, empathetic response (2-3 short paragraphs max). Ask a thoughtful follow-up question. Do not give medical diagnoses. User message: " + msg;
        const body = {
          model: 'llama3-70b-8192',
          temperature: 0.85,
          max_tokens: 500,
          top_p: 0.9,
          stream: false,
          messages: [
            { role: 'system', content: sysPrompt },
            { role: 'user', content: msg }
          ]
        };
        const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
          },
          body: JSON.stringify(body)
        })
        
        if (res.ok) {
          const data = await res.json()
          const raw = data?.output?.choices?.[0]?.message?.content;
          if (raw) botText = raw;
        } else {
          console.error('Groq API Error:', res.status)
        }
      } else {
        console.warn("Please add VITE_GROQ_API_KEY to your frontend .env file.")
      }
      
      setMsgs(p => [...p, { from: 'bot', text: botText, chips: localMatch.chips, resources: localMatch.resources }])
    } catch (err) {
      console.error("Error fetching AI response:", err)
      const fallback = getBotReply(msg)
      setMsgs(p => [...p, { 
        from: 'bot', 
        text: "I'm having trouble thinking due to high traffic limits right now, but I still want to help you. \n\n" + fallback.text, 
        chips: fallback.chips, 
        resources: fallback.resources 
      }])
    } finally {
      setTyping(false)
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }

  const reset = () => {
    setMsgs([{ from: 'bot', text: "Fresh start! What's on your mind today? 💙", chips: ['I feel anxious', 'I feel stressed', "I can't sleep", 'I need to relax'] }])
  }

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.1 } }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  }

  return (
    <div className="pt-28 pb-10 min-h-screen flex flex-col bg-[#F8FAF8]">
      <div className="max-w-5xl mx-auto w-full px-6 flex flex-col flex-1 gap-8">

        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 border border-indigo-100 mb-4">
            <Sparkles size={14} className="text-indigo-600" />
            <span className="text-xs font-semibold text-indigo-700">AI Wellness Companion</span>
          </div>
          <h1 className="font-display text-5xl font-bold text-soul-text mb-3">Sthimitra Chat</h1>
          <p className="text-soul-muted max-w-lg mx-auto">Evidence-based wellness guidance, available 24/7. Your safe space to share and explore.</p>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-6 flex-1 items-stretch">

          {/* Main chat panel */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex-1 flex flex-col bg-white rounded-3xl shadow-xl border border-soul-border overflow-hidden min-h-[600px]"
          >
            {/* Chat header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-soul-border bg-slate-50/50">
              <div className="flex items-center gap-4">
                <motion.div 
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/20"
                  style={{ background: 'linear-gradient(135deg, #4F46E5, #3B82F6)' }}
                >
                  <Bot size={24} color="white" />
                </motion.div>
                <div>
                  <p className="font-semibold text-soul-text">Sthimitra Assistant</p>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
                    <span className="text-xs text-soul-muted">Responds instantly</span>
                  </div>
                </div>
              </div>
              <button onClick={reset}
                className="p-2.5 rounded-xl text-soul-muted hover:bg-white hover:text-indigo-600 transition-all border border-transparent hover:border-soul-border shadow-sm"
                title="Start new conversation">
                <RefreshCw size={18} />
              </button>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto px-6 py-6 flex flex-col gap-5 bg-slate-50/30 scroll-smooth">
              <AnimatePresence>
                {msgs.map((m, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    className={`flex flex-col gap-2 ${m.from === 'user' ? 'items-end' : 'items-start'}`}
                  >
                    {m.from === 'bot' && (
                      <div className="flex items-center gap-2 mb-1">
                        <div className="w-6 h-6 rounded-lg flex items-center justify-center shadow-md shadow-indigo-500/10"
                          style={{ background: 'linear-gradient(135deg, #4F46E5, #3B82F6)' }}>
                          <Bot size={12} color="white" />
                        </div>
                        <span className="text-[10px] uppercase tracking-wider text-soul-muted font-bold">Sthimitra AI</span>
                      </div>
                    )}
                    <div className={m.from === 'user' ? 'bg-indigo-600 text-white px-5 py-3.5 rounded-2xl rounded-tr-none shadow-lg shadow-indigo-500/10 text-sm max-w-[85%]' : 'bg-white border border-soul-border px-5 py-3.5 rounded-2xl rounded-tl-none shadow-sm text-sm text-slate-700 leading-relaxed max-w-[85%]'}>
                      {m.text.split('\n').map((line, j) => (
                        <span key={j}>{line}{j < m.text.split('\n').length - 1 && <br />}</span>
                      ))}
                    </div>
                    {m.chips && (
                      <div className="flex flex-wrap gap-2 mt-1">
                        {m.chips.map(c => (
                          <motion.button 
                            key={c} 
                            whileHover={{ y: -2 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => send(c)}
                            className="text-xs px-4 py-2 rounded-full border border-indigo-100 text-indigo-700 bg-white hover:bg-indigo-600 hover:text-white hover:border-indigo-600 transition-all font-medium shadow-sm"
                          >
                            {c}
                          </motion.button>
                        ))}
                      </div>
                    )}
                    {m.resources?.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-1">
                        {m.resources.map(r => (
                          <a key={r.path} href={r.path}
                            className="flex items-center gap-2 text-xs px-4 py-2 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100 hover:bg-indigo-100 transition-all font-semibold shadow-sm"
                          >
                            <ExternalLink size={12} /> {r.label}
                          </a>
                        ))}
                      </div>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>

              {typing && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-start gap-3"
                >
                  <div className="w-6 h-6 rounded-lg flex items-center justify-center shadow-md shadow-indigo-500/10"
                    style={{ background: 'linear-gradient(135deg, #4F46E5, #3B82F6)' }}>
                    <Bot size={12} color="white" />
                  </div>
                  <div className="bg-white border border-soul-border px-5 py-4 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-1.5">
                    {[0, 1, 2].map(i => (
                      <motion.span 
                        key={i} 
                        animate={{ y: [0, -4, 0] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                        className="w-2 h-2 rounded-full bg-indigo-200"
                      />
                    ))}
                  </div>
                </motion.div>
              )}
              <div ref={endRef} />
            </div>

            {/* Input bar */}
            <div className="px-6 py-5 border-t border-soul-border bg-white flex gap-4 items-end">
              <div className="flex-1 relative">
                <textarea
                  ref={inputRef}
                  rows={1}
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() } }}
                  placeholder="Share how you're feeling..."
                  className="soul-input w-full resize-none py-3.5 px-5 text-sm rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
                  style={{ maxHeight: '150px', overflowY: 'auto' }}
                />
              </div>
              <button 
                onClick={() => send()} 
                disabled={!input.trim()}
                className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center transition-all hover:bg-indigo-700 hover:shadow-lg disabled:opacity-30 disabled:bg-slate-400 group"
              >
                <Send size={20} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </button>
            </div>
          </motion.div>

          {/* Sidebar */}
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="lg:w-80 flex flex-col gap-6"
          >
            {/* Conversation starters */}
            <motion.div variants={itemVariants} className="bg-white rounded-3xl border border-soul-border shadow-xl p-6">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-8 h-8 rounded-xl bg-orange-50 flex items-center justify-center">
                  <Lightbulb size={18} className="text-orange-500" />
                </div>
                <h3 className="font-semibold text-soul-text">Need inspiration?</h3>
              </div>
              <div className="flex flex-col gap-2.5">
                {prompts.map(p => (
                  <button key={p} onClick={() => send(p)}
                    className="text-left text-xs text-soul-muted px-4 py-3 rounded-2xl hover:bg-slate-50 hover:text-indigo-600 transition-all border border-transparent hover:border-indigo-100 group">
                    "{p}"
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Disclaimer */}
            <motion.div variants={itemVariants} className="bg-indigo-50/50 rounded-3xl p-6 border border-indigo-100/50">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles size={16} className="text-indigo-600" />
                <p className="font-bold text-xs uppercase tracking-wider text-indigo-700">Wellness Note</p>
              </div>
              <p className="text-xs leading-relaxed text-indigo-900/70">
                This AI companion provides wellness guidance and support suggestions. It is not a substitute for professional mental health care. If you're in crisis, please reach out to emergency services.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
