import type { ReactNode } from 'react'
import { useMemo } from 'react'
import type { InputStateMangerProps } from '@helpwave/hightide-utils/interfaces'
import type { Weekday } from '@helpwave/hightide-utils/utils'
import { useLocalization } from '../../../../global-contexts/localization/forward-exports'
import { dateInputConfig, useDateStateMachine } from '../useDateStateMachine'
import { CalendarDayPickerContext, type CalendarDayPickerContextConfig } from './CalendarDayPickerContext'
import {
  calendarDayPickerStateTransition,
  type CalendarDayPickerEvent,
  type CalendarDayPickerState
} from './CalendarDayPickerState'

export type CalendarDayPickerStateManagerProps = InputStateMangerProps<CalendarDayPickerState, CalendarDayPickerEvent> & {
  children?: ReactNode,
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
  onStateChange,
  onStateEvent,
  isInvalid,
  isDisabled,
  isReadOnly,
  isRequired,
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
    ...dateInputConfig({ isInvalid, isDisabled, isReadOnly, isRequired }),
    start,
    end,
    weekStart,
    markToday,
    locale,
  }), [end, isDisabled, isInvalid, isReadOnly, isRequired, locale, markToday, start, weekStart])
  const contextValue = useDateStateMachine({
    state,
    transition,
    onStateChange,
    onStateEvent,
    config,
  })

  return (
    <CalendarDayPickerContext.Provider value={contextValue}>
      {children}
    </CalendarDayPickerContext.Provider>
  )
}
