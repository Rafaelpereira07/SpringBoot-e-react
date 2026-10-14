/**
 * Validates required environment variables at startup instead of letting
 * `undefined` silently leak into an axios baseURL (which would produce
 * confusing "Network Error"s pointing at "undefined/...").
 */
function readApiUrl(): string {
  const raw = import.meta.env.VITE_API_URL
  if (!raw) {
    throw new Error(
      'VITE_API_URL nao esta definida. Copie .env.example para .env e preencha a URL da API.',
    )
  }
  return raw.replace(/\/+$/, '')
}

export const env = {
  apiUrl: readApiUrl(),
  isProd: import.meta.env.PROD,
} as const
