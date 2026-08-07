import { beforeEach, describe, expect, it, vi } from 'vitest'
import { defineComponent } from 'vue'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import type { Party } from '~/features/parties/types/party'

const { canShare, share } = vi.hoisted(() => ({ canShare: vi.fn(), share: vi.fn() }))
vi.mock('@capacitor/share', () => ({ Share: { canShare, share } }))

const { useShareInvitation } = await import('~/features/parties/composables/use-share-invitation')

const party: Party = {
  id: 'p1',
  name: 'Gartenparty',
  date: '2026-08-20',
  location: 'Stadtpark',
  description: null,
  startTime: '18:00',
  endTime: null,
  hinweise: null,
  icon: null,
  color: null,
  image: null,
  link: null,
  received: false,
  guests: [],
  shopping: [],
  createdAt: '',
  updatedAt: '',
}

async function make(): Promise<ReturnType<typeof useShareInvitation>> {
  let api: ReturnType<typeof useShareInvitation> | undefined
  await mountSuspended(defineComponent({
    setup() {
      api = useShareInvitation()
      return () => null
    },
  }))
  if (!api) throw new Error('composable did not initialise')
  return api
}

describe('useShareInvitation', () => {
  beforeEach(() => {
    canShare.mockReset()
    share.mockReset()
  })

  it('shares the invitation text through the OS sheet', async () => {
    canShare.mockResolvedValue({ value: true })
    share.mockResolvedValue(undefined)

    const { shareInvitation } = await make()
    const result = await shareInvitation(party)

    expect(result).toBe('shared')
    const payload = share.mock.calls[0]?.[0] as { text: string, title: string }
    expect(payload.text).toContain('Gartenparty')
    expect(payload.text).toContain('Stadtpark')
    expect(payload.title).toContain('Gartenparty')
  })

  it('treats a dismissed share sheet as cancelled, not an error', async () => {
    canShare.mockResolvedValue({ value: true })
    share.mockRejectedValue(Object.assign(new Error('dismissed'), { name: 'AbortError' }))

    const { shareInvitation } = await make()
    expect(await shareInvitation(party)).toBe('cancelled')
  })

  it('falls back to the clipboard when sharing is unavailable', async () => {
    canShare.mockResolvedValue({ value: false })
    const writeText = vi.fn().mockResolvedValue(undefined)
    vi.stubGlobal('navigator', { clipboard: { writeText } })

    const { shareInvitation } = await make()
    const result = await shareInvitation(party)

    expect(result).toBe('copied')
    expect(writeText).toHaveBeenCalledOnce()
    vi.unstubAllGlobals()
  })
})
