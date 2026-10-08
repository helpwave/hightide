import clsx from 'clsx'
import type { InputHTMLAttributes } from 'react'
import { forwardRef, useRef } from 'react'
import type { UseDelayOptionsResolved } from '@helpwave/hightide-utils/hooks'
import { useDelay } from '@helpwave/hightide-utils/hooks'
import { ReactUtils } from '@helpwave/hightide-utils/utils'
import { useFocusManagement } from '../../../../hooks/focus/useFocusManagement'
import { PropsUtil } from '../../../../utils/propsUtil'
import { useTextInputContext } from './TextInputContext'
import type { InputComponentInterface } from './InputTypes'

export type TextInputEditCompleteOptionsResolved = {
  onBlur: boolean,
  afterDelay: boolean,
  allowEnterComplete?: boolean,
} & Omit<UseDelayOptionsResolved, 'disabled'>

export type TextInputEditCompleteOptions = Partial<TextInputEditCompleteOptionsResolved>

const defaultTextInputEditCompleteOptions: TextInputEditCompleteOptionsResolved = {
  allowEnterComplete: false,
  onBlur: true,
  afterDelay: false,
  delay: 2500
}

const Element = 'input'

export type TextInputElementProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'value'>
  & Omit<InputComponentInterface<string>, 'value' | 'initialValue' | 'onValueUpdate'>
  & {
    editCompleteOptions?: TextInputEditCompleteOptions,
  }

export const TextInputElement = forwardRef<HTMLInputElement, TextInputElementProps>(function TextInputElement({
  invalid = false,
  onValueCommit: onEditComplete,
  editCompleteOptions,
  ...props
}, forwardedRef) {
  const { value, setValue, dispatch } = useTextInputContext()
  const {
    onBlur: allowEditCompleteOnBlur,
    afterDelay,
    delay,
    allowEnterComplete
  } = { ...defaultTextInputEditCompleteOptions, ...editCompleteOptions }

  const {
    restartTimer,
    clearTimer
  } = useDelay({ delay, disabled: !afterDelay || props.disabled || props.readOnly })

  const innerRef = useRef<HTMLInputElement>(null)

  const { focusNext } = useFocusManagement()

  return (
    <Element
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
      onFocus={event => {
        props.onFocus?.(event)
        dispatch({ type: 'focus' })
      }}
      onBlur={event => {
        props.onBlur?.(event)
        dispatch({ type: 'blur' })
        if (allowEditCompleteOnBlur) {
          onEditComplete?.(event.target.value)
          clearTimer()
        }
      }}
      onCompositionStart={event => {
        props.onCompositionStart?.(event)
        dispatch({ type: 'compositionStart' })
      }}
      onCompositionEnd={event => {
        props.onCompositionEnd?.(event)
        dispatch({ type: 'compositionEnd' })
      }}
      onChange={event => {
        props.onChange?.(event)
        const nextValue = event.target.value
        restartTimer(() => {
          innerRef.current?.blur()
          onEditComplete?.(nextValue)
        })
        setValue(nextValue)
      }}

      className={clsx('text-input input-element', props.className)}
      data-value={PropsUtil.dataAttributes.bool(!!value)}
      {...PropsUtil.dataAttributes.interactionStates({ ...props, invalid })}

      {...PropsUtil.aria.interactionStates({ ...props, invalid }, props)} />
  )
})
