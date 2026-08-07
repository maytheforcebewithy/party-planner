import { coerceGuests, coerceShopping } from './party-lists'
import type { CreateParty, Party } from '../types/party'

/**
 * Backup format for exporting/importing whole parties as a file. Import returns
 * {@link CreateParty} values (id and timestamps dropped) so each imported party
 * becomes a fresh, independent local copy — matching the product vision.
 */
export const EXPORT_FORMAT = 'party-planner'
export const EXPORT_VERSION = 1

export interface PartyExport {
  readonly format: typeof EXPORT_FORMAT
  readonly version: number
  readonly exportedAt: string
  readonly parties: readonly Party[]
}

/** Thrown when an imported file is not a recognisable party-planner export. */
export class InvalidImportError extends Error {
  constructor() {
    super('The file is not a valid Party Planner export.')
    this.name = 'InvalidImportError'
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function asString(value: unknown): string | null {
  return typeof value === 'string' && value.length > 0 ? value : null
}

/** Serialise parties into a pretty-printed, versioned export document. */
export function serializeParties(parties: readonly Party[], exportedAt: string): string {
  const payload: PartyExport = { format: EXPORT_FORMAT, version: EXPORT_VERSION, exportedAt, parties }
  return JSON.stringify(payload, null, 2)
}

function toCreateParty(entry: unknown): CreateParty[] {
  if (!isRecord(entry) || typeof entry.name !== 'string' || !entry.name.trim()) return []
  return [{
    name: entry.name.trim(),
    date: asString(entry.date),
    location: asString(entry.location),
    description: asString(entry.description),
    startTime: asString(entry.startTime),
    endTime: asString(entry.endTime),
    hinweise: asString(entry.hinweise),
    icon: asString(entry.icon),
    color: asString(entry.color),
    image: asString(entry.image),
    link: asString(entry.link),
    guests: coerceGuests(entry.guests),
    shopping: coerceShopping(entry.shopping),
  }]
}

/**
 * Parse an export document into importable parties. Throws
 * {@link InvalidImportError} when the document is not a party-planner export;
 * individual malformed parties are skipped.
 */
export function parseImport(json: string): CreateParty[] {
  let data: unknown
  try {
    data = JSON.parse(json)
  }
  catch {
    throw new InvalidImportError()
  }
  if (!isRecord(data) || data.format !== EXPORT_FORMAT || !Array.isArray(data.parties)) {
    throw new InvalidImportError()
  }
  return data.parties.flatMap(toCreateParty)
}
