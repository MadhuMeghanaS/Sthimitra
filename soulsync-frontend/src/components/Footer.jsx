import React from 'react'
import { Link } from 'react-router-dom'
import { Sparkles, Heart, Twitter, Instagram, Github, Bot } from 'lucide-react'

export default function Footer() {
  return (
    <footer style={{ background: '#1A252F' }} className="mt-20">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #5DADE2, #A29BFE)' }}>
                <Sparkles size={17} color="white" />
              </div>
              <span className="font-display font-semibold text-xl text-white">
                Sthi<span style={{ color: '#5DADE2' }}>mitra</span>
              </span>
            </div>
            <p className="text-sm leading-relaxed max-w-xs mb-5" style={{ color: '#7F8C8D' }}>
              Your compassionate companion for emotional wellness. Sync your mind, emotions, and lifestyle for a healthier, more balanced life.
            </p>
            <div className="flex gap-3">
              {[Twitter, Instagram, Github].map((Icon, i) => (
                <button key={i} 
                  className="w-9 h-9 rounded-xl flex items-center justify-center hover:opacity-100 transition-opacity"
                  style={{ background: 'rgba(93,173,226,0.12)', color: '#AED6F1' }}>
                  <Icon size={15} />
                </button>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-white font-semibold text-sm mb-4 uppercase tracking-wider">Explore</h4>
            <ul className="space-y-2.5">
              {[
                { to: '/activities', label: 'Activities' },
                { to: '/therapy', label: 'Therapy' },
                { to: '/communities', label: 'Communities' },
                { to: '/chat', label: 'AI Companion' },
                { to: '/profile', label: 'My Profile' },
              ].map(l => (
                <li key={l.to}>
                  <Link to={l.to} className="text-sm transition-colors hover:text-blue-calm"
                    style={{ color: '#7F8C8D' }}>{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold text-sm mb-4 uppercase tracking-wider">Support</h4>
            <ul className="space-y-2.5">
              {['About Us', 'Privacy Policy', 'Terms of Service', 'Contact Us', 'Help Center'].map(item => (
                <li key={item}>
                  <a href="#" className="text-sm transition-colors hover:text-blue-calm"
                    style={{ color: '#7F8C8D' }}>{item}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="divider-soul mb-6" style={{ background: 'linear-gradient(90deg, transparent, rgba(93,173,226,0.3), rgba(162,155,254,0.3), transparent)' }} />

        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-xs" style={{ color: '#7F8C8D' }}>© 2024 Sthimitra. All rights reserved.</p>
          <p className="text-xs flex items-center gap-1.5" style={{ color: '#7F8C8D' }}>
            Made with <Heart size={11} fill="#A29BFE" style={{ color: '#A29BFE' }} /> for mental wellness
          </p>
        </div>
      </div>
    </footer>
  )
}
