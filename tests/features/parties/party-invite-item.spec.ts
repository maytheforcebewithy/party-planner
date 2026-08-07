import { describe, expect, it } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import PartyInviteItem from '~/features/parties/components/PartyInviteItem.vue'
import type { Party } from '~/features/parties/types/party'

const party: Party = {
  id: 'p1',
  name: 'Gartenparty',
  date: '2026-08-15',
  location: null,
  description: null,
  startTime: null,
  endTime: null,
  hinweise: null,
  icon: null,
  color: null,
  image: null,
  link: null,
  guests: [],
  shopping: [],
  createdAt: '',
  updatedAt: '',
}

describe('PartyInviteItem', () => {
  it('shows the party name and date', async () => {
    const wrapper = await mountSuspended(PartyInviteItem, { props: { party } })

    expect(wrapper.text()).toContain('Gartenparty')
    expect(wrapper.find('.invite__date').exists()).toBe(true)
  })

  it('emits share when the share button is clicked', async () => {
    const wrapper = await mountSuspended(PartyInviteItem, { props: { party } })

    await wrapper.get('[data-testid="invite-share"]').trigger('click')

    expect(wrapper.emitted('share')).toBeTruthy()
  })
})
