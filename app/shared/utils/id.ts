/**
 * Generate a locally-unique id. Uses the Web Crypto `randomUUID`, available in
 * the Capacitor webview and in browsers/tests — no dependency and no backend.
 */
export function createId(): string {
  return crypto.randomUUID()
}
