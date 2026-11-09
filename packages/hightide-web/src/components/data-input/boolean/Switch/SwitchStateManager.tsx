import type { ReactNode } from 'react'
import { useMemo } from 'react'
import type { DOMInputStateMangerProps } from '../../domInput'
import { useStateMachineController } from '@helpwave/hightide-utils/hooks'
import { SwitchContext, type SwitchContextValue } from './SwitchContext'
import { switchStateTransition, type SwitchEvent, type SwitchState } from './SwitchState'

export type SwitchStateManagerProps = DOMInputStateMangerProps<SwitchState, SwitchEvent>
  & {
    children?: ReactNode,
  }

export function SwitchStateManager({
  state,
  initialState,
  onStateChange,
  onStateEvent,
  isInvalid = false,
  isDisabled = false,
  isReadOnly = false,
  isRequired = false,
  id,
  children,
}: SwitchStateManagerProps) {
  const machine = useStateMachineController<SwitchState, SwitchEvent>(state
    ? {
      state,
      transition: switchStateTransition,
      onStateChange,
      onStateEvent,
    }
    : {
      initialState,
      transition: switchStateTransition,
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

  const contextValue = useMemo<SwitchContextValue>(() => ({
    state: machine.state,
    dispatch: machine.dispatch,
    config,
  }), [config, machine.dispatch, machine.state])

  return (
    <SwitchContext.Provider value={contextValue}>
      {children}
    </SwitchContext.Provider>
  )
}
