export function Footer() {
  return (
    <footer className="border-t border-ink-line">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-10 text-sm text-muted md:flex-row md:items-center md:justify-between">
        <p className="font-mono text-xs">devpath © {new Date().getFullYear()}</p>
        <p>Projeto de estudo — nao ha processamento real de pagamentos.</p>
      </div>
    </footer>
  )
}
