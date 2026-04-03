import React from 'react'
import ReactDOM from 'react-dom/client'
import axios from 'axios'
import './index.css'
import App from './App.jsx'

// Dynamic API URL for localhost AND Vercel+Render deployment
// In Dev, it hits localhost:5000 directly. In Prod, it hits Render backend unconditionally.
axios.defaults.baseURL = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? 'https://soul-sync-backend.onrender.com' : 'http://localhost:5000')

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
