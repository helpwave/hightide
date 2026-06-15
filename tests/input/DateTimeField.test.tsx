/**
 * @jest-environment jsdom
 */
import { useEffect, useState } from 'react'
import { act, fireEvent, render, screen } from '@testing-library/react'
import { LocaleContext } from '../../src/global-contexts/LocaleContext'
import { DateTimeField, type DateTimeFieldProps } from '../../src/components/user-interaction/input/DateTimeField'
import { DateTimeInput } from '../../src/components/user-interaction/input/DateTimeInput'

const renderField = (props?: Partial<DateTimeFieldProps>) => {
  const onValueChange = jest.fn()
  const Wrapper = () => {
    const [value, setValue] = useState<Date | null>(props?.initialValue ?? null)
    return (
      <LocaleContext.Provider value={{ locale: 'de-DE', setLocale: () => {} }}>
        <DateTimeField
          mode="date"
          locale="de-DE"
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

const typeInto = (segment: HTMLElement, digits: string) => {
  for (const digit of digits) {
    fireEvent.keyDown(segment, { key: digit })
  }
}

describe('DateTimeField', () => {
  test('shows German placeholders in day month year order', () => {
    renderField()
    expect(screen.getAllByRole('spinbutton').map(segment => segment.textContent)).toEqual(['TT', 'MM', 'JJJJ'])
  })

  test('commits a typed date and keeps the display in sync', () => {
    const { onValueChange } = renderField()
    const [day, month, year] = screen.getAllByRole('spinbutton')

    typeInto(day, '15')
    typeInto(month, '06')
    typeInto(year, '2026')

    const committed = onValueChange.mock.calls.at(-1)![0] as Date
    expect([committed.getDate(), committed.getMonth(), committed.getFullYear()]).toEqual([15, 5, 2026])
    expect(screen.getAllByRole('spinbutton').map(segment => segment.textContent)).toEqual(['15', '06', '2026'])
  })

  test('moves focus between segments with the arrow keys', () => {
    renderField()
    const [day, month, year] = screen.getAllByRole('spinbutton')

    act(() => day.focus())
    fireEvent.keyDown(day, { key: 'ArrowRight' })
    expect(document.activeElement).toBe(month)

    fireEvent.keyDown(month, { key: 'ArrowRight' })
    expect(document.activeElement).toBe(year)
  })

  test('steps an empty segment to its lower bound on arrow up', () => {
    renderField()
    const [day] = screen.getAllByRole('spinbutton')

    fireEvent.keyDown(day, { key: 'ArrowUp' })

    expect(day.textContent).toBe('01')
  })

  test('keeps a partial value when focus moves between segments (tab/auto-advance)', () => {
    const frames: FrameRequestCallback[] = []
    const raf = jest.spyOn(window, 'requestAnimationFrame').mockImplementation((callback) => {
      frames.push(callback)
      return frames.length
    })
    try {
      renderField()
      const [day, month, year] = screen.getAllByRole('spinbutton')

      act(() => day.focus())
      typeInto(day, '01')
      fireEvent.keyDown(month, { key: 'Tab' })

      expect(document.activeElement).toBe(year)
      act(() => frames.forEach(frame => frame(0)))

      expect(day.textContent).toBe('01')
    } finally {
      raf.mockRestore()
    }
  })

  test('keeps a partial value visible after focus leaves the field', () => {
    const frames: FrameRequestCallback[] = []
    const raf = jest.spyOn(window, 'requestAnimationFrame').mockImplementation((callback) => {
      frames.push(callback)
      return frames.length
    })
    try {
      renderField()
      const [day] = screen.getAllByRole('spinbutton')

      act(() => day.focus())
      typeInto(day, '01')
      act(() => (document.activeElement as HTMLElement | null)?.blur())
      act(() => frames.forEach(frame => frame(0)))

      expect(screen.getAllByRole('spinbutton')[0].textContent).toBe('01')
    } finally {
      raf.mockRestore()
    }
  })

  test('clears the value when all segments are emptied', () => {
    const { onValueChange } = renderField({ initialValue: new Date(2026, 5, 15) })
    const [day, month, year] = screen.getAllByRole('spinbutton')

    fireEvent.keyDown(year, { key: 'Backspace' })
    fireEvent.keyDown(month, { key: 'Backspace' })
    fireEvent.keyDown(day, { key: 'Backspace' })

    expect(onValueChange).toHaveBeenLastCalledWith(null)
  })
})

describe('DateTimeInput controlled value', () => {
  const StoryLike = ({ onValueChange }: { onValueChange: (value: Date | null) => void }) => {
    const [value, setValue] = useState<Date | null>(null)
    useEffect(() => {
      setValue(null)
    }, [])
    return (
      <LocaleContext.Provider value={{ locale: 'en-US', setLocale: () => {} }}>
        <DateTimeInput
          mode="date"
          value={value}
          onValueChange={(next) => {
            onValueChange(next)
            setValue(next)
          }}
        />
      </LocaleContext.Provider>
    )
  }

  test('does not reset the input while typing into a controlled null value', () => {
    const onValueChange = jest.fn()
    render(<StoryLike onValueChange={onValueChange} />)

    const [month, day, year] = screen.getAllByRole('spinbutton')

    act(() => month.focus())
    typeInto(month, '06')
    typeInto(day, '15')
    typeInto(year, '2026')

    expect(screen.getAllByRole('spinbutton').map(segment => segment.textContent)).toEqual(['06', '15', '2026'])
    const committed = onValueChange.mock.calls.at(-1)![0] as Date
    expect([committed.getMonth(), committed.getDate(), committed.getFullYear()]).toEqual([5, 15, 2026])
  })
})
