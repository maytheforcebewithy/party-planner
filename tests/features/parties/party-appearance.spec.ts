import { describe, expect, it } from 'vitest'
import {
  COLOR_KEYS,
  DEFAULT_COLOR,
  DEFAULT_ICON,
  ICON_KEYS,
  ICON_PATHS,
  resolveColor,
  resolveIcon,
} from '~/features/parties/config/party-appearance'

describe('party appearance catalogue', () => {
  it('provides SVG paths for every icon key', () => {
    for (const key of ICON_KEYS) {
      expect(ICON_PATHS[key].length).toBeGreaterThan(0)
    }
  })

  it('defaults are the first offered option', () => {
    expect(DEFAULT_ICON).toBe(ICON_KEYS[0])
    expect(DEFAULT_COLOR).toBe(COLOR_KEYS[0])
  })

  it('keeps a known icon/colour key and falls back for unknown or null', () => {
    expect(resolveIcon('star')).toBe('star')
    expect(resolveIcon('does-not-exist')).toBe(DEFAULT_ICON)
    expect(resolveIcon(null)).toBe(DEFAULT_ICON)

    expect(resolveColor('pink')).toBe('pink')
    expect(resolveColor('does-not-exist')).toBe(DEFAULT_COLOR)
    expect(resolveColor(null)).toBe(DEFAULT_COLOR)
  })
})
