import type { ReactNode } from 'react'
import { useMemo } from 'react'
import type { DOMInputStateMangerProps } from '../../domInput'
import { useStateMachineController } from '@helpwave/hightide-utils/hooks'
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
  initialState,
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
  const machine = useStateMachineController<WheelPickerState<T>, WheelPickerEvent<T>>(state
    ? {
      state,
      transition: wheelPickerStateTransition,
      onStateChange,
      onStateEvent,
    }
    : {
      initialState,
      transition: wheelPickerStateTransition,
      onStateChange,
      onStateEvent,
    })

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
    dispatch: machine.dispatch,
    config,
  }), [config, machine.dispatch, machine.state])

  return (
    <WheelPickerContext.Provider value={contextValue as WheelPickerContextValue<unknown>}>
      {children}
    </WheelPickerContext.Provider>
  )
}
