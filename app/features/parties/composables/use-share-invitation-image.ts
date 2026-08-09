import { toPng } from 'html-to-image'
import { fileSlug } from '../services/file-slug'
import type { Party } from '../types/party'
import { saveOrShareImage } from '~/shared/files/save-file'
import { logger } from '~/shared/logger'

/** Render at 3× so the shared PNG stays crisp on high-density phone screens. */
const IMAGE_PIXEL_RATIO = 3

/**
 * Renders a party's invitation card (an off-screen DOM node) to a PNG and hands
 * it to the OS share sheet / browser download. Fonts are system fonts, so we
 * skip web-font embedding — it only adds latency and can fail on CORS.
 */
export function useShareInvitationImage() {
  const generating = ref(false)

  /** Resolves `true` when the image was produced and handed off, `false` on failure. */
  async function shareInvitationImage(node: HTMLElement, party: Party): Promise<boolean> {
    if (generating.value) return false
    generating.value = true
    try {
      const dataUrl = await toPng(node, { pixelRatio: IMAGE_PIXEL_RATIO, skipFonts: true })
      await saveOrShareImage(dataUrl, `party-planner-${fileSlug(party.name)}.png`)
      return true
    }
    catch (error) {
      // A render/write/share failure would otherwise be an unhandled rejection
      // (the caller fires this and forgets); log it and report failure instead.
      logger.error('Failed to share the invitation image', error)
      return false
    }
    finally {
      generating.value = false
    }
  }

  return { shareInvitationImage, generating: readonly(generating) }
}
