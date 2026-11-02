import type { KeyboardEvent, RefObject } from 'react'
import { ColoringUtils } from '../../../../utils/coloring'
import { PropsUtil } from '../../../../utils/propsUtil'
import { useCalendarDayPickerContext } from './CalendarDayPickerContext'

type CalendarDayPickerTriggerProps = {
  date: Date,
  isSelected: boolean,
  isFocused: boolean,
  isToday: boolean,
  isSameMonth: boolean,
  isDayValid: boolean,
  markToday: boolean,
  selectedRef: RefObject<HTMLDivElement | null>,
  onKeyDown: (event: KeyboardEvent<HTMLDivElement>) => void,
}

export function CalendarDayPickerTrigger({
  date,
  isSelected,
  isFocused,
  isToday,
  isSameMonth,
  isDayValid,
  markToday,
  selectedRef,
  onKeyDown,
}: CalendarDayPickerTriggerProps) {
  const { dispatch } = useCalendarDayPickerContext()

  return (
    <div
      ref={isFocused ? selectedRef : undefined}
      className="calendar-day-picker-body-item"
      onClick={() => {
        if (isDayValid) {
          dispatch({ type: 'selectDay', date })
        }
      }}
      onKeyDown={onKeyDown}
      role="button"
      tabIndex={isFocused ? 0 : -1}
      {...ColoringUtils.build({
        color: isSelected ? 'primary' : 'surface-inverse',
        mode: isDayValid ? 'interactive' : 'static',
        coloringStyle: isSelected ? 'filled' : 'foreground',
      })}
      data-disabled={PropsUtil.dataAttributes.bool(!isDayValid)}
      data-selected={PropsUtil.dataAttributes.bool(isSelected)}
      data-today={PropsUtil.dataAttributes.bool(isToday && markToday)}
      data-samemonth={PropsUtil.dataAttributes.bool(isSameMonth)}
    >
      {date.getDate()}
    </div>
  )
}
