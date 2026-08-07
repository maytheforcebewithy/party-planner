import { describe, expect, it } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import PartyListItem from '~/features/parties/components/PartyListItem.vue'
import type { Party } from '~/features/parties/types/party'

const party: Party = {
  id: 'p1',
  name: 'Sommerfest',
  date: '2026-08-15',
  location: 'Park',
  description: null,
  startTime: null,
  endTime: null,
  hinweise: null,
  icon: null,
  color: null,
  image: null,
  link: null,
  received: false,
  guests: [],
  shopping: [],
  createdAt: '',
  updatedAt: '',
}

describe('PartyListItem', () => {
  it('links to the party detail and shows name, date and location', async () => {
    const wrapper = await mountSuspended(PartyListItem, { props: { party } })

    expect(wrapper.find('a').attributes('href')).toBe('/parties/p1')
    expect(wrapper.text()).toContain('Sommerfest')
    expect(wrapper.find('.row__date').exists()).toBe(true)
    expect(wrapper.text()).toContain('Park')
  })

  it('omits the date and location lines when neither is set', async () => {
    const wrapper = await mountSuspended(PartyListItem, {
      props: { party: { ...party, date: null, location: null } },
    })

    expect(wrapper.find('.row__date').exists()).toBe(false)
    expect(wrapper.find('.row__location').exists()).toBe(false)
  })
})
