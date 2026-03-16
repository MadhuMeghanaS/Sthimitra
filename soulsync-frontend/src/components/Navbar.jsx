import React, { useState, useEffect, useRef } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Menu, X, ChevronDown, User, LogOut, Settings, Sparkles, Bot } from 'lucide-react'
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
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-400 ${
        scrolled ? 'glass shadow-soul py-3' : 'bg-transparent py-5'
      }`}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center shadow-soul"
              style={{ background: 'linear-gradient(135deg, #5DADE2, #A29BFE)' }}>
              <Sparkles size={18} color="white" />
            </div>
            <span className="font-display font-semibold text-xl tracking-wide" style={{ color: '#2C3E50' }}>
              Soul<span className="gradient-text">Sync</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(({ path, label, icon: Icon }) => (
              <Link key={path} to={path}
                className={`nav-link px-4 py-2 rounded-xl text-sm transition-all ${
                  location.pathname === path ? 'active' : ''
                } ${path === '/chat' ? 'flex items-center gap-1.5' : ''}`}
                style={location.pathname === path
                  ? { color: '#5DADE2', background: 'rgba(93,173,226,0.08)' }
                  : {}}>
                {Icon && <Icon size={14} />}
                {label}
              </Link>
            ))}
          </div>

          {/* Auth section */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="relative" ref={dropRef}>
                <button onClick={() => setDropOpen(!dropOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-blue-pale transition-all">
                  <div className="w-8 h-8 rounded-xl text-white text-xs font-bold flex items-center justify-center"
                    style={{ background: 'linear-gradient(135deg, #5DADE2, #A29BFE)' }}>
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm font-semibold text-soul-text">{user.name?.split(' ')[0]}</span>
                  <ChevronDown size={14} className={`text-soul-muted transition-transform ${dropOpen ? 'rotate-180' : ''}`} />
                </button>
                {dropOpen && (
                  <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-soul-hover border border-soul-border py-2 animate-slide-up">
                    <Link to="/profile" onClick={() => setDropOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-soul-text hover:bg-blue-pale transition-colors">
                      <User size={14} style={{ color: '#5DADE2' }} /> My Profile
                    </Link>
                    <div className="my-1 mx-3 divider-soul" />
                    <button onClick={handleLogout}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 w-full transition-colors">
                      <LogOut size={14} /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <button onClick={() => setShowAuth(true)}
                  className="btn-outline-soul text-sm px-4 py-2 rounded-xl">Sign In</button>
                <button onClick={() => setShowAuth(true)}
                  className="btn-soul text-sm px-5 py-2 rounded-xl"><span>Get Started</span></button>
              </>
            )}
          </div>

          {/* Mobile toggle */}
          <button className="md:hidden p-2 rounded-xl text-soul-muted hover:bg-blue-pale"
            onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden glass border-t border-soul-border px-6 py-4 space-y-1">
            {navLinks.map(({ path, label, icon: Icon }) => (
              <Link key={path} to={path}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  location.pathname === path ? 'text-blue-calm bg-blue-pale' : 'text-soul-text hover:bg-blue-pale'
                }`}>
                {Icon && <Icon size={14} />}{label}
              </Link>
            ))}
            <div className="pt-2 space-y-2">
              {user ? (
                <button onClick={() => { handleLogout(); setMobileOpen(false) }}
                  className="w-full py-2.5 rounded-xl text-sm text-red-500 border border-red-100 hover:bg-red-50">
                  Sign Out
                </button>
              ) : (
                <button onClick={() => { setShowAuth(true); setMobileOpen(false) }}
                  className="btn-soul w-full py-2.5 rounded-xl text-sm"><span>Get Started</span></button>
              )}
            </div>
          </div>
        )}
      </nav>

      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
    </>
  )
}
