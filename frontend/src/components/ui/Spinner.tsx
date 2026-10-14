export function Spinner({ label = 'Carregando' }: { label?: string }) {
  return (
    <div className="flex items-center gap-3 py-10 text-muted" role="status">
      <span className="h-5 w-5 animate-spin rounded-full border-2 border-ink-line border-t-amber" />
      <span className="text-sm">{label}...</span>
    </div>
  )
}
