import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Spinner } from '@/components/ui/Spinner'
import { Alert } from '@/components/ui/Alert'
import { Badge } from '@/components/ui/Badge'
import { subscriptionService } from '@/services/subscriptionService'
import { isSubscriptionCurrentlyValid } from '@/lib/subscription'
import { extractErrorMessage } from '@/lib/api'
import { useAuth } from '@/hooks/useAuth'
import type { Subscription } from '@/types'

const dateFormatter = new Intl.DateTimeFormat('pt-BR', { dateStyle: 'medium' })

function formatDate(value: string | null): string {
  return value ? dateFormatter.format(new Date(value)) : '—'
}

export function AccountPage() {
  const { student } = useAuth()
  const [subscriptions, setSubscriptions] = useState<Subscription[] | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    subscriptionService
      .mine()
      .then((response) => setSubscriptions(response.data))
      .catch((err) => setError(extractErrorMessage(err)))
  }, [])

  if (!student) return null

  return (
    <div className="mx-auto max-w-3xl px-6 py-14">
      <h1 className="font-display text-3xl font-semibold text-paper">Minha conta</h1>

      <div className="mt-8 rounded-lg border border-ink-line bg-ink-soft p-6">
        <p className="text-sm text-muted">Nome</p>
        <p className="mt-1 text-paper">{student.name}</p>
        <p className="mt-4 text-sm text-muted">E-mail</p>
        <p className="mt-1 text-paper">{student.email}</p>
        <p className="mt-4 text-sm text-muted">Conta criada em</p>
        <p className="mt-1 text-paper">{formatDate(student.createdAt)}</p>
      </div>

      <div className="mt-10">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-xl font-semibold text-paper">Assinaturas</h2>
          <Link to="/planos" className="text-sm text-amber hover:underline">
            Ver planos
          </Link>
        </div>

        {error && <Alert>{error}</Alert>}
        {!error && subscriptions === null && <Spinner label="Carregando assinaturas" />}

        {!error && subscriptions !== null && subscriptions.length === 0 && (
          <p className="text-sm text-muted">
            Voce ainda nao tem nenhuma assinatura.{' '}
            <Link to="/planos" className="text-amber hover:underline">
              Escolher um plano
            </Link>
            .
          </p>
        )}

        {!error && subscriptions !== null && subscriptions.length > 0 && (
          <div className="divide-y divide-ink-line rounded-lg border border-ink-line bg-ink-soft">
            {subscriptions.map((subscription) => {
              const valid = isSubscriptionCurrentlyValid(subscription)
              return (
                <div key={subscription.id} className="flex items-center justify-between px-5 py-4">
                  <div>
                    <p className="text-paper">{subscription.planName}</p>
                    <p className="mt-0.5 text-xs text-muted">
                      {subscription.status === 'PENDING'
                        ? 'Aguardando confirmacao de pagamento'
                        : subscription.expiresAt
                          ? `Expira em ${formatDate(subscription.expiresAt)}`
                          : 'Sem expiracao'}
                    </p>
                  </div>
                  <Badge tone={valid ? 'teal' : subscription.status === 'PENDING' ? 'amber' : 'muted'}>
                    {valid ? 'ativa' : subscription.status.toLowerCase()}
                  </Badge>
                </div>
              )
            })}
          </div>
        )}
      </div>

      <div className="mt-10 rounded-lg border border-ink-line bg-ink-soft p-6">
        <h2 className="font-display text-lg font-semibold text-paper">Certificados</h2>
        <p className="mt-2 text-sm text-muted">
          Ao concluir todas as aulas de um curso, o certificado e emitido
          automaticamente. Guarde o codigo para baixar ou validar a
          qualquer momento.
        </p>
        <Link to="/validar-certificado" className="mt-3 inline-block text-sm text-amber hover:underline">
          Validar um certificado →
        </Link>
      </div>
    </div>
  )
}
