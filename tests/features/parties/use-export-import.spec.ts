import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { InMemoryPartyRepository } from '~/infrastructure/repositories/in-memory-party-repository'
import { EXPORT_FORMAT } from '~/features/parties/services/party-transfer'

const repository = new InMemoryPartyRepository()
vi.mock('~/features/parties/composables/use-party-repository', () => ({
  usePartyRepository: () => repository,
}))

const { usePartiesStore } = await import('~/features/parties/stores/parties-store')
const { useExportImport } = await import('~/features/parties/composables/use-export-import')

function fileOf(text: string): File {
  return { text: () => Promise.resolve(text) } as unknown as File
}

const exportDoc = (names: string[]): string =>
  JSON.stringify({ format: EXPORT_FORMAT, version: 1, parties: names.map(name => ({ name })) })

describe('useExportImport', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('imports parties from a valid file as new copies', async () => {
    const store = usePartiesStore()
    const { importParties } = useExportImport()

    const result = await importParties(fileOf(exportDoc(['A', 'B'])))

    expect(result).toEqual({ ok: true, imported: 2 })
    expect(store.partyCount).toBe(2)
  })

  it('reports an invalid file without creating parties', async () => {
    const store = usePartiesStore()
    const { importParties } = useExportImport()

    const result = await importParties(fileOf('not an export'))

    expect(result).toEqual({ ok: false })
    expect(store.partyCount).toBe(0)
  })

  it('exports the current parties and returns the count', async () => {
    const store = usePartiesStore()
    await store.create({ name: 'Only one' })
    const createObjectURL = vi.fn(() => 'blob:x')
    vi.stubGlobal('URL', { createObjectURL, revokeObjectURL: vi.fn() })

    const { exportParties } = useExportImport()
    const count = exportParties()

    expect(count).toBe(1)
    expect(createObjectURL).toHaveBeenCalledOnce()
    vi.unstubAllGlobals()
  })
})
