import { useEffect, useState } from 'react'
import { CourseCard } from '@/components/course/CourseCard'
import { Spinner } from '@/components/ui/Spinner'
import { Alert } from '@/components/ui/Alert'
import { courseService } from '@/services/courseService'
import { extractErrorMessage } from '@/lib/api'
import type { Course } from '@/types'

export function CoursesPage() {
  const [courses, setCourses] = useState<Course[] | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let active = true
    courseService
      .list()
      .then((response) => {
        if (active) setCourses(response.data)
      })
      .catch((err) => {
        if (active) setError(extractErrorMessage(err))
      })
    return () => {
      active = false
    }
  }, [])

  return (
    <div className="mx-auto max-w-6xl px-6 py-14">
      <h1 className="font-display text-3xl font-semibold text-paper">Cursos</h1>
      <p className="mt-2 max-w-lg text-muted">
        Descricao completa, aulas e duracao estao abertas para qualquer
        pessoa. Assinar e preciso apenas para assistir aos videos.
      </p>

      <div className="mt-10">
        {error && <Alert>{error}</Alert>}
        {!error && courses === null && <Spinner label="Carregando cursos" />}
        {!error && courses !== null && courses.length === 0 && (
          <p className="text-sm text-muted">Nenhum curso publicado ainda.</p>
        )}
        {!error && courses !== null && courses.length > 0 && (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {courses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
