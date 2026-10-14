import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { EditorMockup } from '@/components/EditorMockup'
import { CourseCard } from '@/components/course/CourseCard'
import { Spinner } from '@/components/ui/Spinner'
import { courseService } from '@/services/courseService'
import type { Course } from '@/types'

export function HomePage() {
  const [courses, setCourses] = useState<Course[] | null>(null)

  useEffect(() => {
    let active = true
    courseService
      .list()
      .then((response) => {
        if (active) setCourses(response.data.slice(0, 3))
      })
      .catch(() => {
        if (active) setCourses([])
      })
    return () => {
      active = false
    }
  }, [])

  return (
    <div>
      <section className="mx-auto grid max-w-6xl items-center gap-16 px-6 py-20 md:grid-cols-2 md:py-28">
        <div className="flex flex-col gap-6">
          <h1 className="font-display text-4xl font-semibold leading-[1.1] text-paper md:text-5xl">
            Aprenda programacao assistindo, praticando e concluindo.
          </h1>
          <p className="max-w-md text-lg text-muted">
            Cursos em video com progresso salvo por aula, certificado emitido
            automaticamente ao concluir, e acesso enquanto sua assinatura
            estiver ativa.
          </p>
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Link
              to="/cursos"
              className="inline-flex items-center gap-2 rounded-md bg-amber px-5 py-3 text-sm font-medium text-ink transition-colors hover:bg-amber-dim"
            >
              Ver cursos
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/planos"
              className="inline-flex items-center gap-2 rounded-md border border-ink-line px-5 py-3 text-sm font-medium text-paper transition-colors hover:border-amber hover:text-amber"
            >
              Ver planos
            </Link>
          </div>
        </div>
        <EditorMockup />
      </section>

      <section className="border-t border-ink-line">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <div className="mb-8 flex items-end justify-between">
            <h2 className="font-display text-2xl font-semibold text-paper">Cursos recentes</h2>
            <Link to="/cursos" className="text-sm text-muted hover:text-amber">
              Ver todos
            </Link>
          </div>

          {courses === null && <Spinner label="Carregando cursos" />}

          {courses !== null && courses.length === 0 && (
            <p className="text-sm text-muted">
              Nenhum curso publicado ainda. Volte em breve.
            </p>
          )}

          {courses !== null && courses.length > 0 && (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {courses.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
