import type { Attendance } from '../types/party'

/** Colour feedback per reply, using design-system tokens (never hardcoded). */
export interface AttendanceColors {
  /** Solid fill for the active/selected state. */
  readonly color: string
  /** Readable text colour on top of {@link color}. */
  readonly contrast: string
  /** Faint tint for chips/backgrounds. */
  readonly soft: string
}

export const ATTENDANCE_APPEARANCE: Record<Attendance, AttendanceColors> = {
  yes: {
    color: 'var(--color-primary)',
    contrast: 'var(--color-primary-contrast)',
    soft: 'var(--color-primary-soft)',
  },
  maybe: {
    color: 'var(--color-warning)',
    contrast: 'var(--color-warning-contrast)',
    soft: 'var(--color-warning-soft)',
  },
  no: {
    color: 'var(--color-danger)',
    contrast: 'var(--color-danger-contrast)',
    soft: 'var(--color-danger-soft)',
  },
}
