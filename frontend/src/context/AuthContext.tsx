import { createContext, useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { authService, type LoginPayload, type RegisterPayload } from '@/services/authService'
import { clearToken, readToken, saveToken } from '@/lib/secureStorage'
import { isTokenExpired } from '@/lib/jwt'
import { setUnauthorizedHandler } from '@/lib/api'
import type { Student } from '@/types'

interface AuthContextValue {
  student: Student | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (payload: LoginPayload) => Promise<void>
  register: (payload: RegisterPayload) => Promise<void>
  logout: () => void
  refreshAccount: () => Promise<void>
}

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [student, setStudent] = useState<Student | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate()

  const logout = useCallback(() => {
    clearToken()
    setStudent(null)
    navigate('/entrar')
  }, [navigate])

  const refreshAccount = useCallback(async () => {
    const response = await authService.account()
    setStudent(response.data)
  }, [])

  useEffect(() => {
    setUnauthorizedHandler(() => {
      clearToken()
      setStudent(null)
    })
  }, [])

  useEffect(() => {
    async function bootstrap() {
      const token = await readToken()
      if (!token || isTokenExpired(token)) {
        clearToken()
        setIsLoading(false)
        return
      }
      try {
        await refreshAccount()
      } catch {
        clearToken()
        setStudent(null)
      } finally {
        setIsLoading(false)
      }
    }
    void bootstrap()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const login = useCallback(async (payload: LoginPayload) => {
    const response = await authService.login(payload)
    await saveToken(response.data.token)
    setStudent(response.data.student)
  }, [])

  const register = useCallback(async (payload: RegisterPayload) => {
    await authService.register(payload)
    await login({ email: payload.email, password: payload.password })
  }, [login])

  const value = useMemo<AuthContextValue>(
    () => ({
      student,
      isAuthenticated: student !== null,
      isLoading,
      login,
      register,
      logout,
      refreshAccount,
    }),
    [student, isLoading, login, register, logout, refreshAccount],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
