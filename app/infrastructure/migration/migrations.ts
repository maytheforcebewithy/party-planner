import { addPartyDetails } from './add-party-details'
import { createPartiesTable } from './create-parties-table'
import type { Migration } from './migration'

/**
 * Ordered list of schema migrations. The runner applies any with a version
 * greater than the stored schema version, in ascending order. Append new
 * migrations here with a strictly increasing `version`.
 */
export const migrations: readonly Migration[] = [createPartiesTable, addPartyDetails]
