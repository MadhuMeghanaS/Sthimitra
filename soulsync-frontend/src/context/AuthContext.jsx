axios.defaults.baseURL = import.meta.env.VITE_API_URL || ''
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import axios from 'axios'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser]       = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('soulsync_token')
    if (!token) { setLoading(false); return }

    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`

    // Pull real profile from DB (populated with savedActivities, joinedCommunities, registeredEvents)
    axios.get('/api/users/profile')
      .then(({ data }) => {
        if (data.success && data.user) {
          setUser(data.user)
        } else {
          throw new Error('Malformed profile data')
        }
      })
      .catch(() => {
        localStorage.removeItem('soulsync_token')
        localStorage.removeItem('soulsync_user')
        delete axios.defaults.headers.common['Authorization']
      })
      .finally(() => setLoading(false))
  }, [])

  // Refresh full user from DB — call after any data change
  const refreshUser = useCallback(async () => {
    try {
      const { data } = await axios.get('/api/users/profile')
      if (data.success && data.user) {
        setUser(data.user)
        localStorage.setItem('soulsync_user', JSON.stringify(data.user))
      }
    } catch (e) {
      console.warn('refreshUser failed:', e?.message)
    }
  }, [])

  const login = async (email, password) => {
    try {
      const { data } = await axios.post('/api/auth/login', { email, password })
      localStorage.setItem('soulsync_token', data.token)
      axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`
      const profile  = await axios.get('/api/users/profile')
      const fullUser = profile.data?.user
      if (fullUser) {
        setUser(fullUser)
        localStorage.setItem('soulsync_user', JSON.stringify(fullUser))
        return { success: true }
      }
      throw new Error('Profile fetch failed after login')
    } catch (e) {
      return { success: false, message: e.response?.data?.message || 'Login failed' }
    }
  }

  const register = async (name, email, password) => {
    try {
      const { data } = await axios.post('/api/auth/register', { name, email, password })
      localStorage.setItem('soulsync_token', data.token)
      axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`
      setUser(data.user)
      localStorage.setItem('soulsync_user', JSON.stringify(data.user))
      return { success: true }
    } catch (e) {
      return { success: false, message: e.response?.data?.message || 'Registration failed' }
    }
  }

  const logout = () => {
    localStorage.removeItem('soulsync_token')
    localStorage.removeItem('soulsync_user')
    delete axios.defaults.headers.common['Authorization']
    setUser(null)
  }

  const updateUser = (u) => {
    setUser(u)
    localStorage.setItem('soulsync_user', JSON.stringify(u))
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateUser, refreshUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
