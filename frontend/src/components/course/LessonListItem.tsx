import { Lock, PlayCircle, CheckCircle2 } from 'lucide-react'
import type { LessonSummary } from '@/types'
import { formatSeconds } from './levelMeta'

interface LessonListItemProps {
  lesson: LessonSummary
  index: number
  locked: boolean
  completed?: boolean
  onClick: () => void
}

export function LessonListItem({ lesson, index, locked, completed = false, onClick }: LessonListItemProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center gap-4 border-b border-ink-line px-1 py-3.5 text-left last:border-b-0 hover:bg-ink-soft"
    >
      <span className="w-6 shrink-0 font-mono text-sm text-muted">
        {String(index + 1).padStart(2, '0')}
      </span>
      {completed ? (
        <CheckCircle2 className="h-4 w-4 shrink-0 text-teal" />
      ) : locked ? (
        <Lock className="h-4 w-4 shrink-0 text-muted" />
      ) : (
        <PlayCircle className="h-4 w-4 shrink-0 text-amber" />
      )}
      <span className="flex-1 text-sm text-paper">{lesson.title}</span>
      <span className="font-mono text-xs text-muted">{formatSeconds(lesson.durationSeconds)}</span>
    </button>
  )
}
