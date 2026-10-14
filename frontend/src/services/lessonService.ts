import { api } from '@/lib/api'
import type { LessonVideo } from '@/types'

export const lessonService = {
  watch: (courseSlug: string, lessonSlug: string) =>
    api.get<LessonVideo>(`/courses/${courseSlug}/${lessonSlug}`),
}
