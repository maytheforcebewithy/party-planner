import { usePartiesStore } from '../stores/parties-store'
import { InvalidImportError, parseImport, serializeParties } from '../services/party-transfer'
import { fileSlug } from '../services/file-slug'
import type { Party } from '../types/party'
import { saveOrShareFile } from '~/shared/files/save-file'

export type ImportResult = { ok: true, imported: number } | { ok: false }

/**
 * Back up parties to a file and import parties from one. Export writes a file
 * and shares it on a device, or downloads it in the browser (see
 * {@link saveOrShareFile}). Import adds the file's parties as fresh local copies
 * (new ids) alongside the existing ones.
 */
export function useExportImport() {
  const store = usePartiesStore()

  /** Export all parties as a file; resolves with how many were exported. */
  async function exportParties(): Promise<number> {
    const parties = store.parties
    const json = serializeParties(parties, new Date().toISOString())
    await saveOrShareFile(json, `party-planner-${new Date().toISOString().slice(0, 10)}.json`)
    return parties.length
  }

  /** Export a single party as a file (named after the party). */
  async function exportParty(party: Party): Promise<void> {
    const json = serializeParties([party], new Date().toISOString())
    await saveOrShareFile(json, `party-planner-${fileSlug(party.name)}.json`)
  }

  /**
   * Import parties from a file. With `received: true` the imported parties are
   * flagged as received invitations (from someone else); otherwise they are
   * restored as own parties.
   */
  async function importParties(file: File, options: { received?: boolean } = {}): Promise<ImportResult> {
    try {
      const drafts = parseImport(await file.text())
      for (const draft of drafts) await store.create({ ...draft, received: options.received ?? false })
      return { ok: true, imported: drafts.length }
    }
    catch (error) {
      if (error instanceof InvalidImportError) return { ok: false }
      throw error
    }
  }

  return { exportParties, exportParty, importParties }
}
