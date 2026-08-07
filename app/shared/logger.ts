/**
 * Tiny logger. `debug` output is emitted only during development; Nuxt strips
 * the `import.meta.dev` branch from production builds, so no debug logs ship.
 * `error` is always emitted.
 *
 * This is the single sanctioned place for `console` usage (see eslint config).
 */
const isDev = import.meta.dev === true

export const logger = {
  debug(...args: readonly unknown[]): void {
    if (isDev) console.debug('[party-planner]', ...args)
  },
  error(message: string, error?: unknown): void {
    console.error('[party-planner]', message, error)
  },
}
