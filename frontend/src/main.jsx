import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom/client'
import './styles/index.css'
import { Toaster } from 'react-hot-toast'
import { AuthProvider, useAuth } from './context/AuthContext.jsx'
import HomePage from './pages/HomePage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import SignupPage from './pages/SignupPage.jsx'
import AppPage from './App.jsx'

function Router() {
  const { user, loading } = useAuth()
  const [page, setPage] = useState('home')
  const [darkMode, setDarkMode] = useState(false)

  useEffect(() => {
    // If user is already logged in, go straight to app
    if (!loading && user && page === 'home') setPage('app')
  }, [user, loading])

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode)
  }, [darkMode])

  if (loading) return (
    <div className="min-h-screen bg-[#0C0A08] flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-[#C9A84C]/30 border-t-[#C9A84C] rounded-full animate-spin" />
    </div>
  )

  const navigate = (target) => {
    if (target === 'app' && !user) { setPage('login'); return }
    setPage(target)
  }

  if (page === 'home')   return <HomePage onNavigate={navigate} />
  if (page === 'login')  return <LoginPage onNavigate={navigate} />
  if (page === 'signup') return <SignupPage onNavigate={navigate} />
  if (page === 'app')    return <AppPage onNavigate={navigate} darkMode={darkMode} setDarkMode={setDarkMode} />
  return <HomePage onNavigate={navigate} />
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <Router />
      <Toaster
        position="bottom-center"
        toastOptions={{
          style: {
            background: '#1A1410',
            color: '#FAF7F2',
            fontFamily: 'DM Sans, sans-serif',
            fontSize: '13px',
            borderRadius: '100px',
            padding: '10px 20px',
          },
          duration: 2200,
        }}
      />
    </AuthProvider>
  </React.StrictMode>,
)
