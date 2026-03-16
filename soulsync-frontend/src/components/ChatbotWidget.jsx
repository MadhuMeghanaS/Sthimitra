import React, { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Send, Bot, Sparkles, ExternalLink, ChevronDown, ChevronUp } from 'lucide-react'

const getBotReply = (msg) => {
  const m = msg.toLowerCase()
  if (m.match(/anxi|panic|fear|worry/)) return { text: "Anxiety can feel overwhelming, but you're not alone 💙 Try box breathing right now: inhale 4s → hold 4s → exhale 4s → hold 4s. Our Breathing Exercises activity and the Anxiety Support community can provide ongoing help.", chips: ['Breathing Exercises', 'Anxiety Support', 'CBT Therapy'] }
  if (m.match(/stress|overwhelm|pressure|burnout/)) return { text: "Stress builds up quietly. A nature walk or short meditation can reset your nervous system in minutes. For deeper support, our Work Stress community has thousands of members who understand exactly what you're going through.", chips: ['Meditation', 'Nature Walk', 'Work Stress Community'] }
  if (m.match(/sad|depress|low|lonely|hopeless/)) return { text: "Feeling low is valid, and reaching out like this takes courage 💜 Journaling your thoughts or trying Art Therapy can help process emotions. The Depression Support community is a safe, compassionate space.", chips: ['Journaling', 'Art Therapy', 'Depression Support'] }
  if (m.match(/sleep|insomnia|tired|exhaust/)) return { text: "Poor sleep deeply impacts everything else. Try Music Relaxation or Progressive Relaxation before bed. Limiting screens 1 hour before sleep is one of the most evidence-backed improvements you can make.", chips: ['Music Relaxation', 'Progressive Relaxation', 'Mindfulness Therapy'] }
  if (m.match(/calm|relax|peace|breath|mindful/)) return { text: "Finding calm is a practice, not a destination 🌿 Here are my top suggestions: 5-minute Breathing Exercises, a guided Meditation session, or gentle Yoga. The Mindfulness Circle community shares daily practices.", chips: ['Breathing Exercises', 'Meditation', 'Yoga'] }
  if (m.match(/focus|concentrat|distract/)) return { text: "Difficulty focusing often signals mental fatigue. Try the Pomodoro technique: 25 minutes of focus, 5 minute break. Meditation has strong research backing for improving attention span over time.", chips: ['Meditation', 'Journaling', 'CBT Therapy'] }
  return { text: "I'm your SoulSync wellness companion 💙 You can share how you're feeling — whether it's stress, anxiety, low mood, sleep trouble, or anything else — and I'll suggest personalized activities, therapy approaches, and communities to support you.", chips: ['I feel anxious', 'I need to relax', 'Help with sleep'] }
}

export default function ChatbotWidget() {
  const [msgs, setMsgs] = useState([
    { from: 'bot', text: "Hi! I'm your SoulSync wellness companion 💙 How are you feeling today? Tell me what's on your mind.", chips: ['I feel stressed', 'I feel anxious', 'Help me sleep', 'I need to calm down'] }
  ])
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const [collapsed, setCollapsed] = useState(false)
  const endRef = useRef(null)

  useEffect(() => { if (!collapsed) endRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [msgs, collapsed])

  const send = (text) => {
    const msg = text || input.trim()
    if (!msg) return
    setMsgs(p => [...p, { from: 'user', text: msg }])
    setInput('')
    setTyping(true)
    setTimeout(() => {
      setTyping(false)
      setMsgs(p => [...p, { from: 'bot', ...getBotReply(msg) }])
    }, 1000 + Math.random() * 600)
  }

  return (
    <div className="w-full bg-white rounded-2xl border border-soul-border shadow-soul overflow-hidden">
      {/* Header - clickable to collapse */}
      <button onClick={() => setCollapsed(!collapsed)}
        className="w-full flex items-center justify-between px-5 py-4 border-b border-soul-border hover:bg-soul-bg transition-colors"
        style={{ background: 'linear-gradient(135deg, #EBF5FB, #F3F2FF)' }}>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #5DADE2, #A29BFE)' }}>
            <Bot size={18} color="white" />
          </div>
          <div className="text-left">
            <p className="font-semibold text-soul-text text-sm">SoulSync AI Companion</p>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-mint animate-pulse-glow" style={{ background: '#55E6C1' }} />
              <span className="text-xs text-soul-muted">Online · Quick reply mode</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link to="/chat" onClick={e => e.stopPropagation()}
            className="flex items-center gap-1 text-xs text-blue-calm font-semibold hover:underline px-3 py-1.5 rounded-lg bg-blue-pale">
            <ExternalLink size={12} /> Full Chat
          </Link>
          {collapsed ? <ChevronDown size={16} className="text-soul-muted" /> : <ChevronUp size={16} className="text-soul-muted" />}
        </div>
      </button>

      {!collapsed && (
        <>
          {/* Messages - compact height */}
          <div className="h-52 overflow-y-auto px-5 py-4 flex flex-col gap-3" style={{ background: '#FAFCFF' }}>
            {msgs.map((m, i) => (
              <div key={i} className={`flex flex-col ${m.from === 'user' ? 'items-end' : 'items-start'}`}>
                {m.from === 'bot' && (
                  <div className="w-5 h-5 rounded-md flex items-center justify-center mb-1"
                    style={{ background: 'linear-gradient(135deg, #5DADE2, #A29BFE)' }}>
                    <Bot size={11} color="white" />
                  </div>
                )}
                <div className={m.from === 'user' ? 'bubble-user' : 'bubble-bot'}>{m.text}</div>
                {m.chips && m.from === 'bot' && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {m.chips.map(c => (
                      <button key={c} onClick={() => send(c)}
                        className="text-xs px-3 py-1 rounded-full border border-blue-light text-blue-dark bg-blue-pale hover:bg-blue-calm hover:text-white hover:border-blue-calm transition-all">
                        {c}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
            {typing && (
              <div className="flex items-start gap-2">
                <div className="w-5 h-5 rounded-md flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg, #5DADE2, #A29BFE)' }}>
                  <Bot size={11} color="white" />
                </div>
                <div className="bubble-bot flex items-center gap-1 py-3">
                  {[0,1,2].map(i => (
                    <span key={i} className="w-2 h-2 rounded-full animate-bounce"
                      style={{ background: '#AED6F1', animationDelay: `${i * 0.15}s` }} />
                  ))}
                </div>
              </div>
            )}
            <div ref={endRef} />
          </div>

          {/* Input */}
          <div className="px-4 py-3 border-t border-soul-border flex gap-2 items-center bg-white">
            <input value={input} onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && send()}
              placeholder="Tell me how you're feeling..."
              className="soul-input flex-1 py-2.5 text-sm" />
            <button onClick={() => send()} disabled={!input.trim()}
              className="btn-soul w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 disabled:opacity-40 disabled:transform-none disabled:shadow-none">
              <span><Send size={15} /></span>
            </button>
          </div>
        </>
      )}
    </div>
  )
}
