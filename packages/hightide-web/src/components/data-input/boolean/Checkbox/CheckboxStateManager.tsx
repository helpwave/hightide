import { useMemo } from 'react'
import type { DOMInputStateManagerProps } from '../../domInput'
import { useInputStateManager } from '@helpwave/hightide-utils/hooks'
import { CheckboxContext, type CheckboxContextValue } from './CheckboxContext'
import { checkboxStateTransition, type CheckboxEvent, type CheckboxState } from './CheckboxState'

export type CheckboxStateManagerProps = DOMInputStateManagerProps<CheckboxState, CheckboxEvent>

export function CheckboxStateManager({
  state,
  value,
  initialValue,
  onValueChange,
  onStateChange,
  onStateEvent,
  isInvalid = false,
  isDisabled = false,
  isReadOnly = false,
  isRequired = false,
  id,
  children,
}: CheckboxStateManagerProps) {
  const machine = useInputStateManager({
    state,
    value,
    initialValue,
    onValueChange,
    initialState: { value: false },
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
