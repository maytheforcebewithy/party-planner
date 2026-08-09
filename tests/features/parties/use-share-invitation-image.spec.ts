import { beforeEach, describe, expect, it, vi } from 'vitest'
import { defineComponent } from 'vue'
import { mountSuspended } from '@nuxt/test-utils/runtime'

const { toPng } = vi.hoisted(() => ({ toPng: vi.fn() }))
vi.mock('html-to-image', () => ({ toPng }))

const { saveOrShareImage } = vi.hoisted(() => ({ saveOrShareImage: vi.fn() }))
vi.mock('~/shared/files/save-file', () => ({ saveOrShareImage }))

const { useShareInvitationImage } = await import('~/features/parties/composables/use-share-invitation-image')

const party = { id: 'p1', name: 'Fest' }

async function make(): Promise<ReturnType<typeof useShareInvitationImage>> {
  let api: ReturnType<typeof useShareInvitationImage> | undefined
  await mountSuspended(defineComponent({
    setup() {
      api = useShareInvitationImage()
      return () => null
    },
  }))
  if (!api) throw new Error('composable did not initialise')
  return api
}

describe('useShareInvitationImage', () => {
  beforeEach(() => {
    toPng.mockReset()
    saveOrShareImage.mockReset()
  })

  it('renders the node to a PNG, hands it off, and returns true', async () => {
    toPng.mockResolvedValue('data:image/png;base64,AAA')
    saveOrShareImage.mockResolvedValue(undefined)
    const { shareInvitationImage } = await make()

    const ok = await shareInvitationImage(document.createElement('div'), party as never)

    expect(ok).toBe(true)
    expect(saveOrShareImage).toHaveBeenCalledWith('data:image/png;base64,AAA', 'party-planner-fest.png')
  })

  it('swallows a render/share failure and returns false (no unhandled rejection)', async () => {
    toPng.mockRejectedValue(new Error('render failed'))
    const { shareInvitationImage } = await make()

    const ok = await shareInvitationImage(document.createElement('div'), party as never)

    expect(ok).toBe(false)
    expect(saveOrShareImage).not.toHaveBeenCalled()
  })
})
