import { describe, expect, it } from 'vitest'
import {
  EXPORT_FORMAT,
  InvalidImportError,
  parseImport,
  serializeParties,
} from '~/features/parties/services/party-transfer'
import type { Party } from '~/features/parties/types/party'

const party = (over: Partial<Party> = {}): Party => ({
  id: 'p1',
  name: 'Gartenparty',
  date: '2026-08-20',
  location: 'Stadtpark',
  description: null,
  startTime: '18:00',
  endTime: null,
  notes: null,
  icon: 'star',
  color: 'sky',
  image: null,
  link: 'https://open.spotify.com/x',
  guests: [{ id: 'g1', name: 'Anna', rsvp: 'yes' }],
  shopping: [{ id: 's1', name: 'Brot', done: false, guestId: 'g1' }],
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
  ...over,
})

describe('serializeParties', () => {
  it('wraps parties in a versioned envelope', () => {
    const doc = JSON.parse(serializeParties([party()], '2026-08-07T00:00:00.000Z'))
    expect(doc.format).toBe(EXPORT_FORMAT)
    expect(doc.version).toBe(1)
    expect(doc.exportedAt).toBe('2026-08-07T00:00:00.000Z')
    expect(doc.parties).toHaveLength(1)
  })
})

describe('parseImport', () => {
  it('round-trips a party but drops its id and timestamps for a fresh copy', () => {
    const [draft, ...rest] = parseImport(serializeParties([party()], 'now'))

    expect(rest).toHaveLength(0)
    expect(draft).not.toHaveProperty('id')
    expect(draft).not.toHaveProperty('createdAt')
    expect(draft).toMatchObject({
      name: 'Gartenparty',
      location: 'Stadtpark',
      startTime: '18:00',
      link: 'https://open.spotify.com/x',
      guests: [{ id: 'g1', name: 'Anna', rsvp: 'yes' }],
      shopping: [{ id: 's1', name: 'Brot', done: false, guestId: 'g1' }],
    })
  })

  it('round-trips a known attendance and drops an unknown one', () => {
    const [kept] = parseImport(serializeParties([party({ attendance: 'yes' })], 'now'))
    expect(kept?.attendance).toBe('yes')

    const doc = JSON.stringify({ format: EXPORT_FORMAT, version: 1, parties: [{ name: 'X', attendance: 'going' }] })
    expect(parseImport(doc)[0]?.attendance).toBeNull()
  })

  it('throws on non-JSON and on a document with the wrong format', () => {
    expect(() => parseImport('not json')).toThrow(InvalidImportError)
    expect(() => parseImport('{"parties":[]}')).toThrow(InvalidImportError)
    expect(() => parseImport(JSON.stringify({ format: 'other', parties: [] }))).toThrow(InvalidImportError)
  })

  it('skips party entries without a usable name', () => {
    const doc = serializeParties([party(), party({ name: '' }), party({ name: 'Kept' })], 'now')
    const drafts = parseImport(doc)
    expect(drafts.map(draft => draft.name)).toEqual(['Gartenparty', 'Kept'])
  })

  it('drops malformed guests instead of failing the whole import', () => {
    const doc = JSON.stringify({
      format: EXPORT_FORMAT,
      version: 1,
      parties: [{ name: 'X', guests: [{ id: 'g1', name: 'Ok', rsvp: 'weird' }, { id: 5 }] }],
    })
    const drafts = parseImport(doc)
    expect(drafts[0]?.guests).toEqual([{ id: 'g1', name: 'Ok', rsvp: 'pending' }])
  })

  it('preserves each party\'s own received flag across a backup round-trip', () => {
    const doc = serializeParties([party({ received: true }), party({ name: 'Own', received: false })], 'now')
    const drafts = parseImport(doc)

    expect(drafts.find(d => d.name === 'Gartenparty')?.received).toBe(true)
    expect(drafts.find(d => d.name === 'Own')?.received).toBe(false)
  })

  it('never imports a link as an executable non-http scheme', () => {
    const doc = JSON.stringify({
      format: EXPORT_FORMAT,
      version: 1,
      parties: [{ name: 'X', link: 'javascript:alert(document.cookie)' }],
    })
    const link = parseImport(doc)[0]?.link ?? ''
    expect(link.startsWith('javascript:')).toBe(false)
    expect(link.startsWith('https://')).toBe(true)
  })

  it('keeps a data: image but drops a remote image URL on import', () => {
    const dataUrl = 'data:image/png;base64,QUJD'
    const kept = parseImport(serializeParties([party({ image: dataUrl })], 'now'))
    expect(kept[0]?.image).toBe(dataUrl)

    const remote = JSON.stringify({
      format: EXPORT_FORMAT,
      version: 1,
      parties: [{ name: 'X', image: 'http://evil.example/pixel.png' }],
    })
    expect(parseImport(remote)[0]?.image).toBeNull()
  })
})
