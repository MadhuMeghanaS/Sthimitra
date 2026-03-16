import React, { useState } from 'react'
import { X, Eye, EyeOff, Sparkles, Mail, Lock, User } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

export default function AuthModal({ onClose }) {
  const [mode, setMode] = useState('login')
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const { login, register } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    const res = mode === 'login'
      ? await login(form.email, form.password)
      : await register(form.name, form.email, form.password)
    setLoading(false)
    if (res.success) {
      toast.success(mode === 'login' ? 'Welcome back! 💙' : 'Welcome to SoulSync! ✨')
      onClose()
    } else {
      toast.error(res.message)
    }
  }

  const set = (k) => (e) => setForm(p => ({ ...p, [k]: e.target.value }))

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center modal-overlay"
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="bg-white rounded-2xl shadow-soul-hover w-full max-w-md mx-4 overflow-hidden animate-slide-up">
        {/* Top gradient bar */}
        <div className="h-1.5" style={{ background: 'linear-gradient(90deg, #5DADE2, #A29BFE, #55E6C1)' }} />

        <div className="p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #5DADE2, #A29BFE)' }}>
                <Sparkles size={15} color="white" />
              </div>
              <span className="font-display text-lg font-semibold gradient-text">SoulSync</span>
            </div>
            <button onClick={onClose} className="p-2 rounded-xl text-soul-muted hover:bg-soul-bg">
              <X size={18} />
            </button>
          </div>

          <h2 className="font-display text-2xl font-bold text-soul-text mb-1">
            {mode === 'login' ? 'Welcome back' : 'Begin your journey'}
          </h2>
          <p className="text-sm text-soul-muted mb-6">
            {mode === 'login' ? 'Sign in to continue your wellness journey' : 'Create your free account'}
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <div className="relative">
                <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-blue-calm opacity-60" />
                <input value={form.name} onChange={set('name')} placeholder="Full name"
                  required className="soul-input pl-10" />
              </div>
            )}
            <div className="relative">
              <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-blue-calm opacity-60" />
              <input type="email" value={form.email} onChange={set('email')} placeholder="Email address"
                required className="soul-input pl-10" />
            </div>
            <div className="relative">
              <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-blue-calm opacity-60" />
              <input type={showPw ? 'text' : 'password'} value={form.password} onChange={set('password')}
                placeholder="Password" required className="soul-input pl-10 pr-10" />
              <button type="button" onClick={() => setShowPw(!showPw)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-soul-muted hover:text-blue-calm">
                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            <button type="submit" disabled={loading}
              className="btn-soul w-full py-3 rounded-xl text-sm disabled:opacity-60">
              <span className="flex items-center justify-center gap-2">
                {loading && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                {mode === 'login' ? 'Sign In' : 'Create Account'}
              </span>
            </button>
          </form>

          <p className="text-center text-sm text-soul-muted mt-5">
            {mode === 'login' ? "Don't have an account? " : "Already have an account? "}
            <button onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
              className="text-blue-calm font-semibold hover:underline">
              {mode === 'login' ? 'Sign up free' : 'Sign in'}
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}
