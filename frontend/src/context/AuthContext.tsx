import React, { createContext, useContext, useEffect, useState } from 'react'
import * as jwt_decode from 'jwt-decode'
const jwtDecode = (jwt_decode as any).default || jwt_decode

type User = { id: string; name: string; email: string; role: string } | null

type AuthContextType = {
  user: User
  token: string | null
  setToken: (t: string | null) => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType>({ user: null, token: null, setToken: () => {}, isLoading: true })

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setTokenState] = useState<string | null>(() => localStorage.getItem('token'))
  const [user, setUser] = useState<User>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (token) {
      try {
        const decoded: any = jwtDecode(token)
        setUser({ id: decoded.id, name: decoded.name, email: decoded.email, role: decoded.role })
      } catch (e) {
        setUser(null)
        localStorage.removeItem('token')
        setTokenState(null)
      }
    } else {
      setUser(null)
    }
    setIsLoading(false)
  }, [token])

  const setToken = (t: string | null) => {
    setTokenState(t)
    if (t) localStorage.setItem('token', t)
    else localStorage.removeItem('token')
  }

  return <AuthContext.Provider value={{ user, token, setToken, isLoading }}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)
