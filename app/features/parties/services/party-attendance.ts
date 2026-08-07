import { ATTENDANCE_OPTIONS } from '../types/party'
import type { Attendance } from '../types/party'

/**
 * Validate an untrusted value (from storage or an imported file) into a known
 * attendance reply, or `null` when it is missing/unrecognised.
 */
export function coerceAttendance(value: unknown): Attendance | null {
  return ATTENDANCE_OPTIONS.includes(value as Attendance) ? (value as Attendance) : null
}
