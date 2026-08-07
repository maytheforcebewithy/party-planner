/**
 * Catalogue of selectable party badge appearances. Parties store only a key
 * (see {@link ICON_KEYS} / {@link COLOR_KEYS}); the concrete SVG paths and the
 * colour tokens live here so the picker, hero and list badge stay in sync and
 * a stored value that is no longer offered degrades to the default.
 */

/** Icon keys in the order the picker shows them; index 0 is the default. */
export const ICON_KEYS = ['cake', 'gift', 'balloon', 'music', 'star', 'heart'] as const
export type PartyIconKey = typeof ICON_KEYS[number]
export const DEFAULT_ICON: PartyIconKey = ICON_KEYS[0]

/** SVG `d` attributes per icon, drawn on a `0 0 24 24` viewBox as stroked line-art. */
export const ICON_PATHS: Record<PartyIconKey, readonly string[]> = {
  cake: [
    'M4 21h16',
    'M5 21v-8a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v8',
    'M4 15.5c1.5 0 1.5 1 3 1s1.5-1 3-1 1.5 1 3 1 1.5-1 3-1 1.5 1 3 1',
    'M12 8V5.5',
    'M12 3.5v.01',
  ],
  gift: [
    'M20 12v8a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-8',
    'M3 8h18a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1z',
    'M12 8v13',
    'M12 8S11 4 8.5 4a2.5 2.5 0 0 0 0 4H12',
    'M12 8s1-4 3.5-4a2.5 2.5 0 0 1 0 4H12',
  ],
  balloon: [
    'M12 3a6.5 6.5 0 0 1 6.5 6.5c0 3.8-2.9 6.5-6.5 6.5S5.5 13.3 5.5 9.5A6.5 6.5 0 0 1 12 3z',
    'M10.8 15.6 12 17l1.2-1.4',
    'M12 17c-1 1.2 1 2 0 3.2',
  ],
  music: [
    'M9 17V6.5',
    'M18 15V4.5',
    'M9 6.5 18 4.5',
    'M9 9.5 18 7.5',
    'M9 17a2.5 2.5 0 1 1-2.5-2.5A2.5 2.5 0 0 1 9 17z',
    'M18 15a2.5 2.5 0 1 1-2.5-2.5A2.5 2.5 0 0 1 18 15z',
  ],
  star: [
    'M12 3.2l2.7 5.5 6 .9-4.35 4.24 1.03 5.99L12 17.02l-5.38 2.82 1.03-5.99L3.3 9.6l6-.9z',
  ],
  heart: [
    'M12 21C12 21 3 14.5 3 8.8 3 6 5.2 4 7.6 4c1.7 0 3.2 1 3.9 2.4h1C13.2 5 14.7 4 16.4 4 18.8 4 21 6 21 8.8 21 14.5 12 21 12 21z',
  ],
}

/** Colour keys in picker order; each maps to `--party-<key>` tokens in CSS. */
export const COLOR_KEYS = ['green', 'amber', 'sky', 'pink', 'purple', 'orange'] as const
export type PartyColorKey = typeof COLOR_KEYS[number]
export const DEFAULT_COLOR: PartyColorKey = COLOR_KEYS[0]

function resolve<T extends string>(keys: readonly T[], value: string | null, fallback: T): T {
  return keys.includes(value as T) ? (value as T) : fallback
}

/** Normalise a stored icon key to a known one, falling back to the default. */
export function resolveIcon(value: string | null): PartyIconKey {
  return resolve(ICON_KEYS, value, DEFAULT_ICON)
}

/** Normalise a stored colour key to a known one, falling back to the default. */
export function resolveColor(value: string | null): PartyColorKey {
  return resolve(COLOR_KEYS, value, DEFAULT_COLOR)
}
