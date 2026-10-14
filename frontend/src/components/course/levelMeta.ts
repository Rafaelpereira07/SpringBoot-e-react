import type { CourseLevel } from '@/types'

export const levelMeta: Record<CourseLevel, { label: string; border: string; text: string }> = {
  BEGINNER: { label: 'iniciante', border: 'border-t-teal', text: 'text-teal' },
  INTERMEDIATE: { label: 'intermediario', border: 'border-t-amber', text: 'text-amber' },
  ADVANCED: { label: 'avancado', border: 'border-t-coral', text: 'text-coral' },
}

export function formatMinutes(totalMinutes: number): string {
  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60
  if (hours === 0) return `${minutes}min`
  if (minutes === 0) return `${hours}h`
  return `${hours}h${String(minutes).padStart(2, '0')}`
}

export function formatSeconds(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${minutes}:${String(seconds).padStart(2, '0')}`
}
