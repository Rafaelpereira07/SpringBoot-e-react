import { useState, type FormEvent } from 'react'
import { CheckCircle2, XCircle } from 'lucide-react'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Alert } from '@/components/ui/Alert'
import { certificateService } from '@/services/certificateService'
import { extractErrorMessage } from '@/lib/api'
import type { CertificateValidation } from '@/types'

const dateFormatter = new Intl.DateTimeFormat('pt-BR', { dateStyle: 'long' })

export function CertificateValidationPage() {
  const [code, setCode] = useState('')
  const [result, setResult] = useState<CertificateValidation | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setError(null)
    setResult(null)
    setIsSubmitting(true)
    try {
      const response = await certificateService.validate(code.trim())
      setResult(response.data)
    } catch (err) {
      setError(extractErrorMessage(err))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="mx-auto max-w-lg px-6 py-16">
      <h1 className="font-display text-2xl font-semibold text-paper">Validar certificado</h1>
      <p className="mt-2 text-sm text-muted">
        Digite o codigo impresso no certificado (ex.: A8F3-92KD-71MX-4PQA).
      </p>

      <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
        <Input
          label="Codigo do certificado"
          name="code"
          required
          placeholder="XXXX-XXXX-XXXX-XXXX"
          className="font-mono uppercase"
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
        />
        <Button type="submit" isLoading={isSubmitting}>
          Validar
        </Button>
      </form>

      {error && (
        <div className="mt-6">
          <Alert>{error}</Alert>
        </div>
      )}

      {result && (
        <div className="mt-8 rounded-lg border border-ink-line bg-ink-soft p-6">
          {result.valid ? (
            <>
              <div className="flex items-center gap-2 text-teal">
                <CheckCircle2 className="h-5 w-5" />
                <span className="font-medium">Certificado valido</span>
              </div>
              <dl className="mt-4 space-y-2 text-sm">
                <div className="flex justify-between gap-4">
                  <dt className="text-muted">Aluno</dt>
                  <dd className="text-paper">{result.student}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-muted">Curso</dt>
                  <dd className="text-right text-paper">{result.course}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-muted">Concluido em</dt>
                  <dd className="text-paper">
                    {result.completedAt && dateFormatter.format(new Date(result.completedAt))}
                  </dd>
                </div>
              </dl>
              <a
                href={certificateService.downloadUrl(code.trim())}
                target="_blank"
                rel="noreferrer"
                className="mt-5 inline-block text-sm text-amber hover:underline"
              >
                Baixar PDF →
              </a>
            </>
          ) : (
            <div className="flex items-center gap-2 text-coral">
              <XCircle className="h-5 w-5" />
              <span className="font-medium">Certificado nao encontrado</span>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
