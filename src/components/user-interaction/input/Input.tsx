import type { InputHTMLAttributes } from 'react'
import React, { forwardRef, useImperativeHandle, useRef } from 'react'
import type { UseDelayOptionsResolved } from '@/src/hooks/useDelay'
import { useDelay  } from '@/src/hooks/useDelay'
import { useFocusManagement } from '@/src/hooks/focus/useFocusManagement'
import { useOverwritableState } from '@/src/hooks/useOverwritableState'
import type { FormFieldWrapperBagProps } from '../../form/FormFieldWrapper'
import { DataAttributesUtil } from '@/src/utils/dataAttribute'

export type EditCompleteOptionsResolved = {
  onBlur: boolean,
  afterDelay: boolean,
  allowEnterComplete?: boolean,
} & Omit<UseDelayOptionsResolved, 'disabled'>

export type EditCompleteOptions = Partial<EditCompleteOptionsResolved>

const defaultEditCompleteOptions: EditCompleteOptionsResolved = {
  allowEnterComplete: false,
  onBlur: true,
  afterDelay: false,
  delay: 2500
}

export type InputProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'value'> &
  Partial<FormFieldWrapperBagProps<string>> & { editCompleteOptions?: EditCompleteOptions }

/**
 * A Component for inputting text or other information
 *
 * Its state is managed must be managed by the parent
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(function Input({
  value,
  onValueChange,
  onEditComplete,
  editCompleteOptions,
  disabled = false,
  invalid = false,
  ...props
}, forwardedRef) {
  const {
    onBlur: allowEditCompleteOnBlur,
    afterDelay,
    delay,
    allowEnterComplete
  } = { ...defaultEditCompleteOptions, ...editCompleteOptions }

  const {
    restartTimer,
    clearTimer
  } = useDelay({ delay, disabled: !afterDelay })

  const innerRef = useRef<HTMLInputElement>(null)
  useImperativeHandle(forwardedRef, () => innerRef.current)

  const { focusNext } = useFocusManagement()

  return (
    <input
      {...props}
      ref={innerRef}
      value={value}
      disabled={disabled}
      onKeyDown={event => {
        props.onKeyDown?.(event)
        if (!allowEnterComplete) {
          return
        }
        if (event.key === 'Enter' && !event.shiftKey) {
          event.preventDefault()
          innerRef.current?.blur()
          onEditComplete?.((event.target as HTMLInputElement).value)
          focusNext()
        }
      }}
      onBlur={event => {
        props.onBlur?.(event)
        if (allowEditCompleteOnBlur) {
          onEditComplete?.(event.target.value)
          clearTimer()
        }
      }}
      onChange={event => {
        props.onChange?.(event)
        const value = event.target.value
        restartTimer(() => {
          innerRef.current?.blur()
          onEditComplete?.(value)
        })
        onValueChange?.(value)
      }}

      data-name={DataAttributesUtil.name('input', props)}
      data-value={DataAttributesUtil.bool(!!value)}
      data-disabled={DataAttributesUtil.bool(disabled)}
      data-invalid={DataAttributesUtil.bool(invalid)}

      aria-invalid={props['aria-invalid'] ?? invalid}
      aria-disabled={props['aria-disabled'] ?? disabled}
    />
  )
})


/**
 * A Component for inputting text or other information
 *
 * Its state is managed by the component itself
 */
export const InputUncontrolled = forwardRef<HTMLInputElement, InputProps>(function InputUncontrolled({
  value,
  onValueChange,
  ...props
}, ref) {
  const [usedValue, setUsedValue] = useOverwritableState(value, onValueChange)

  return (
    <Input
      {...props}
      ref={ref}
      value={usedValue}
      onValueChange={setUsedValue}
    />
  )
})
