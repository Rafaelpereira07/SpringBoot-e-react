import { api } from '@/lib/api'
import type { PlanType, QrCodeResponse, Subscription } from '@/types'

export const subscriptionService = {
  subscribe: (planType: PlanType) =>
    api.post<QrCodeResponse>('/subscriptions', { planType }),
  confirm: (paymentCode: string) =>
    api.post<Subscription>(`/subscriptions/${paymentCode}/confirm`),
  mine: () => api.get<Subscription[]>('/subscriptions/me'),
}
