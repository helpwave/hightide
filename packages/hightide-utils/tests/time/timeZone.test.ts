import { DateUtils } from '../../src/utils/date'

describe('DateUtils time zone conversion', () => {
  test('reads the wall clock fields of an instant in a given zone', () => {
    const instant = new Date(Date.UTC(2024, 5, 1, 0, 30, 0))
    const parts = DateUtils.zonedParts(instant, 'America/New_York')
    expect([parts.year, parts.month, parts.day, parts.hour, parts.minute]).toEqual([2024, 5, 31, 20, 30])
  })

  test('toZonedDate exposes the zone wall clock through the local Date getters', () => {
    const instant = new Date(Date.UTC(2024, 5, 1, 0, 30, 0))
    const zoned = DateUtils.toZonedDate(instant, 'America/New_York')!
    expect([zoned.getFullYear(), zoned.getMonth(), zoned.getDate(), zoned.getHours(), zoned.getMinutes()])
      .toEqual([2024, 4, 31, 20, 30])
  })

  test('toZonedDate and fromZonedDate are inverses across zones and DST', () => {
    const instants = [
      new Date(Date.UTC(2024, 0, 15, 12, 0, 0)),
      new Date(Date.UTC(2024, 5, 1, 0, 30, 0)),
      new Date(Date.UTC(2024, 6, 20, 23, 45, 30, 123)),
    ]
    for (const zone of ['UTC', 'America/New_York', 'Asia/Tokyo', 'Europe/Berlin']) {
      for (const instant of instants) {
        const roundTripped = DateUtils.fromZonedDate(DateUtils.toZonedDate(instant, zone), zone)
        expect(roundTripped.getTime()).toBe(instant.getTime())
      }
    }
  })

  test('passes the value through untouched without a zone', () => {
    const instant = new Date(Date.UTC(2024, 5, 1, 0, 30, 0))
    expect(DateUtils.toZonedDate(instant, undefined)).toBe(instant)
    expect(DateUtils.fromZonedDate(instant, undefined)).toBe(instant)
    expect(DateUtils.toZonedDate(null, 'America/New_York')).toBeNull()
  })
})
