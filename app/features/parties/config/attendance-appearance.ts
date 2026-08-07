import type { Attendance } from '../types/party'

/** Colour feedback per reply, using design-system tokens (never hardcoded). */
export interface AttendanceColors {
  /** Solid fill for the active/selected state and the row border. */
  readonly color: string
  /** Readable text colour on top of the solid {@link color} fill. */
  readonly contrast: string
  /** Faint tint for chip backgrounds. */
  readonly soft: string
  /** Readable text colour on top of the {@link soft} tint (see the guest-list chips). */
  readonly text: string
}

export const ATTENDANCE_APPEARANCE: Record<Attendance, AttendanceColors> = {
  yes: {
    color: 'var(--color-primary)',
    contrast: 'var(--color-primary-contrast)',
    soft: 'var(--color-primary-soft)',
    text: 'var(--color-primary-text)',
  },
  maybe: {
    color: 'var(--color-warning)',
    contrast: 'var(--color-warning-contrast)',
    soft: 'var(--color-warning-soft)',
    text: 'var(--color-warning-text)',
  },
  no: {
    color: 'var(--color-danger)',
    contrast: 'var(--color-danger-contrast)',
    soft: 'var(--color-danger-soft)',
    text: 'var(--color-danger)',
  },
}
