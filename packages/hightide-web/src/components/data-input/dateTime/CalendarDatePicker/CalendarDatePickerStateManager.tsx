import { useMemo } from 'react'
import type { DOMInputStateManagerProps } from '../../domInput'
import type { Weekday } from '@helpwave/hightide-utils/utils'
import { useLocalization } from '../../../../global-contexts/localization/forward-exports'
import { useInputStateManager } from '@helpwave/hightide-utils/hooks'
import { dateInputConfig } from '../useDateStateMachine'
import { CalendarDatePickerContext, type CalendarDatePickerContextConfig } from './CalendarDatePickerContext'
import {
  calendarDatePickerStateTransition,
  type CalendarDatePickerEvent,
  type CalendarDatePickerState,
  type CalendarDisplayMode
} from './CalendarDatePickerState'

export type CalendarDatePickerStateManagerProps = DOMInputStateManagerProps<CalendarDatePickerState, CalendarDatePickerEvent> & {
  initialDisplay?: CalendarDisplayMode,
  start?: Date,
  end?: Date,
  weekStart?: Weekday,
  markToday?: boolean,
}

export function CalendarDatePickerStateManager({
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
  initialDisplay = 'day',
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
  const machine = useInputStateManager({
    state,
    value,
    initialValue,
    onValueChange,
    initialState: (seeded) => {
      const resolved = seeded ?? new Date()
      return {
        value: resolved,
        displayedMonth: new Date(resolved.getFullYear(), resolved.getMonth(), 1),
        displayMode: initialDisplay,
      }
    },
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
