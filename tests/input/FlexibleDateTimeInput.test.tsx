/**
 * @jest-environment jsdom
 */
import { useState } from 'react'
import { act, fireEvent, render, screen } from '@testing-library/react'
import { LocaleContext } from '../../src/global-contexts/LocaleContext'
import { FlexibleDateTimeInput, type FlexibleDateTimeInputProps } from '../../src/components/user-interaction/input/FlexibleDateTimeInput'

const renderFlexible = (props: Partial<FlexibleDateTimeInputProps> & { defaultMode: 'date' | 'dateTime' }) => {
  const onValueChange = jest.fn()
  const Wrapper = () => {
    const [value, setValue] = useState<Date | null>(props.initialValue ?? null)
    return (
      <LocaleContext.Provider value={{ locale: 'de-DE', setLocale: () => {} }}>
        <FlexibleDateTimeInput
          {...props}
          value={value}
          onValueChange={(next) => {
            onValueChange(next)
            setValue(next)
          }}
        />
      </LocaleContext.Provider>
    )
  }
  render(<Wrapper/>)
  return { onValueChange }
}

const toggleMode = () => fireEvent.click(screen.getAllByRole('button')[0])
const segmentCount = () => screen.getAllByRole('spinbutton').length
const lastValue = (mock: jest.Mock): Date => mock.mock.calls.at(-1)![0] as Date
const typeInto = (segment: HTMLElement, digits: string) => {
  for (const digit of digits) {
    fireEvent.keyDown(segment, { key: digit })
  }
}

describe('FlexibleDateTimeInput mode toggle', () => {
  test('date to date time without a value reveals the time segments', () => {
    renderFlexible({ defaultMode: 'date' })
    expect(segmentCount()).toBe(3)

    toggleMode()

    expect(segmentCount()).toBe(5)
  })

  test('date to date time with a value seeds the current time', () => {
    const { onValueChange } = renderFlexible({ defaultMode: 'date', initialValue: new Date(2026, 5, 15, 23, 59, 59, 999) })
    expect(segmentCount()).toBe(3)

    toggleMode()

    expect(segmentCount()).toBe(5)
    const committed = lastValue(onValueChange)
    expect([committed.getFullYear(), committed.getMonth(), committed.getDate()]).toEqual([2026, 5, 15])
    expect(committed.getHours()).toBe(new Date().getHours())
  })

  test('date time to date without a value hides the time segments', () => {
    renderFlexible({ defaultMode: 'dateTime' })
    expect(segmentCount()).toBe(5)

    toggleMode()

    expect(segmentCount()).toBe(3)
  })

  test('date time to date with a value anchors to the fixed end of day time', () => {
    const { onValueChange } = renderFlexible({ defaultMode: 'dateTime', initialValue: new Date(2026, 5, 15, 14, 30) })
    expect(segmentCount()).toBe(5)

    toggleMode()

    expect(segmentCount()).toBe(3)
    const committed = lastValue(onValueChange)
    expect([committed.getHours(), committed.getMinutes(), committed.getSeconds(), committed.getMilliseconds()]).toEqual([23, 59, 59, 999])
  })

  test('lets a full year be typed over an existing value without snapping to the 1900s', () => {
    const { onValueChange } = renderFlexible({ defaultMode: 'date', initialValue: new Date(2026, 0, 1, 23, 59, 59, 999) })
    const year = screen.getAllByRole('spinbutton')[2]

    act(() => year.focus())
    typeInto(year, '2004')

    expect(screen.getAllByRole('spinbutton')[2].textContent).toBe('2004')
    expect(lastValue(onValueChange).getFullYear()).toBe(2004)
  })

  test('uses 24 hour time without a day period for German', () => {
    renderFlexible({ defaultMode: 'dateTime', initialValue: new Date(2026, 5, 15, 16, 0) })
    expect(screen.getAllByRole('spinbutton').map(segment => segment.getAttribute('aria-label'))).toEqual([
      'Tag',
      'Monat',
      'Jahr',
      'Stunde',
      'Minute',
    ])
  })
})
