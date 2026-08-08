import { beforeEach, describe, expect, it } from 'vitest'
import { defineComponent, nextTick } from 'vue'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { resolveTheme, useTheme } from '~/composables/use-theme'

async function make(): Promise<ReturnType<typeof useTheme>> {
  let api: ReturnType<typeof useTheme> | undefined
  await mountSuspended(defineComponent({
    setup() {
      api = useTheme()
      return () => null
    },
  }))
  if (!api) throw new Error('composable did not initialise')
  return api
}

describe('resolveTheme', () => {
  it('forces the chosen scheme regardless of the OS', () => {
    expect(resolveTheme('light', 'dark')).toBe('light')
    expect(resolveTheme('dark', 'light')).toBe('dark')
  })

  it('follows the OS in auto mode', () => {
    expect(resolveTheme('auto', 'light')).toBe('light')
    expect(resolveTheme('auto', 'dark')).toBe('dark')
  })

  it('is dark-first when the OS has no preference', () => {
    expect(resolveTheme('auto', 'no-preference')).toBe('dark')
  })
})

describe('useTheme', () => {
  beforeEach(() => {
    localStorage.clear()
    delete document.documentElement.dataset.theme
  })

  it('defaults to auto and applies the resolved scheme to <html>', async () => {
    const { mode, resolved } = await make()

    expect(mode.value).toBe('auto')
    expect(document.documentElement.dataset.theme).toBe(resolved.value)
  })

  it('forces the chosen scheme, applies it to <html> and persists it', async () => {
    const { mode, resolved } = await make()

    mode.value = 'light'
    await nextTick()
    expect(resolved.value).toBe('light')
    expect(document.documentElement.dataset.theme).toBe('light')
    expect(localStorage.getItem('party-planner.theme')).toBe('light')

    mode.value = 'dark'
    await nextTick()
    expect(resolved.value).toBe('dark')
    expect(document.documentElement.dataset.theme).toBe('dark')
  })

  it('reads a previously stored choice', async () => {
    localStorage.setItem('party-planner.theme', 'light')
    const { mode, resolved } = await make()

    expect(mode.value).toBe('light')
    expect(resolved.value).toBe('light')
  })
})
