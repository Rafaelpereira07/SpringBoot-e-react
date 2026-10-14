/**
 * Thin wrapper around the Web Crypto API (AES-GCM, 256-bit) used to encrypt
 * the JWT before it touches sessionStorage.
 *
 * Honest scope of what this protects against: anything that reads
 * sessionStorage WITHOUT executing JavaScript in this origin (a careless
 * log line, a browser-extension dump, an exported storage snapshot, a
 * screenshot-based bug report) sees ciphertext, not a usable bearer token.
 * It does NOT protect against a genuine XSS vulnerability in this app -
 * malicious JS running on the page can call the same decrypt function we
 * do. There is no way to fully solve that on the client; the real fix for
 * token theft via XSS is an httpOnly, SameSite cookie issued by the
 * backend, which this REST API (by design, for a portable Bearer-token
 * API) does not use. Treat this as defense-in-depth, not a replacement
 * for sanitizing all rendered content (which React does by default - see
 * README) and keeping dependencies patched.
 */

const AES_ALGO = { name: 'AES-GCM', length: 256 }
const IV_BYTES = 12

// Newer TypeScript DOM typings pin BufferSource to Uint8Array<ArrayBuffer>
// specifically, while plain `new Uint8Array(n)` / `.slice()` infer the wider
// `Uint8Array<ArrayBufferLike>`. The values are always real, non-shared
// ArrayBuffers at runtime (nothing here ever touches a SharedArrayBuffer),
// so this local helper documents and contains that cast in one place
// instead of sprinkling `as unknown as BufferSource` through the file.
function asBufferSource(bytes: Uint8Array): BufferSource {
  return bytes as unknown as BufferSource
}

async function getOrCreateKey(): Promise<CryptoKey> {
  const stored = sessionStorage.getItem('dp:k')
  if (stored) {
    const raw = base64ToBytes(stored)
    return crypto.subtle.importKey('raw', asBufferSource(raw), AES_ALGO, false, ['encrypt', 'decrypt'])
  }

  const key = await crypto.subtle.generateKey(AES_ALGO, true, ['encrypt', 'decrypt'])
  const exported = await crypto.subtle.exportKey('raw', key)
  sessionStorage.setItem('dp:k', bytesToBase64(new Uint8Array(exported)))
  return key
}

export async function encryptText(plainText: string): Promise<string> {
  const key = await getOrCreateKey()
  const iv = crypto.getRandomValues(new Uint8Array(IV_BYTES))
  const encoded = new TextEncoder().encode(plainText)
  const cipherBuffer = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv: asBufferSource(iv) },
    key,
    asBufferSource(encoded),
  )

  const combined = new Uint8Array(iv.length + cipherBuffer.byteLength)
  combined.set(iv, 0)
  combined.set(new Uint8Array(cipherBuffer), iv.length)
  return bytesToBase64(combined)
}

export async function decryptText(payload: string): Promise<string> {
  const key = await getOrCreateKey()
  const combined = base64ToBytes(payload)
  const iv = combined.slice(0, IV_BYTES)
  const cipherBytes = combined.slice(IV_BYTES)

  const plainBuffer = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv: asBufferSource(iv) },
    key,
    asBufferSource(cipherBytes),
  )
  return new TextDecoder().decode(plainBuffer)
}

export function clearEncryptionKey(): void {
  sessionStorage.removeItem('dp:k')
}

function bytesToBase64(bytes: Uint8Array): string {
  let binary = ''
  for (const byte of bytes) binary += String.fromCharCode(byte)
  return btoa(binary)
}

function base64ToBytes(base64: string): Uint8Array {
  const binary = atob(base64)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i)
  return bytes
}
