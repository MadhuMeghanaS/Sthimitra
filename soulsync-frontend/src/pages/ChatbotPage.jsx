import React, { useState, useRef, useEffect } from 'react'
import { Send, Bot, Sparkles, RefreshCw, ExternalLink, Lightbulb } from 'lucide-react'

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
    text: "Hello! I'm your SoulSync wellness companion 💙 I'm here to provide personalized mental wellness guidance.\n\nYou can tell me about:\n• How you're feeling emotionally\n• Stress or anxiety you're experiencing\n• Sleep difficulties\n• Focus or concentration problems\n• Relationship or work stress\n\nI'll suggest evidence-based activities, explain therapy approaches, and point you toward supportive communities. What's on your mind?",
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
      text: "Hello! I'm your SoulSync wellness companion 💙\n\nI'm trained to provide thoughtful, evidence-based mental wellness guidance. Share how you're feeling — whether it's stress, anxiety, low mood, sleep issues, or anything else — and I'll give you personalized recommendations.\n\nWhat would you like to explore today?",
      chips: ['I feel anxious', 'I feel stressed', "I can't sleep", 'I need to relax', 'I feel low'],
    }
  ])
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const endRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [msgs, typing])

  const send = (text) => {
    const msg = text || input.trim()
    if (!msg) return
    setMsgs(p => [...p, { from: 'user', text: msg }])
    setInput('')
    setTyping(true)
    setTimeout(() => {
      setTyping(false)
      setMsgs(p => [...p, { from: 'bot', ...getBotReply(msg) }])
      inputRef.current?.focus()
    }, 900 + Math.random() * 700)
  }

  const reset = () => {
    setMsgs([{ from: 'bot', text: "Fresh start! What's on your mind today? 💙", chips: ['I feel anxious', 'I feel stressed', "I can't sleep", 'I need to relax'] }])
  }

  return (
    <div className="pt-20 min-h-screen flex flex-col" style={{ background: 'linear-gradient(160deg, #EBF5FB, #F4F7FB, #F3F2FF)' }}>
      <div className="max-w-5xl mx-auto w-full px-4 py-8 flex flex-col flex-1 gap-6">

        {/* Header */}
        <div className="text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-blue mb-4">
            <Sparkles size={14} style={{ color: '#5DADE2' }} />
            <span className="text-xs font-semibold text-blue-dark">AI Wellness Companion</span>
          </div>
          <h1 className="font-display text-4xl font-bold text-soul-text mb-2">SoulSync Chat</h1>
          <p className="text-soul-muted text-sm">Evidence-based wellness guidance, available 24/7</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-5 flex-1">

          {/* Main chat panel */}
          <div className="flex-1 flex flex-col bg-white rounded-2xl shadow-soul border border-soul-border overflow-hidden" style={{ minHeight: '520px' }}>
            {/* Chat header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-soul-border"
              style={{ background: 'linear-gradient(135deg, #EBF5FB, #F3F2FF)' }}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-soul"
                  style={{ background: 'linear-gradient(135deg, #5DADE2, #A29BFE)' }}>
                  <Bot size={20} color="white" />
                </div>
                <div>
                  <p className="font-semibold text-soul-text text-sm">SoulSync Assistant</p>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full" style={{ background: '#55E6C1', boxShadow: '0 0 6px rgba(85,230,193,0.6)' }} />
                    <span className="text-xs text-soul-muted">Online · Responds instantly</span>
                  </div>
                </div>
              </div>
              <button onClick={reset}
                className="p-2 rounded-xl text-soul-muted hover:bg-white hover:text-blue-calm transition-all"
                title="Start new conversation">
                <RefreshCw size={15} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-5 py-5 flex flex-col gap-4" style={{ background: '#FAFCFF', minHeight: 0 }}>
              {msgs.map((m, i) => (
                <div key={i} className={`flex flex-col gap-2 ${m.from === 'user' ? 'items-end' : 'items-start'} animate-fade-up`}>
                  {m.from === 'bot' && (
                    <div className="flex items-center gap-1.5">
                      <div className="w-6 h-6 rounded-lg flex items-center justify-center"
                        style={{ background: 'linear-gradient(135deg, #5DADE2, #A29BFE)' }}>
                        <Bot size={12} color="white" />
                      </div>
                      <span className="text-xs text-soul-muted font-medium">SoulSync</span>
                    </div>
                  )}
                  <div className={m.from === 'user' ? 'bubble-user' : 'bubble-bot'}>
                    {m.text.split('\n').map((line, j) => (
                      <span key={j}>{line}{j < m.text.split('\n').length - 1 && <br />}</span>
                    ))}
                  </div>
                  {m.chips && (
                    <div className="flex flex-wrap gap-1.5">
                      {m.chips.map(c => (
                        <button key={c} onClick={() => send(c)}
                          className="text-xs px-3 py-1.5 rounded-full border border-lavender-light text-lavender-dark bg-lavender-pale hover:bg-lavender hover:text-white hover:border-lavender transition-all font-medium">
                          {c}
                        </button>
                      ))}
                    </div>
                  )}
                  {m.resources?.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {m.resources.map(r => (
                        <a key={r.path} href={r.path}
                          className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-full bg-blue-pale text-blue-dark border border-blue-light hover:bg-blue-calm hover:text-white transition-all font-semibold">
                          <ExternalLink size={10} /> {r.label}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {typing && (
                <div className="flex items-start gap-2 animate-fade-up">
                  <div className="w-6 h-6 rounded-lg flex items-center justify-center"
                    style={{ background: 'linear-gradient(135deg, #5DADE2, #A29BFE)' }}>
                    <Bot size={12} color="white" />
                  </div>
                  <div className="bubble-bot flex items-center gap-1.5 py-4">
                    {[0, 1, 2].map(i => (
                      <span key={i} className="w-2.5 h-2.5 rounded-full animate-bounce"
                        style={{ background: '#AED6F1', animationDelay: `${i * 0.18}s` }} />
                    ))}
                  </div>
                </div>
              )}
              <div ref={endRef} />
            </div>

            {/* Input bar */}
            <div className="px-4 py-3.5 border-t border-soul-border bg-white flex gap-3 items-end">
              <textarea
                ref={inputRef}
                rows={1}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() } }}
                placeholder="Share how you're feeling, ask for guidance..."
                className="soul-input flex-1 resize-none py-3 text-sm"
                style={{ maxHeight: '120px', overflowY: 'auto' }}
              />
              <button onClick={() => send()} disabled={!input.trim()}
                className="btn-soul w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 disabled:opacity-40 disabled:transform-none disabled:shadow-none">
                <span><Send size={16} /></span>
              </button>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:w-64 flex flex-col gap-4">
            {/* Conversation starters */}
            <div className="bg-white rounded-2xl border border-soul-border shadow-soul p-5">
              <div className="flex items-center gap-2 mb-4">
                <Lightbulb size={15} style={{ color: '#A29BFE' }} />
                <h3 className="font-semibold text-soul-text text-sm">Conversation Starters</h3>
              </div>
              <div className="flex flex-col gap-2">
                {prompts.map(p => (
                  <button key={p} onClick={() => send(p)}
                    className="text-left text-xs text-soul-muted px-3 py-2.5 rounded-xl hover:bg-soul-bg hover:text-soul-text transition-all border border-transparent hover:border-soul-border leading-relaxed">
                    "{p}"
                  </button>
                ))}
              </div>
            </div>

            {/* Disclaimer */}
            <div className="rounded-2xl p-4 text-xs leading-relaxed" style={{ background: 'rgba(162,155,254,0.08)', border: '1px solid rgba(162,155,254,0.2)', color: '#7F8C8D' }}>
              <p className="font-semibold text-lavender-dark mb-1">Important Note</p>
              This AI companion provides wellness guidance and support suggestions. It is not a substitute for professional mental health care. If you're in crisis, please reach out to a qualified mental health professional or emergency services.
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
