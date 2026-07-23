import { describe, expect, it } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import AppHeader from '~/components/AppHeader.vue'

describe('AppHeader', () => {
  it('renders the brand inside a header element', async () => {
    const wrapper = await mountSuspended(AppHeader)

    expect(wrapper.find('header.app-header').exists()).toBe(true)
    expect(wrapper.text()).toContain('Party Planner')
  })
})
