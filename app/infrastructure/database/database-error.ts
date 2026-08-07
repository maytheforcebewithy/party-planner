/**
 * Error types for the persistence layer. Keeping them explicit lets callers
 * (e.g. the init plugin) react without crashing the app.
 */

export class DatabaseError extends Error {
  constructor(message: string, options?: { cause?: unknown }) {
    super(message, options)
    this.name = 'DatabaseError'
  }
}

/** Raised when the database cannot be opened. */
export class DatabaseOpenError extends DatabaseError {
  constructor(message: string, options?: { cause?: unknown }) {
    super(message, options)
    this.name = 'DatabaseOpenError'
  }
}

/** Raised when a migration cannot be applied or is misconfigured. */
export class MigrationError extends DatabaseError {
  constructor(message: string, options?: { cause?: unknown }) {
    super(message, options)
    this.name = 'MigrationError'
  }
}
