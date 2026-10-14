import { api } from '@/lib/api'
import type { LoginResponse, Student } from '@/types'

export interface RegisterPayload {
  name: string
  email: string
  password: string
}

export interface LoginPayload {
  email: string
  password: string
}

export const authService = {
  register: (payload: RegisterPayload) => api.post<Student>('/students/register', payload),
  login: (payload: LoginPayload) => api.post<LoginResponse>('/auth/login', payload),
  account: () => api.get<Student>('/account'),
}
