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
      startTime: null,
      endTime: null,
      location: null,
      description: null,
      hinweise: null,
      icon: 'cake',
      color: 'green',
      image: null,
      link: null,
    })
  })

  it('emits the time and hinweise fields when they are filled', async () => {
    const wrapper = await mountSuspended(PartyForm, { props: { submitLabel: 'Save' } })

    await wrapper.find('input').setValue('Picnic')
    await wrapper.find('input[type="time"]').setValue('18:00')
    await wrapper.findAll('input[type="time"]')[1]?.setValue('23:30')
    await wrapper.findAll('textarea')[1]?.setValue('  Bring a blanket  ')
    await wrapper.find('form').trigger('submit.prevent')

    expect(wrapper.emitted('submit')?.[0]?.[0]).toMatchObject({
      startTime: '18:00',
      endTime: '23:30',
      hinweise: 'Bring a blanket',
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
          startTime: '19:00',
          endTime: null,
          hinweise: 'Dress code: green',
          icon: 'star',
          color: 'sky',
          image: null,
          link: 'https://open.spotify.com/x',
          received: false,
          guests: [],
          shopping: [],
          createdAt: '',
          updatedAt: '',
        },
      },
    })

    expect(wrapper.find('input').element.value).toBe('Existing')
    expect(wrapper.find('input[type="time"]').element.value).toBe('19:00')
    expect(wrapper.find('[data-testid="icon-star"]').attributes('aria-pressed')).toBe('true')
    expect(wrapper.find('[data-testid="color-sky"]').attributes('aria-pressed')).toBe('true')
  })

  it('emits the chosen icon and colour', async () => {
    const wrapper = await mountSuspended(PartyForm, { props: { submitLabel: 'Save' } })

    await wrapper.find('input').setValue('Picnic')
    await wrapper.find('[data-testid="icon-balloon"]').trigger('click')
    await wrapper.find('[data-testid="color-pink"]').trigger('click')
    await wrapper.find('form').trigger('submit.prevent')

    expect(wrapper.emitted('submit')?.[0]?.[0]).toMatchObject({
      icon: 'balloon',
      color: 'pink',
    })
  })

  it('normalises the link on submit', async () => {
    const wrapper = await mountSuspended(PartyForm, { props: { submitLabel: 'Save' } })

    await wrapper.find('input').setValue('Picnic')
    await wrapper.find('input[type="url"]').setValue('open.spotify.com/x')
    await wrapper.find('form').trigger('submit.prevent')

    expect(wrapper.emitted('submit')?.[0]?.[0]).toMatchObject({ link: 'https://open.spotify.com/x' })
  })
})
