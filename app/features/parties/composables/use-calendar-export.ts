import { buildCalendarEvent, CALENDAR_MIME_TYPE } from '../services/calendar-event'
import { fileSlug } from '../services/file-slug'
import type { Party } from '../types/party'
import { saveOrShareFile } from '~/shared/files/save-file'

/**
 * Export a party as an `.ics` file so it can be added to the phone calendar
 * (through the OS share sheet on a device, or a download in the browser).
 */
export function useCalendarExport() {
  /** Returns `false` when the party has no date and therefore no calendar event. */
  async function exportToCalendar(party: Party): Promise<boolean> {
    const ics = buildCalendarEvent(party)
    if (!ics) return false
    await saveOrShareFile(ics, `party-planner-${fileSlug(party.name)}.ics`, CALENDAR_MIME_TYPE)
    return true
  }

  return { exportToCalendar }
}
