import { beforeEach, describe, expect, it, vi } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import AppLanguagePicker from '~/components/app/AppLanguagePicker.vue'

describe('AppLanguagePicker', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('lists each supported language by its endonym', async () => {
    const wrapper = await mountSuspended(AppLanguagePicker)

    expect(wrapper.get('[data-testid="language-option-de"]').text()).toContain('Deutsch')
    expect(wrapper.get('[data-testid="language-option-en"]').text()).toContain('English')
  })

  it('persists the picked language on tap', async () => {
    const wrapper = await mountSuspended(AppLanguagePicker)

    await wrapper.get('[data-testid="language-option-de"]').trigger('click')

    await vi.waitFor(() => {
      expect(localStorage.getItem('party-planner.language')).toBe('de')
    })
  })
})
