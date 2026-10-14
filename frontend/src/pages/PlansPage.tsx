import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Check } from 'lucide-react'
import { Spinner } from '@/components/ui/Spinner'
import { Alert } from '@/components/ui/Alert'
import { Button } from '@/components/ui/Button'
import { planService } from '@/services/planService'
import { extractErrorMessage } from '@/lib/api'
import { useAuth } from '@/hooks/useAuth'
import type { Plan } from '@/types'

const currency = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })

const perks: Record<Plan['type'], string[]> = {
  MENSAL: ['Acesso a todos os cursos', 'Certificados inclusos', 'Cancele quando quiser'],
  ANUAL: ['Acesso a todos os cursos', 'Certificados inclusos', '2 meses de desconto no total'],
  VITALICIO: ['Acesso a todos os cursos', 'Certificados inclusos', 'Pagamento unico, acesso para sempre'],
}

export function PlansPage() {
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [plans, setPlans] = useState<Plan[] | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    planService
      .list()
      .then((response) => setPlans(response.data))
      .catch((err) => setError(extractErrorMessage(err)))
  }, [])

  function handleSubscribe(plan: Plan) {
    if (!isAuthenticated) {
      navigate('/entrar', { state: { from: { pathname: `/assinar/${plan.type}` } } })
      return
    }
    navigate(`/assinar/${plan.type}`)
  }

  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <div className="max-w-xl">
        <h1 className="font-display text-3xl font-semibold text-paper">Planos</h1>
        <p className="mt-3 text-muted">
          Pagamento simulado por QR Code — nenhuma cobranca real acontece
          neste projeto.
        </p>
      </div>

      {error && (
        <div className="mt-10">
          <Alert>{error}</Alert>
        </div>
      )}

      {!error && plans === null && <Spinner label="Carregando planos" />}

      {!error && plans !== null && (
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {plans.map((plan) => {
            const isHighlighted = plan.type === 'VITALICIO'
            return (
              <div
                key={plan.id}
                className={`flex flex-col gap-6 rounded-lg border p-6 ${
                  isHighlighted
                    ? 'border-amber bg-amber/5'
                    : 'border-ink-line bg-ink-soft'
                }`}
              >
                <div>
                  {isHighlighted && (
                    <p className="mb-2 font-mono text-xs text-amber">melhor custo-beneficio</p>
                  )}
                  <h2 className="font-display text-xl font-semibold text-paper">{plan.name}</h2>
                  <p className="mt-1 text-sm text-muted">{plan.description}</p>
                </div>

                <div>
                  <span className="font-display text-3xl text-paper">{currency.format(plan.price)}</span>
                  <span className="ml-1 text-sm text-muted">
                    {plan.lifetime ? 'pagamento unico' : plan.type === 'ANUAL' ? '/ano' : '/mes'}
                  </span>
                </div>

                <ul className="flex flex-1 flex-col gap-2.5 text-sm text-muted">
                  {perks[plan.type].map((perk) => (
                    <li key={perk} className="flex items-start gap-2">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-teal" />
                      {perk}
                    </li>
                  ))}
                </ul>

                <Button
                  variant={isHighlighted ? 'primary' : 'secondary'}
                  onClick={() => handleSubscribe(plan)}
                >
                  Assinar {plan.name.toLowerCase()}
                </Button>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
