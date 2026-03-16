import React, { useState } from 'react'
import { X, ArrowRight, ArrowLeft, CheckCircle, AlertCircle, AlertTriangle, Sparkles, Loader2 } from 'lucide-react'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

const questions = [
  { id: 1, text: 'How many hours of quality sleep are you getting on average?',
    options: ['7–9 hours consistently', '6–7 hours, mostly okay', '4–6 hours, often disrupted', 'Under 4 hours or very poor'] },
  { id: 2, text: 'How often do you feel overwhelmed by your responsibilities?',
    options: ['Rarely — I feel in control', 'Sometimes, but I manage', 'Often, it feels too much', 'Almost daily, unbearable'] },
  { id: 3, text: 'How is your ability to focus on tasks throughout the day?',
    options: ['Sharp and clear focus', 'Slight distractions', 'Hard to concentrate', 'Cannot focus at all'] },
  { id: 4, text: 'How would you describe your energy levels?',
    options: ['Energized all day', 'Some afternoon dips', 'Frequently fatigued', 'Exhausted constantly'] },
  { id: 5, text: 'How often do you experience physical tension (headaches, tight shoulders, chest tightness)?',
    options: ['Never', 'Occasionally', 'Several times a week', 'Daily or constantly'] },
  { id: 6, text: 'How connected do you feel to people around you?',
    options: ['Very connected and supported', 'Generally okay', 'Somewhat isolated', 'Very lonely/disconnected'] },
  { id: 7, text: 'How often do you experience racing thoughts or anxiety?',
    options: ['Rarely or never', 'Sometimes', 'Often', 'Almost all the time'] },
  { id: 8, text: 'How satisfied are you with your work-life balance?',
    options: ['Very satisfied', 'Somewhat balanced', 'Mostly unbalanced', 'Completely burnt out'] },
  { id: 9, text: 'How often do you engage in activities you genuinely enjoy?',
    options: ['Daily — I make time for myself', 'A few times a week', 'Rarely', 'Never — no time or energy'] },
  { id: 10, text: 'When you face a setback or challenge, how do you cope?',
    options: ['I handle it calmly', 'I manage after some effort', 'I struggle significantly', 'I feel completely lost'] },
]

const levels = {
  Low:      { icon: CheckCircle,   color: '#55E6C1', bg: '#EAFAF5', border: 'rgba(85,230,193,0.3)',  label: 'Low Stress',      desc: "You're doing well! Your stress levels are manageable. Keep nurturing your healthy habits and practices." },
  Moderate: { icon: AlertCircle,   color: '#F39C12', bg: '#FEF9E7', border: 'rgba(243,156,18,0.3)',  label: 'Moderate Stress', desc: "You're experiencing some stress. Consider building in more self-care routines and exploring calming activities." },
  High:     { icon: AlertTriangle, color: '#E74C3C', bg: '#FDEDEC', border: 'rgba(231,76,60,0.3)',   label: 'High Stress',     desc: 'Your stress levels are elevated. We strongly recommend exploring therapy options and connecting with supportive communities.' },
}

const recMap = {
  Low:      { activities: ['Meditation', 'Nature Walk', 'Gratitude Practice'],        communities: ['Mindfulness Circle', 'Wellness Enthusiasts'], therapies: ['Mindfulness Therapy', 'Art Therapy'] },
  Moderate: { activities: ['Yoga', 'Breathing Exercises', 'Journaling'],              communities: ['Work Stress', 'Academic Stress'],              therapies: ['CBT', 'Mindfulness Therapy', 'Group Therapy'] },
  High:     { activities: ['Breathing Exercises', 'Meditation', 'Progressive Relax'], communities: ['Anxiety Support', 'Depression Support'],        therapies: ['CBT', 'Group Therapy', 'Music Therapy'] },
}

export default function StressAssessment({ onClose }) {
  const { user, refreshUser } = useAuth()
  const [step,    setStep]    = useState(0)
  const [answers, setAnswers] = useState({})
  const [result,  setResult]  = useState(null)
  const [saving,  setSaving]  = useState(false)

  const q   = questions[step]
  const pct = ((step + 1) / questions.length) * 100
  const cur = answers[q?.id]

  const pick = (idx) => setAnswers(p => ({ ...p, [q.id]: idx + 1 }))

  const next = async () => {
    if (step < questions.length - 1) {
      setStep(s => s + 1)
      return
    }

    // Final step — calculate result
    const score = Object.values(answers).reduce((a, b) => a + b, 0)
    const level = score <= 15 ? 'Low' : score <= 25 ? 'Moderate' : 'High'
    const res   = { level, score, ...levels[level], recs: recMap[level] }
    setResult(res)

    // Save to DB if logged in
    if (user) {
      setSaving(true)
      try {
        await axios.post('/api/assessments', {
          answers: Object.entries(answers).map(([qId, answer]) => ({
            questionId:   Number(qId),
            questionText: questions.find(q => q.id === Number(qId))?.text || '',
            answer,
          })),
        })
        await refreshUser()   // profile Assessments tab will now show this result
        toast.success('Assessment saved to your profile! 📊')
      } catch (err) {
        console.warn('Assessment save failed:', err?.message)
        // Still show result locally even if save failed
      } finally {
        setSaving(false)
      }
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center modal-overlay"
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="bg-white rounded-2xl shadow-soul-hover w-full max-w-lg mx-4 overflow-hidden animate-slide-up">

        {/* Progress bar */}
        <div className="h-1.5 bg-soul-bg">
          {!result
            ? <div className="h-full progress-soul transition-all duration-500 rounded-full" style={{ width: `${pct}%` }} />
            : <div className="h-full w-full rounded-full" style={{ background: result.color }} />
          }
        </div>

        <div className="p-8">
          <div className="flex items-center justify-between mb-6">
            <span className="tag-blue">Stress Assessment</span>
            <button onClick={onClose} className="p-2 rounded-xl text-soul-muted hover:bg-soul-bg">
              <X size={18} />
            </button>
          </div>

          {/* Question screen */}
          {!result ? (
            <>
              <p className="text-xs text-soul-muted font-medium mb-1">Question {step + 1} of {questions.length}</p>
              <h3 className="font-display text-xl font-semibold text-soul-text mb-6 leading-snug">{q.text}</h3>

              <div className="space-y-3 mb-8">
                {q.options.map((opt, i) => (
                  <button key={i} onClick={() => pick(i)}
                    className={`w-full text-left px-4 py-3.5 rounded-xl text-sm font-medium transition-all border-2 ${
                      cur === i + 1
                        ? 'border-blue-calm bg-blue-pale text-blue-dark'
                        : 'border-soul-border text-soul-text hover:border-blue-light hover:bg-blue-pale'
                    }`}>
                    <span className={`mr-3 inline-flex w-5 h-5 rounded-full border-2 items-center justify-center text-xs ${
                      cur === i + 1 ? 'border-blue-calm bg-blue-calm text-white' : 'border-gray-300'
                    }`}>
                      {cur === i + 1 && '✓'}
                    </span>
                    {opt}
                  </button>
                ))}
              </div>

              <div className="flex gap-3">
                {step > 0 && (
                  <button onClick={() => setStep(s => s - 1)}
                    className="flex items-center gap-1.5 px-5 py-3 rounded-xl border-2 border-soul-border text-soul-muted text-sm font-medium hover:border-blue-light hover:text-blue-calm transition-all">
                    <ArrowLeft size={15} /> Back
                  </button>
                )}
                <button onClick={next} disabled={!cur}
                  className="btn-soul flex-1 py-3 rounded-xl text-sm flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none">
                  <span>{step === questions.length - 1 ? 'See My Results' : 'Next Question'}</span>
                  <ArrowRight size={15} className="relative z-10" />
                </button>
              </div>
            </>
          ) : (
            /* Result screen */
            <div className="text-center animate-fade-up">
              <div className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4"
                style={{ background: result.bg, border: `2px solid ${result.border}` }}>
                {saving
                  ? <Loader2 size={38} className="animate-spin" style={{ color: result.color }} />
                  : <result.icon size={38} style={{ color: result.color }} />
                }
              </div>

              <h3 className="font-display text-2xl font-bold mb-1" style={{ color: result.color }}>
                {result.label}
              </h3>
              <p className="text-xs text-soul-muted mb-1">Score: {result.score}/40</p>

              {/* Saved status */}
              <p className="text-xs mb-5" style={{ color: result.color }}>
                {saving
                  ? '⏳ Saving to your profile...'
                  : user
                    ? '✅ Saved to your profile — check Profile → Assessments'
                    : '💡 Sign in to save your assessment history'
                }
              </p>

              <p className="text-sm text-soul-muted mb-6 leading-relaxed max-w-sm mx-auto">{result.desc}</p>

              <div className="space-y-3 text-left mb-6">
                {[
                  { key: 'activities',  label: 'Recommended Activities', tagClass: 'tag-blue' },
                  { key: 'communities', label: 'Suggested Communities',  tagClass: 'tag-lavender' },
                  { key: 'therapies',   label: 'Therapy Options',        tagClass: 'tag-mint' },
                ].map(({ key, label, tagClass }) => (
                  <div key={key} className="p-3.5 rounded-xl" style={{ background: '#F4F7FB' }}>
                    <p className="text-xs font-semibold text-soul-muted uppercase tracking-wide mb-2">{label}</p>
                    <div className="flex flex-wrap gap-2">
                      {result.recs[key].map(item => (
                        <span key={item} className={tagClass}>{item}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <button onClick={onClose}
                className="btn-soul w-full py-3 rounded-xl text-sm flex items-center justify-center gap-2">
                <span>Explore Recommendations</span>
                <Sparkles size={15} className="relative z-10" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
