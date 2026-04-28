import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Load user from localStorage on mount
    try {
      const stored = localStorage.getItem('ocs_user')
      if (stored) setUser(JSON.parse(stored))
    } catch (_) {}
    setLoading(false)
  }, [])

  const signup = (name, email, password) => {
    // Get existing users
    const users = JSON.parse(localStorage.getItem('ocs_users') || '[]')
    if (users.find(u => u.email === email)) {
      throw new Error('An account with this email already exists.')
    }
    const newUser = {
      id: Date.now().toString(),
      name,
      email,
      password, // NOTE: In production, NEVER store plain passwords — use a real auth backend
      avatar: name.slice(0, 2).toUpperCase(),
      joinedAt: new Date().toISOString(),
    }
    users.push(newUser)
    localStorage.setItem('ocs_users', JSON.stringify(users))
    const { password: _, ...safeUser } = newUser
    setUser(safeUser)
    localStorage.setItem('ocs_user', JSON.stringify(safeUser))
    return safeUser
  }

  const login = (email, password) => {
    const users = JSON.parse(localStorage.getItem('ocs_users') || '[]')
    const found = users.find(u => u.email === email && u.password === password)
    if (!found) throw new Error('Invalid email or password.')
    const { password: _, ...safeUser } = found
    setUser(safeUser)
    localStorage.setItem('ocs_user', JSON.stringify(safeUser))
    return safeUser
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('ocs_user')
  }

  return (
    <AuthContext.Provider value={{ user, loading, signup, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
