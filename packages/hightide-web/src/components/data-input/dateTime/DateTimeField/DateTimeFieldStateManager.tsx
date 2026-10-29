import type { ReactNode } from 'react'
import { useCallback, useMemo } from 'react'
import type { InputStateMangerProps } from '@helpwave/hightide-utils/interfaces'
import { useStableEvent, useStateMachine } from '@helpwave/hightide-utils/hooks'
import { DateTimeFieldContext, type DateTimeFieldContextValue } from './DateTimeFieldContext'
import { dateTimeFieldStateTransition, type DateTimeFieldEvent, type DateTimeFieldState } from './DateTimeFieldState'

export type DateTimeFieldStateManagerProps = InputStateMangerProps<DateTimeFieldState, DateTimeFieldEvent> & {
  locale: string,
  is24HourFormat: boolean,
  children?: ReactNode,
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
  children,
}: DateTimeFieldStateManagerProps) {
  const machine = useStateMachine<DateTimeFieldState, DateTimeFieldEvent>({
    state,
    transition: dateTimeFieldStateTransition,
    onStateChange,
  })
  const onStateEventStable = useStableEvent(onStateEvent)
  const dispatch = useCallback((event: DateTimeFieldEvent) => {
    machine.dispatch(event)
    onStateEventStable(event)
  }, [machine, onStateEventStable])
  const config = useMemo(() => ({
    isInvalid,
    isDisabled,
    isReadOnly,
    isRequired,
  }), [isDisabled, isInvalid, isReadOnly, isRequired])
  const contextValue = useMemo<DateTimeFieldContextValue>(() => ({
    state: machine.state,
    dispatch,
    config,
    locale,
    is24HourFormat,
  }), [config, dispatch, is24HourFormat, locale, machine.state])

  return (
    <DateTimeFieldContext.Provider value={contextValue}>
      {children}
    </DateTimeFieldContext.Provider>
  )
}
