import { describe, expect, it } from 'vitest'
import { shareNoticeKey } from '~/shared/sharing/share-text'

describe('shareNoticeKey', () => {
  it('maps copy/unavailable to a notice key and shared/cancelled to none', () => {
    expect(shareNoticeKey('copied')).toBe('share.copied')
    expect(shareNoticeKey('unavailable')).toBe('share.unavailable')
    expect(shareNoticeKey('shared')).toBeNull()
    expect(shareNoticeKey('cancelled')).toBeNull()
  })
})
