import {
  buildSegmentLayout,
  composeDate,
  decomposeDate,
  editableTypesOf,
  formatSegment,
  isComplete,
  isEmpty,
  stepSegment,
  typeDigit,
  type SegmentEditState
} from '../../src/components/user-interaction/input/dateTimeSegments'

const dateLayout = buildSegmentLayout({ locale: 'de-DE', mode: 'date', precision: 'minute', is24HourFormat: true })
const dateTimeLayout = buildSegmentLayout({ locale: 'de-DE', mode: 'dateTime', precision: 'minute', is24HourFormat: true })
const twelveHourTimeLayout = buildSegmentLayout({ locale: 'en-US', mode: 'time', precision: 'minute', is24HourFormat: false })

const empty: SegmentEditState = { values: {}, buffer: null }

const typeSequence = (start: SegmentEditState, type: Parameters<typeof typeDigit>[1], digits: number[], is24HourFormat = true): SegmentEditState => {
  return digits.reduce((state, digit) => typeDigit(state, type, digit, is24HourFormat).state, start)
}

describe('dateTimeSegments layout', () => {
  test('uses the day, month, year order with dots for German dates', () => {
    expect(editableTypesOf(dateLayout)).toEqual(['day', 'month', 'year'])
    expect(dateLayout[1]).toEqual({ kind: 'literal', text: '.' })
  })

  test('joins date and time with a dash for date time', () => {
    expect(editableTypesOf(dateTimeLayout)).toEqual(['day', 'month', 'year', 'hour', 'minute'])
    expect(dateTimeLayout.some(segment => segment.kind === 'literal' && segment.text === ' - ')).toBe(true)
  })

  test('includes a day period for twelve hour time', () => {
    expect(editableTypesOf(twelveHourTimeLayout)).toEqual(['hour', 'minute', 'dayPeriod'])
  })
})

describe('dateTimeSegments compose and decompose', () => {
  test('builds a midnight date from a complete date', () => {
    const date = composeDate({ day: 15, month: 6, year: 2026 }, dateLayout, 'date', true)
    expect(date).not.toBeNull()
    expect([date!.getFullYear(), date!.getMonth(), date!.getDate(), date!.getHours()]).toEqual([2026, 5, 15, 0])
  })

  test('returns null while the date is incomplete', () => {
    expect(composeDate({ day: 15, month: 6 }, dateLayout, 'date', true)).toBeNull()
  })

  test('round trips through decompose', () => {
    expect(decomposeDate(new Date(2026, 5, 15), dateLayout, true)).toEqual({ day: 15, month: 6, year: 2026 })
  })

  test('resolves the twelve hour clock with the day period', () => {
    const reference = new Date(2026, 0, 1)
    const midnight = composeDate({ hour: 12, minute: 0, dayPeriod: 0 }, twelveHourTimeLayout, 'time', false, reference)
    const noon = composeDate({ hour: 12, minute: 0, dayPeriod: 1 }, twelveHourTimeLayout, 'time', false, reference)
    const onePm = composeDate({ hour: 1, minute: 0, dayPeriod: 1 }, twelveHourTimeLayout, 'time', false, reference)
    expect([midnight!.getHours(), noon!.getHours(), onePm!.getHours()]).toEqual([0, 12, 13])
  })

  test('reports completeness and emptiness', () => {
    expect(isEmpty({}, dateLayout)).toBe(true)
    expect(isComplete({ day: 1, month: 1, year: 2020 }, dateLayout)).toBe(true)
    expect(isComplete({ day: 1, month: 1 }, dateLayout)).toBe(false)
  })
})

describe('dateTimeSegments typing', () => {
  test('builds a four digit year and then advances', () => {
    let result = typeDigit(empty, 'year', 2, true)
    for (const digit of [0, 2, 5]) {
      result = typeDigit(result.state, 'year', digit, true)
    }
    expect(result.state.values.year).toBe(2025)
    expect(result.advance).toBe(true)
  })

  test('replaces an overflowing month with the latest digit', () => {
    const state = typeSequence(empty, 'month', [1, 3])
    expect(state.values.month).toBe(3)
  })

  test('keeps a valid two digit month', () => {
    const state = typeSequence(empty, 'month', [1, 2])
    expect(state.values.month).toBe(12)
  })

  test('clamps the day when the month and year make it invalid', () => {
    let state = typeSequence(empty, 'day', [3, 1])
    expect(state.values.day).toBe(31)
    state = typeSequence(state, 'month', [2])
    expect(state.values.day).toBe(29)
    state = typeSequence(state, 'year', [2, 0, 2, 3])
    expect(state.values.day).toBe(28)
  })
})

describe('dateTimeSegments stepping', () => {
  test('wraps around the bounds', () => {
    expect(stepSegment({ values: { month: 12 }, buffer: null }, 'month', 1, true).values.month).toBe(1)
    expect(stepSegment(empty, 'month', 1, true).values.month).toBe(1)
    expect(stepSegment(empty, 'month', -1, true).values.month).toBe(12)
  })
})

describe('dateTimeSegments formatting', () => {
  test('shows localized placeholders while empty', () => {
    expect(formatSegment('day', {}, null, 'de-DE')).toBe('TT')
    expect(formatSegment('year', {}, null, 'de-DE')).toBe('JJJJ')
  })

  test('pads committed values', () => {
    expect(formatSegment('day', { day: 5 }, null, 'de-DE')).toBe('05')
    expect(formatSegment('year', { year: 2026 }, null, 'de-DE')).toBe('2026')
  })
})
