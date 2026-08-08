import { beforeEach, describe, expect, it } from 'vitest'
import { defineComponent } from 'vue'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { readStoredLanguage, useLanguage } from '~/composables/use-language'

async function make(): Promise<ReturnType<typeof useLanguage>> {
  let api: ReturnType<typeof useLanguage> | undefined
  await mountSuspended(defineComponent({
    setup() {
      api = useLanguage()
      return () => null
    },
  }))
  if (!api) throw new Error('composable did not initialise')
  return api
}

describe('useLanguage', () => {
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

  it('offers every supported language by its own endonym', async () => {
    const { options } = await make()
    expect(options.value).toEqual([
      { value: 'de', label: 'Deutsch' },
      { value: 'en', label: 'English' },
    ])
  })

  it('is unchosen on a fresh install, then switches and persists the choice', async () => {
    const { language, setLanguage, hasChosenLanguage } = await make()
    expect(hasChosenLanguage.value).toBe(false)

    await setLanguage('en')
    expect(language.value).toBe('en')
    expect(localStorage.getItem('party-planner.language')).toBe('en')
    expect(hasChosenLanguage.value).toBe(true)

    await setLanguage('de')
    expect(language.value).toBe('de')
    expect(localStorage.getItem('party-planner.language')).toBe('de')
  })
})
