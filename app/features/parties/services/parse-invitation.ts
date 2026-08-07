import type { CreateParty } from '../types/party'

/**
 * Best-effort parser that turns a pasted free-text invitation (e.g. a WhatsApp
 * message) into a draft party. Local-first — pure heuristics, no cloud/LLM: it
 * pulls out a date, time and location where it can and leaves the rest as the
 * name/description for the user to review and correct before saving.
 */

const GERMAN_MONTHS = [
  'januar', 'februar', 'märz', 'april', 'mai', 'juni',
  'juli', 'august', 'september', 'oktober', 'november', 'dezember',
]
const ENGLISH_MONTHS = [
  'january', 'february', 'march', 'april', 'may', 'june',
  'july', 'august', 'september', 'october', 'november', 'december',
]

function pad(value: number): string {
  return String(value).padStart(2, '0')
}

function iso(year: number, month: number, day: number): string {
  return `${year}-${pad(month)}-${pad(day)}`
}

/** Pick the year that keeps a day/month upcoming when the text omits a year. */
function inferYear(month: number, day: number, now: Date): number {
  const year = now.getFullYear()
  const candidate = new Date(year, month - 1, day)
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  return candidate < today ? year + 1 : year
}

function extractDate(text: string, now: Date): string | null {
  const isoMatch = text.match(/\b(\d{4})-(\d{2})-(\d{2})\b/)
  if (isoMatch) return `${isoMatch[1]}-${isoMatch[2]}-${isoMatch[3]}`

  const numeric = text.match(/\b(\d{1,2})\.(\d{1,2})\.(\d{4}|\d{2})?/)
  if (numeric) {
    const day = Number(numeric[1])
    const month = Number(numeric[2])
    const rawYear = numeric[3]
    if (month >= 1 && month <= 12 && day >= 1 && day <= 31) {
      const year = rawYear
        ? (rawYear.length === 2 ? 2000 + Number(rawYear) : Number(rawYear))
        : inferYear(month, day, now)
      return iso(year, month, day)
    }
  }

  const names = [...GERMAN_MONTHS, ...ENGLISH_MONTHS].join('|')
  const named = text.match(new RegExp(`\\b(\\d{1,2})\\.?\\s+(${names})\\b(?:\\s+(\\d{4}))?`, 'i'))
  if (named) {
    const day = Number(named[1])
    const monthName = (named[2] ?? '').toLowerCase()
    const index = GERMAN_MONTHS.indexOf(monthName) >= 0
      ? GERMAN_MONTHS.indexOf(monthName)
      : ENGLISH_MONTHS.indexOf(monthName)
    if (index >= 0 && day >= 1 && day <= 31) {
      const month = index + 1
      const year = named[3] ? Number(named[3]) : inferYear(month, day, now)
      return iso(year, month, day)
    }
  }

  return null
}

function extractTime(text: string): string | null {
  const hhmm = text.match(/\b(\d{1,2}):(\d{2})\b/)
  if (hhmm) {
    const hours = Number(hhmm[1])
    const minutes = Number(hhmm[2])
    if (hours < 24 && minutes < 60) return `${pad(hours)}:${pad(minutes)}`
  }

  const oClock = text.match(/\b(\d{1,2})\s*Uhr\b/i)
  if (oClock) {
    const hours = Number(oClock[1])
    if (hours < 24) return `${pad(hours)}:00`
  }

  return null
}

function extractLocation(lines: readonly string[]): string | null {
  for (const line of lines) {
    const labelled = line.match(/^(?:ort|wo|adresse|address|location|where|treffpunkt)\s*[:\-–]\s*(.+)$/i)
    if (labelled?.[1]) return labelled[1].trim()
  }
  const at = lines.join('\n').match(/@\s*([^\n,]{2,})/)
  return at?.[1] ? at[1].trim() : null
}

export function parseInvitationText(text: string, now: Date = new Date()): CreateParty {
  const lines = text.split(/\r?\n/).map(line => line.trim()).filter(Boolean)
  return {
    name: lines[0] ?? '',
    date: extractDate(text, now),
    startTime: extractTime(text),
    location: extractLocation(lines),
    description: lines.slice(1).join('\n') || null,
  }
}
