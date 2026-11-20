/*

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
  return { text: "I'm your Sthimitra wellness companion 💙 You can share how you're feeling — whether it's stress, anxiety, low mood, sleep trouble, or anything else — and I'll suggest personalized activities, therapy approaches, and communities to support you.", chips: ['I feel anxious', 'I need to relax', 'Help with sleep'] }
}

export default function ChatbotWidget() {
  const [msgs, setMsgs] = useState([
    { from: 'bot', text: "Hi! I'm your Sthimitra wellness companion 💙 How are you feeling today? Tell me what's on your mind.", chips: ['I feel stressed', 'I feel anxious', 'Help me sleep', 'I need to calm down'] }
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
      
      <button onClick={() => setCollapsed(!collapsed)}
        className="w-full flex items-center justify-between px-5 py-4 border-b border-soul-border hover:bg-soul-bg transition-colors"
        style={{ background: 'linear-gradient(135deg, #EBF5FB, #F3F2FF)' }}>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #5DADE2, #A29BFE)' }}>
            <Bot size={18} color="white" />
          </div>
          <div className="text-left">
            <p className="font-semibold text-soul-text text-sm">Sthimitra AI Companion</p>
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


*/




// ============================================================
//  Sthimitra — AI Stress Coach Chat
//  File: src/components/ChatbotWidget.jsx
//
//  LLM: Google Gemini 1.5 Flash (FREE)
//  Get API key: https://aistudio.google.com/app/apikey
//  Replace YOUR_GEMINI_API_KEY below or use .env
// ============================================================

import React, { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Send, Bot, ExternalLink, ChevronDown, ChevronUp, X, RefreshCw } from 'lucide-react'

// ─────────────────────────────────────────────────────────────
//  CONFIG  —  paste your Groq API key in .env as VITE_GROQ_API_KEY
// ─────────────────────────────────────────────────────────────
const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY || ""
// ✅ NEW — Groq free‑tier endpoint (OpenAI compatible)
const GROQ_URL = `https://api.groq.com/openai/v1/chat/completions`

// ─────────────────────────────────────────────────────────────
//  SYSTEM PROMPT  — original prompt restored + relationship support added
// ─────────────────────────────────────────────────────────────
const SYSTEM_PROMPT = `
You are Sthimitra AI — a warm, emotionally supportive companion who talks like a close, understanding friend.

Your goal is to make the user feel heard, safe, and supported — not rushed or analyzed.

You are NOT just a wellness assistant. You are someone the user can open up to about anything:
stress, relationships, loneliness, overthinking, career pressure, family issues, sibling conflicts,
friendship problems, romantic issues, or just a bad day.

=== CORE BEHAVIOR ===
- Listen deeply and respond with empathy
- Talk like a real human friend, not a chatbot
- Let the conversation flow naturally
- Support ALL kinds of emotional situations (not just stress)
- ALWAYS respond to the actual topic the user brings up — never ignore it

=== HOW TO RESPOND ===

1. Start with emotional understanding:
   - Acknowledge what they're feeling
   - Validate it genuinely (don't sound generic)

2. Reflect + connect:
   - Show you understand their situation
   - Sometimes relate gently (without making it about you)

3. Gently explore (optional but preferred):
   - Ask 1–2 soft, open-ended questions
   - Never interrogate

4. Offer support:
   - Give small, realistic suggestions (only if needed)
   - Sometimes just being there is enough

5. If relevant, suggest Sthimitra features naturally (not forced)

=== TONE & STYLE ===
- Warm, calm, caring
- Slightly casual, like texting a close friend
- Emotionally intelligent
- Never judgmental
- Never overly cheerful when user is low
- Use emojis lightly (💙 🌿 🧘 🌊)

=== IMPORTANT RULES ===
- DO NOT sound robotic, scripted, or clinical
- DO NOT jump straight to solutions
- DO NOT overwhelm with too many suggestions
- DO NOT diagnose mental health conditions
- If user mentions self-harm or extreme distress:
  → Respond with care and encourage seeking professional help gently

=== RELATIONSHIP & FAMILY SUPPORT ===
When user talks about sisters, brothers, parents, friends, partners or any relationship:
- Take it seriously and respond with genuine empathy
- Ask what happened or how long it's been going on
- Help them process their feelings first
- Only suggest practical steps after they feel heard
- Example for sister issue: acknowledge the pain of sibling conflict, ask what's happening,
  validate that family relationships can be the hardest ones

=== FLEXIBILITY ===
- You can write short OR longer responses depending on the situation
- If user shares deeply → respond with depth
- If user is casual → keep it light and friendly

=== APP INTEGRATION (SOFT, NATURAL) ===
Only suggest when it feels helpful:

Examples:
- "Maybe a quick breathing reset could help a bit right now"
- "You could try writing this out in the gratitude journal"
- "There's a 7-day reset challenge if you want something structured"

Suggestions should feel like a friend recommending something, NOT a feature list

==================================================
=== SOULSYNC APP COMPLETE GUIDE ===

APP SECTIONS YOU CAN GUIDE USERS TO:

1. HOME DASHBOARD (/home)
   - Shows today's stress level (1-10 orb)
   - Displays recommended activity
   - Shows nearby relaxation places
   - Upcoming workshops & today's micro activity
   - Wellness progress tracking

2. DAILY MICRO ACTIVITIES (/activities)
   - 1-Minute Resets: 4-7-8 Breathing, Cold Water Reset
   - 5-Minute Resets: Gratitude Journal, Body Stretch
   - 10-Minute Resets: Mindful Walk, Calming Music
   - Users can mark activities as completed

3. RELAXATION PLACES (/places)
   - Map of peaceful spots nearby
   - Parks, forests, lakes, meditation centers
   - Each place has: photos, description, relaxation score, distance
   - Can get directions to any place

4. WELLNESS WORKSHOPS & EVENTS (/workshops)
   - Breathwork Immersion (Free)
   - Sound Healing Circle ($25)
   - Mindfulness for Burnout (Free)
   - Restorative Yoga ($15)
   - Aromatherapy Session ($30)
   - Users can book directly in app

5. THERAPY DISCOVERY (/therapies)
   - Meditation Therapy
   - Yoga Therapy
   - Breathwork Therapy
   - Sound Healing
   - Aromatherapy
   - Each has therapist details and booking option

6. COMMUNITY CHALLENGES (/challenges)
   - 7-Day Stress Reset (most popular)
   - 21-Day Mindfulness Challenge
   - 30-Day Digital Detox
   - Progress tracking + invite friends

7. USER PROFILE (/profile)
   - Stress history charts
   - Completed activities log
   - Workshop bookings
   - Challenge progress

==================================================
=== HOW TO USE APP KNOWLEDGE ===

- Use this information ONLY when relevant to the user's situation
- Do NOT dump all features at once
- Explain features in a friendly, conversational way

==================================================
=== RESPONSE FORMAT (STRICT) ===

You MUST respond ONLY in this JSON format. No text before or after:
{
  "message": "A warm, natural, human-like response",
  "suggestions": ["Short optional suggestion", "Max 2-3 only when relevant"]
}

suggestions can be [] if no app feature fits naturally.

==================================================
=== EXAMPLES ===

User: "I feel like I'm not good enough compared to others"
{
  "message": "Hey… that feeling can be really heavy 💙 It's honestly so easy to fall into that comparison loop, especially when it feels like everyone else is doing better. But just because it looks that way doesn't mean you're falling behind. You're on your own path, even if it doesn't feel clear right now. What's been making you feel this way lately?",
  "suggestions": ["Open Gratitude Journal", "Start 7-Day Stress Reset"]
}

User: "I'm having issues with my sister"
{
  "message": "Aw, sibling stuff can hit really different 💙 Because you're so close, the conflicts feel so much more personal. Whether it's a fight, distance, or just not feeling understood — it genuinely hurts. What's been going on between you two lately?",
  "suggestions": ["Open Gratitude Journal", "Try 5-min Journaling"]
}

User: "I feel stressed about exams"
{
  "message": "Exam pressure is so real and exhausting — especially when it feels like everything is riding on one moment. Are you more stressed about the studying itself, or that fear of how it'll go on the day?",
  "suggestions": ["Try 4-7-8 Breathing", "Join 7-Day Reset Challenge"]
}
`

// ─────────────────────────────────────────────────────────────
//  ROBUST JSON PARSER  — handles messy Gemini output
// ─────────────────────────────────────────────────────────────
function parseGroqResponse(raw) {
  if (!raw) return null

  // 1. Try direct parse
  try { return JSON.parse(raw) } catch (_) { }

  // 2. Try extracting JSON block from markdown fences
  const fenceMatch = raw.match(/```(?:json)?\s*([\s\S]*?)```/)
  if (fenceMatch) {
    try { return JSON.parse(fenceMatch[1].trim()) } catch (_) { }
  }

  // 3. Try extracting first {...} block
  const braceMatch = raw.match(/\{[\s\S]*\}/)
  if (braceMatch) {
    try { return JSON.parse(braceMatch[0]) } catch (_) { }
  }

  // 4. Fallback — treat the whole thing as a plain message
  return { message: raw.trim(), suggestions: [] }
}

// ─────────────────────────────────────────────────────────────
//  CALL GROQ
// ─────────────────────────────────────────────────────────────
async function callGroq(conversationHistory) {
  // Build Groq‑compatible messages array (OpenAI style)
  const messages = []
  // System prompt
  messages.push({ role: 'system', content: SYSTEM_PROMPT })
  for (const msg of conversationHistory) {
    messages.push({ role: msg.from === 'user' ? 'user' : 'assistant', content: msg.text })
  }

  const body = {
    model: 'llama-3.1-8b-instant',
    temperature: 0.85,
    max_tokens: 500,
    top_p: 0.9,
    stream: false,
    messages
  }

  const res = await fetch(GROQ_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${GROQ_API_KEY}`
    },
    body: JSON.stringify(body)
  })

  if (!res.ok) {
    const errBody = await res.text()
    throw new Error(`Groq ${res.status}: ${errBody}`)
  }

  const data = await res.json()
  // Groq returns { choices: [{ message: { content: "..." } }] }
  const rawText = data?.choices?.[0]?.message?.content || ''

  if (!rawText) throw new Error('Empty response from Groq')

  const parsed = parseGroqResponse(rawText)
  if (!parsed || !parsed.message) {
    // Fallback
    return {
      message: "I'm here with you 💙 Could you tell me a bit more about what's going on?",
      suggestions: []
    }
  }

  return parsed
}

// ─────────────────────────────────────────────────────────────
//  QUICK PROMPTS
// ─────────────────────────────────────────────────────────────
const QUICK_PROMPTS = [
  "I feel stressed 😟",
  "Having family issues",
  "I can't sleep 😴",
  "I feel anxious",
  "Feeling burnt out",
  "Relationship problems",
]

// ─────────────────────────────────────────────────────────────
//  CHAT BUBBLE
// ─────────────────────────────────────────────────────────────
function Bubble({ msg, onChipClick }) {
  const isUser = msg.from === 'user'
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: isUser ? 'flex-end' : 'flex-start',
      gap: 6,
    }}>
      {/* AI label */}
      {!isUser && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{
            width: 24, height: 24, borderRadius: 8, flexShrink: 0,
            background: 'linear-gradient(135deg, #8FAF9A, #A7C7E7)',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <Bot size={13} color="white" />
          </div>
          <span style={{ fontSize: 11, color: '#9ABAAF', fontWeight: 600 }}>Sthimitra AI</span>
        </div>
      )}

      {/* Bubble */}
      <div style={{
        maxWidth: '82%',
        padding: '11px 15px',
        borderRadius: isUser ? '18px 18px 4px 18px' : '4px 18px 18px 18px',
        background: isUser
          ? 'linear-gradient(135deg, #8FAF9A, #5C7A66)'
          : '#FFFFFF',
        color: isUser ? '#fff' : '#263832',
        fontSize: 13.5,
        lineHeight: 1.6,
        boxShadow: isUser
          ? '0 4px 14px rgba(90,122,102,.28)'
          : '0 2px 10px rgba(60,100,80,.08)',
        border: isUser ? 'none' : '1px solid #E2EDE7',
        wordBreak: 'break-word',
      }}>
        {msg.text}
      </div>

      {/* Suggestion chips */}
      {!isUser && msg.suggestions && msg.suggestions.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, maxWidth: '90%' }}>
          {msg.suggestions.map((s, i) => (
            <button
              key={i}
              onClick={() => onChipClick(s)}
              style={{
                fontSize: 11, padding: '5px 13px', borderRadius: 50,
                border: '1.5px solid #8FAF9A', background: '#EDF4F0',
                color: '#5C7A66', cursor: 'pointer', fontWeight: 600,
                transition: 'all .15s ease',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = '#8FAF9A'
                e.currentTarget.style.color = '#fff'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = '#EDF4F0'
                e.currentTarget.style.color = '#5C7A66'
              }}
            >
              {s}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
//  TYPING DOTS
// ─────────────────────────────────────────────────────────────
function TypingDots() {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
      <div style={{
        width: 24, height: 24, borderRadius: 8, flexShrink: 0,
        background: 'linear-gradient(135deg, #8FAF9A, #A7C7E7)',
        display: 'flex', alignItems: 'center', justifyContent: 'center'
      }}>
        <Bot size={13} color="white" />
      </div>
      <div style={{
        padding: '12px 18px', borderRadius: '4px 18px 18px 18px',
        background: '#fff', border: '1px solid #E2EDE7',
        boxShadow: '0 2px 10px rgba(60,100,80,.08)',
        display: 'flex', gap: 5, alignItems: 'center'
      }}>
        {[0, 1, 2].map(i => (
          <span key={i} style={{
            width: 7, height: 7, borderRadius: '50%',
            background: '#8FAF9A', display: 'inline-block',
            animation: 'dotBounce 1.2s ease-in-out infinite',
            animationDelay: `${i * 0.2}s`
          }} />
        ))}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
//  ERROR BANNER
// ─────────────────────────────────────────────────────────────
function ErrorBanner({ msg, onDismiss, onRetry }) {
  return (
    <div style={{
      background: '#FFF5F5', border: '1px solid #FECACA', borderRadius: 12,
      padding: '10px 14px', fontSize: 12, color: '#B91C1C',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8
    }}>
      <span>⚠️ {msg}</span>
      <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
        {onRetry && (
          <button onClick={onRetry} style={{
            background: '#FEE2E2', border: 'none', borderRadius: 8,
            padding: '4px 8px', cursor: 'pointer', color: '#B91C1C',
            display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, fontWeight: 600
          }}>
            <RefreshCw size={11} /> Retry
          </button>
        )}
        <button onClick={onDismiss} style={{
          background: 'none', border: 'none', cursor: 'pointer', color: '#B91C1C'
        }}>
          <X size={14} />
        </button>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
//  MAIN COMPONENT
// ─────────────────────────────────────────────────────────────
export default function ChatbotWidget({ fullPage = false }) {
  const [msgs, setMsgs] = useState([{
    from: 'bot',
    text: "Hey 👋 I'm your Sthimitra companion — you can talk to me about anything. Stress, relationships, family stuff, sleep, work pressure… whatever's on your mind. What's going on?",
    suggestions: []
  }])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [collapsed, setCollapsed] = useState(false)
  const [error, setError] = useState(null)
  const [lastUserMsg, setLastUserMsg] = useState(null)
  // API conversation history (plain text only, no suggestions/metadata)
  const [history, setHistory] = useState([])
  const scrollRef = useRef(null)

  // Auto-scroll
  useEffect(() => {
    if (!collapsed && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [msgs, collapsed, loading])

  // Inject animation CSS
  useEffect(() => {
    const id = 'ss-chat-anim'
    if (document.getElementById(id)) return
    const s = document.createElement('style')
    s.id = id
    s.textContent = `
      @keyframes dotBounce {
        0%, 80%, 100% { transform: scale(0.4); opacity: .4; }
        40% { transform: scale(1); opacity: 1; }
      }
      @keyframes spin {
        from { transform: rotate(0deg); }
        to   { transform: rotate(360deg); }
      }
    `
    document.head.appendChild(s)
  }, [])

  const sendMessage = async (text, isRetry = false) => {
    const msg = text || input.trim()
    if (!msg || loading) return

    setInput('')
    setError(null)

    // Show user bubble immediately
    if (!isRetry) {
      setMsgs(prev => [...prev, { from: 'user', text: msg }])
      setLastUserMsg(msg)
    }

    // Update API history
    const newHistory = isRetry
      ? history  // on retry, history already includes the user msg
      : [...history, { from: 'user', text: msg }]

    if (!isRetry) setHistory(newHistory)

    setLoading(true)
    try {
      const reply = await callGroq(newHistory)

      const botMsg = {
        from: 'bot',
        text: reply.message || "I'm here 💙 Tell me more.",
        suggestions: Array.isArray(reply.suggestions) ? reply.suggestions : []
      }

      setMsgs(prev => [...prev, botMsg])
      setHistory(prev => [...prev, { from: 'bot', text: reply.message }])
      setLastUserMsg(null)
    } catch (err) {
      console.error('Groq error:', err)

      let errMsg = 'Something went wrong. Please try again.'
      if (err.message.includes('401') || err.message.includes('403')) {
        errMsg = 'API key invalid. Check your VITE_GROQ_API_KEY in .env'
      } else if (err.message.includes('429')) {
        errMsg = 'Too many requests. Wait a moment and retry.'
      } else if (err.message.includes('Failed to fetch') || err.message.includes('NetworkError')) {
        errMsg = 'No internet connection. Please check your network.'
      }

      setError(errMsg)

      // On first error, remove the user bubble so they can retry cleanly
      if (!isRetry) {
        setMsgs(prev => prev.slice(0, -1))
        // Keep lastUserMsg so retry button works
      }
    } finally {
      setLoading(false)
    }
  }

  const handleRetry = () => {
    if (!lastUserMsg) return
    setError(null)
    setMsgs(prev => [...prev, { from: 'user', text: lastUserMsg }])
    const newHistory = [...history, { from: 'user', text: lastUserMsg }]
    setHistory(newHistory)
    sendMessage(lastUserMsg, true)
  }

  // ── Styles ──────────────────────────────────────────────────
  const containerStyle = fullPage
    ? {
      display: 'flex', flexDirection: 'column',
      height: '100dvh', background: '#FAFAF7',
      fontFamily: "'DM Sans', sans-serif",
    }
    : {
      width: '100%', background: '#fff',
      borderRadius: 20, overflow: 'hidden',
      border: '1px solid #E2EDE7',
      boxShadow: '0 6px 28px rgba(60,100,80,.12)',
      fontFamily: "'DM Sans', sans-serif",
    }

  return (
    <div style={containerStyle}>

      {/* ── HEADER ────────────────────────────────────────── */}
      <button
        onClick={() => !fullPage && setCollapsed(c => !c)}
        style={{
          width: '100%', display: 'flex', alignItems: 'center',
          justifyContent: 'space-between',
          padding: '14px 18px', border: 'none',
          cursor: fullPage ? 'default' : 'pointer',
          background: 'linear-gradient(135deg, #EDF4F0 0%, #D4E8F5 100%)',
          borderBottom: '1px solid #E2EDE7',
          flexShrink: 0,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 42, height: 42, borderRadius: 14,
            background: 'linear-gradient(135deg, #8FAF9A, #A7C7E7)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 14px rgba(143,175,154,.4)', flexShrink: 0
          }}>
            <Bot size={21} color="white" />
          </div>
          <div style={{ textAlign: 'left' }}>
            <p style={{ fontWeight: 700, color: '#263832', fontSize: 14 }}>
              Sthimitra AI Coach
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 2 }}>
              <span style={{
                width: 7, height: 7, borderRadius: '50%',
                background: '#7ABF82', display: 'inline-block',
                boxShadow: '0 0 6px #7ABF82AA'
              }} />
              <span style={{ fontSize: 11, color: '#5A7870' }}>
                Powered by Groq · Always here
              </span>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {!fullPage && (
            <Link
              to="/chat"
              onClick={e => e.stopPropagation()}
              style={{
                display: 'flex', alignItems: 'center', gap: 4,
                fontSize: 11, color: '#5C7A66', fontWeight: 700,
                padding: '5px 10px', borderRadius: 8,
                background: 'rgba(143,175,154,.2)', textDecoration: 'none'
              }}
            >
              <ExternalLink size={11} /> Full Chat
            </Link>
          )}
          {!fullPage && (
            collapsed
              ? <ChevronDown size={16} color="#9ABAAF" />
              : <ChevronUp size={16} color="#9ABAAF" />
          )}
        </div>
      </button>

      {/* ── BODY ──────────────────────────────────────────── */}
      {(!collapsed || fullPage) && (
        <>
          {/* Quick prompts — only on fresh conversation */}
          {msgs.length <= 1 && (
            <div style={{
              padding: '12px 16px 10px',
              display: 'flex', flexWrap: 'wrap', gap: 6,
              background: '#F5F9FF',
              borderBottom: '1px solid #E2EDE7',
              flexShrink: 0,
            }}>
              {QUICK_PROMPTS.map(p => (
                <button
                  key={p}
                  onClick={() => sendMessage(p)}
                  style={{
                    fontSize: 11.5, padding: '6px 14px', borderRadius: 50,
                    border: '1.5px solid #D4E8F5', background: '#fff',
                    color: '#5A7870', cursor: 'pointer', fontWeight: 500,
                    transition: 'all .15s ease',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = '#8FAF9A'
                    e.currentTarget.style.color = '#5C7A66'
                    e.currentTarget.style.background = '#EDF4F0'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = '#D4E8F5'
                    e.currentTarget.style.color = '#5A7870'
                    e.currentTarget.style.background = '#fff'
                  }}
                >
                  {p}
                </button>
              ))}
            </div>
          )}

          {/* Messages */}
          <div ref={scrollRef} style={{
            flex: 1,
            overflowY: 'auto',
            height: fullPage ? 'auto' : 280,
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: 16,
            background: '#FAFCFF',
          }}>
            {msgs.map((m, i) => (
              <Bubble key={i} msg={m} onChipClick={t => sendMessage(t)} />
            ))}

            {loading && <TypingDots />}

            {error && (
              <ErrorBanner
                msg={error}
                onDismiss={() => setError(null)}
                onRetry={lastUserMsg ? handleRetry : null}
              />
            )}

          </div>

          {/* Input */}
          <div style={{
            padding: '10px 12px',
            background: '#fff',
            borderTop: '1px solid #E2EDE7',
            display: 'flex',
            gap: 8,
            alignItems: 'center',
            flexShrink: 0,
          }}>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  sendMessage()
                }
              }}
              placeholder="Tell me what's on your mind..."
              disabled={loading}
              style={{
                flex: 1, border: '1.5px solid #E2EDE7', borderRadius: 14,
                padding: '10px 14px', fontSize: 13,
                color: '#263832',
                background: loading ? '#F5F8F6' : '#fff',
                outline: 'none', transition: 'border-color .2s',
                fontFamily: 'inherit',
              }}
              onFocus={e => e.target.style.borderColor = '#8FAF9A'}
              onBlur={e => e.target.style.borderColor = '#E2EDE7'}
            />
            <button
              onClick={() => sendMessage()}
              disabled={!input.trim() || loading}
              style={{
                width: 44, height: 44, borderRadius: 13, border: 'none',
                flexShrink: 0, cursor: !input.trim() || loading ? 'not-allowed' : 'pointer',
                background: !input.trim() || loading
                  ? '#E8F0EB'
                  : 'linear-gradient(135deg, #8FAF9A, #5C7A66)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: !input.trim() || loading ? 'none' : '0 4px 14px rgba(92,122,102,.35)',
                transition: 'all .2s',
              }}
            >
              {loading
                ? <span style={{
                  width: 17, height: 17,
                  border: '2.5px solid #8FAF9A',
                  borderTopColor: 'transparent',
                  borderRadius: '50%', display: 'inline-block',
                  animation: 'spin 0.7s linear infinite'
                }} />
                : <Send size={17} color={!input.trim() ? '#9ABAAF' : '#fff'} />
              }
            </button>
          </div>

          {/* Footer */}
          <p style={{
            textAlign: 'center', fontSize: 10, color: '#B0C8BE',
            padding: '5px 0 10px', background: '#fff', flexShrink: 0
          }}>
            Powered by Groq (free tier) · Not a substitute for professional mental health care
          </p>
        </>
      )}
    </div>
  )
}