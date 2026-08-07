import { createId } from '~/shared/utils/id'
import type { CreateParty } from '../types/party'

/** Days from today used for the demo party's date, so it stays upcoming. */
const DEMO_LEAD_DAYS = 21

/**
 * A fully populated, realistic example party for first-time exploration. Every
 * field is set (badge, times, guests with mixed RSVPs, a shopping list with
 * assignments). Text is localised via `t`; guest names are language-neutral.
 * All food is vegetarian, per the project's demo-data rule.
 */
export function buildDemoParty(t: (key: string) => string, now: Date): CreateParty {
  const date = new Date(now)
  date.setDate(date.getDate() + DEMO_LEAD_DAYS)

  const anna = { id: createId(), name: 'Anna', rsvp: 'yes' as const }
  const ben = { id: createId(), name: 'Ben', rsvp: 'yes' as const }
  const clara = { id: createId(), name: 'Clara', rsvp: 'pending' as const }
  const david = { id: createId(), name: 'David', rsvp: 'no' as const }
  const emma = { id: createId(), name: 'Emma', rsvp: 'yes' as const }

  return {
    name: t('demo.name'),
    date: date.toISOString().slice(0, 10),
    startTime: '16:00',
    endTime: '22:00',
    location: t('demo.location'),
    description: t('demo.description'),
    hinweise: t('demo.hinweise'),
    icon: 'balloon',
    color: 'amber',
    link: 'https://open.spotify.com/playlist/37i9dQZF1DX0XUsuxWHRQd',
    guests: [anna, ben, clara, david, emma],
    shopping: [
      { id: createId(), name: t('demo.shopping.skewers'), done: false, guestId: anna.id },
      { id: createId(), name: t('demo.shopping.halloumi'), done: false, guestId: ben.id },
      { id: createId(), name: t('demo.shopping.salads'), done: false, guestId: emma.id },
      { id: createId(), name: t('demo.shopping.bread'), done: true, guestId: null },
      { id: createId(), name: t('demo.shopping.drinks'), done: true, guestId: null },
      { id: createId(), name: t('demo.shopping.tableware'), done: false, guestId: null },
    ],
  }
}
