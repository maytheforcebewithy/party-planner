import { describe, expect, it } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import IndexPage from '~/pages/index.vue'

describe('index page', () => {
  it('shows the app title', async () => {
    const wrapper = await mountSuspended(IndexPage)

    expect(wrapper.find('h1').text()).toBe('Party Planner')
  })
})
