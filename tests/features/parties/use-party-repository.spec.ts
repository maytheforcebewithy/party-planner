import { beforeEach, describe, expect, it } from 'vitest'
import { resetPartyRepository, usePartyRepository } from '~/features/parties/composables/use-party-repository'
import { InMemoryPartyRepository } from '~/infrastructure/repositories/in-memory-party-repository'

describe('usePartyRepository', () => {
  beforeEach(() => {
    resetPartyRepository()
  })

  it('builds the in-memory repository in a browser/test environment', () => {
    expect(usePartyRepository()).toBeInstanceOf(InMemoryPartyRepository)
  })

  it('memoises the instance across calls', () => {
    expect(usePartyRepository()).toBe(usePartyRepository())
  })

  it('rebuilds after a reset', () => {
    const first = usePartyRepository()
    resetPartyRepository()

    expect(usePartyRepository()).not.toBe(first)
  })
})
