import type { ReactNode } from 'react'
import { useMemo } from 'react'
import type { InputStateMangerProps } from '@helpwave/hightide-utils/interfaces'
import type { Weekday } from '@helpwave/hightide-utils/utils'
import { useLocalization } from '../../../../global-contexts/localization/forward-exports'
import { dateInputConfig, useDateStateMachine } from '../useDateStateMachine'
import { CalendarDatePickerContext, type CalendarDatePickerContextConfig } from './CalendarDatePickerContext'
import {
  calendarDatePickerStateTransition,
  type CalendarDatePickerEvent,
  type CalendarDatePickerState
} from './CalendarDatePickerState'

export type CalendarDatePickerStateManagerProps = InputStateMangerProps<CalendarDatePickerState, CalendarDatePickerEvent> & {
  children?: ReactNode,
  start?: Date,
  end?: Date,
  weekStart?: Weekday,
  markToday?: boolean,
}

export function CalendarDatePickerStateManager({
  state,
  onStateChange,
  onStateEvent,
  isInvalid,
  isDisabled,
  isReadOnly,
  isRequired,
  start,
  end,
  weekStart,
  markToday = true,
  children,
}: CalendarDatePickerStateManagerProps) {
  const { locale } = useLocalization()
  const config = useMemo<CalendarDatePickerContextConfig>(() => ({
    ...dateInputConfig({ isInvalid, isDisabled, isReadOnly, isRequired }),
    start,
    end,
    weekStart,
    markToday,
    locale,
  }), [end, isDisabled, isInvalid, isReadOnly, isRequired, locale, markToday, start, weekStart])
  const contextValue = useDateStateMachine({
    state,
    transition: calendarDatePickerStateTransition,
    onStateChange,
    onStateEvent,
    config,
  })

  return (
    <CalendarDatePickerContext.Provider value={contextValue}>
      {children}
    </CalendarDatePickerContext.Provider>
  )
}
