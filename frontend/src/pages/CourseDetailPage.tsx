import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Spinner } from '@/components/ui/Spinner'
import { Alert } from '@/components/ui/Alert'
import { Badge } from '@/components/ui/Badge'
import { LessonListItem } from '@/components/course/LessonListItem'
import { formatMinutes, levelMeta } from '@/components/course/levelMeta'
import { courseService } from '@/services/courseService'
import { progressService } from '@/services/progressService'
import { subscriptionService } from '@/services/subscriptionService'
import { hasAnyActiveSubscription } from '@/lib/subscription'
import { extractErrorMessage } from '@/lib/api'
import { useAuth } from '@/hooks/useAuth'
import type { CourseDetail, CourseProgress } from '@/types'

export function CourseDetailPage() {
  const { slug = '' } = useParams()
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()

  const [course, setCourse] = useState<CourseDetail | null>(null)
  const [progress, setProgress] = useState<CourseProgress | null>(null)
  const [hasActiveSubscription, setHasActiveSubscription] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let active = true
    setCourse(null)
    setError(null)

    courseService
      .detail(slug)
      .then((response) => {
        if (active) setCourse(response.data)
      })
      .catch((err) => {
        if (active) setError(extractErrorMessage(err))
      })

    if (isAuthenticated) {
      subscriptionService
        .mine()
        .then((response) => {
          if (active) setHasActiveSubscription(hasAnyActiveSubscription(response.data))
        })
        .catch(() => undefined)

      progressService
        .courseProgress(slug)
        .then((response) => {
          if (active) setProgress(response.data)
        })
        .catch(() => undefined)
    }

    return () => {
      active = false
    }
  }, [slug, isAuthenticated])

  if (error) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-14">
        <Alert>{error}</Alert>
      </div>
    )
  }

  if (!course) {
    return <Spinner label="Carregando curso" />
  }

  const meta = levelMeta[course.level]
  const locked = !isAuthenticated || !hasActiveSubscription

  function openLesson(lessonSlug: string) {
    if (!isAuthenticated) {
      navigate('/entrar')
      return
    }
    navigate(`/cursos/${slug}/${lessonSlug}`)
  }

  return (
    <div className="mx-auto grid max-w-6xl gap-10 px-6 py-14 md:grid-cols-[1fr_320px]">
      <div>
        <div className="mb-4 flex items-center gap-3">
          <span className={`font-mono text-xs ${meta.text}`}>{meta.label}</span>
          {course.language && <span className="text-xs text-muted">· {course.language}</span>}
        </div>
        <h1 className="font-display text-3xl font-semibold text-paper">{course.title}</h1>
        <p className="mt-4 max-w-2xl whitespace-pre-line text-muted">{course.description}</p>

        <div className="mt-10 border-t border-ink-line">
          <h2 className="mb-2 mt-6 font-display text-lg font-semibold text-paper">
            Aulas ({course.lessons.length})
          </h2>
          {course.lessons.length === 0 ? (
            <p className="py-6 text-sm text-muted">Nenhuma aula publicada ainda.</p>
          ) : (
            <div>
              {course.lessons.map((lesson, index) => (
                <LessonListItem
                  key={lesson.id}
                  lesson={lesson}
                  index={index}
                  locked={locked}
                  onClick={() => openLesson(lesson.slug)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <aside className="h-fit rounded-lg border border-ink-line bg-ink-soft p-5">
        <p className="font-mono text-xs text-muted">duracao total</p>
        <p className="mt-1 font-display text-xl text-paper">{formatMinutes(course.durationMinutes)}</p>

        {isAuthenticated && progress && (
          <div className="mt-5">
            <div className="flex items-center justify-between text-xs text-muted">
              <span>progresso</span>
              <span className="font-mono">{Math.round(progress.percentage)}%</span>
            </div>
            <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-ink-line">
              <div
                className="h-full rounded-full bg-teal transition-all"
                style={{ width: `${progress.percentage}%` }}
              />
            </div>
            {progress.courseCompleted && (
              <div className="mt-3">
                <Badge tone="teal">curso concluido</Badge>
              </div>
            )}
          </div>
        )}

        <div className="mt-6">
          {!isAuthenticated && (
            <Link
              to="/entrar"
              className="block w-full rounded-md bg-amber px-4 py-2.5 text-center text-sm font-medium text-ink hover:bg-amber-dim"
            >
              Entrar para assistir
            </Link>
          )}
          {isAuthenticated && !hasActiveSubscription && (
            <Link
              to="/planos"
              className="block w-full rounded-md bg-amber px-4 py-2.5 text-center text-sm font-medium text-ink hover:bg-amber-dim"
            >
              Assinar para assistir
            </Link>
          )}
          {isAuthenticated && hasActiveSubscription && (
            <Badge tone="teal">acesso liberado</Badge>
          )}
        </div>
      </aside>
    </div>
  )
}
