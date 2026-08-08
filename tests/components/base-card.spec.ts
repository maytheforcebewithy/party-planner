import { describe, expect, it } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import BaseCard from '~/components/base/BaseCard.vue'

describe('BaseCard', () => {
  it('renders the heading when a title is given', async () => {
    const wrapper = await mountSuspended(BaseCard, { props: { title: 'Language' } })

    expect(wrapper.get('.card__title').text()).toBe('Language')
  })

  it('omits the heading when no title is given', async () => {
    const wrapper = await mountSuspended(BaseCard)

    expect(wrapper.find('.card__title').exists()).toBe(false)
  })

  it('renders slotted content', async () => {
    const wrapper = await mountSuspended(BaseCard, {
      slots: { default: () => 'Body' },
    })

    expect(wrapper.text()).toContain('Body')
  })
})
