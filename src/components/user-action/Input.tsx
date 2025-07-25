import type { InputHTMLAttributes } from 'react'
import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'
import clsx from 'clsx'
import type { UseDelayOptionsResolved } from '@/src'
import { useDelay, useFocusManagement } from '@/src'
import { noop } from '@/src/utils/noop'

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
                                                                               onChange = noop,
                                                                               onChangeText = noop,
                                                                               onEditCompleted,
                                                                               editCompleteOptions,
                                                                               onBlur,
                                                                               onKeyDown,
                                                                               disabled = false,
                                                                               invalid = false,
                                                                               className = '',
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
  const { focusNext } = useFocusManagement()

  useImperativeHandle(forwardedRef, () => innerRef.current)

  return (
    <input
      {...props}
      ref={innerRef}
      value={value}
      disabled={disabled}
      className={clsx(
        'px-2.5 py-1.75 rounded-md border-1 text-sm',
        {
          'bg-input-background text-input-text hover:border-primary focus:border-primary': !disabled && !invalid,
          'bg-on-negative text-negative border-negative-border hover:border-negative-border-hover focus-visible:ring-negative-border': !disabled && invalid,
          'bg-disabled-background text-disabled-text border-disabled-border': disabled,
        }, className
      )}
      onKeyDown={event => {
        onKeyDown?.(event)
        if (!allowEnterComplete) {
          return
        }
        if (event.key === 'Enter' && !event.shiftKey) {
          event.preventDefault()
          innerRef.current?.blur()
          try {
            onEditCompleted(value as string)
          } catch (e) {
            console.warn(e)
          }
          focusNext()
        }
      }}
      onBlur={event => {
        onBlur?.(event)
        if (onEditCompleted && allowEditCompleteOnBlur) {
          onEditCompleted(event.target.value)
          clearTimer()
        }
      }}
      onChange={e => {
        const value = e.target.value
        if (onEditCompleted) {
          restartTimer(() => {
            if (innerRef.current) {
              innerRef.current.blur()
              if (!allowEditCompleteOnBlur) {
                onEditCompleted(value)
              }
            } else {
              onEditCompleted(value)
            }
          })
        }
        onChange(e)
        onChangeText(value)
      }}

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
                                    onChangeText = noop,
                                    ...props
                                  }: InputProps) => {
  const [usedValue, setUsedValue] = useState(value)

  useEffect(() => {
    setUsedValue(value)
  }, [value])

  return (
    <Input
      {...props}
      value={usedValue}
      onChangeText={text => {
        setUsedValue(text)
        onChangeText(text)
      }}
    />
  )
}
