import { useEffect, useMemo, useRef } from 'react'
import type { DOMInputStateManagerProps } from '../../domInput'
import { useInputStateManager } from '@helpwave/hightide-utils/hooks'
import { ColorInputContext, type ColorInputContextValue } from './ColorInputContext'
import { defaultHex } from './hexColor'
import { colorInputStateFromHex, colorInputStateTransition, type ColorInputEvent, type ColorInputState } from './ColorInputState'

export type ColorInputStateManagerProps = DOMInputStateManagerProps<ColorInputState, ColorInputEvent> & {
  hasAlpha?: boolean,
  isCapitalized?: boolean,
}

export function ColorInputStateManager({
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
  hasAlpha = false,
  isCapitalized = false,
  children,
}: ColorInputStateManagerProps) {
  const machine = useInputStateManager({
    state,
    value,
    initialValue,
    onValueChange,
    initialState: (seeded) => colorInputStateFromHex(seeded ?? defaultHex(true)),
    transition: colorInputStateTransition,
    onStateChange,
    onStateEvent,
  })

  const { dispatch, state: colorState } = machine
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
    state: colorState,
    dispatch,
    config,
  }), [colorState, config, dispatch])

  return (
    <ColorInputContext.Provider value={contextValue}>
      {children}
    </ColorInputContext.Provider>
  )
}
