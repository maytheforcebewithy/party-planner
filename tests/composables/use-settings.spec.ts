import { beforeEach, describe, expect, it } from 'vitest'
import { defineComponent } from 'vue'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { readStoredLanguage, useSettings } from '~/composables/use-settings'

async function make(): Promise<ReturnType<typeof useSettings>> {
  let api: ReturnType<typeof useSettings> | undefined
  await mountSuspended(defineComponent({
    setup() {
      api = useSettings()
      return () => null
    },
  }))
  if (!api) throw new Error('composable did not initialise')
  return api
}

describe('useSettings', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('reads a valid stored language, else null', () => {
    expect(readStoredLanguage()).toBeNull()
    localStorage.setItem('party-planner.language', 'en')
    expect(readStoredLanguage()).toBe('en')
    localStorage.setItem('party-planner.language', 'xx')
    expect(readStoredLanguage()).toBeNull()
  })

  it('switches the language and persists the choice', async () => {
    const { language, setLanguage } = await make()

    await setLanguage('en')

    expect(language.value).toBe('en')
    expect(localStorage.getItem('party-planner.language')).toBe('en')

    await setLanguage('de')
    expect(language.value).toBe('de')
  })
})
