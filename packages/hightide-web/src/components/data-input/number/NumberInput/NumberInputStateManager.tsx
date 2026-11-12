import { useMemo } from 'react'
import type { DOMInputStateManagerProps } from '../../domInput'
import { useInputStateManager } from '@helpwave/hightide-utils/hooks'
import { NumberInputContext, type NumberInputContextValue } from './NumberInputContext'
import { numberInputStateTransition, type NumberInputEvent, type NumberInputState } from './NumberInputState'

export type NumberInputStateManagerProps = DOMInputStateManagerProps<NumberInputState, NumberInputEvent> & {
  minimum?: number,
  maximum?: number,
  approximateMaxCharacters?: number,
  formatDisplayedValue?: (value: number) => string,
  parseDisplayedValue?: (rawValue: string) => number | undefined,
}

export function NumberInputStateManager({
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
  minimum,
  maximum,
  approximateMaxCharacters = 6,
  formatDisplayedValue,
  parseDisplayedValue,
  children,
}: NumberInputStateManagerProps) {
  const machine = useInputStateManager({
    state,
    value,
    initialValue,
    onValueChange,
    initialState: { value: 0 },
    transition: numberInputStateTransition,
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
  const contextValue = useMemo<NumberInputContextValue>(() => ({
    state: machine.state,
    dispatch: machine.dispatch,
    config,
    minimum,
    maximum,
    approximateMaxCharacters,
    formatDisplayedValue,
    parseDisplayedValue,
  }), [
    approximateMaxCharacters,
    config,
    formatDisplayedValue,
    machine.dispatch,
    machine.state,
    maximum,
    minimum,
    parseDisplayedValue,
  ])

  return (
    <NumberInputContext.Provider value={contextValue}>
      {children}
    </NumberInputContext.Provider>
  )
}
