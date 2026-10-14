import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { CheckCircle2 } from 'lucide-react'
import { Spinner } from '@/components/ui/Spinner'
import { Alert } from '@/components/ui/Alert'
import { Button } from '@/components/ui/Button'
import { subscriptionService } from '@/services/subscriptionService'
import { extractErrorMessage } from '@/lib/api'
import type { PlanType, QrCodeResponse } from '@/types'

const planLabel: Record<PlanType, string> = {
  MENSAL: 'Mensal',
  ANUAL: 'Anual',
  VITALICIO: 'Vitalicio',
}

export function CheckoutPage() {
  const { planType } = useParams<{ planType: PlanType }>()
  const navigate = useNavigate()

  const [charge, setCharge] = useState<QrCodeResponse | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isConfirming, setIsConfirming] = useState(false)
  const [confirmed, setConfirmed] = useState(false)

  useEffect(() => {
    if (!planType) return
    subscriptionService
      .subscribe(planType)
      .then((response) => setCharge(response.data))
      .catch((err) => setError(extractErrorMessage(err)))
  }, [planType])

  async function handleConfirm() {
    if (!charge) return
    setIsConfirming(true)
    setError(null)
    try {
      await subscriptionService.confirm(charge.paymentCode)
      setConfirmed(true)
    } catch (err) {
      setError(extractErrorMessage(err))
    } finally {
      setIsConfirming(false)
    }
  }

  if (!planType || !(planType in planLabel)) {
    return (
      <div className="mx-auto max-w-xl px-6 py-20">
        <Alert>Plano invalido.</Alert>
      </div>
    )
  }

  if (confirmed) {
    return (
      <div className="mx-auto max-w-md px-6 py-20 text-center">
        <CheckCircle2 className="mx-auto h-10 w-10 text-teal" />
        <h1 className="mt-4 font-display text-2xl font-semibold text-paper">
          Assinatura ativada
        </h1>
        <p className="mt-2 text-muted">
          Sua assinatura {planLabel[planType]} esta ativa. Voce ja pode
          assistir aos cursos.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Button onClick={() => navigate('/cursos')}>Ver cursos</Button>
          <Button variant="secondary" onClick={() => navigate('/conta')}>
            Minha conta
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-md px-6 py-16">
      <h1 className="font-display text-2xl font-semibold text-paper">
        Assinatura {planLabel[planType]}
      </h1>
      <p className="mt-2 text-sm text-muted">
        Pagamento simulado por QR Code. Nenhuma cobranca real acontece aqui —
        clique em "confirmar" abaixo para simular a confirmacao.
      </p>

      {error && (
        <div className="mt-6">
          <Alert>{error}</Alert>
        </div>
      )}

      {!charge && !error && <Spinner label="Gerando cobranca" />}

      {charge && (
        <div className="mt-8 flex flex-col items-center gap-5 rounded-lg border border-ink-line bg-ink-soft p-6">
          <img
            src={`data:image/png;base64,${charge.qrCodeImageBase64}`}
            alt="QR Code de pagamento simulado"
            className="h-56 w-56 rounded bg-white p-3"
          />
          <p className="font-mono text-xs text-muted">codigo de pagamento</p>
          <p className="break-all text-center font-mono text-sm text-paper">{charge.paymentCode}</p>

          <Button onClick={handleConfirm} isLoading={isConfirming} className="w-full">
            Confirmar pagamento (simulado)
          </Button>
        </div>
      )}

      <p className="mt-6 text-center">
        <Link to="/planos" className="text-sm text-muted hover:text-amber">
          Escolher outro plano
        </Link>
      </p>
    </div>
  )
}
