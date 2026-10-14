import type { ReactNode } from 'react'

type Tone = 'amber' | 'teal' | 'coral' | 'muted'

const toneClasses: Record<Tone, string> = {
  amber: 'bg-amber/10 text-amber border-amber/30',
  teal: 'bg-teal/10 text-teal border-teal/30',
  coral: 'bg-coral/10 text-coral border-coral/30',
  muted: 'bg-ink-soft text-muted border-ink-line',
}

export function Badge({ tone = 'muted', children }: { tone?: Tone; children: ReactNode }) {
  return (
    <span
      className={`inline-flex items-center rounded border px-2 py-0.5 font-mono text-xs ${toneClasses[tone]}`}
    >
      {children}
    </span>
  )
}
