import { useMemo } from 'react'
import type { DOMInputStateMangerProps } from '../../domInput'
import { useStateMachine } from '@helpwave/hightide-utils/hooks'
import { DateTimeFieldContext, type DateTimeFieldContextValue } from './DateTimeFieldContext'
import { dateTimeFieldStateTransition, type DateTimeFieldEvent, type DateTimeFieldState } from './DateTimeFieldState'

export type DateTimeFieldStateManagerProps = DOMInputStateMangerProps<DateTimeFieldState, DateTimeFieldEvent> & {
  locale: string,
  is24HourFormat: boolean,
}

export function DateTimeFieldStateManager({
  state,
  onStateChange,
  onStateEvent,
  locale,
  is24HourFormat,
  isInvalid = false,
  isDisabled = false,
  isReadOnly = false,
  isRequired = false,
  id,
  children,
}: DateTimeFieldStateManagerProps) {
  const machine = useStateMachine({
    state,
    transition: dateTimeFieldStateTransition,
    onStateChange,
    onStateEvent,
  })
  const config = useMemo(() => ({
    isInvalid,
    isDisabled,
    isReadOnly,
    isRequired,
    id,
  }), [isDisabled, isInvalid, isReadOnly, isRequired, id])
  const contextValue = useMemo<DateTimeFieldContextValue>(() => ({
    state: machine.state,
    dispatch: machine.dispatch,
    config,
    locale,
    is24HourFormat,
  }), [config, machine.dispatch, is24HourFormat, locale, machine.state])

  return (
    <DateTimeFieldContext.Provider value={contextValue}>
      {children}
    </DateTimeFieldContext.Provider>
  )
}
