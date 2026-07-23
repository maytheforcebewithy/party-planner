import { describe, expect, it } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import AppContainer from '~/components/AppContainer.vue'

describe('AppContainer', () => {
  it('renders its default slot content', async () => {
    const wrapper = await mountSuspended(AppContainer, {
      slots: { default: () => 'slotted content' },
    })

    expect(wrapper.find('.app-container').exists()).toBe(true)
    expect(wrapper.text()).toContain('slotted content')
  })
})
