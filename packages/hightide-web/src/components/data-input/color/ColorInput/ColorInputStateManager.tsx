import type { ReactNode } from 'react'
import { useEffect, useMemo, useRef } from 'react'
import type { DOMInputStateMangerProps } from '../../domInput'
import { useStateMachineController } from '@helpwave/hightide-utils/hooks'
import { ColorInputContext, type ColorInputContextValue } from './ColorInputContext'
import { colorInputStateTransition, type ColorInputEvent, type ColorInputState } from './ColorInputState'

export type ColorInputStateManagerProps = DOMInputStateMangerProps<ColorInputState, ColorInputEvent> & {
  hasAlpha?: boolean,
  isCapitalized?: boolean,
  children?: ReactNode,
}

export function ColorInputStateManager({
  state,
  initialState,
  onStateChange,
  onStateEvent,
  isInvalid = false,
  isDisabled = false,
  isReadOnly = false,
  isRequired = false,
  id,
  hasAlpha = false,
  isCapitalized = false,
  children,
}: ColorInputStateManagerProps) {
  const machine = useStateMachineController<ColorInputState, ColorInputEvent>(state
    ? {
      state,
      transition: colorInputStateTransition,
      onStateChange,
      onStateEvent,
    }
    : {
      initialState,
      transition: colorInputStateTransition,
      onStateChange,
      onStateEvent,
    })

  const hasAlphaRef = useRef<boolean | null>(null)
  useEffect(() => {
    const previous = hasAlphaRef.current
    hasAlphaRef.current = hasAlpha
    if (hasAlpha || previous === hasAlpha) return
    machine.dispatch({ type: 'resetAlpha' })
  }, [machine.dispatch, hasAlpha])

  const config = useMemo(() => ({
    isInvalid,
    isDisabled,
    isReadOnly,
    isRequired,
    id,
    hasAlpha,
    isCapitalized,
  }), [isCapitalized, hasAlpha, isDisabled, isInvalid, isReadOnly, isRequired, id])

  const contextValue = useMemo<ColorInputContextValue>(() => ({
    state: machine.state,
    dispatch: machine.dispatch,
    config,
  }), [config, machine.dispatch, machine.state])

  return (
    <ColorInputContext.Provider value={contextValue}>
      {children}
    </ColorInputContext.Provider>
  )
}
