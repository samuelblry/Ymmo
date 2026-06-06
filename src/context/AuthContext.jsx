import { createContext, useContext, useState } from 'react'
import { apiFetch, setAccessToken } from '../lib/api'

const AuthContext = createContext(null)

const dashboardPath = (role) => ({
  Commercial: '/dashboard/commercial',
  Marketing: '/dashboard/marketing',
  RH_Juridique: '/dashboard/rh',
  Direction: '/dashboard/direction',
  IT_Support: '/dashboard/it',
}[role] ?? '/compte')

const toUser = (authData, email, profile = {}) => ({
  type: authData.user_type,
  role: authData.role,
  agenceId: authData.agence_id,
  email,
  firstName: profile.firstName ?? (authData.role ? authData.role.replace('_', ' ') : 'Compte'),
  lastName: profile.lastName ?? 'Ymmo',
  dashboardPath: dashboardPath(authData.role),
})

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('ymmo_user')
      return stored ? JSON.parse(stored) : null
    } catch {
      return null
    }
  })

  const login = async ({ email, password, mfaCode, tempToken, profile }) => {
    const endpoint = tempToken ? '/api/auth/login/mfa' : '/api/auth/login'
    const body = tempToken ? { temp_token: tempToken, code: mfaCode } : { email, password }
    const authData = await apiFetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })

    if (authData.require_mfa) {
      return authData
    }

    setAccessToken(authData.access_token)
    const userData = toUser(authData, email, profile)
    setUser(userData)
    localStorage.setItem('ymmo_user', JSON.stringify(userData))
    return { user: userData }
  }

  const register = async ({ firstName, lastName, email, password }) => {
    await apiFetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nom: lastName,
        prenom: firstName,
        email,
        password,
      }),
    })
    return login({ email, password, profile: { firstName, lastName } })
  }

  const logout = async () => {
    try {
      await apiFetch('/api/auth/logout', { method: 'POST' })
    } catch {
      // La deconnexion locale reste prioritaire si le token est deja expire.
    }
    setAccessToken(null)
    setUser(null)
    localStorage.removeItem('ymmo_user')
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
