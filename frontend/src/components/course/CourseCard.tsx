import { Link } from 'react-router-dom'
import type { Course } from '@/types'
import { formatMinutes, levelMeta } from './levelMeta'

export function CourseCard({ course }: { course: Course }) {
  const meta = levelMeta[course.level]

  return (
    <Link
      to={`/cursos/${course.slug}`}
      className={`group flex flex-col gap-4 border-t-2 bg-ink-soft p-5 transition-colors hover:bg-ink-soft/70 ${meta.border}`}
    >
      <div className="flex items-center justify-between">
        <span className={`font-mono text-xs ${meta.text}`}>{meta.label}</span>
        <span className="font-mono text-xs text-muted">{formatMinutes(course.durationMinutes)}</span>
      </div>
      <h3 className="font-display text-lg font-semibold leading-snug text-paper group-hover:text-amber">
        {course.title}
      </h3>
      {course.language && <p className="text-sm text-muted">{course.language}</p>}
    </Link>
  )
}
