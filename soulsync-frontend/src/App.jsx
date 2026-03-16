import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './context/AuthContext'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Activities from './pages/Activities'
import Therapy from './pages/Therapy'
import Communities from './pages/Communities'
import Profile from './pages/Profile'
import ChatbotPage from './pages/ChatbotPage'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
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
      </BrowserRouter>
    </AuthProvider>
  )
}
