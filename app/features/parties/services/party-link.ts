/**
 * Normalise a user-entered link to a URL, or `null` when blank. A missing
 * scheme defaults to `https://` so "open.spotify.com/…" becomes a valid link.
 */
export function normalizeLink(raw: string): string | null {
  const trimmed = raw.trim()
  if (!trimmed) return null
  return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`
}

/** A compact label for a link — its host, or the raw value if it won't parse. */
export function linkHost(url: string): string {
  try {
    return new URL(url).host
  }
  catch {
    return url
  }
}
