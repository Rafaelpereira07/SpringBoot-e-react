import { clearEncryptionKey, decryptText, encryptText } from './crypto'

/**
 * Persists the JWT in sessionStorage (cleared when the tab closes - never
 * localStorage, which would survive indefinitely) as AES-GCM ciphertext.
 * See crypto.ts for exactly what this does and does not protect against.
 */
const TOKEN_KEY = 'dp:t'

export async function saveToken(token: string): Promise<void> {
  const encrypted = await encryptText(token)
  sessionStorage.setItem(TOKEN_KEY, encrypted)
}

export async function readToken(): Promise<string | null> {
  const stored = sessionStorage.getItem(TOKEN_KEY)
  if (!stored) return null
  try {
    return await decryptText(stored)
  } catch {
    // Corrupted or tampered payload: treat as logged out rather than throwing.
    clearToken()
    return null
  }
}

export function clearToken(): void {
  sessionStorage.removeItem(TOKEN_KEY)
  clearEncryptionKey()
}
