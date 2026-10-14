interface Line {
  text: string
  tone?: 'muted' | 'amber' | 'teal'
}

const LINES: Line[] = [
  { text: 'const aluno = await matricular("joao@email.com")', tone: 'muted' },
  { text: 'aula.assistir("introducao-ao-curso")', tone: 'muted' },
  { text: 'progresso.atualizar()  // 4/12 aulas concluidas', tone: 'teal' },
  { text: 'if (curso.completo) emitirCertificado(aluno)', tone: 'amber' },
]

const toneClass: Record<NonNullable<Line['tone']>, string> = {
  muted: 'text-paper/80',
  amber: 'text-amber',
  teal: 'text-teal',
}

/**
 * The one deliberate visual device for this app: a stylized code-editor
 * window. Used sparingly (hero + auth split panel) rather than repeated
 * everywhere, grounded in the subject matter (a platform that teaches
 * programming through video courses).
 */
export function EditorMockup() {
  return (
    <div className="w-full overflow-hidden rounded-lg border border-ink-line bg-ink-soft shadow-2xl shadow-black/40">
      <div className="flex items-center gap-1.5 border-b border-ink-line px-4 py-3">
        <span className="h-2.5 w-2.5 rounded-full bg-coral/60" />
        <span className="h-2.5 w-2.5 rounded-full bg-amber/60" />
        <span className="h-2.5 w-2.5 rounded-full bg-teal/60" />
        <span className="ml-3 font-mono text-xs text-muted">meu-progresso.ts</span>
      </div>
      <div className="space-y-2.5 px-5 py-6 font-mono text-[13px] leading-relaxed">
        {LINES.map((line, index) => (
          <p
            key={line.text}
            className={`animate-type-line ${toneClass[line.tone ?? 'muted']}`}
            style={{ animationDelay: `${index * 220 + 200}ms` }}
          >
            <span className="mr-3 select-none text-muted/50">{index + 1}</span>
            {line.text}
          </p>
        ))}
        <p
          className="animate-type-line mt-1 h-4 w-2 bg-amber/70"
          style={{ animationDelay: `${LINES.length * 220 + 300}ms` }}
          aria-hidden="true"
        />
      </div>
    </div>
  )
}
