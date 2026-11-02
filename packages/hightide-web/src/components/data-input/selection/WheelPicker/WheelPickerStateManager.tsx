import type { ReactNode } from 'react'
import { useCallback, useMemo } from 'react'
import type { DOMInputStateMangerProps } from '../../domInput'
import { useStableEvent, useStateMachine } from '@helpwave/hightide-utils/hooks'
import { WheelPickerContext, type WheelPickerContextConfig, type WheelPickerContextValue } from './WheelPickerContext'
import {
  wheelPickerStateTransition,
  type WheelPickerEvent,
  type WheelPickerState
} from './WheelPickerState'

export type WheelPickerStateManagerProps<T> = DOMInputStateMangerProps<WheelPickerState<T>, WheelPickerEvent<T>>
  & {
    isLooping?: boolean,
    visibleRows?: number,
    children?: ReactNode,
  }

export function WheelPickerStateManager<T>({
  state,
  onStateChange,
  onStateEvent,
  isInvalid = false,
  isDisabled = false,
  isReadOnly = false,
  isRequired = false,
  id,
  isLooping = false,
  visibleRows = 1,
  children,
}: WheelPickerStateManagerProps<T>) {
  const machine = useStateMachine<WheelPickerState<T>, WheelPickerEvent<T>>({
    state,
    transition: wheelPickerStateTransition,
    onStateChange,
  })

  const onStateEventStable = useStableEvent(onStateEvent)
  const dispatch = useCallback((event: WheelPickerEvent<T>) => {
    machine.dispatch(event)
    onStateEventStable(event)
  }, [machine, onStateEventStable])

  const config = useMemo<WheelPickerContextConfig>(() => ({
    isInvalid,
    isDisabled,
    isReadOnly,
    isRequired,
    id,
    isLooping,
    visibleRows,
  }), [id, isDisabled, isInvalid, isLooping, isReadOnly, isRequired, visibleRows])

  const contextValue = useMemo<WheelPickerContextValue<T>>(() => ({
    state: machine.state,
    dispatch,
    config,
  }), [config, dispatch, machine.state])

  return (
    <WheelPickerContext.Provider value={contextValue as WheelPickerContextValue<unknown>}>
      {children}
    </WheelPickerContext.Provider>
  )
}
