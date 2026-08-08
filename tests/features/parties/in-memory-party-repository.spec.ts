import { describe, expect, it } from 'vitest'
import { InMemoryPartyRepository } from '~/infrastructure/repositories/in-memory-party-repository'
import { PartyNotFoundError } from '~/features/parties/repositories/party-repository'

describe('InMemoryPartyRepository', () => {
  it('creates a party with a generated id, timestamps and null defaults', async () => {
    const repository = new InMemoryPartyRepository()

    const party = await repository.create({ name: 'Birthday' })

    expect(party.id).toBeTruthy()
    expect(party.name).toBe('Birthday')
    expect(party.date).toBeNull()
    expect(party.location).toBeNull()
    expect(party.description).toBeNull()
    expect(party.startTime).toBeNull()
    expect(party.endTime).toBeNull()
    expect(party.notes).toBeNull()
    expect(party.createdAt).toBe(party.updatedAt)
    expect(await repository.findById(party.id)).toEqual(party)
  })

  it('keeps provided optional fields on create', async () => {
    const repository = new InMemoryPartyRepository()

    const party = await repository.create({
      name: 'Picnic',
      date: '2026-08-15',
      location: 'Park',
      description: 'Bring salad',
      startTime: '18:00',
      endTime: '23:30',
      notes: 'No glass bottles',
    })

    expect(party).toMatchObject({
      date: '2026-08-15',
      location: 'Park',
      description: 'Bring salad',
      startTime: '18:00',
      endTime: '23:30',
      notes: 'No glass bottles',
    })
  })

  it('returns null for an unknown id and an empty list initially', async () => {
    const repository = new InMemoryPartyRepository()

    expect(await repository.findById('missing')).toBeNull()
    expect(await repository.findAll()).toHaveLength(0)
  })

  it('updates only the provided fields and refreshes updatedAt', async () => {
    const repository = new InMemoryPartyRepository()
    const created = await repository.create({ name: 'Draft', location: 'Home' })

    const updated = await repository.update(created.id, {
      name: 'Final',
      date: '2026-09-01',
      startTime: '18:00',
      endTime: '22:00',
      notes: 'Bring ID',
    })

    expect(updated.name).toBe('Final')
    expect(updated.date).toBe('2026-09-01')
    expect(updated.location).toBe('Home')
    expect(updated.startTime).toBe('18:00')
    expect(updated.endTime).toBe('22:00')
    expect(updated.notes).toBe('Bring ID')
    expect(updated.createdAt).toBe(created.createdAt)
  })

  it('clears a nullable field when explicitly set to null', async () => {
    const repository = new InMemoryPartyRepository()
    const created = await repository.create({ name: 'Party', location: 'Hall' })

    const updated = await repository.update(created.id, { location: null })

    expect(updated.location).toBeNull()
  })

  it('rejects updating an unknown party', async () => {
    const repository = new InMemoryPartyRepository()

    await expect(repository.update('missing', { name: 'X' })).rejects.toBeInstanceOf(PartyNotFoundError)
  })

  it('deletes a party and is a no-op for unknown ids', async () => {
    const repository = new InMemoryPartyRepository()
    const created = await repository.create({ name: 'Gone' })

    await repository.delete(created.id)
    await repository.delete('missing')

    expect(await repository.findById(created.id)).toBeNull()
    expect(await repository.findAll()).toHaveLength(0)
  })
})
