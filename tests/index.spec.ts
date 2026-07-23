import { describe, expect, it } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import IndexPage from '~/pages/index.vue'

describe('app setup', () => {
  it('renders the minimal start view', async () => {
    const wrapper = await mountSuspended(IndexPage)

    expect(wrapper.text()).toContain('Party Planner')
    expect(wrapper.text()).toContain('App setup successful')
  })
})
