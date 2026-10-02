import clsx from 'clsx'
import type { InputHTMLAttributes } from 'react'
import React, { forwardRef, useRef } from 'react'
import type { UseDelayOptionsResolved } from '@helpwave/hightide-utils/hooks'
import { useDelay } from '@helpwave/hightide-utils/hooks'
import { useFocusManagement } from '../../../hooks/focus/useFocusManagement'
import { useControlledState } from '@helpwave/hightide-utils/hooks'
import { ReactUtils } from '@helpwave/hightide-utils/utils'

import { PropsUtil } from '../../../utils/propsUtil'

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

export type InputInterface<In, Out extends In = In> = {
  value?: In,
  initialValue?: In,
  onValueChange?: (value: Out) => void,
  onEditComplete?: (value: Out) => void,
  invalid?: boolean,
  disabled?: boolean,
  readOnly?: boolean,
  required?: boolean,
}

export type InputProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'value'>
  & InputInterface<string>
  & {
    editCompleteOptions?: EditCompleteOptions,
  }

/**
 * A Component for inputting text or other information
 *
 * Its state is managed must be managed by the parent
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(function Input({
  value: controlledValue,
  initialValue,
  invalid = false,
  onValueChange,
  onEditComplete,
  editCompleteOptions,
  ...props
}, forwardedRef) {
  const [value, setValue] = useControlledState({
    value: controlledValue,
    onValueChange: onValueChange,
    defaultValue: initialValue,
  })
  const {
    onBlur: allowEditCompleteOnBlur,
    afterDelay,
    delay,
    allowEnterComplete
  } = { ...defaultEditCompleteOptions, ...editCompleteOptions }

  const {
    restartTimer,
    clearTimer
  } = useDelay({ delay, disabled: !afterDelay || props.disabled || props.readOnly })

  const innerRef = useRef<HTMLInputElement>(null)

  const { focusNext } = useFocusManagement()

  return (
    <input
      {...props}
      value={value}
      ref={ReactUtils.assingRefsBuilder([innerRef, forwardedRef])}

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
        setValue(value)
      }}

      className={clsx('input input-element', props.className)}
      data-value={PropsUtil.dataAttributes.bool(!!value)}
      {...PropsUtil.dataAttributes.interactionStates({ ...props, invalid })}

      {...PropsUtil.aria.interactionStates({ ...props, invalid }, props)}/>
  )
})
