import type { ComponentRef, Ref } from 'react'
import { ReactUtils } from '@helpwave/hightide-utils/utils'
import { NumberInputContext } from './NumberInputContext'
import { NumberInputInput, type NumberInputInputProps } from './NumberInputInput'
import { NumberInputStateManager, type NumberInputStateManagerProps } from './NumberInputStateManager'

export type NumberInputProps = Omit<NumberInputStateManagerProps, 'children'> & {
  inputRef?: Ref<ComponentRef<typeof NumberInputInput>>,
  inputProps?: NumberInputInputProps,
}

const NumberInputComponent = ({
  inputRef,
  inputProps,
  ...props
}: NumberInputProps) => {
  return (
    <NumberInputStateManager {...props}>
      <NumberInputInput
        ref={ReactUtils.assingRefsBuilder([inputRef])}
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
