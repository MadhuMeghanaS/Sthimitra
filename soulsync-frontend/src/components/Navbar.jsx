import React, { useState, useEffect, useRef } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Menu, X, ChevronDown, User, LogOut, Settings, Sparkles, Bot } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import AuthModal from './AuthModal'

const navLinks = [
  { path: '/', label: 'Home' },
  { path: '/activities', label: 'Activities' },
  { path: '/therapy', label: 'Therapy' },
  { path: '/communities', label: 'Communities' },
  { path: '/chat', label: 'AI Chat', icon: Bot },
  { path: '/profile', label: 'Profile' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [showAuth, setShowAuth] = useState(false)
  const [dropOpen, setDropOpen] = useState(false)
  const { user, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const dropRef = useRef(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const handler = (e) => { if (dropRef.current && !dropRef.current.contains(e.target)) setDropOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleLogout = () => {
    logout(); setDropOpen(false); navigate('/')
  }

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? 'bg-white/80 backdrop-blur-xl border-b border-slate-200/50 py-3 shadow-sm' : 'bg-transparent py-6'
      }`}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group relative z-10">
            <motion.div 
              whileHover={{ rotate: 10, scale: 1.1 }}
              className="w-10 h-10 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/20"
              style={{ background: 'linear-gradient(135deg, #4F46E5, #3B82F6)' }}
            >
              <Sparkles size={20} color="white" />
            </motion.div>
            <span className="font-display font-bold text-2xl tracking-tight text-slate-900">
              Soul<span className="text-indigo-600">Sync</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1 bg-slate-100/50 p-1.5 rounded-2xl border border-slate-200/50">
            {navLinks.map(({ path, label, icon: Icon }) => {
              const isActive = location.pathname === path
              return (
                <Link 
                  key={path} 
                  to={path}
                  className={`relative px-5 py-2 rounded-xl text-sm font-semibold transition-all ${
                    isActive ? 'text-indigo-600' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <div className="relative z-10 flex items-center gap-2">
                    {Icon && <Icon size={14} className={isActive ? 'text-indigo-600' : 'text-slate-400'} />}
                    {label}
                  </div>
                  {isActive && (
                    <motion.div 
                      layoutId="activeNav"
                      className="absolute inset-0 bg-white rounded-lg shadow-sm border border-slate-200/50"
                      initial={false}
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              )
            })}
          </div>

          {/* Auth Section */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="relative" ref={dropRef}>
                <motion.button 
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setDropOpen(!dropOpen)}
                  className="flex items-center gap-3 px-3 py-2 rounded-2xl bg-white border border-slate-200 hover:border-indigo-200 transition-all shadow-sm"
                >
                  <div className="w-8 h-8 rounded-xl text-white text-xs font-bold flex items-center justify-center shadow-md shadow-indigo-500/10"
                    style={{ background: 'linear-gradient(135deg, #4F46E5, #3B82F6)' }}>
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm font-semibold text-slate-700">{user.name?.split(' ')[0]}</span>
                  <ChevronDown size={14} className={`text-slate-400 transition-transform ${dropOpen ? 'rotate-180' : ''}`} />
                </motion.button>
                
                <AnimatePresence>
                  {dropOpen && (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.95, y: 10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: 10 }}
                      className="absolute right-0 mt-3 w-56 bg-white rounded-3xl shadow-2xl border border-slate-200/80 p-2 z-50 overflow-hidden"
                    >
                      <Link to="/profile" onClick={() => setDropOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 rounded-2xl transition-colors group">
                        <User size={16} className="text-indigo-500 group-hover:scale-110 transition-transform" /> 
                        My Profile
                      </Link>
                      <div className="my-1 border-t border-slate-100 mx-2" />
                      <button onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-3 text-sm font-semibold text-red-500 hover:bg-red-50 w-full rounded-2xl transition-colors group">
                        <LogOut size={16} className="group-hover:translate-x-1 transition-transform" /> 
                        Sign Out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button onClick={() => setShowAuth(true)}
                  className="px-6 py-2.5 rounded-2xl text-sm font-bold text-slate-700 hover:bg-slate-100 transition-all">
                  Sign In
                </button>
                <button onClick={() => setShowAuth(true)}
                  className="btn-soul px-6 py-2.5 rounded-2xl text-sm font-bold shadow-lg shadow-indigo-500/20">
                  <span>Get Started</span>
                </button>
              </div>
            )}
          </div>

          {/* Mobile Toggle */}
          <button className="md:hidden p-2 rounded-2xl text-slate-600 bg-slate-100 hover:bg-slate-200 transition-all"
            onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden bg-white border-t border-slate-200/50 overflow-hidden"
            >
              <div className="px-6 py-8 flex flex-col gap-2">
                {navLinks.map(({ path, label, icon: Icon }) => {
                  const isActive = location.pathname === path
                  return (
                    <Link key={path} to={path}
                      onClick={() => setMobileOpen(false)}
                      className={`flex items-center gap-4 px-5 py-4 rounded-2xl text-base font-bold transition-all ${
                        isActive ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50'
                      }`}>
                      {Icon && <Icon size={20} className={isActive ? 'text-indigo-600' : 'text-slate-400'} />}
                      {label}
                    </Link>
                  )
                })}
                <div className="mt-4 pt-4 border-t border-slate-100 space-y-3">
                  {user ? (
                    <button onClick={() => { handleLogout(); setMobileOpen(false) }}
                      className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl text-base font-bold text-red-500 bg-red-50 hover:bg-red-100 transition-all">
                      <LogOut size={20} /> Sign Out
                    </button>
                  ) : (
                    <button onClick={() => { setShowAuth(true); setMobileOpen(false) }}
                      className="btn-soul w-full py-4 rounded-2xl text-base font-bold shadow-lg shadow-indigo-500/10">
                      <span>Get Started</span>
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
    </>
  )
}
