import { describe, expect, it } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import PartyForm from '~/features/parties/components/PartyForm.vue'

describe('PartyForm', () => {
  it('blocks submit and shows an error when the name is empty', async () => {
    const wrapper = await mountSuspended(PartyForm, { props: { submitLabel: 'Save' } })

    await wrapper.find('form').trigger('submit.prevent')

    expect(wrapper.emitted('submit')).toBeUndefined()
    expect(wrapper.find('[role="alert"]').exists()).toBe(true)
  })

  it('emits a normalised payload with nulls for empty optional fields', async () => {
    const wrapper = await mountSuspended(PartyForm, { props: { submitLabel: 'Save' } })

    await wrapper.find('input').setValue('  Summer party  ')
    await wrapper.find('form').trigger('submit.prevent')

    expect(wrapper.emitted('submit')?.[0]?.[0]).toEqual({
      name: 'Summer party',
      date: null,
      location: null,
      description: null,
    })
  })

  it('pre-fills fields from an initial party when editing', async () => {
    const wrapper = await mountSuspended(PartyForm, {
      props: {
        submitLabel: 'Save',
        initial: {
          id: '1',
          name: 'Existing',
          date: '2026-09-01',
          location: 'Hall',
          description: 'Notes',
          createdAt: '',
          updatedAt: '',
        },
      },
    })

    expect(wrapper.find('input').element.value).toBe('Existing')
  })
})
