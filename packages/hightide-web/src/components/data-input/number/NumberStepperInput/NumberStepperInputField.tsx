import type { ComponentRef, Ref } from 'react'
import clsx from 'clsx'
import { NumberInput, type NumberInputInputProps, type NumberInputProps } from '../NumberInput'
import { useNumberStepperInputContext } from './NumberStepperInputContext'
import { useNumberStepperHold } from './NumberStepperInputHold'

export type NumberStepperInputFieldProps = Omit<NumberInputProps, 'value' | 'onValueChange' | 'onStateEvent' | 'inputRef' | 'inputProps'> & {
  inputRef?: Ref<ComponentRef<typeof NumberInput.Input>>,
  inputProps?: NumberInputInputProps,
}

export function NumberStepperInputField({
  inputRef,
  inputProps,
  ...props
}: NumberStepperInputFieldProps) {
  const { state, dispatch, config } = useNumberStepperInputContext()
  const { start, stop } = useNumberStepperHold()

  return (
    <NumberInput
      {...props}
      value={state.value}
      isInvalid={config.isInvalid}
      isDisabled={config.isDisabled}
      isReadOnly={config.isReadOnly}
      isRequired={config.isRequired}
      onValueChange={(next) => dispatch({ type: 'change', value: next })}
      onStateEvent={(event) => {
        if (event.type === 'commit') {
          dispatch({ type: 'commit', value: event.value })
        }
      }}
      inputRef={inputRef}
      inputProps={{
        ...inputProps,
        onKeyDown: (event) => {
          inputProps?.onKeyDown?.(event)
          if (event.key === 'ArrowUp') {
            event.preventDefault()
            start('keyboard', 1)
          }
          if (event.key === 'ArrowDown') {
            event.preventDefault()
            start('keyboard', -1)
          }
        },
        onKeyUp: (event) => {
          inputProps?.onKeyUp?.(event)
          if (event.key === 'ArrowUp') {
            event.preventDefault()
            stop('keyboard', 1)
          }
          if (event.key === 'ArrowDown') {
            event.preventDefault()
            stop('keyboard', -1)
          }
        },
        className: clsx('number-stepper-input-field', inputProps?.className),
      }}
    />
  )
}
