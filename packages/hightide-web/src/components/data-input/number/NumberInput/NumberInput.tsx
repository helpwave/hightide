import type { ComponentRef, Ref } from 'react'
import { useCallback } from 'react'
import type { ControllableInputProps } from '@helpwave/hightide-utils/interfaces'
import { useControlledState, useStateMachineBinding } from '@helpwave/hightide-utils/hooks'
import { ReactUtils } from '@helpwave/hightide-utils/utils'
import { NumberInputContext } from './NumberInputContext'
import { NumberInputInput, type NumberInputInputProps } from './NumberInputInput'
import { NumberInputStateManager } from './NumberInputStateManager'
import type { NumberInputEvent, NumberInputState } from './NumberInputState'

export type NumberInputProps = ControllableInputProps<number, NumberInputEvent> & {
  minimum?: number,
  maximum?: number,
  approximateMaxCharacters?: number,
  formatDisplayedValue?: (value: number) => string,
  parseDisplayedValue?: (rawValue: string) => number | undefined,
  inputRef?: Ref<ComponentRef<typeof NumberInputInput>>,
  inputProps?: NumberInputInputProps,
}

const NumberInputComponent = ({
  value,
  initialValue,
  onValueChange,
  onStateEvent,
  isInvalid,
  isDisabled,
  isReadOnly,
  isRequired,
  minimum,
  maximum,
  approximateMaxCharacters,
  formatDisplayedValue,
  parseDisplayedValue,
  inputRef,
  inputProps,
}: NumberInputProps) => {
  const [state, setState] = useControlledState<NumberInputState>({
    defaultValue: { value: initialValue ?? 0 },
  })
  const binding = useStateMachineBinding<NumberInputState, number>({
    state,
    onStateChange: setState,
    onValueChange,
    value,
    inject: useCallback((next: number) => ({ value: next }), []),
    get: useCallback((current: NumberInputState) => current.value, []),
  })

  return (
    <NumberInputStateManager
      state={binding.state}
      onStateChange={binding.onStateChange}
      onStateEvent={onStateEvent}
      isInvalid={isInvalid}
      isDisabled={isDisabled}
      isReadOnly={isReadOnly}
      isRequired={isRequired}
    >
      <NumberInputInput
        ref={ReactUtils.assingRefsBuilder([inputRef])}
        minimum={minimum}
        maximum={maximum}
        approximateMaxCharacters={approximateMaxCharacters}
        formatDisplayedValue={formatDisplayedValue}
        parseDisplayedValue={parseDisplayedValue}
        {...inputProps}
      />
    </NumberInputStateManager>
  )
}

export const NumberInput = Object.assign(NumberInputComponent, {
  StateManager: NumberInputStateManager,
  Input: NumberInputInput,
  Context: NumberInputContext,
  Provider: NumberInputContext.Provider,
  Consumer: NumberInputContext.Consumer,
})
