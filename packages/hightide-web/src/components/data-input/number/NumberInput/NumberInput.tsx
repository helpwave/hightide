import type { ComponentRef, Ref } from 'react'
import type { ControllableDOMInputProps } from '../../domInput'
import { useStateStore, useStateStoreBindings } from '@helpwave/hightide-utils/hooks'
import { ReactUtils } from '@helpwave/hightide-utils/utils'
import { NumberInputContext } from './NumberInputContext'
import { NumberInputInput, type NumberInputInputProps } from './NumberInputInput'
import { NumberInputStateManager } from './NumberInputStateManager'
import { type NumberInputEvent, type NumberInputState } from './NumberInputState'

export type NumberInputProps = ControllableDOMInputProps<number, NumberInputEvent> & {
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
  id,
  minimum,
  maximum,
  approximateMaxCharacters,
  formatDisplayedValue,
  parseDisplayedValue,
  inputRef,
  inputProps,
}: NumberInputProps) => {
  const store = useStateStore<NumberInputState>({
    value: value ?? initialValue ?? 0,
  })
  const onStateChange = useStateStoreBindings({
    store,
    bindings: {
      value: { value, onValueChange },
    },
  })

  return (
    <NumberInputStateManager
      state={store}
      onStateChange={onStateChange}
      onStateEvent={onStateEvent}
      isInvalid={isInvalid}
      isDisabled={isDisabled}
      isReadOnly={isReadOnly}
      isRequired={isRequired}
      id={id}
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
