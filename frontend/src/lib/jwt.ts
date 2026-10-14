/**
 * Reads the `exp` claim out of a JWT purely to decide, client-side, whether
 * to bother sending a request or show a "sessao expirada" state early.
 * This is NOT signature verification - a client can never verify an HMAC
 * JWT without the server's secret, and must not pretend to. The backend
 * remains the only source of truth for whether a token is actually valid;
 * this is a UX shortcut only.
 */
interface DecodedPayload {
  sub?: string
  exp?: number
  email?: string
}

function base64UrlDecode(segment: string): string {
  const padded = segment.replace(/-/g, '+').replace(/_/g, '/').padEnd(Math.ceil(segment.length / 4) * 4, '=')
  return atob(padded)
}

export function decodeJwtPayload(token: string): DecodedPayload | null {
  const parts = token.split('.')
  if (parts.length !== 3) return null
  try {
    return JSON.parse(base64UrlDecode(parts[1])) as DecodedPayload
  } catch {
    return null
  }
}

export function isTokenExpired(token: string): boolean {
  const payload = decodeJwtPayload(token)
  if (!payload?.exp) return true
  return payload.exp * 1000 <= Date.now()
}
