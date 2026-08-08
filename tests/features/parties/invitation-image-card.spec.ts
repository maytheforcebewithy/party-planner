import { describe, expect, it } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import InvitationImageCard from '~/features/parties/components/InvitationImageCard.vue'
import type { Party } from '~/features/parties/types/party'

const party: Party = {
  id: 'p1',
  name: 'Sommerfest',
  date: '2026-08-15',
  location: 'Stadtpark',
  description: 'ignored on the card',
  startTime: '18:00',
  endTime: '23:30',
  notes: 'Decke mitbringen',
  icon: 'star',
  color: 'sky',
  image: null,
  link: null,
  received: false,
  attendance: null,
  guests: [],
  shopping: [],
  createdAt: '',
  updatedAt: '',
}

describe('InvitationImageCard', () => {
  it('renders the party name, date/time, location and notes', async () => {
    const wrapper = await mountSuspended(InvitationImageCard, { props: { party } })

    expect(wrapper.get('.invite__name').text()).toBe('Sommerfest')
    expect(wrapper.text()).toContain('August')
    expect(wrapper.text()).toContain('18:00')
    expect(wrapper.text()).toContain('Stadtpark')
    expect(wrapper.get('.invite__notes').text()).toBe('Decke mitbringen')
  })

  it('omits the location and notes when they are not set', async () => {
    const wrapper = await mountSuspended(InvitationImageCard, {
      props: { party: { ...party, location: null, notes: null } },
    })

    expect(wrapper.find('.invite__notes').exists()).toBe(false)
    expect(wrapper.text()).not.toContain('Stadtpark')
  })
})
