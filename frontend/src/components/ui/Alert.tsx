import type { ReactNode } from 'react'

type Tone = 'coral' | 'teal' | 'amber'

const toneClasses: Record<Tone, string> = {
  coral: 'border-coral/30 bg-coral/10 text-coral',
  teal: 'border-teal/30 bg-teal/10 text-teal',
  amber: 'border-amber/30 bg-amber/10 text-amber',
}

export function Alert({ tone = 'coral', children }: { tone?: Tone; children: ReactNode }) {
  return (
    <div role="alert" className={`rounded-md border px-4 py-3 text-sm ${toneClasses[tone]}`}>
      {children}
    </div>
  )
}
