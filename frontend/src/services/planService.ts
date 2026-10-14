import { api } from '@/lib/api'
import type { Plan } from '@/types'

export const planService = {
  list: () => api.get<Plan[]>('/plans'),
}
