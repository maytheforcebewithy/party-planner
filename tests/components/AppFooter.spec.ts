import { describe, expect, it } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import AppFooter from '~/components/AppFooter.vue'

describe('AppFooter', () => {
  it('renders a footer element with the brand note', async () => {
    const wrapper = await mountSuspended(AppFooter)

    expect(wrapper.find('footer.app-footer').exists()).toBe(true)
    expect(wrapper.text()).toContain('Party Planner')
  })
})
