import { beforeEach, describe, expect, it, vi } from 'vitest'
import { defineComponent } from 'vue'
import { mountSuspended } from '@nuxt/test-utils/runtime'

const { canShare, share } = vi.hoisted(() => ({ canShare: vi.fn(), share: vi.fn() }))
vi.mock('@capacitor/share', () => ({ Share: { canShare, share } }))

const { useShareApp } = await import('~/composables/use-share-app')

async function make(): Promise<ReturnType<typeof useShareApp>> {
  let api: ReturnType<typeof useShareApp> | undefined
  await mountSuspended(defineComponent({
    setup() {
      api = useShareApp()
      return () => null
    },
  }))
  if (!api) throw new Error('composable did not initialise')
  return api
}

describe('useShareApp', () => {
  beforeEach(() => {
    canShare.mockReset()
    share.mockReset()
  })

  it('shares the app text including both store links', async () => {
    canShare.mockResolvedValue({ value: true })
    share.mockResolvedValue(undefined)

    const { shareApp } = await make()
    const result = await shareApp()

    expect(result).toBe('shared')
    const text = (share.mock.calls[0]?.[0] as { text: string }).text
    expect(text).toContain('play.google.com')
    expect(text).toContain('apps.apple.com')
  })
})
