import { api } from '@/lib/api'
import type { Course, CourseDetail } from '@/types'

export const courseService = {
  list: () => api.get<Course[]>('/courses'),
  detail: (slug: string) => api.get<CourseDetail>(`/courses/${slug}`),
}
