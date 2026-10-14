import axios, { AxiosError } from 'axios'
import { env } from './env'
import { readToken } from './secureStorage'
import type { ApiError } from '@/types'

export const api = axios.create({
  baseURL: env.apiUrl,
  timeout: 15_000,
  headers: {
    'Content-Type': 'application/json',
  },
})

/**
 * Registered by AuthContext so this module (which has no knowledge of
 * React Router) can react to a 401 by clearing the session and redirecting
 * to /login, without creating a circular import between api.ts and the
 * auth context.
 */
let unauthorizedHandler: (() => void) | null = null
export function setUnauthorizedHandler(handler: () => void): void {
  unauthorizedHandler = handler
}

// Attach the bearer token to every request that isn't explicitly public.
api.interceptors.request.use(async (config) => {
  const token = await readToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiError>) => {
    if (error.response?.status === 401) {
      unauthorizedHandler?.()
    }
    return Promise.reject(error)
  },
)

/** Extracts a user-facing message from a failed request, falling back to a generic one. */
export function extractErrorMessage(error: unknown): string {
  if (axios.isAxiosError<ApiError>(error)) {
    const details = error.response?.data?.details
    if (details?.length) return details.join(' ')
    if (error.response?.data?.message) return error.response.data.message
    if (error.code === 'ECONNABORTED') return 'A requisicao demorou demais. Tente novamente.'
    if (!error.response) return 'Nao foi possivel conectar a API. Verifique sua conexao.'
  }
  return 'Ocorreu um erro inesperado. Tente novamente.'
}
