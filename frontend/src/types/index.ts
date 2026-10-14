// Tipos espelhando os DTOs da API (ver README do backend).

export interface Student {
  id: number
  name: string
  email: string
  createdAt: string
}

export interface LoginResponse {
  token: string
  tokenType: string
  expiresInSeconds: number
  student: Student
}

export type PlanType = 'MENSAL' | 'ANUAL' | 'VITALICIO'

export interface Plan {
  id: number
  name: string
  type: PlanType
  description: string
  durationDays: number | null
  price: number
  lifetime: boolean
}

export type SubscriptionStatus = 'PENDING' | 'ACTIVE' | 'EXPIRED' | 'CANCELLED'

export interface Subscription {
  id: number
  planName: string
  status: SubscriptionStatus
  startedAt: string | null
  activatedAt: string | null
  expiresAt: string | null
}

export interface QrCodeResponse {
  subscriptionId: number
  paymentCode: string
  qrCodeImageBase64: string
  status: SubscriptionStatus
}

export type CourseLevel = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED'

export interface Course {
  id: number
  title: string
  slug: string
  language: string | null
  level: CourseLevel
  thumbnailUrl: string | null
  durationMinutes: number
}

export interface LessonSummary {
  id: number
  title: string
  slug: string
  thumbnailUrl: string | null
  durationSeconds: number
  order: number
}

export interface CourseDetail {
  id: number
  title: string
  slug: string
  description: string
  language: string | null
  level: CourseLevel
  thumbnailUrl: string | null
  durationMinutes: number
  lessons: LessonSummary[]
}

export interface LessonVideo {
  id: number
  title: string
  videoUrl: string
  durationSeconds: number
}

export interface CourseProgress {
  courseId: number
  totalLessons: number
  completedLessons: number
  percentage: number
  courseCompleted: boolean
}

export interface CertificateValidation {
  valid: boolean
  student: string | null
  course: string | null
  completedAt: string | null
  courseDurationMinutes: number | null
}

export interface ApiError {
  timestamp: string
  status: number
  error: string
  message: string
  path: string
  details?: string[]
}
