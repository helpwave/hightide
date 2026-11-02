import type { ReactNode } from 'react'
import { useCallback, useEffect, useMemo, useRef } from 'react'
import type { DOMInputStateMangerProps } from '../../domInput'
import { useStableEvent, useStateMachine } from '@helpwave/hightide-utils/hooks'
import { ColorInputContext, type ColorInputContextValue } from './ColorInputContext'
import { colorInputStateTransition, type ColorInputEvent, type ColorInputState } from './ColorInputState'

export type ColorInputStateManagerProps = DOMInputStateMangerProps<ColorInputState, ColorInputEvent> & {
  hasAlpha?: boolean,
  isCapitalized?: boolean,
  children?: ReactNode,
}

export function ColorInputStateManager({
  state,
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
  const machine = useStateMachine<ColorInputState, ColorInputEvent>({
    state,
    transition: colorInputStateTransition,
    onStateChange,
  })

  const onStateEventStable = useStableEvent(onStateEvent)
  const dispatch = useCallback((event: ColorInputEvent) => {
    machine.dispatch(event)
    onStateEventStable(event)
  }, [machine, onStateEventStable])

  const hasAlphaRef = useRef<boolean | null>(null)
  useEffect(() => {
    const previous = hasAlphaRef.current
    hasAlphaRef.current = hasAlpha
    if (hasAlpha || previous === hasAlpha) return
    dispatch({ type: 'resetAlpha' })
  }, [dispatch, hasAlpha])

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
    dispatch,
    config,
  }), [config, dispatch, machine.state])

  return (
    <ColorInputContext.Provider value={contextValue}>
      {children}
    </ColorInputContext.Provider>
  )
}
