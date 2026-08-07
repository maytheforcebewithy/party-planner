import { describe, expect, it } from 'vitest'
import { defineComponent } from 'vue'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { usePartyFormatting } from '~/features/parties/composables/use-party-formatting'

// The composable depends on `useI18n`, so exercise it inside a mounted setup.
async function formatting(): Promise<ReturnType<typeof usePartyFormatting>> {
  let api: ReturnType<typeof usePartyFormatting> | undefined
  await mountSuspended(defineComponent({
    setup() {
      api = usePartyFormatting()
      return () => null
    },
  }))
  if (!api) throw new Error('composable did not initialise')
  return api
}

describe('usePartyFormatting', () => {
  it('formats a full time window with both bounds', async () => {
    const { displayTime } = await formatting()

    const label = displayTime('18:00', '23:30')

    expect(label).toContain('18:00')
    expect(label).toContain('23:30')
  })

  it('labels a start-only and an end-only window distinctly', async () => {
    const { displayTime } = await formatting()

    expect(displayTime('18:00', null)).toContain('18:00')
    expect(displayTime(null, '23:30')).toContain('23:30')
  })

  it('returns null when no time is set', async () => {
    const { displayTime } = await formatting()

    expect(displayTime(null, null)).toBeNull()
  })

  it('falls back to a label when the date is missing', async () => {
    const { displayDate } = await formatting()

    expect(displayDate(null).length).toBeGreaterThan(0)
    expect(displayDate('2026-08-15')).toContain('August')
  })
})
