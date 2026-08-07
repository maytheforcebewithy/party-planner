import { usePartiesStore } from '../stores/parties-store'
import { InvalidImportError, parseImport, serializeParties } from '../services/party-transfer'
import type { Party } from '../types/party'

export type ImportResult = { ok: true, imported: number } | { ok: false }

/**
 * Back up all parties to a JSON file and import parties from one. Import adds
 * the file's parties as fresh local copies (new ids) alongside the existing
 * ones. Browser file IO for now; the app is a client-rendered SPA.
 */
export function useExportImport() {
  const store = usePartiesStore()

  /** Download all parties as a file; returns how many were exported. */
  function exportParties(): number {
    const parties = store.parties
    const json = serializeParties(parties, new Date().toISOString())
    downloadFile(json, `party-planner-${new Date().toISOString().slice(0, 10)}.json`)
    return parties.length
  }

  /** Download a single party as a file (named after the party). */
  function exportParty(party: Party): void {
    const json = serializeParties([party], new Date().toISOString())
    downloadFile(json, `party-planner-${fileSlug(party.name)}.json`)
  }

  async function importParties(file: File): Promise<ImportResult> {
    try {
      const drafts = parseImport(await file.text())
      for (const draft of drafts) await store.create(draft)
      return { ok: true, imported: drafts.length }
    }
    catch (error) {
      if (error instanceof InvalidImportError) return { ok: false }
      throw error
    }
  }

  return { exportParties, exportParty, importParties }
}

/** A filesystem-safe slug from a party name, or `party` when it reduces to nothing. */
function fileSlug(name: string): string {
  return name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'party'
}

function downloadFile(content: string, filename: string): void {
  const blob = new Blob([content], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = filename
  anchor.click()
  URL.revokeObjectURL(url)
}
