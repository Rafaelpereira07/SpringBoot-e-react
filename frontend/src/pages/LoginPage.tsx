import { useState, type FormEvent } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { EditorMockup } from '@/components/EditorMockup'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Alert } from '@/components/ui/Alert'
import { extractErrorMessage } from '@/lib/api'
import { useAuth } from '@/hooks/useAuth'

interface LocationState {
  from?: { pathname: string }
}

export function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setError(null)
    setIsSubmitting(true)
    try {
      await login({ email, password })
      const state = location.state as LocationState | null
      navigate(state?.from?.pathname ?? '/conta', { replace: true })
    } catch (err) {
      setError(extractErrorMessage(err))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="mx-auto grid max-w-5xl items-center gap-16 px-6 py-16 md:grid-cols-2 md:py-24">
      <div className="hidden md:block">
        <EditorMockup />
      </div>

      <div className="mx-auto w-full max-w-sm">
        <h1 className="font-display text-2xl font-semibold text-paper">Entrar</h1>
        <p className="mt-2 text-sm text-muted">Acesse sua conta para continuar de onde parou.</p>

        <form className="mt-8 flex flex-col gap-5" onSubmit={handleSubmit}>
          {error && <Alert>{error}</Alert>}

          <Input
            label="E-mail"
            type="email"
            name="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            label="Senha"
            type="password"
            name="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <Button type="submit" isLoading={isSubmitting} className="mt-2">
            Entrar
          </Button>
        </form>

        <p className="mt-6 text-sm text-muted">
          Ainda nao tem conta?{' '}
          <Link to="/cadastro" className="text-amber hover:underline">
            Criar conta
          </Link>
        </p>
      </div>
    </div>
  )
}
