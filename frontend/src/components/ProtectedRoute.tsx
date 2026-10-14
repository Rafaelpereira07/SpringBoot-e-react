import type { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { Spinner } from './ui/Spinner'

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth()
  const location = useLocation()

  if (isLoading) {
    return <Spinner label="Verificando sessao" />
  }

  if (!isAuthenticated) {
    return <Navigate to="/entrar" replace state={{ from: location }} />
  }

  return <>{children}</>
}
