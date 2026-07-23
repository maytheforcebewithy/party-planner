import { describe, expect, it } from 'vitest'
import type { CrudRepository } from '~/infrastructure/repositories/crud-repository'

interface Note {
  id: string
  text: string
}

/** A minimal implementation exercising the generic CrudRepository contract. */
class InMemoryNoteRepository implements CrudRepository<Note, string, { text: string }> {
  readonly #items = new Map<string, Note>()
  #nextId = 1

  findById(id: string): Promise<Note | null> {
    return Promise.resolve(this.#items.get(id) ?? null)
  }

  findAll(): Promise<readonly Note[]> {
    return Promise.resolve([...this.#items.values()])
  }

  create(data: { text: string }): Promise<Note> {
    const note: Note = { id: String(this.#nextId), text: data.text }
    this.#nextId += 1
    this.#items.set(note.id, note)
    return Promise.resolve(note)
  }

  update(id: string, changes: Partial<Note>): Promise<Note> {
    const existing = this.#items.get(id)
    if (!existing) return Promise.reject(new Error(`Unknown note: ${id}`))
    const updated: Note = { ...existing, ...changes, id }
    this.#items.set(id, updated)
    return Promise.resolve(updated)
  }

  delete(id: string): Promise<void> {
    this.#items.delete(id)
    return Promise.resolve()
  }
}

describe('CrudRepository contract', () => {
  it('creates, reads, updates and deletes entities', async () => {
    const repository = new InMemoryNoteRepository()

    const created = await repository.create({ text: 'hello' })
    expect(created.id).toBeTruthy()
    expect(await repository.findById(created.id)).toEqual(created)
    expect(await repository.findAll()).toHaveLength(1)

    const updated = await repository.update(created.id, { text: 'world' })
    expect(updated.text).toBe('world')

    await repository.delete(created.id)
    expect(await repository.findById(created.id)).toBeNull()
    expect(await repository.findAll()).toHaveLength(0)
  })
})
