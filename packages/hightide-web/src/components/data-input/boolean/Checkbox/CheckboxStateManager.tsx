import type { ReactNode } from 'react'
import { useMemo } from 'react'
import type { DOMInputStateMangerProps } from '../../domInput'
import { useStateMachineController } from '@helpwave/hightide-utils/hooks'
import { CheckboxContext, type CheckboxContextValue } from './CheckboxContext'
import { checkboxStateTransition, type CheckboxEvent, type CheckboxState } from './CheckboxState'

export type CheckboxStateManagerProps = DOMInputStateMangerProps<CheckboxState, CheckboxEvent>
  & {
    children?: ReactNode,
  }

export function CheckboxStateManager({
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
}: CheckboxStateManagerProps) {
  const machine = useStateMachineController<CheckboxState, CheckboxEvent>(state
    ? {
      state,
      transition: checkboxStateTransition,
      onStateChange,
      onStateEvent,
    }
    : {
      initialState,
      transition: checkboxStateTransition,
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

  const contextValue = useMemo<CheckboxContextValue>(() => ({
    state: machine.state,
    dispatch: machine.dispatch,
    config,
  }), [config, machine.dispatch, machine.state])

  return (
    <CheckboxContext.Provider value={contextValue}>
      {children}
    </CheckboxContext.Provider>
  )
}
