import type { InputHTMLAttributes } from 'react'
import React, { forwardRef, useImperativeHandle, useRef } from 'react'
import type { UseDelayOptionsResolved } from '@/src/hooks/useDelay'
import { useDelay  } from '@/src/hooks/useDelay'
import { useFocusManagement } from '@/src/hooks/focus/useFocusManagement'
import { useOverwritableState } from '@/src/hooks/useOverwritableState'

export type EditCompleteOptionsResolved = {
  onBlur: boolean,
  afterDelay: boolean,
  allowEnterComplete?: boolean,
} & Omit<UseDelayOptionsResolved, 'disabled'>

export type EditCompleteOptions = Partial<EditCompleteOptionsResolved>

const defaultEditCompleteOptions: EditCompleteOptionsResolved = {
  allowEnterComplete: false,
  onBlur: true,
  afterDelay: true,
  delay: 2500
}

export type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  invalid?: boolean,
  onChangeText?: (text: string) => void,
  onEditCompleted?: (text: string) => void,
  editCompleteOptions?: EditCompleteOptions,
}

/**
 * A Component for inputting text or other information
 *
 * Its state is managed must be managed by the parent
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(function Input({
                                                                               value,
                                                                               onChange,
                                                                               onChangeText,
                                                                               onEditCompleted,
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
          onEditCompleted?.((event.target as HTMLInputElement).value)
          focusNext()
        }
      }}
      onBlur={event => {
        props.onBlur?.(event)
        if (allowEditCompleteOnBlur) {
          onEditCompleted?.(event.target.value)
          clearTimer()
        }
      }}
      onChange={event => {
        onChange?.(event)
        const value = event.target.value
        restartTimer(() => {
          innerRef.current?.blur()
          onEditCompleted?.(value)
        })
        onChangeText?.(value)
      }}

      data-name={props['data-name'] ?? 'input'}
      data-value={value ? '' : undefined}
      data-disabled={disabled ? '' : undefined}
      data-invalid={invalid ? '' : undefined}

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
export const InputUncontrolled = ({
                                    value = '',
                                    onChangeText,
                                    ...props
                                  }: InputProps) => {
  const [usedValue, setUsedValue] = useOverwritableState(value, onChangeText)

  return (
    <Input
      {...props}
      value={usedValue}
      onChangeText={setUsedValue}
    />
  )
}
