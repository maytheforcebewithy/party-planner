import { describe, expect, it } from 'vitest'
import { fileSlug } from '~/features/parties/services/file-slug'

describe('fileSlug', () => {
  it('lowercases and hyphenates a name', () => {
    expect(fileSlug('Sommer Fest 2026')).toBe('sommer-fest-2026')
  })

  it('collapses runs of non-alphanumerics and trims edge hyphens', () => {
    expect(fileSlug('  Anna & Ben!! ')).toBe('anna-ben')
  })

  it('falls back to "party" when nothing usable remains', () => {
    expect(fileSlug('——')).toBe('party')
    expect(fileSlug('')).toBe('party')
  })
})
