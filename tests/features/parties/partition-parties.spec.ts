import { describe, expect, it } from 'vitest'
import { partitionParties } from '~/features/parties/services/partition-parties'
import type { Party } from '~/features/parties/types/party'

function party(id: string, date: string | null): Party {
  return {
    id,
    name: id,
    date,
    location: null,
    description: null,
    startTime: null,
    endTime: null,
    hinweise: null,
    icon: null,
    color: null,
    guests: [],
    shopping: [],
    createdAt: '',
    updatedAt: '',
  }
}

const TODAY = '2026-08-07'

describe('partitionParties', () => {
  it('splits parties into upcoming and past around today', () => {
    const { upcoming, past } = partitionParties(
      [party('future', '2026-09-01'), party('past', '2026-07-01'), party('today', TODAY)],
      TODAY,
    )

    expect(upcoming.map(p => p.id)).toEqual(['today', 'future'])
    expect(past.map(p => p.id)).toEqual(['past'])
  })

  it('treats today as upcoming (inclusive)', () => {
    const { upcoming, past } = partitionParties([party('today', TODAY)], TODAY)

    expect(upcoming).toHaveLength(1)
    expect(past).toHaveLength(0)
  })

  it('sorts upcoming ascending and past descending', () => {
    const { upcoming, past } = partitionParties(
      [
        party('soon', '2026-08-10'),
        party('later', '2026-12-24'),
        party('old', '2026-01-01'),
        party('recent', '2026-08-01'),
      ],
      TODAY,
    )

    expect(upcoming.map(p => p.id)).toEqual(['soon', 'later'])
    expect(past.map(p => p.id)).toEqual(['recent', 'old'])
  })

  it('places undated parties in upcoming, sorted last', () => {
    const { upcoming } = partitionParties(
      [party('undated', null), party('dated', '2026-09-01')],
      TODAY,
    )

    expect(upcoming.map(p => p.id)).toEqual(['dated', 'undated'])
  })

  it('returns empty groups for no parties', () => {
    expect(partitionParties([], TODAY)).toEqual({ upcoming: [], past: [] })
  })
})
