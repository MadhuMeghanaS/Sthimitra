import React, { useState, useEffect } from 'react'
import {
  User, Mail, Edit3, LogOut, Save, X,
  Activity, BookOpen, Users, Calendar,
  Shield, Clock, ExternalLink, Loader2, RefreshCw
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { useNavigate, Link } from 'react-router-dom'
import axios from 'axios'
import AuthModal from '../components/AuthModal'
import toast from 'react-hot-toast'

const levelConfig = {
  Low:      { color: '#55E6C1', bg: '#EAFAF5', border: 'rgba(85,230,193,0.3)' },
  Moderate: { color: '#F39C12', bg: '#FEF9E7', border: 'rgba(243,156,18,0.3)' },
  High:     { color: '#E74C3C', bg: '#FDEDEC', border: 'rgba(231,76,60,0.3)' },
}

const tabs = [
  { id: 'overview',    label: 'Overview',    icon: User },
  { id: 'assessments', label: 'Assessments', icon: Activity },
  { id: 'activities',  label: 'Saved',       icon: BookOpen },
  { id: 'communities', label: 'Communities', icon: Users },
  { id: 'events',      label: 'Events',      icon: Calendar },
]

export default function Profile() {
  const { user, logout, updateUser, refreshUser } = useAuth()
  const navigate  = useNavigate()

  const [showAuth,     setShowAuth]     = useState(false)
  const [editing,      setEditing]      = useState(false)
  const [form,         setForm]         = useState({ name: '', email: '', bio: '' })
  const [activeTab,    setActiveTab]    = useState('overview')
  const [assessments,  setAssessments]  = useState([])
  const [loadingA,     setLoadingA]     = useState(false)
  const [saving,       setSaving]       = useState(false)
  const [refreshing,   setRefreshing]   = useState(false)

  // Local therapy-event registrations (stored in localStorage per user)
  const [localEvents, setLocalEvents] = useState([])

  // Populate form fields when user data loads
  useEffect(() => {
    if (user) {
      setForm({ name: user.name || '', email: user.email || '', bio: user.bio || '' })

      // Load locally-stored therapy event registrations
      const key     = `soulsync_events_${user._id || user.id}`
      const stored  = JSON.parse(localStorage.getItem(key) || '[]')
      setLocalEvents(stored)
    }
  }, [user])

  // Fetch assessments from DB when that tab is opened
  useEffect(() => {
    if (activeTab === 'assessments' && user) {
      setLoadingA(true)
      axios.get('/api/assessments')
        .then(({ data }) => setAssessments(data.assessments || []))
        .catch(() => toast.error('Could not load assessments'))
        .finally(() => setLoadingA(false))
    }
  }, [activeTab, user])

  // ── Not logged in ─────────────────────────────────────────────────────────
  if (!user) {
    return (
      <div className="pt-28 pb-20 min-h-screen flex items-center justify-center relative overflow-hidden bg-slate-50">
        <div className="absolute inset-0 z-0 pointer-events-none opacity-40">
          <motion.div animate={{ x: [-50, 50, -50], y: [-20, 20, -20] }} transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
            className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-indigo-300 rounded-full blur-[100px] mix-blend-multiply" />
          <motion.div animate={{ x: [50, -50, 50], y: [20, -20, 20] }} transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-cyan-300 rounded-full blur-[120px] mix-blend-multiply" />
        </div>
        <div className="text-center max-w-md px-6 relative z-10 bg-white/70 backdrop-blur-xl p-10 rounded-[3rem] shadow-2xl border border-white">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-7xl mb-6">🔐</motion.div>
          <h2 className="font-display text-3xl font-bold text-slate-800 mb-3">Sign in to view your profile</h2>
          <p className="text-slate-500 mb-8 leading-relaxed font-light">
            Track your wellness journey, saved activities, stress history, community memberships, and registered events.
          </p>
          <button onClick={() => setShowAuth(true)}
            className="btn-soul px-8 py-4 rounded-2xl text-sm w-full font-bold shadow-lg hover:-translate-y-1 transition-all"><span>Sign In / Create Account</span></button>
        </div>
        {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
      </div>
    )
  }

  // ── Actions ───────────────────────────────────────────────────────────────
  const handleSave = async () => {
    setSaving(true)
    try {
      const { data } = await axios.put('/api/users/profile', form)
      updateUser(data.user)
      setEditing(false)
      toast.success('Profile updated! ✨')
    } catch {
      toast.error('Could not update profile')
    } finally {
      setSaving(false)
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/')
    toast.success('Signed out. Take care! 💙')
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    await refreshUser()
    // Also reload local events
    const key    = `soulsync_events_${user._id || user.id}`
    const stored = JSON.parse(localStorage.getItem(key) || '[]')
    setLocalEvents(stored)
    setRefreshing(false)
    toast.success('Profile refreshed!')
  }

  // ── Derived data ──────────────────────────────────────────────────────────
  const initials         = (user.name || '').split(' ').filter(Boolean).map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'U'
  const savedActivities  = (user.savedActivities  || []).filter(Boolean)
  const joinedComms      = (user.joinedCommunities || []).filter(Boolean)
  const registeredEvents = (user.registeredEvents  || []).filter(Boolean)

  // Merge DB events + locally stored therapy events (dedup by title)
  const dbEventTitles    = new Set(registeredEvents.map(e => e.title || e.name || ''))
  const allEvents        = [
    ...registeredEvents,
    ...localEvents.filter(e => !dbEventTitles.has(e.title)),
  ]

  const latest = assessments[0]

  return (
    <div className="pt-28 pb-20 min-h-screen relative overflow-hidden bg-[#F8FAF8]">
      {/* ── Soft Ambient Animated Background ──────────────────────────────── */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-30">
        <motion.div animate={{ x: [-50, 50, -50], y: [-20, 20, -20] }} transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
          className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-200 rounded-full blur-[100px]" />
        <motion.div animate={{ x: [50, -50, 50], y: [20, -20, 20] }} transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-cyan-200 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-5xl mx-auto px-6 relative z-10">

        {/* ── Profile header ──────────────────────────────────────────── */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/80 backdrop-blur-xl rounded-[2rem] overflow-hidden border border-white shadow-xl mb-6 relative group transition-all hover:shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)]"
        >
          <div className="h-28 relative overflow-hidden"
            style={{ background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)' }}>
            {[...Array(5)].map((_, i) => (
              <motion.div 
                key={i} 
                animate={{ 
                  y: [0, -10, 0],
                  scale: [1, 1.1, 1],
                  opacity: [0.1, 0.15, 0.1]
                }}
                transition={{ 
                  duration: 4 + i, 
                  repeat: Infinity, 
                  ease: "easeInOut" 
                }}
                className="absolute rounded-full"
                style={{
                  width: `${60 + i * 30}px`, height: `${60 + i * 30}px`,
                  top: `${-10 + i * 5}px`, left: `${10 + i * 15}%`,
                  background: i % 2 === 0 ? '#4F46E5' : '#3B82F6',
                }} 
              />
            ))}
          </div>

          <div className="px-8 pb-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 -mt-8 mb-6">
              {/* Avatar */}
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="w-20 h-20 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-xl border-4 border-white z-10"
                style={{ background: 'linear-gradient(135deg, #4F46E5, #3B82F6)' }}
              >
                {initials}
              </motion.div>

              {/* Buttons */}
              <div className="flex items-center gap-2 flex-wrap">
                <button onClick={handleRefresh} disabled={refreshing}
                  title="Sync latest data from server"
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-100 text-xs text-slate-500 hover:bg-slate-50 transition-all disabled:opacity-50">
                  <RefreshCw size={13} className={refreshing ? 'animate-spin' : ''} /> Sync
                </button>
                {editing ? (
                  <>
                    <button onClick={handleSave} disabled={saving}
                      className="btn-soul flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm disabled:opacity-60 shadow-lg shadow-indigo-500/20">
                      <span className="flex items-center gap-1.5 relative z-10">
                        {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                        Save
                      </span>
                    </button>
                    <button onClick={() => setEditing(false)}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-200 text-sm text-slate-500 hover:bg-slate-50 transition-colors">
                      <X size={14} /> Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button onClick={() => setEditing(true)}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-200 text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:text-indigo-600 hover:border-indigo-200 transition-all">
                      <Edit3 size={14} /> Edit Profile
                    </button>
                    <button onClick={handleLogout}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-red-100 text-sm font-semibold text-red-500 hover:bg-red-50 transition-all">
                      <LogOut size={14} /> Sign Out
                    </button>
                  </>
                )}
              </div>
            </div>

            {editing ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-xl">
                {[
                  { key: 'name',  label: 'Full Name', type: 'text' },
                  { key: 'email', label: 'Email',     type: 'email' },
                ].map(({ key, label, type }) => (
                  <div key={key}>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">{label}</label>
                    <input type={type} value={form[key]}
                      onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))}
                      className="w-full text-sm font-semibold text-slate-700 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 ring-indigo-500 outline-none" />
                  </div>
                ))}
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Bio</label>
                  <textarea value={form.bio}
                    onChange={e => setForm(p => ({ ...p, bio: e.target.value }))}
                    placeholder="A short note about your wellness journey..."
                    rows={2}
                    className="w-full text-sm text-slate-700 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 ring-indigo-500 outline-none resize-none" />
                </div>
              </div>
            ) : (
              <>
                <h1 className="font-display text-3xl font-bold text-slate-800 mb-2 tracking-tight">{user.name}</h1>
                <div className="flex flex-wrap items-center gap-5">
                  <span className="flex items-center gap-1.5 text-sm font-medium text-slate-500">
                    <Mail size={14} className="text-indigo-500" /> {user.email}
                  </span>
                  <span className="flex items-center gap-1.5 text-sm font-medium text-slate-500">
                    <Shield size={14} className="text-emerald-500" />
                    Member since {user.createdAt
                      ? new Date(user.createdAt).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })
                      : '2024'}
                  </span>
                  {user.lastLogin && (
                    <span className="flex items-center gap-1.5 text-sm font-medium text-slate-500">
                      <Clock size={14} className="text-blue-500" />
                      Last login {new Date(user.lastLogin).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                    </span>
                  )}
                </div>
                {user.bio && <p className="text-sm text-slate-600 mt-4 leading-relaxed max-w-2xl bg-slate-50 p-4 rounded-xl border border-slate-100 italic">"{user.bio}"</p>}
              </>
            )}
          </div>
        </motion.div>

        {/* ── Live stat cards ──────────────────────────────────────────── */}
        <motion.div 
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
          }}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
        >
          {[
            { icon: Activity, label: 'Assessments',     value: assessments.length || '—', color: '#4F46E5', tab: 'assessments' },
            { icon: BookOpen, label: 'Saved Activities', value: savedActivities.length,    color: '#3B82F6', tab: 'activities' },
            { icon: Users,    label: 'Communities',      value: joinedComms.length,         color: '#10B981', tab: 'communities' },
            { icon: Calendar, label: 'Events',           value: allEvents.length,            color: '#F59E0B', tab: 'events' },
          ].map(({ icon: Icon, label, value, color, tab }) => (
            <motion.button 
              key={label}
              variants={{
                hidden: { y: 10, opacity: 0 },
                visible: { y: 0, opacity: 1 }
              }}
              whileHover={{ y: -4, scale: 1.02 }}
              onClick={() => setActiveTab(tab)}
              className={`bg-white/80 backdrop-blur-md rounded-[1.5rem] p-6 border text-center transition-all hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] ${activeTab === tab ? 'border-indigo-400 shadow-lg ring-4 ring-indigo-50' : 'border-slate-100 shadow-sm'}`}
            >
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-3 transition-transform duration-300"
                style={{ background: `${color}12`, border: `1px solid ${color}25` }}>
                <Icon size={20} style={{ color }} />
              </div>
              <div className="font-display text-3xl font-bold text-slate-800 tracking-tight">{value}</div>
              <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">{label}</div>
            </motion.button>
          ))}
        </motion.div>

        {/* ── Tabs ─────────────────────────────────────────────────────── */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button key={id} onClick={() => setActiveTab(id)}
              className={`flex items-center gap-2 px-5 py-3 rounded-[1.25rem] text-sm font-bold whitespace-nowrap transition-all flex-shrink-0 relative ${
                activeTab === id
                  ? 'text-white shadow-xl shadow-indigo-500/20'
                  : 'bg-white/80 backdrop-blur-sm border border-slate-100 text-slate-500 hover:border-indigo-200 hover:text-slate-800'
              }`}
              style={activeTab === id ? { background: 'linear-gradient(135deg, #4F46E5, #3B82F6)' } : {}}>
              <Icon size={14} /> {label}
            </button>
          ))}
        </div>

        {/* ── Tab content ──────────────────────────────────────────────── */}
        <div className="bg-white/80 backdrop-blur-2xl rounded-[2rem] border border-white shadow-lg p-8 min-h-[400px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {/* OVERVIEW */}
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  <h3 className="font-display text-2xl font-bold text-slate-800 mb-6">Your Wellness Snapshot</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="p-6 rounded-[1.5rem]"
                      style={{
                        background: latest ? levelConfig[latest.stressLevel]?.bg || '#F8FAFC' : '#F8FAFC',
                        border: `1px solid ${latest ? levelConfig[latest.stressLevel]?.border || '#E2E8F0' : '#E2E8F0'}`,
                      }}>
                      <div className="flex items-center justify-between mb-4">
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Latest Check-in</p>
                        <Activity size={14} className="text-slate-400" />
                      </div>
                      {loadingA
                        ? <div className="h-6 w-32 bg-slate-200 rounded animate-pulse" />
                        : latest
                          ? <>
                              <p className="text-2xl font-bold font-display tracking-tight" style={{ color: levelConfig[latest.stressLevel]?.color }}>
                                {latest.stressLevel} Stress <span className="opacity-50 text-xl font-normal">— {latest.totalScore}/40</span>
                              </p>
                              <p className="text-xs text-slate-500 mt-2 font-medium">
                                Recorded on {new Date(latest.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                              </p>
                            </>
                          : <div className="mt-2">
                              <p className="text-sm text-slate-500 mb-3">No stress data recorded yet.</p>
                              <button onClick={() => navigate('/')} className="text-sm font-bold text-indigo-600 hover:text-indigo-700 hover:underline flex items-center gap-1">
                                Take an assessment <ExternalLink size={12}/>
                              </button>
                            </div>
                      }
                    </div>
                    <div className="p-6 rounded-[1.5rem] bg-indigo-50/50 border border-indigo-100">
                      <div className="flex items-center justify-between mb-4">
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Next Appt / Event</p>
                        <Calendar size={14} className="text-slate-400" />
                      </div>
                      {allEvents.length > 0
                        ? <>
                            <p className="text-lg font-bold text-slate-800 leading-snug">
                              {allEvents[0].title || allEvents[0].name || 'Event Session'}
                            </p>
                            <p className="text-sm text-indigo-600 font-semibold mt-2 flex items-center gap-1.5 bg-white w-fit px-3 py-1.5 rounded-lg shadow-sm border border-indigo-50">
                              <Clock size={12} /> {allEvents[0].date || 'Date TBD'}
                            </p>
                          </>
                        : <div className="mt-2">
                            <p className="text-sm text-slate-500 mb-3">Your schedule is currently clear.</p>
                            <Link to="/therapy" className="text-sm font-bold text-indigo-600 hover:text-indigo-700 hover:underline flex items-center gap-1">
                              Browse available events <ExternalLink size={12}/>
                            </Link>
                          </div>
                      }
                    </div>
                  </div>
                  {savedActivities.length > 0 && (
                    <div className="p-6 rounded-[1.5rem] bg-slate-50 border border-slate-100 mt-6">
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
                        Recently Saved ({savedActivities.length})
                      </p>
                      <div className="flex flex-wrap gap-2.5">
                        {savedActivities.slice(0, 6).map(a => (
                          <span key={a._id || a} className="px-3 py-1.5 bg-white border border-slate-200 text-slate-700 text-sm font-medium rounded-xl shadow-sm flex items-center gap-2 hover:border-indigo-200 transition-colors cursor-default">
                            {a.emoji && <span>{a.emoji}</span>} {a.name || a}
                          </span>
                        ))}
                        {savedActivities.length > 6 && (
                          <span className="px-3 py-1.5 bg-indigo-50 border border-indigo-100 text-indigo-700 text-sm font-bold rounded-xl shadow-sm">+{savedActivities.length - 6} more</span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* ASSESSMENTS — from DB */}
              {activeTab === 'assessments' && (
                <div>
                  <h3 className="font-display text-2xl font-bold text-slate-800 mb-6">Assessment History</h3>
                  {loadingA ? (
                    <div className="space-y-4">
                      {[...Array(3)].map((_, i) => (
                        <div key={i} className="h-20 bg-slate-100 rounded-2xl animate-pulse" />
                      ))}
                    </div>
                  ) : assessments.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="text-6xl mb-4 animate-bounce">📋</div>
                      <h4 className="text-xl font-bold text-slate-800 mb-2">No history found</h4>
                      <p className="text-slate-500 mb-6 font-light">Regular check-ins help map your wellness journey.</p>
                      <button onClick={() => navigate('/')}
                        className="btn-soul px-6 py-3 rounded-xl text-sm shadow-xl shadow-indigo-500/20 font-bold hover:-translate-y-1 transition-transform"><span>Start New Assessment</span></button>
                    </div>
                  ) : (
                    <div className="grid gap-4">
                      {assessments.map((a, i) => {
                        const cfg = levelConfig[a.stressLevel] || levelConfig.Low
                        return (
                          <motion.div 
                            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                            key={a._id || i}
                            className="flex flex-col sm:flex-row sm:items-center justify-between p-5 rounded-[1.5rem] bg-white border border-slate-100 hover:border-indigo-200 hover:shadow-lg transition-all gap-4"
                          >
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 rounded-xl flex items-center justify-center shadow-sm"
                                style={{ background: cfg.bg, border: `1px solid ${cfg.border}` }}>
                                <span className="text-lg font-bold" style={{ color: cfg.color }}>{a.stressLevel?.charAt(0)}</span>
                              </div>
                              <div>
                                <p className="text-base font-bold text-slate-800">{a.stressLevel} Indicator</p>
                                <p className="text-xs text-slate-400 font-medium mt-0.5">
                                  {new Date(a.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                                </p>
                              </div>
                            </div>
                            <div className="text-left sm:text-right bg-slate-50 px-4 py-3 rounded-xl border border-slate-100">
                              <p className="text-xl font-bold font-display text-slate-800">{a.totalScore}<span className="text-sm text-slate-400">/40</span></p>
                              <div className="w-full sm:w-24 h-1.5 rounded-full bg-slate-200 mt-1.5 overflow-hidden">
                                <motion.div initial={{ width: 0 }} animate={{ width: `${(a.totalScore / 40) * 100}%` }}
                                  className="h-full rounded-full transition-all" style={{ background: cfg.color }} />
                              </div>
                            </div>
                          </motion.div>
                        )
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* SAVED ACTIVITIES */}
              {activeTab === 'activities' && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="font-display text-2xl font-bold text-slate-800">Your Toolkit</h3>
                    <Link to="/activities" className="text-sm text-indigo-600 font-bold hover:underline bg-indigo-50 px-4 py-2 rounded-xl hidden sm:flex items-center gap-1.5">
                      Find more <ExternalLink size={14} />
                    </Link>
                  </div>
                  {savedActivities.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="text-6xl mb-4 animate-bounce">🔖</div>
                      <h4 className="text-xl font-bold text-slate-800 mb-2">No exercises saved</h4>
                      <p className="text-slate-500 mb-6 font-light">Explore activities and save the ones that help you most.</p>
                      <Link to="/activities" className="btn-soul px-6 py-3 rounded-xl text-sm font-bold shadow-xl shadow-indigo-500/20 inline-block"><span>Explore Libary</span></Link>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
                      {savedActivities.map((a, i) => (
                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.05 }}
                          key={a._id || i} onClick={() => navigate('/activities')}
                          className="p-6 rounded-[1.5rem] bg-white border border-slate-100 text-center hover:border-indigo-200 transition-all hover:shadow-[0_10px_30px_rgb(0,0,0,0.06)] cursor-pointer group"
                        >
                          <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300 drop-shadow-sm">{a.emoji || '🌿'}</div>
                          <p className="text-base font-bold text-slate-800 leading-tight">{a.name || a}</p>
                          {a.category && <p className="text-xs font-semibold text-indigo-500 mt-2 bg-indigo-50 inline-block px-2 py-1 rounded-md">{a.category}</p>}
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* COMMUNITIES */}
              {activeTab === 'communities' && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="font-display text-2xl font-bold text-slate-800">Your Circles</h3>
                    <Link to="/communities" className="text-sm text-indigo-600 font-bold hover:underline bg-indigo-50 px-4 py-2 rounded-xl hidden sm:flex items-center gap-1.5">
                      Browse all <ExternalLink size={14} />
                    </Link>
                  </div>
                  {joinedComms.length === 0 ? (
                    <div className="text-center py-12 bg-slate-50 rounded-[2rem] border border-slate-100">
                      <div className="text-6xl mb-4 animate-bounce">👥</div>
                      <h4 className="text-xl font-bold text-slate-800 mb-2">You aren't in any circles</h4>
                      <p className="text-slate-500 mb-6 font-light">Join a community to share experiences and find support.</p>
                      <Link to="/communities" className="btn-soul px-6 py-3 rounded-xl text-sm font-bold shadow-xl shadow-indigo-500/20 inline-block"><span>Find a Community</span></Link>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {joinedComms.map((c, i) => (
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                          key={c._id || i} onClick={() => navigate(`/communities?open=${c._id}`)}
                          className="flex items-center p-5 rounded-[1.5rem] bg-white border border-slate-100 hover:border-indigo-200 transition-all hover:shadow-[0_10px_30px_rgb(0,0,0,0.06)] cursor-pointer group"
                        >
                          <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-2xl mr-4 group-hover:scale-110 transition-transform shadow-sm">{c.emoji || '💬'}</div>
                          <div className="flex-1">
                            <p className="text-sm font-bold text-slate-800">{c.name || c}</p>
                            {c.memberCount !== undefined && <p className="text-xs text-slate-500 font-medium flex items-center gap-1 mt-1"><Users size={12}/>{c.memberCount.toLocaleString()} members</p>}
                          </div>
                          <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-indigo-500 group-hover:text-white transition-colors">
                            <ExternalLink size={12} />
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* EVENTS */}
              {activeTab === 'events' && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="font-display text-2xl font-bold text-slate-800">Registered Events</h3>
                    <Link to="/therapy" className="text-sm text-indigo-600 font-bold hover:underline bg-indigo-50 px-4 py-2 rounded-xl hidden sm:flex items-center gap-1.5">
                      Schedule more <ExternalLink size={14} />
                    </Link>
                  </div>
                  {allEvents.length === 0 ? (
                    <div className="text-center py-12 bg-slate-50 rounded-[2rem] border border-slate-100">
                      <div className="text-6xl mb-4 animate-bounce">📅</div>
                      <h4 className="text-xl font-bold text-slate-800 mb-2">No upcoming calendar items</h4>
                      <p className="text-slate-500 mb-6 font-light">Book your next therapy session or community event.</p>
                      <Link to="/therapy" className="btn-soul px-6 py-3 rounded-xl text-sm font-bold shadow-xl shadow-indigo-500/20 inline-block"><span>View Schedule</span></Link>
                    </div>
                  ) : (
                    <div className="grid gap-4">
                      {allEvents.map((ev, i) => {
                        const isDateObj = ev.date && !isNaN(new Date(ev.date))
                        const isPast   = isDateObj && new Date(ev.date) < new Date()
                        return (
                          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                            key={ev._id || ev.id || i}
                            className={`flex flex-col sm:flex-row sm:items-center justify-between p-5 rounded-[1.5rem] border transition-all hover:shadow-lg bg-white ${isPast ? 'border-slate-100 opacity-80' : 'border-indigo-100'}`}
                          >
                            <div className="flex-1 pr-4">
                              <div className="flex items-start justify-between sm:justify-start gap-3 mb-2">
                                <h4 className={`text-base font-bold ${isPast ? 'text-slate-600' : 'text-slate-800'}`}>{ev.title || ev.name || 'Therapy Session'}</h4>
                                <span className={`px-2.5 py-1 rounded-md text-[10px] uppercase font-black tracking-widest ${isPast ? 'bg-slate-100 text-slate-500' : 'bg-emerald-100 text-emerald-700'}`}>
                                  {isPast ? 'Attended' : 'Upcoming'}
                                </span>
                              </div>
                              <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-slate-500">
                                <span className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-100 text-slate-700">
                                  <Calendar size={12} className="text-indigo-500"/>
                                  {isDateObj ? new Date(ev.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : (ev.date || 'To be announced')}
                                </span>
                                {ev.location && <span className="bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-100 flex items-center gap-1">📍 {ev.location}</span>}
                                {ev.therapyName && <span className="text-indigo-600 font-bold bg-indigo-50 px-2.5 py-1.5 rounded-lg">{ev.therapyName}</span>}
                              </div>
                            </div>
                          </motion.div>
                        )
                      })}
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>{/* end tab content */}
      </div>
    </div>
  )
}
