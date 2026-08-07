import { describe, expect, it } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import IndexPage from '~/pages/index.vue'

describe('parties index page', () => {
  it('offers a way to create a new party', async () => {
    const wrapper = await mountSuspended(IndexPage)

    const hrefs = wrapper.findAll('a').map(anchor => anchor.attributes('href'))
    expect(hrefs).toContain('/parties/create')
  })
})
