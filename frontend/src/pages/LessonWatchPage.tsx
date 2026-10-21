import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import axios from 'axios'
import { CheckCircle2 } from 'lucide-react'
import { Spinner } from '@/components/ui/Spinner'
import { Alert } from '@/components/ui/Alert'
import { Button } from '@/components/ui/Button'
import { lessonService } from '@/services/lessonService'
import { progressService } from '@/services/progressService'
import { extractErrorMessage } from '@/lib/api'
import type { ApiError, LessonVideo } from '@/types'

function getYouTubeEmbedUrl(rawUrl: string): string | null {
  try {
    const url = new URL(rawUrl)
    const host = url.hostname.toLowerCase().replace(/^www\./, '')
    let videoId: string | null = null

    if (host === 'youtu.be') {
      videoId = url.pathname.split('/').filter(Boolean)[0] ?? null
    } else if (host === 'youtube.com' || host === 'm.youtube.com') {
      if (url.pathname === '/watch') {
        videoId = url.searchParams.get('v')
      } else {
        const pathMatch = url.pathname.match(/^\/(?:embed|shorts|live)\/([^/?]+)/)
        videoId = pathMatch?.[1] ?? null
      }
    }

    return videoId ? `https://www.youtube.com/embed/${encodeURIComponent(videoId)}` : null
  } catch {
    return null
  }
}

export function LessonWatchPage() {
  const { courseSlug = '', lessonSlug = '' } = useParams()

  const [video, setVideo] = useState<LessonVideo | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [needsSubscription, setNeedsSubscription] = useState(false)
  const [isCompleting, setIsCompleting] = useState(false)
  const [completed, setCompleted] = useState(false)

  useEffect(() => {
    let active = true
    setVideo(null)
    setError(null)
    setNeedsSubscription(false)
    setCompleted(false)

    lessonService
      .watch(courseSlug, lessonSlug)
      .then((response) => {
        if (active) setVideo(response.data)
      })
      .catch((err: unknown) => {
        if (!active) return
        if (axios.isAxiosError<ApiError>(err) && err.response?.status === 403) {
          setNeedsSubscription(true)
          return
        }
        setError(extractErrorMessage(err))
      })

    return () => {
      active = false
    }
  }, [courseSlug, lessonSlug])

  async function handleComplete() {
    setIsCompleting(true)
    try {
      await progressService.complete(courseSlug, lessonSlug)
      setCompleted(true)
    } catch (err) {
      setError(extractErrorMessage(err))
    } finally {
      setIsCompleting(false)
    }
  }

  if (needsSubscription) {
    return (
      <div className="mx-auto max-w-xl px-6 py-20 text-center">
        <h1 className="font-display text-2xl font-semibold text-paper">
          Esta aula exige uma assinatura ativa
        </h1>
        <p className="mt-3 text-muted">
          Voce esta autenticado, mas nao ha uma assinatura ativa na sua
          conta para liberar este video.
        </p>
        <Link
          to="/planos"
          className="mt-6 inline-block rounded-md bg-amber px-5 py-2.5 text-sm font-medium text-ink hover:bg-amber-dim"
        >
          Ver planos
        </Link>
      </div>
    )
  }

  if (error) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-14">
        <Alert>{error}</Alert>
      </div>
    )
  }

  if (!video) {
    return <Spinner label="Carregando aula" />
  }

  const youtubeEmbedUrl = getYouTubeEmbedUrl(video.videoUrl)

  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <Link to={`/cursos/${courseSlug}`} className="text-sm text-muted hover:text-amber">
        ← Voltar para o curso
      </Link>

      <h1 className="mt-4 font-display text-2xl font-semibold text-paper">{video.title}</h1>

      <div className="mt-6 overflow-hidden rounded-lg border border-ink-line bg-black">
        {youtubeEmbedUrl ? (
          <iframe
            key={video.id}
            className="aspect-video w-full"
            src={youtubeEmbedUrl}
            title={video.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        ) : (
          // eslint-disable-next-line jsx-a11y/media-has-caption
          <video key={video.id} controls className="aspect-video w-full" src={video.videoUrl} />
        )}
      </div>

      <div className="mt-6 flex items-center gap-4">
        <Button onClick={handleComplete} isLoading={isCompleting} disabled={completed}>
          {completed ? 'Aula concluida' : 'Marcar aula como concluida'}
        </Button>
        {completed && <CheckCircle2 className="h-5 w-5 text-teal" aria-hidden="true" />}
      </div>
    </div>
  )
}
