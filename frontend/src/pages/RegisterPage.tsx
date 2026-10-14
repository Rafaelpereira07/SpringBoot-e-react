import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { EditorMockup } from '@/components/EditorMockup'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Alert } from '@/components/ui/Alert'
import { extractErrorMessage } from '@/lib/api'
import { useAuth } from '@/hooks/useAuth'

export function RegisterPage() {
  const { register } = useAuth()
  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [fieldError, setFieldError] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setError(null)
    setFieldError(null)

    if (password.length < 8) {
      setFieldError('A senha deve ter no minimo 8 caracteres.')
      return
    }
    if (password !== confirmPassword) {
      setFieldError('As senhas nao coincidem.')
      return
    }

    setIsSubmitting(true)
    try {
      await register({ name, email, password })
      navigate('/conta', { replace: true })
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
        <h1 className="font-display text-2xl font-semibold text-paper">Criar conta</h1>
        <p className="mt-2 text-sm text-muted">Leva menos de um minuto.</p>

        <form className="mt-8 flex flex-col gap-5" onSubmit={handleSubmit}>
          {error && <Alert>{error}</Alert>}
          {fieldError && <Alert tone="amber">{fieldError}</Alert>}

          <Input
            label="Nome completo"
            name="name"
            autoComplete="name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
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
            autoComplete="new-password"
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Input
            label="Confirmar senha"
            type="password"
            name="confirmPassword"
            autoComplete="new-password"
            required
            minLength={8}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          <Button type="submit" isLoading={isSubmitting} className="mt-2">
            Criar conta
          </Button>
        </form>

        <p className="mt-6 text-sm text-muted">
          Ja tem conta?{' '}
          <Link to="/entrar" className="text-amber hover:underline">
            Entrar
          </Link>
        </p>
      </div>
    </div>
  )
}
