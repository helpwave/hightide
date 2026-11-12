import { useMemo } from 'react'
import type { DOMInputStateManagerProps } from '../../domInput'
import type { Weekday } from '@helpwave/hightide-utils/utils'
import { useLocalization } from '../../../../global-contexts/localization/forward-exports'
import { useInputStateManager } from '@helpwave/hightide-utils/hooks'
import { dateInputConfig } from '../useDateStateMachine'
import { CalendarDayPickerContext, type CalendarDayPickerContextConfig } from './CalendarDayPickerContext'
import {
  calendarDayPickerStateTransition,
  type CalendarDayPickerEvent,
  type CalendarDayPickerState
} from './CalendarDayPickerState'

export type CalendarDayPickerStateManagerProps = DOMInputStateManagerProps<CalendarDayPickerState, CalendarDayPickerEvent> & {
  displayedMonth?: Date,
  initialDisplayedMonth?: Date,
  changeDisplayedMonth?: (date: Date) => void,
  start?: Date,
  end?: Date,
  weekStart?: Weekday,
  markToday?: boolean,
}

function dateOnly(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}

export function CalendarDayPickerStateManager({
  state,
  value,
  initialValue,
  onValueChange,
  onStateChange,
  onStateEvent,
  isInvalid,
  isDisabled,
  isReadOnly,
  isRequired,
  id,
  displayedMonth,
  initialDisplayedMonth,
  changeDisplayedMonth,
  start: providedStart,
  end: providedEnd,
  weekStart: weekStartOverride,
  markToday = true,
  children,
}: CalendarDayPickerStateManagerProps) {
  const { locale, startingWeekday } = useLocalization()
  const weekStart = weekStartOverride ?? startingWeekday
  const start = useMemo(() => providedStart ? dateOnly(providedStart) : undefined, [providedStart])
  const end = useMemo(() => providedEnd ? dateOnly(providedEnd) : undefined, [providedEnd])
  const transition = useMemo(() => {
    return (current: CalendarDayPickerState, event: CalendarDayPickerEvent) => calendarDayPickerStateTransition(current, event, { start, end })
  }, [end, start])
  const config = useMemo<CalendarDayPickerContextConfig>(() => ({
    ...dateInputConfig({ isInvalid, isDisabled, isReadOnly, isRequired, id }),
    start,
    end,
    weekStart,
    markToday,
    locale,
  }), [end, isDisabled, isInvalid, isReadOnly, isRequired, locale, markToday, start, weekStart, id])
  const machine = useInputStateManager({
    state,
    value,
    initialValue,
    onValueChange,
    initialState: (seeded) => {
      const resolved = seeded ?? new Date()
      return {
        value: resolved,
        displayedMonth: displayedMonth ?? initialDisplayedMonth ?? resolved,
      }
    },
    bindings: {
      displayedMonth: { value: displayedMonth, onValueChange: changeDisplayedMonth },
    },
    transition,
    onStateChange,
    onStateEvent,
  })
  const contextValue = useMemo(() => ({
    state: machine.state,
    dispatch: machine.dispatch,
    config,
  }), [config, machine.dispatch, machine.state])

  return (
    <CalendarDayPickerContext.Provider value={contextValue}>
      {children}
    </CalendarDayPickerContext.Provider>
  )
}
