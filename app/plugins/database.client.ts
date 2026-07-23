import { createDatabase } from '~/infrastructure/database/create-database'
import { migrations } from '~/infrastructure/migration/migrations'
import { runMigrations } from '~/infrastructure/migration/migration-runner'
import { logger } from '~/shared/logger'

/**
 * Opens the local database on app start and runs pending migrations.
 * Initialisation only — no business logic. A failure is logged and swallowed so
 * the app never crashes on a storage error; `$database` is still provided.
 */
export default defineNuxtPlugin(async () => {
  const database = createDatabase()

  try {
    await database.open()
    const result = await runMigrations(database, migrations)
    logger.debug('Database ready', { schemaVersion: result.version })
  }
  catch (error) {
    logger.error('Database initialisation failed', error)
  }

  return {
    provide: { database },
  }
})
