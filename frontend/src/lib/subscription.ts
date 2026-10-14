import type { Subscription } from '@/types'

/**
 * The API's `status` field is set to ACTIVE at activation time but isn't
 * flipped to EXPIRED by a background job - server-side access control
 * re-checks `expiresAt` on every request instead (see backend
 * SubscriptionService.hasActiveSubscription). The UI mirrors that same
 * check here so the subscription badge never claims "ativa" for something
 * the API would actually reject.
 */
export function isSubscriptionCurrentlyValid(subscription: Subscription): boolean {
  if (subscription.status !== 'ACTIVE') return false
  if (!subscription.expiresAt) return true // lifetime plan
  return new Date(subscription.expiresAt).getTime() > Date.now()
}

export function hasAnyActiveSubscription(subscriptions: Subscription[]): boolean {
  return subscriptions.some(isSubscriptionCurrentlyValid)
}
