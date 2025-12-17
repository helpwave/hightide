import { Duration } from '../../src/utils/duration'

describe('Duration', () => {
  test('adds duration to date', () => {
    const base = new Date('2025-01-01T00:00:00.000Z')
    const d = new Duration({ days: 1, hours: 2 })

    const result = d.addTo(base)

    expect(result.toISOString()).toBe('2025-01-02T02:00:00.000Z')
  })

  test('subtracts duration from date', () => {
    const base = new Date('2025-01-02T02:00:00.000Z')
    const d = new Duration({ days: 1, hours: 2 })

    const result = d.subtractFrom(base)

    expect(result.toISOString()).toBe('2025-01-01T00:00:00.000Z')
  })

  test('adds two durations', () => {
    const d1 = new Duration({ days: 1, hours: 2 })
    const d2 = new Duration({ hours: 3, minutes: 30 })

    const result = d1.add(d2)

    expect(result.equals(
      new Duration({ days: 1, hours: 5, minutes: 30 })
    )).toBe(true)
  })

  test('subtracts two durations', () => {
    const d1 = new Duration({ days: 2, hours: 4 })
    const d2 = new Duration({ days: 1, hours: 1 })

    const result = d1.subtract(d2)

    expect(result.equals(
      new Duration({ days: 1, hours: 3 })
    )).toBe(true)
  })

  test('equality check', () => {
    const a = new Duration({ days: 1 })
    const b = new Duration({ days: 1 })
    const c = new Duration({ days: 2 })

    expect(a.equals(b)).toBe(true)
    expect(a.equals(c)).toBe(false)
  })

  test('difference between dates', () => {
    const start = new Date('2025-01-01T00:00:00.000Z')
    const end = new Date('2025-01-02T01:00:00.000Z')

    const diff = Duration.difference(start, end)

    expect(diff.days).toBe(1)
    expect(diff.hours).toBe(1)
  })
})
