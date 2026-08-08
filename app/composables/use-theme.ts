export type ThemeMode = 'auto' | 'light' | 'dark'
export type SystemScheme = 'light' | 'dark' | 'no-preference'

/** Order shown in the settings toggle: follow the OS, or force one scheme. */
export const THEME_MODES: readonly ThemeMode[] = ['auto', 'light', 'dark']

const STORAGE_KEY = 'party-planner.theme'

/**
 * The scheme to actually apply for a given choice and OS preference. "auto"
 * follows the OS; anything else forces a scheme. Dark-first: an unknown OS
 * preference (`no-preference`) stays dark.
 */
export function resolveTheme(mode: ThemeMode, system: SystemScheme): 'light' | 'dark' {
  if (mode === 'light' || mode === 'dark') return mode
  return system === 'light' ? 'light' : 'dark'
}

/**
 * Theme state: the persisted user choice (`mode`) and the scheme actually
 * applied (`resolved`). The resolved scheme is written to `<html data-theme>`,
 * which drives the token overrides in `variables.css`.
 */
export function useTheme() {
  const mode = useLocalStorage<ThemeMode>(STORAGE_KEY, 'auto')
  const system = usePreferredColorScheme()

  const resolved = computed<'light' | 'dark'>(() => resolveTheme(mode.value, system.value))

  if (import.meta.client) {
    watch(resolved, (value) => {
      document.documentElement.dataset.theme = value
    }, { immediate: true })
  }

  return { mode, resolved, modes: THEME_MODES }
}
