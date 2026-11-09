import type { ReactNode } from 'react'
import { useMemo } from 'react'
import type { DOMInputStateMangerProps } from '../../domInput'
import type { Weekday } from '@helpwave/hightide-utils/utils'
import { useLocalization } from '../../../../global-contexts/localization/forward-exports'
import { useStateMachineController } from '@helpwave/hightide-utils/hooks'
import { dateInputConfig } from '../useDateStateMachine'
import { CalendarDatePickerContext, type CalendarDatePickerContextConfig } from './CalendarDatePickerContext'
import {
  calendarDatePickerStateTransition,
  type CalendarDatePickerEvent,
  type CalendarDatePickerState
} from './CalendarDatePickerState'

export type CalendarDatePickerStateManagerProps = DOMInputStateMangerProps<CalendarDatePickerState, CalendarDatePickerEvent> & {
  children?: ReactNode,
  start?: Date,
  end?: Date,
  weekStart?: Weekday,
  markToday?: boolean,
}

export function CalendarDatePickerStateManager({
  state,
  initialState,
  onStateChange,
  onStateEvent,
  isInvalid,
  isDisabled,
  isReadOnly,
  isRequired,
  id,
  start,
  end,
  weekStart,
  markToday = true,
  children,
}: CalendarDatePickerStateManagerProps) {
  const { locale } = useLocalization()
  const config = useMemo<CalendarDatePickerContextConfig>(() => ({
    ...dateInputConfig({ isInvalid, isDisabled, isReadOnly, isRequired, id }),
    start,
    end,
    weekStart,
    markToday,
    locale,
  }), [end, isDisabled, isInvalid, isReadOnly, isRequired, locale, markToday, start, weekStart, id])
  const machine = useStateMachineController(state
    ? {
      state,
      transition: calendarDatePickerStateTransition,
      onStateChange,
      onStateEvent,
    }
    : {
      initialState,
      transition: calendarDatePickerStateTransition,
      onStateChange,
      onStateEvent,
    })
  const contextValue = useMemo(() => ({
    state: machine.state,
    dispatch: machine.dispatch,
    config,
  }), [config, machine.dispatch, machine.state])

  return (
    <CalendarDatePickerContext.Provider value={contextValue}>
      {children}
    </CalendarDatePickerContext.Provider>
  )
}
