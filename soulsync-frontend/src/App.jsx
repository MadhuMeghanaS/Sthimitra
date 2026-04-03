import React, { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './context/AuthContext'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ScrollToTop from './components/ScrollToTop'
import Home from './pages/Home'
import Activities from './pages/Activities'
import Therapy from './pages/Therapy'
import Communities from './pages/Communities'
import Profile from './pages/Profile'
import ChatbotPage from './pages/ChatbotPage'
import ChatbotWidget from './components/ChatbotWidget'

export default function App() {
    const [showChat, setShowChat] = useState(false) 
  return (
    <AuthProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              fontFamily: 'Nunito, sans-serif',
              fontSize: '0.875rem',
              borderRadius: '14px',
              border: '1px solid #E8EEF5',
              boxShadow: '0 8px 32px rgba(44,62,80,0.1)',
              color: '#2C3E50',
            },
            success: { iconTheme: { primary: '#55E6C1', secondary: '#fff' } },
            error: { iconTheme: { primary: '#E74C3C', secondary: '#fff' } },
          }}
        />
        <div className="flex flex-col min-h-screen" style={{ background: '#F4F7FB' }}>
          <Navbar />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/activities" element={<Activities />} />
              <Route path="/therapy" element={<Therapy />} />
              <Route path="/communities" element={<Communities />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/chat" element={<ChatbotPage />} />
              
            </Routes>
          </main>
          <Footer />
        </div>

        {/* ── FLOATING CHAT BUTTON (add this block) ── */}
        <div style={{
          position: 'fixed', bottom: 24, right: 24, zIndex: 1000
        }}>
          {showChat && (
            <div style={{ marginBottom: 12, width: 340 }}>
              <ChatbotWidget />
            </div>
          )}
          <button
            onClick={() => setShowChat(!showChat)}
            style={{
              width: 56, height: 56, borderRadius: '50%', border: 'none',
              background: 'linear-gradient(135deg, #8FAF9A, #5C7A66)',
              boxShadow: '0 8px 24px rgba(92,122,102,.4)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', marginLeft: 'auto',
              fontSize: 24,
            }}
          >
            {showChat ? '✕' : '🧘'}
          </button>
        </div>
        {/* ── END FLOATING CHAT ── */}

      </BrowserRouter>
    </AuthProvider>
  )
}
