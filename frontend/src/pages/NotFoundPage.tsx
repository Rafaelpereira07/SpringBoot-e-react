import { Link } from 'react-router-dom'

export function NotFoundPage() {
  return (
    <div className="mx-auto max-w-md px-6 py-24 text-center">
      <p className="font-mono text-sm text-amber">404</p>
      <h1 className="mt-3 font-display text-2xl font-semibold text-paper">Pagina nao encontrada</h1>
      <p className="mt-2 text-muted">O endereco que voce tentou acessar nao existe.</p>
      <Link to="/" className="mt-6 inline-block text-sm text-amber hover:underline">
        Voltar para o inicio
      </Link>
    </div>
  )
}
