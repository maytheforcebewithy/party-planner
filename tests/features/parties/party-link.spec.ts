import { describe, expect, it } from 'vitest'
import { linkHost, normalizeLink } from '~/features/parties/services/party-link'

describe('normalizeLink', () => {
  it('returns null for blank input', () => {
    expect(normalizeLink('')).toBeNull()
    expect(normalizeLink('   ')).toBeNull()
  })

  it('keeps an existing http(s) scheme and trims', () => {
    expect(normalizeLink('  https://open.spotify.com/x ')).toBe('https://open.spotify.com/x')
    expect(normalizeLink('http://example.com')).toBe('http://example.com')
  })

  it('prepends https:// when the scheme is missing', () => {
    expect(normalizeLink('open.spotify.com/x')).toBe('https://open.spotify.com/x')
  })
})

describe('linkHost', () => {
  it('returns the host of a URL', () => {
    expect(linkHost('https://open.spotify.com/playlist/42')).toBe('open.spotify.com')
  })

  it('returns the raw value when it cannot be parsed', () => {
    expect(linkHost('not a url')).toBe('not a url')
  })
})
