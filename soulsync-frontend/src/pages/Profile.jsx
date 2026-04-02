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
      <div className="pt-28 pb-20 min-h-screen flex items-center justify-center"
        style={{ background: 'linear-gradient(160deg, #EBF5FB, #F4F7FB, #F3F2FF)' }}>
        <div className="text-center max-w-md px-6 animate-fade-up">
          <div className="text-7xl mb-6">🔐</div>
          <h2 className="font-display text-3xl font-bold text-soul-text mb-3">Sign in to view your profile</h2>
          <p className="text-soul-muted mb-8 leading-relaxed">
            Track your wellness journey, saved activities, stress history, community memberships, and registered events.
          </p>
          <button onClick={() => setShowAuth(true)}
            className="btn-soul px-8 py-4 rounded-2xl text-sm"><span>Sign In / Create Account</span></button>
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
  const initials         = user.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'U'
  const savedActivities  = user.savedActivities  || []
  const joinedComms      = user.joinedCommunities || []
  const registeredEvents = user.registeredEvents  || []

  // Merge DB events + locally stored therapy events (dedup by title)
  const dbEventTitles    = new Set(registeredEvents.map(e => e.title || e.name || ''))
  const allEvents        = [
    ...registeredEvents,
    ...localEvents.filter(e => !dbEventTitles.has(e.title)),
  ]

  const latest = assessments[0]

  return (
    <div className="pt-28 pb-20 min-h-screen">
      <div className="max-w-5xl mx-auto px-6">

        {/* ── Profile header ──────────────────────────────────────────── */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl overflow-hidden border border-soul-border shadow-soul mb-6"
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

          <div className="px-8 pb-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 -mt-8 mb-4">
              {/* Avatar */}
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="w-16 h-16 rounded-2xl flex items-center justify-center text-white text-xl font-bold shadow-xl border-4 border-white z-10"
                style={{ background: 'linear-gradient(135deg, #4F46E5, #3B82F6)' }}
              >
                {initials}
              </motion.div>

              {/* Buttons */}
              <div className="flex items-center gap-2 flex-wrap">
                <button onClick={handleRefresh} disabled={refreshing}
                  title="Sync latest data from server"
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-soul-border text-xs text-soul-muted hover:bg-soul-bg transition-all disabled:opacity-50">
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
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-soul-border text-sm text-soul-muted hover:bg-soul-bg">
                      <X size={14} /> Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button onClick={() => setEditing(true)}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-soul-border text-sm text-soul-text hover:bg-soul-bg transition-all">
                      <Edit3 size={14} /> Edit
                    </button>
                    <button onClick={handleLogout}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-red-200 text-sm text-red-500 hover:bg-red-50 transition-all">
                      <LogOut size={14} /> Sign Out
                    </button>
                  </>
                )}
              </div>
            </div>

            {editing ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-lg">
                {[
                  { key: 'name',  label: 'Full Name', type: 'text' },
                  { key: 'email', label: 'Email',     type: 'email' },
                ].map(({ key, label, type }) => (
                  <div key={key}>
                    <label className="block text-xs font-semibold text-soul-muted uppercase tracking-wide mb-1">{label}</label>
                    <input type={type} value={form[key]}
                      onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))}
                      className="soul-input text-sm" />
                  </div>
                ))}
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-soul-muted uppercase tracking-wide mb-1">Bio</label>
                  <input value={form.bio}
                    onChange={e => setForm(p => ({ ...p, bio: e.target.value }))}
                    placeholder="A short note about your wellness journey..."
                    className="soul-input text-sm" />
                </div>
              </div>
            ) : (
              <>
                <h1 className="font-display text-2xl font-bold text-soul-text mb-1">{user.name}</h1>
                <div className="flex flex-wrap items-center gap-4">
                  <span className="flex items-center gap-1.5 text-sm text-soul-muted">
                    <Mail size={13} className="text-indigo-500" /> {user.email}
                  </span>
                  <span className="flex items-center gap-1.5 text-sm text-soul-muted">
                    <Shield size={13} className="text-emerald-500" />
                    Member since {user.createdAt
                      ? new Date(user.createdAt).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })
                      : '2024'}
                  </span>
                  {user.lastLogin && (
                    <span className="flex items-center gap-1.5 text-sm text-soul-muted">
                      <Clock size={13} className="text-blue-500" />
                      Last login {new Date(user.lastLogin).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                    </span>
                  )}
                </div>
                {user.bio && <p className="text-sm text-soul-muted mt-2 italic">"{user.bio}"</p>}
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
          className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6"
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
              whileHover={{ y: -4, shadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
              onClick={() => setActiveTab(tab)}
              className={`bg-white rounded-xl p-4 border text-center shadow-sm transition-all ${activeTab === tab ? 'border-indigo-500 shadow-md' : 'border-soul-border'}`}
            >
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-2"
                style={{ background: `${color}12`, border: `1px solid ${color}25` }}>
                <Icon size={18} style={{ color }} />
              </div>
              <div className="font-display text-2xl font-bold text-slate-800">{value}</div>
              <div className="text-xs text-soul-muted mt-0.5">{label}</div>
            </motion.button>
          ))}
        </motion.div>

        {/* ── Tabs ─────────────────────────────────────────────────────── */}
        <div className="flex gap-2 mb-5 overflow-x-auto pb-1">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button key={id} onClick={() => setActiveTab(id)}
              className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all flex-shrink-0 ${
                activeTab === id
                  ? 'text-white shadow-soul'
                  : 'bg-white border border-soul-border text-soul-muted hover:border-blue-light hover:text-soul-text'
              }`}
              style={activeTab === id ? { background: 'linear-gradient(135deg, #5DADE2, #A29BFE)' } : {}}>
              <Icon size={13} /> {label}
            </button>
          ))}
        </div>

        {/* ── Tab content ──────────────────────────────────────────────── */}
        <div className="bg-white rounded-2xl border border-soul-border shadow-sm p-6 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
            >
              {/* OVERVIEW */}
              {activeTab === 'overview' && (
                <div className="space-y-5">
                  <h3 className="font-display text-xl font-semibold text-soul-text">Your Wellness Snapshot</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl"
                      style={{
                        background: latest ? levelConfig[latest.stressLevel]?.bg || '#F8FAFC' : '#F8FAFC',
                        border: `1px solid ${latest ? levelConfig[latest.stressLevel]?.border || '#E2E8F0' : '#E2E8F0'}`,
                      }}>
                      <p className="text-xs font-semibold text-soul-muted uppercase tracking-wide mb-2">Latest Stress Assessment</p>
                      {loadingA
                        ? <div className="h-5 w-32 bg-gray-100 rounded animate-pulse" />
                        : latest
                          ? <>
                              <p className="text-sm font-bold" style={{ color: levelConfig[latest.stressLevel]?.color }}>
                                {latest.stressLevel} Stress — {latest.totalScore}/40
                              </p>
                              <p className="text-xs text-soul-muted mt-1">
                                {new Date(latest.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                              </p>
                            </>
                          : <p className="text-sm text-soul-muted">
                              No assessments yet.{' '}
                              <button onClick={() => navigate('/')} className="text-indigo-600 font-semibold hover:underline">
                                Take one now →
                              </button>
                            </p>
                      }
                    </div>
                    <div className="p-4 rounded-xl bg-slate-50 border border-soul-border">
                      <p className="text-xs font-semibold text-soul-muted uppercase tracking-wide mb-2">Next Event</p>
                      {allEvents.length > 0
                        ? <>
                            <p className="text-sm font-semibold text-soul-text leading-snug">
                              {allEvents[0].title || allEvents[0].name || 'Event'}
                            </p>
                            <p className="text-xs text-soul-muted mt-1 flex items-center gap-1">
                              <Calendar size={11} /> {allEvents[0].date || '—'}
                            </p>
                          </>
                        : <p className="text-sm text-soul-muted">
                            No events yet.{' '}
                            <Link to="/therapy" className="text-indigo-600 font-semibold hover:underline">Browse events →</Link>
                          </p>
                      }
                    </div>
                  </div>
                  {savedActivities.length > 0 && (
                    <div className="p-4 rounded-xl bg-slate-50 border border-soul-border">
                      <p className="text-xs font-semibold text-soul-muted uppercase tracking-wide mb-3">
                        Saved Activities ({savedActivities.length})
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {savedActivities.slice(0, 6).map(a => (
                          <span key={a._id || a} className="tag-blue border-blue-100 bg-blue-50 text-blue-700">{a.name || a}</span>
                        ))}
                        {savedActivities.length > 6 && (
                          <span className="tag-lavender border-indigo-100 bg-indigo-50 text-indigo-700">+{savedActivities.length - 6} more</span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* ASSESSMENTS — from DB */}
              {activeTab === 'assessments' && (
                <div>
                  <h3 className="font-display text-xl font-semibold text-soul-text mb-5">Stress Assessment History</h3>
                  {loadingA ? (
                    <div className="space-y-3">
                      {[...Array(3)].map((_, i) => (
                        <div key={i} className="h-16 bg-gray-50 rounded-xl animate-pulse" />
                      ))}
                    </div>
                  ) : assessments.length === 0 ? (
                    <div className="text-center py-10">
                      <div className="text-4xl mb-3">📋</div>
                      <p className="text-soul-muted mb-3">No assessments taken yet.</p>
                      <button onClick={() => navigate('/')}
                        className="btn-soul px-5 py-2.5 rounded-xl text-sm shadow-indigo-500/10 shadow-lg"><span>Take Your First Assessment →</span></button>
                    </div>
                  ) : (
                    <div className="grid gap-3">
                      {assessments.map((a, i) => {
                        const cfg = levelConfig[a.stressLevel] || levelConfig.Low
                        return (
                          <motion.div 
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                            key={a._id || i}
                            className="flex items-center justify-between p-4 rounded-xl border border-soul-border hover:border-indigo-100 hover:bg-slate-50 transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                                style={{ background: cfg.bg, border: `1px solid ${cfg.border}` }}>
                                <span className="text-sm font-bold" style={{ color: cfg.color }}>
                                  {a.stressLevel?.charAt(0)}
                                </span>
                              </div>
                              <div>
                                <p className="text-sm font-semibold" style={{ color: cfg.color }}>
                                  {a.stressLevel} Stress
                                </p>
                                <p className="text-xs text-soul-muted">
                                  {new Date(a.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-lg font-bold font-display text-slate-800">{a.totalScore}/40</p>
                              <div className="w-24 h-1.5 rounded-full bg-slate-100 mt-1 overflow-hidden">
                                <motion.div 
                                  initial={{ width: 0 }}
                                  animate={{ width: `${(a.totalScore / 40) * 100}%` }}
                                  className="h-full rounded-full transition-all"
                                  style={{ background: cfg.color }} 
                                />
                              </div>
                            </div>
                          </motion.div>
                        )
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* SAVED ACTIVITIES — from user.savedActivities (DB) */}
              {activeTab === 'activities' && (
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <h3 className="font-display text-xl font-semibold text-soul-text">Saved Activities</h3>
                    <Link to="/activities" className="text-xs text-indigo-600 font-semibold hover:underline flex items-center gap-1">
                      Browse all <ExternalLink size={11} />
                    </Link>
                  </div>
                  {savedActivities.length === 0 ? (
                    <div className="text-center py-10">
                      <div className="text-4xl mb-3">🔖</div>
                      <p className="text-soul-muted mb-3">No saved activities yet.</p>
                      <Link to="/activities"
                        className="btn-soul px-5 py-2.5 rounded-xl text-sm inline-block shadow-lg shadow-indigo-500/10"><span>Explore Activities →</span></Link>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {savedActivities.map((a, i) => (
                        <motion.div 
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: i * 0.05 }}
                          key={a._id || i}
                          className="p-4 rounded-xl bg-slate-50 border border-soul-border text-center hover:border-indigo-100 hover:bg-white transition-all hover:shadow-md"
                        >
                          <div className="text-3xl mb-2">{a.emoji || '🌿'}</div>
                          <p className="text-sm font-semibold text-soul-text">{a.name || a}</p>
                          {a.category && <p className="text-xs text-soul-muted mt-0.5">{a.category}</p>}
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* COMMUNITIES — from DB, each links to /communities/:id */}
              {activeTab === 'communities' && (
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <h3 className="font-display text-xl font-semibold text-soul-text">Joined Communities</h3>
                    <Link to="/communities" className="text-xs text-indigo-600 font-semibold hover:underline flex items-center gap-1">
                      Browse all <ExternalLink size={11} />
                    </Link>
                  </div>
                  {joinedComms.length === 0 ? (
                    <div className="text-center py-10">
                      <div className="text-4xl mb-3">👥</div>
                      <p className="text-soul-muted mb-3">You haven't joined any communities yet.</p>
                      <Link to="/communities"
                        className="btn-soul px-5 py-2.5 rounded-xl text-sm inline-block shadow-lg shadow-indigo-500/10"><span>Find Communities →</span></Link>
                    </div>
                  ) : (
                    <div className="grid gap-3">
                      {joinedComms.map((c, i) => (
                        <motion.div 
                          initial={{ opacity: 0, x: -5 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.05 }}
                          key={c._id || i}
                          className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-soul-border hover:border-indigo-100 hover:bg-white transition-all group hover:shadow-md"
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">{c.emoji || '💬'}</span>
                            <div>
                              <p className="text-sm font-semibold text-soul-text">{c.name || c}</p>
                              {c.memberCount !== undefined && (
                                <p className="text-xs text-soul-muted">{c.memberCount.toLocaleString()} members</p>
                              )}
                            </div>
                          </div>
                          <Link to={`/communities${c._id ? `?open=${c._id}` : ''}`}
                            className="flex items-center gap-1 text-xs text-indigo-600 font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                            Open <ExternalLink size={11} />
                          </Link>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* EVENTS — DB events + locally-registered therapy events */}
              {activeTab === 'events' && (
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <h3 className="font-display text-xl font-semibold text-soul-text">Registered Events</h3>
                    <Link to="/therapy" className="text-xs text-indigo-600 font-semibold hover:underline flex items-center gap-1">
                      Find more <ExternalLink size={11} />
                    </Link>
                  </div>
                  {allEvents.length === 0 ? (
                    <div className="text-center py-10">
                      <div className="text-4xl mb-3">📅</div>
                      <p className="text-soul-muted mb-3">No events registered yet.</p>
                      <Link to="/therapy"
                        className="btn-soul px-5 py-2.5 rounded-xl text-sm inline-block shadow-lg shadow-indigo-500/10"><span>Browse Events →</span></Link>
                    </div>
                  ) : (
                    <div className="grid gap-3">
                      {allEvents.map((ev, i) => {
                        const dateStr  = ev.date || ''
                        const isDateObj = ev.date && !isNaN(new Date(ev.date))
                        const isPast   = isDateObj && new Date(ev.date) < new Date()
                        return (
                          <motion.div 
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                            key={ev._id || ev.id || i}
                            className="flex items-start justify-between p-4 rounded-xl border border-soul-border hover:border-indigo-100 hover:bg-slate-50 transition-all gap-4"
                          >
                            <div>
                              <p className="text-sm font-semibold text-soul-text mb-1">
                                {ev.title || ev.name || 'Event'}
                              </p>
                              <p className="text-xs text-soul-muted flex items-center gap-2 flex-wrap">
                                <span className="flex items-center gap-1">
                                  <Calendar size={11} />
                                  {isDateObj
                                    ? new Date(ev.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
                                    : dateStr}
                                </span>
                                {ev.location && <span>· {ev.location}</span>}
                                {ev.therapyName && <span className="tag-lavender border-indigo-100 bg-indigo-50 text-indigo-700">{ev.therapyName}</span>}
                              </p>
                            </div>
                            <span className={isPast ? 'tag-lavender px-2 py-0.5 rounded text-[10px] uppercase font-bold border border-indigo-100 bg-indigo-50 text-indigo-700' : 'tag-mint px-2 py-0.5 rounded text-[10px] uppercase font-bold border border-emerald-100 bg-emerald-50 text-emerald-700'} style={{ whiteSpace: 'nowrap' }}>
                              {isPast ? 'Attended' : 'Upcoming'}
                            </span>
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
