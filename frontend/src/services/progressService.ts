import { api } from '@/lib/api'
import type { CourseProgress } from '@/types'

export const progressService = {
  complete: (courseSlug: string, lessonSlug: string) =>
    api.post<{ lessonId: number; completed: boolean; completedAt: string | null }>(
      '/progress/complete',
      { courseSlug, lessonSlug },
    ),
  courseProgress: (courseSlug: string) =>
    api.get<CourseProgress>(`/progress/courses/${courseSlug}`),
}
